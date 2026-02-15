# Facts

| 维度 | 事实 | Evidence |
|---|---|---|
| 技术栈 | Astro + Tailwind + TypeScript + Playwright | `package.json`: `"astro": "^5.16.0"`, `"@astrojs/tailwind": "^6.0.2"`, `"@playwright/test": "^1.57.0"` |
| 构建入口 | 构建命令为 `astro build` | `package.json`: `"build": "astro build"` |
| 路由/页面入口 | 主要入口为动态路由页 | `src/pages/[...page].astro`, `src/pages/article/[...article].astro`, `src/pages/categories/[...categories].astro`, `src/pages/tag/[...tags].astro` |
| 状态管理入口 | 未发现 Redux/Pinia/Zustand 等集中状态库；以脚本内变量为主 | `package.json` 无相关依赖；`src/scripts/Search.ts:4` `let searchJson: any[] = [];` |
| API 请求封装入口 | `$GET/$POST` 统一封装在工具层 | `src/utils/index.ts:61` `const $GET = async ...`; `src/utils/index.ts:71` `const $POST = async ...` |
| 主题或 token 入口 | token 在 CSS 变量 + Tailwind 映射 | `src/styles/globals.css` `:root { --vh-back-top: ... }`; `tailwind.config.mjs` `colors: { border: 'hsl(var(--border))', ... }` |
| 测试入口 | Playwright E2E，启动本地 dev server | `playwright.config.ts` `testDir: './tests'`; `webServer.command: 'npm run dev -- --port 4322'` |

# Risks Top 10

1. 
Evidence: `src/pages/article/[...article].astro:105` 与 `src/pages/en/article/[...article].astro:103` 均存在 `</main>`，但文件内未见对应 `<main>` 起始标签。
Impact: 可能导致构建阶段模板解析失败或运行时 DOM 结构异常。
Fix: 改 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro`，将错误闭合标签改为正确标签；验证 `npm run build` 与文章页渲染。

2. 
Evidence: `src/scripts/Search.ts:33-34` 使用字符串模板拼接 `i.title/i.content` 后直接 `innerHTML` 注入。
Impact: 搜索索引若含恶意内容，可触发前端 XSS。
Fix: 改 `src/scripts/Search.ts` 为 DOM API + `textContent` 渲染（高亮单独节点实现）；验证含 `<script>`/HTML 特殊字符的搜索样本。

3. 
Evidence: 英文文章页标签链接写为 `href={`/tag/${i}`}`（`src/pages/en/article/[...article].astro:90`）。
Impact: 英文站点点击标签会跳到中文路径命名空间，出现语言跳转错误/404 风险。
Fix: 改 `src/pages/en/article/[...article].astro` 为 `/en/tag/${i}`；验证英文文章标签跳转与回归测试。

4. 
Evidence: `src/utils/index.ts:66-68`、`77-78` 在 catch 中仅 `console.error`，未抛出错误；调用方如 `src/scripts/Search.ts:5` 直接赋值结果。
Impact: 网络失败会静默降级为 `undefined`，后续逻辑可能出现隐式错误且难定位。
Fix: 改 `src/utils/index.ts` 抛出异常或返回 `Result` 类型；验证断网/500 场景下 UI 与日志行为。

5. 
Evidence: `src/utils/vhSearch.ts:15-20` 在构建流程中写 `dist/vh-search.json` 和 `public/vh-search.json`；由 `src/pages/[...page].astro:18` 调用。
Impact: 页面生成阶段带文件副作用，易在并行构建/只读构建环境下失败或产物不一致。
Fix: 将索引生成迁移到独立构建钩子/脚本；验证本地与 CI 构建产物一致性。

6. 
Evidence: `src/i18n/utils.ts:30` 非默认语言路由统一返回 `/${path}`（仅保留末段）。
Impact: 多级英文路由在语言切换时可能丢失父路径（如分类/标签深层路由）。
Fix: 改 `src/i18n/utils.ts` 为“仅去掉语言前缀，保留其余 path”；验证 `/en/categories/*`、`/en/tag/*` 切换。

7. 
Evidence: `astro.config.mjs` 出现两个顶层 `markdown` 字段（`36-47` 与 `60-65`）。
Impact: 前一段配置被后一段覆盖，导致高亮主题/wrap 配置与预期不一致。
Fix: 合并为单一 `markdown` 配置块；验证代码高亮主题与换行行为。

8. 
Evidence: `src/pages/article/[...article].astro:21`、`src/pages/en/article/[...article].astro:24` 使用 `const post: any = Astro.props`。
Impact: 关键页面失去类型约束，内容字段变更时更易在运行时爆错。
Fix: 用 `CollectionEntry<'blog'>` 明确 `Props` 并移除 `any`；验证 `tsc` 与页面构建。

9. 
Evidence: `src/config.ts` 硬编码线上站点与业务配置：`Site: 'https://www.l-souljourney.cn'`、`CreateTime`、`ICP` 等。
Impact: 多环境部署（预发/本地）易出现配置污染与错误 canonical/sitemap。
Fix: 将环境敏感项迁移到环境变量；验证不同环境构建输出的 `site`/sitemap。

10. 
Evidence: 测试仅见单一 E2E 文件：`tests/e2e.spec.ts`；`playwright.config.ts` 仅配置 `chromium`。
Impact: 工具函数、i18n、构建配置变更缺少单元/多浏览器回归覆盖。
Fix: 增加 `src/utils` 与 `src/i18n` 的单元测试，补充至少一个非 Chromium 项目；验证 CI 覆盖率与失败拦截。

# Hotspots Top 5

1. `src/config.ts`
依据: `git log` 变更计数约 15 次；被 26 处导入（`rg "from '@/config' src | wc -l"`）。

2. `src/pages/article/[...article].astro`
依据: `git log` 变更计数约 12 次；文件 115 行，承载文章渲染核心路径。

3. `src/components/Aside/Aside.astro`
依据: `git log` 变更计数约 9 次；文件 153 行，聚合分类/标签/推荐/广告等多职责。

4. `src/layouts/Layout/Layout.astro`
依据: `git log` 变更计数约 9 次；全局布局入口并触发 `Init`（`<script> import InitFn ... InitFn();`）。

5. `src/scripts/Init.ts`
依据: `git log` 变更计数约 8 次；集中编排多模块初始化（TypeWrite/Code/Video/Search/Ads/SEO 等）。

# Missing Items

- 【待验证】CI 实际构建与测试策略：请提供 `.github/workflows/` 或其他 CI 配置目录（当前仓库根目录未见）。
- 【待验证】搜索索引真实输入边界：请提供 `src/content/blog/` 中包含特殊字符/HTML 的样本文章（至少 2 篇）。
- 【待验证】线上路由切换行为：请提供 `src/components/Header/Header.astro` 当前语言切换逻辑关联用例（或录屏/复现步骤）。
- 【待验证】多环境配置来源：请提供 `.env*`、部署脚本或平台环境变量映射文件（若存在）。
