# State Management

> 本项目的状态模型很轻：没有全局 store，主要是 build-time 内容状态、URL/locale 状态，以及少量浏览器偏好与 DOM 显示状态。

---

## State Categories

### 1. Build-time content state

由 `astro:content` 和 shared util 生成：

- `src/content.config.ts`
- `src/utils/publishSet.ts`
- `src/utils/articleI18n.ts`
- `src/utils/getArchive.ts`
- `src/utils/getPostInfo.ts`

这类状态决定公开文章集合、镜像配对、归档、标签、RSS 等，必须在服务端 / 构建阶段收敛。

### 2. URL and locale state

由 `Astro.url` 派生：

- `src/i18n/utils.ts`
- `src/components/Head/Head.astro`
- `src/components/Header/Header.astro`

不要再引入第二套 locale store。

### 3. Browser preference state

只有少量跨页面偏好走浏览器存储，例如主题：

- `localStorage.theme`
- `document.documentElement.classList`

参考 `src/components/ThemeIcon/ThemeIcon.astro`。

### 4. Transient DOM/UI state

搜索弹层、移动端侧边栏、回到顶部等状态主要通过：

- class 切换
- `data-*` 属性
- `window.__...` 去重标记

来维持，参考：

- `src/components/Search/Search.astro`
- `src/scripts/MobileSidebar.ts`
- `src/scripts/BackTop.ts`

---

## When to Introduce Global State

默认不要。

只有当某个浏览器端状态同时满足下面条件时，才考虑提升为共享层：

- 被多个独立客户端交互消费
- 不能从 `Astro.url`、props、DOM 或 localStorage 直接恢复
- 不是单纯的 UI 开关或一次性绑定标记

在当前仓库代码里，这种情况还没有出现。

---

## Derived State Rules

- 派生内容状态优先写成 pure util，不写进组件模板里
- 路由语言切换从 mirror pair 派生，不靠硬编码 fallback
- 公开内容集合的单一事实来源是 `publishSet`

---

## Common Mistakes

- 用全局 store 解决本可由 URL 或 props 表达的问题
- 在组件里直接重复计算 `published` / `archives` / `tags`
- 用浏览器状态去驱动本该在构建期决定的公开内容逻辑
- 忘记在 Astro 页面切换后重新绑定交互事件
