# Component Guidelines

> 组件以 Astro 单文件组件为主，数据通过 props 进入，样式主要靠 Tailwind 内联类名表达。

---

## Component Structure

常见结构：

1. frontmatter 区：导入 config、utils、i18n，解构 `Astro.props`
2. markup 区：输出结构化 HTML
3. 可选 `<script>`：仅当组件自带浏览器交互
4. 可选 `<style>` / `<style is:global>`：只在 Tailwind 不适合或第三方组件覆盖时使用

参考：

- `src/components/Head/Head.astro`
- `src/components/Header/Header.astro`
- `src/components/ArticleCard/ArticleCard.astro`
- `src/components/Search/Search.astro`

---

## Props Conventions

- 原子组件优先显式声明 `Props` 接口，例如：
  - `src/components/Badge/Badge.astro`
  - `src/components/Alert/Alert.astro`
- 页面和布局组件通常直接解构 `Astro.props`，但改动时应尽量收窄字段，而不是继续扩大 `any`
- 新代码优先保留数据来源的具体类型，例如 `CollectionEntry<"blog">`、`UIKeys`、字面量 union
- `class` 透传采用 Astro 现有写法：`class: className`

---

## Composition Rules

- 页面经常通过布局组合页面骨架：`Layout.astro` 统一接入 `Head`、`Header`、`Aside`、`Footer`
- 组件不直接负责内容聚合；聚合结果应由 page/layout 或 util 先算好，再通过 props 传入
- i18n 通过 `getLangFromUrl` + `useTranslations` 在组件内部解析，不把中英文文案硬编码进 JSX/HTML
- 文章 SEO / 语言切换等跨页面规则统一复用 shared util，例如 `articleI18n.ts`

---

## Styling Patterns

- 首选 Tailwind utility classes，样式直接附着在组件结构上
- 主题变量和设计 token 走全局 CSS 变量，不在组件里散落硬编码主题逻辑
- 局部样式块用于：
  - 复杂 SVG / 主题切换动画：`src/components/ThemeIcon/ThemeIcon.astro`
  - 第三方组件覆盖：`src/components/Search/Search.astro`
- 若确实需要 `is:global`，目标必须足够窄，避免污染整站

---

## Accessibility

- 交互元素优先使用正确语义元素：按钮用 `<button>`，导航切换用 `<a>`
- 搜索、主题切换等显式设置 `aria-label` / `title`
- 图片必须保留 `alt`
- 语言和 SEO 元信息必须跟随当前 locale，参考 `Head.astro`
- 时间字段使用 `<time>`

---

## Common Mistakes

- 组件内部重新实现内容筛选逻辑，绕过 `publishSet`
- 在文章语言切换上恢复“找不到镜像就回首页”的旧逻辑
- 交互脚本重复绑定，未考虑 `astro:page-load` / view transition
- 为单次需求引入复杂抽象，而不是复用现有 Astro props + util 结构
