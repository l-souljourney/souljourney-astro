## Context

`v2.2.0` 把公开内容统一收敛到 `publishSet` 后，公开页是否有内容取决于“镜像对是否完整”。这次线上事故证明当前实现还缺一层加载稳定性约束：Astro `glob` loader 默认以 frontmatter `slug` 生成 entry id，导致同 slug 的 zh/en 稿件在 content store 中发生覆盖。  
覆盖发生后，`publishSet` 只能看到单语条目，最终 article route、首页、RSS、搜索索引都会被强镜像规则排空，但构建流程本身仍返回成功。

受影响范围：
- 内容加载层：`src/content.config.ts`
- 构建发布层：`.github/workflows/deploy.yml`
- 回归测试层：`tests/*`
- 内容层：`src/content/blog/zh/1723-4k.md`（误推稿件）

## Goals / Non-Goals

**Goals:**
- 在加载层消除 zh/en 同 slug 覆盖风险，确保 entry id 稳定唯一
- 增加发布健康门禁，防止“构建成功但公开集合归零”静默上线
- 把本次修复沉淀为可执行测试与文档，形成 `v2.2.1` 收口基线

**Non-Goals:**
- 不改变 `v2.2.0` 的“完整镜像对才公开”业务策略
- 不改 Astro 公开路由形态（继续 `/article/{slug}` 与 `/en/article/{slug}`）
- 不做模板层重构与搜索架构升级
- 不改 Engine 接口与外部发布链路

## Decisions

### Decision 1: 在 `src/content.config.ts` 显式定义 `generateId`

**选择：** blog collection loader 使用 `lang::source_id::slug` 作为 entry id。

**原因：**
- `slug` 是路由键，不是存储唯一键
- `source_id + slug + lang` 能稳定区分同一逻辑文章的双语镜像条目
- 不影响前台路由，因为路由仍使用 `post.data.slug`

**Before:**
```ts
loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
```

**After:**
```ts
loader: glob({
  base: './src/content/blog',
  pattern: '**/*.{md,mdx}',
  generateId: ({ entry, data }) => {
    const lang = String(data.lang ?? 'unknown');
    const sourceId = String(data.source_id ?? entry);
    const slug = String(data.slug ?? entry);
    return `${lang}::${sourceId}::${slug}`;
  },
}),
```

**替代方案：** 使用相对文件路径作为 id。  
**否决原因：** 路径变化（改名/迁移）会引入额外漂移风险，且在当前仓库出现过 collection 空集异常，不适合作为长期主键。

### Decision 2: 增加发布健康检查脚本并接入 CI

**选择：**
- 新增脚本（`scripts/`）读取 `node_modules/.astro/data-store.json` 与 `dist` 产物，校验：
  - `mirrorPairs >= 1`（可通过环境变量覆盖）
  - article routes 数量与 RSS items 不为 0
- 在 `.github/workflows/deploy.yml` 的 build 阶段执行该检查，失败即阻断部署

**原因：**
- 仅 `pnpm build` 退出码不足以代表“公开内容可用”
- 健康检查可在部署前给出明确失败原因与可观测指标

**替代方案：** 只依赖人工巡检首页和 RSS。  
**否决原因：** 无法防止误发布窗口，且不可审计。

### Decision 3: 回归测试分两层补齐

**选择：**
- 单元层：新增针对 entry id 生成逻辑的测试
- 集成层：新增发布健康检查脚本的最小验证（正常样本与空集样本）

**原因：**
- `publishSet` 测试已覆盖配对逻辑，但未覆盖加载层主键冲突
- 需要把“规则正确”和“加载正确”拆开验证

### Decision 4: 内容治理同步执行误推稿件删除

**选择：** 在同一 `v2.2.1` 变更中删除 `src/content/blog/zh/1723-4k.md`。

**原因：**
- 用户明确要求撤回该误推稿
- 该稿件未配对，按当前规则不会公开，但保留会持续干扰内容治理视图

## Risks / Trade-offs

- **[风险] 健康门禁阈值过严导致 CI 频繁阻断** → **缓解：** 阈值参数化（默认 1，可按环境变量调整）
- **[风险] `generateId` 依赖 frontmatter 字段，缺失字段时行为不稳定** → **缓解：** `lang/source_id/slug` 已在 schema 必填，脚本仍保留 fallback 防御式处理
- **[风险] 历史文章长期未配对，公开内容规模可能继续偏小** → **缓解：** 本次只修复稳定性，不改变强镜像策略；通过后续内容运营补齐
- **[风险] 删除误推稿件可能影响用户本地草稿追踪** → **缓解：** 仅删除仓库误推文件，不影响 Obsidian 本地源稿

## Migration Plan

1. 在修复分支完成 `generateId + health-check + tests + 误推稿件删除`
2. 本地执行 `pnpm build`、测试命令与健康检查脚本
3. 提交并通过 PR 合并到 `main`
4. 由 `Deploy to COS + CDN` 自动触发部署
5. 构建后回读 Actions 与线上首页/RSS 指标，确认公开面恢复

回滚策略：
- 若上线后异常，可直接回滚本次 `v2.2.1` 合并提交；不涉及数据迁移，无状态回滚

## Open Questions

- 健康门禁阈值是否固定为 `mirrorPairs >= 1`，还是按分支/环境分别配置
- 后续是否需要将“镜像对数量”纳入长期可观测指标（例如构建日志固定输出）

## i18n Implications

- 不改变现有中英文 URL 规则
- 不改变语言切换逻辑输入（仍从 `publishSet`）
- 仅确保 zh/en 镜像在加载层不再被同 slug 覆盖，避免 i18n 页面被动归零
