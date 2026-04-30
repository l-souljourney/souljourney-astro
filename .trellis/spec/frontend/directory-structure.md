# Directory Structure

> 本项目的前端目录组织不是按“功能岛 + 全局 store”来分，而是按 Astro 站点职责分层。

---

## Directory Layout

```text
src/
├── components/      # 可复用 UI 组件
├── layouts/         # 页面骨架与布局容器
├── pages/           # Astro 路由入口
├── utils/           # 内容聚合、路由、格式化、共享逻辑
├── scripts/         # 客户端 DOM 初始化与浏览器交互
├── i18n/            # 文案 key 与路由语言工具
├── styles/          # 全局样式与第三方样式覆盖
├── icons/           # 本地 SVG 资源
├── content/         # Markdown / MDX 内容
├── plugins/         # markdown/remark/rehype 相关插件
└── type/            # 少量 ambient types

tests/               # node:test 回归测试
script/              # Node 级发布/检查脚本（当前有 publish-health.js）
.github/workflows/   # CI/CD 工作流
```

---

## Module Boundaries

- `src/pages/` 只负责路由入口、分页参数和页面装配。内容筛选、配对、聚合不要直接堆在页面里，优先下沉到 `src/utils/`。
- `src/layouts/` 负责页面骨架，例如 `Layout.astro` 统一接 `Head`、`Header`、`Aside`、`Footer` 和初始化脚本。
- `src/components/` 放可复用 UI 组件；如果某个交互只服务单个组件，可以把脚本内联在组件里，例如 `Search.astro`。
- `src/scripts/` 放页面级或跨组件的 DOM 初始化逻辑，统一由 `src/scripts/Init.ts` 或 Astro 页面事件驱动。
- `src/utils/` 承载共享业务逻辑，例如 `publishSet.ts`、`articleI18n.ts`、`getArchive.ts`、`getPostInfo.ts`。
- `src/i18n/` 负责语言 key、route/lang 推导与翻译函数；不要在组件里发明第二套 i18n 机制。

---

## Naming Conventions

- Astro 组件和布局目录使用 `PascalCase`，如 `components/Header/Header.astro`、`layouts/Layout/Layout.astro`
- 工具函数文件使用 `camelCase`，如 `publishSet.ts`、`articleI18n.ts`、`getArchive.ts`
- 客户端脚本文件沿用现有 feature 命名，通常是 `PascalCase` 或历史保留名；新增时优先跟随同目录相邻风格，不引入第三套命名
- 页面路由文件严格跟随 Astro 路由约定，如 `src/pages/article/[...article].astro`
- 内容 schema 的单一事实来源在 `src/content.config.ts`，不要在多个 util 中重复硬编码分类或语言常量

---

## Examples

- 页面只装配、逻辑下沉：`src/pages/article/[...article].astro` + `src/utils/publishSet.ts`
- 布局统一接入全局组件与初始化：`src/layouts/Layout/Layout.astro`
- 交互组件内联脚本：`src/components/Search/Search.astro`
- DOM 初始化集中入口：`src/scripts/Init.ts`

---

## Common Mistakes

- 在 `src/pages/` 直接复制聚合逻辑，而不是复用 `src/utils/`
- 把浏览器事件逻辑塞进 `src/utils/`，导致 server/build-time util 与 client code 混杂
- 新增路由或分类时只改页面，不搜索 `config / i18n / publishSet / tests` 的联动点
