# Hook Guidelines

> 这个仓库当前没有 React/Vue 风格的自定义 hooks。这里的“hook”主要指 Astro 页面事件、DOM 初始化入口，以及少量浏览器端共享逻辑。

---

## Current Reality

- 没有 `use*` 自定义 hook 目录
- 没有 React Query / SWR / Zustand / Redux 一类 hook 生态
- 可复用交互逻辑主要落在：
  - `src/scripts/*.ts`
  - 组件内 `<script>`
  - `src/utils/updateRouter.ts`

---

## Reuse Pattern

- 页面级浏览器初始化统一走 `src/scripts/Init.ts`
- 局部组件交互可放在组件自身，例如 `src/components/Search/Search.astro`
- 页面切换相关监听统一依赖 Astro 事件，如 `astro:page-load`、`astro:before-swap`、`astro:after-swap`
- 若多个脚本都要响应页面进入/离开，优先复用 `inRouter` / `outRouter`

---

## Data Fetching

- 公开内容、路由、归档、RSS 等数据优先在 build-time 通过 `astro:content` + `src/utils/` 计算
- 客户端请求只用于少量增强功能，走现有 util 封装（如 `$GET` / `$POST`）或特定脚本
- 不要为了静态内容站引入客户端 server-state hook 层

---

## Naming Rules

- 不要在没有客户端框架组件的前提下创建 `useSomething.ts`
- DOM 初始化函数保持 feature 命名，通常默认导出 `init` 风格函数
- 若脚本需要跨页面重绑，名称和职责要清晰可见，例如 `bindThemeToggle`、`initSearchModal`

---

## Guardrails

- 绑定浏览器事件前先考虑去重/清理
- 对 page transition 场景，优先使用：
  - `astro:page-load`
  - `astro:before-swap`
  - `astro:after-swap`
- 当脚本需要跨导航保留一次性状态时，可用 `window.__...` 标记，但只限去重/cleanup 之类的轻量用途

---

## Common Mistakes

- 为单个 DOM 初始化创建“伪 hook”抽象
- 忘记处理 `astro:page-load` 后的重复绑定
- 把应该在 build-time 完成的内容拉到客户端再请求
- 在没有真实收益的情况下引入第三方状态/请求 hook 方案
