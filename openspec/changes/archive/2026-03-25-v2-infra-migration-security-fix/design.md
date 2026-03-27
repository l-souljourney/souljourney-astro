## Context

Souljourney Blog v1.9.5 当前部署链路为 CNB 构建 → 推送 GitHub → 推送腾讯云 COS → EdgeOne 访问，同时 Cloudflare 从 GitHub 拉取构建。该链路存在三个核心问题：

1. **安全漏洞**：技术审计（2026-02-10）发现 3 个高危问题
2. **部署依赖 CNB**：GitHub 不是唯一代码源，CNB 是构建入口
3. **技术债务累积**：死代码、无用依赖、配置冗余

当前需要变更的关键文件：

| 文件 | 当前问题 |
|------|----------|
| `src/scripts/Search.ts:33` | `innerHTML` 拼接未转义的 `title` 和 `content`，XSS 风险 |
| `src/pages/[...page].astro:18` + `src/utils/vhSearch.ts:16-23` | 页面路由构建时写入 `dist/public` 搜索索引，存在构建副作用和双链路维护成本 |
| `src/components/Search/Search.astro:57-60` | 首次加载 + `astro:page-load` 都会重复绑定事件，可能叠加监听 |
| `src/pages/en/article/[...article].astro:90` | 标签链接 `href={/tag/${i}}` 缺少 `/en/` 前缀 |
| `src/components/ArticleCard/ArticleCard.astro:49,69` | 分类和标签链接未适配 i18n |
| `astro.config.mjs:36-47,60-65` | 两个 `markdown` 块，后者覆盖前者，Shiki 双主题配置丢失 |
| `.github/workflows/deploy.yml` | COS 上传未使用全球加速端点 |

## Goals / Non-Goals

**Goals:**
- 修复全部 3 个高危安全/功能问题
- GitHub Actions 成为唯一 CI/CD，COS 全球加速部署
- Cloudflare Pages 自动部署海外线路
- 清理 CNB 遗留和死代码
- 以最小必要改动完成上线，保持个人项目可维护性

**Non-Goals:**
- 不做中英文页面去重（v2.2 范围）
- 不对接 Engine（v2.1 范围）
- 不升级 Tailwind v4
- 不引入 SSR
- 不引入重型工程化体系（复杂测试矩阵、额外服务编排）

## Decisions

### Decision 1: XSS 修复方案 — 移除遗留 `innerHTML` 搜索渲染

**选择：** 直接移除遗留 `src/scripts/Search.ts` 运行时渲染链路，统一使用 `astro-pagefind`，从根源消除 `innerHTML` 注入面。

**替代方案：** 保留遗留链路并增加 `escapeHtml()`。**否决原因：** 仍需长期维护两套搜索实现，且后续变更时容易再次引入注入缺陷。

**变更前：**
```typescript
searchHTML = !arr.length ? '<em></em>' : arr.map(i => `<a class="vh-search-item" href="${i.url}"><span class="truncate">${i.title}</span><p class="line-clamp-3">${i.content}</p></a>`).join('');
document.querySelector('.vh-header>.main>.vh-search>main>.vh-search-list')!.innerHTML = searchHTML;
```

**变更后：**
- 删除 `src/scripts/Search.ts`
- 删除 `src/utils/vhSearch.ts` 与 `setSearchJson(posts)` 调用
- 保留并加固 `src/components/Search/Search.astro`（幂等初始化 + 无重复监听）

### Decision 2: i18n 路由修复 — 路径前缀函数

**选择：** 利用已有的 `getLangFromUrl()` 工具函数，创建轻量路径辅助函数，仅统一核心内容路径（`/article`、`/tag`、`/categories`）。

**需修复文件清单：**

| 文件 | 行号 | 当前值 | 修复值 |
|------|------|--------|--------|
| `src/pages/en/article/[...article].astro` | :90 | `/tag/${i}` | `/en/tag/${i}` |
| `src/components/ArticleCard/ArticleCard.astro` | :49 | `/categories/${...}` | 根据 `lang` 变量加前缀 |
| `src/components/ArticleCard/ArticleCard.astro` | :69 | `/tag/${tag}` | 根据 `lang` 变量加前缀 |

**i18n 影响：** ArticleCard 组件在中英文页面中共用，已有 `lang` prop。v2.0 仅收敛为同一套轻量规则，不做跨目录重构。

### Decision 3: astro.config.mjs 配置合并

**选择：** 将两个 `markdown` 块合并为一个，保留双主题 Shiki 配置 + 所有 remark/rehype 插件。

**变更前** (`astro.config.mjs`):
```javascript
// 第一个 markdown 块 (line 36-47) — 有双主题但没有插件
markdown: {
  shikiConfig: { theme: { light: 'github-light', dark: 'github-dark-dimmed' }, wrap: false },
},
// ... integrations ...
// 第二个 markdown 块 (line 60-65) — 有插件但只有单主题
markdown: {
  remarkPlugins: [...], rehypePlugins: [...],
  syntaxHighlight: 'shiki', shikiConfig: { theme: 'github-light' },
},
```

**变更后 — 单一 markdown 块：**
```javascript
markdown: {
  remarkPlugins: [remarkMath, remarkDirective, remarkNote],
  rehypePlugins: [rehypeKatex, rehypeSlug, addClassNames],
  syntaxHighlight: 'shiki',
  shikiConfig: {
    theme: { light: 'github-light', dark: 'github-dark-dimmed' },
    wrap: false,
  },
},
```

### Decision 4: COS 部署优化 — 全球加速端点

**选择：** `deploy.yml` 中 coscli 使用 COS 全球加速端点 `cos.accelerate.myqcloud.com`。

**理由：** GitHub Actions runner 在美国，跨太平洋上传到国内 COS 不稳定（曾出现 8 分钟超时）。全球加速走腾讯内部骨干网。

**变更：** `deploy.yml` 中添加 `COS_ACCELERATE` 端点配置，coscli sync 命令使用加速 bucket 地址。

### Decision 5: Cloudflare Pages — Dashboard 直连

**选择：** Cloudflare Pages 通过 Dashboard 直连 GitHub 仓库，由 CF 自己 build。

**替代方案：** GitHub Actions 用 Wrangler 推送。**暂不采用原因：** 直连更简单零维护。如果后续发现 CF 构建与 Actions 构建不一致再切换。

**操作：** 这是 Dashboard 配置而非代码变更，不在 tasks 中体现代码任务，但需要在验收标准中确认。

### Decision 5.1: CDN 刷新触发策略（轻量）

**选择：** 采用兼容策略（TEO_ZONE_ID / CDN_DOMAIN 任一可用即执行），缺少配置时仅 warning 并跳过，不阻断部署。

**理由：** 个人项目优先保证发布主链路稳定，避免因边缘配置缺失导致整体失败。

### Decision 6: 死代码清理范围

**清理清单：**
- `src/scripts/TypeWrite.ts` — 已禁用（TypeWriteList 为空数组）
- `src/scripts/Init.ts` — 移除对 TypeWrite、Friends、RSS Reader 的引用
- `package.json` — 移除 `@waline/client`, `@types/dplayer`, `@types/nprogress`
- `.cnb.yml` — 删除（如果存在）
- `src/scripts/Search.ts` — 遗留搜索实现，已被 Pagefind 替代
- `src/utils/vhSearch.ts` — 遗留索引生成逻辑，存在构建副作用

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| COS 全球加速增加费用 | 博客流量极小，预计 < 1 元/月，可忽略 |
| Cloudflare 构建与 Actions 构建不一致 | 同一 commit 触发，源码一致；如出现差异可切到 Wrangler 统一构建 |
| 清理死代码误删有用代码 | 逐文件 grep 确认无引用后再删除 |
| i18n 修复不完整（遗漏其他硬编码路径） | 全局 grep `/tag/` 和 `/categories/` 确认所有出现位置 |
| Search 弹层事件重复绑定导致行为异常 | 使用幂等绑定并在视图跳转场景验证仅绑定一次 |

## Migration Plan

1. **安全修复先行** — 搜索单链路 + XSS + i18n + config 合并为独立 commit
2. **CI/CD 切换** — 更新 deploy.yml + 清理 CNB 配置
3. **Cloudflare 绑定** — Dashboard 操作
4. **DNS 切换** — DNSPod 分线路解析
5. **回滚策略** — 每步独立 commit，可逐个 revert

## Open Questions

（已确认）
- `.cnb.yml` 当前仓库中不存在；任务保留“兜底检查”即可
- CDN 刷新采用兼容触发策略，缺配置时 warning + skip
- v2.0 环境变量化范围仅 `PUBLIC_SITE_URL`
