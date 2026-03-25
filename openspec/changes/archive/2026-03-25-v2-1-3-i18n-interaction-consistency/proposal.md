## Why

`v2.1.2` 已完成结构/SEO 第一轮止血，但在回归审查中仍发现两个会持续累积质量风险的问题：文章页存在 `main` 嵌套语义违规、英文空分类页缺少 empty-state 与索引策略。同时，原定 `v2.1.3` 的双语交互一致性事项仍需落地，因此将三类问题合并到同一小版本收敛。

## What Changes

- 修复双语交互一致性问题：移动端侧边栏文案与链接前缀、TOC 高亮选择器、搜索弹层监听器幂等性。
- 强化文章页语义结构约束：禁止在布局主容器内再嵌套第二个 `main`，保持可访问性 landmark 合法。
- 为英文空分类页补充明确 empty-state 文案，并增加 `robots` noindex 策略，避免薄内容页被持续索引。
- 补齐对应 OpenSpec 规范与验收任务，作为 `v2.1.3` 发布门槛。

## Non-goals

- 不调整视觉风格与主题系统。
- 不升级 Astro 主版本与依赖栈。
- 不引入 SSR 或新的外部服务。
- 不变更内容 schema（frontmatter 字段契约保持不变）。

## Capabilities

### New Capabilities
- `astro-i18n-interaction-consistency`: 规范双语交互层在侧边栏、TOC、搜索弹层生命周期中的一致行为。

### Modified Capabilities
- `astro-article-structure-seo-consistency`: 增补语义结构约束，明确禁止 `main` 嵌套并要求文章主内容容器语义稳定。
- `astro-taxonomy-and-meta-normalization`: 增补英文空分类页的空态文案与 noindex 索引策略要求。

## Impact

- 受影响代码（预期）：
  - `src/pages/article/[...article].astro`
  - `src/pages/en/article/[...article].astro`
  - `src/pages/en/categories/[...categories].astro`
  - `src/components/Archive/Archive.astro`（若由组件承载空态）
  - `src/components/Header/Header.astro`
  - `src/components/MobileSidebar/MobileSidebar.astro`
  - `src/components/TOC/TOC.astro`（及相关脚本）
  - `src/components/Search/Search.astro`（及相关初始化逻辑）
- 影响系统：Astro SSG 渲染、i18n 路由与 SEO 元数据输出。
- 外部依赖：无新增依赖。
- Engine 依赖：无。该变更仅涉及前端渲染与交互层，不依赖 L-Engine 接口变更。
