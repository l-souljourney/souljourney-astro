## Why

`v2.1.1` 后，文章详情页仍存在三类会直接影响可用性与收录质量的硬问题：HTML 结构闭合错误、文章页 SEO 元数据传参不一致（封面与页面类型）、英文核心分类入口存在可复现 404。该问题集属于 `v2.x` 路线中的 P0 止血范围，需在 `v2.1.2` 单版本内最小修复并发布。

## What Changes

- 修复 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro` 的结构闭合与语义容器问题，确保文章详情页 HTML 结构稳定。
- 修复 `Layout -> Head` 的文章 SEO 关键传参：统一封面字段传递，补充显式页面类型，保证 `og:type` 与 JSON-LD 输出与文章页一致。
- 修复英文分类核心入口 404：英文分类路由静态路径从“仅已有英文文章分类”扩展为“全量规范分类键”，缺数据时输出空列表页而非 404。

## Non-goals

- 不做组件重构或目录迁移。
- 不做样式风格调整与视觉升级。
- 不引入新依赖，不处理 v2.1.3（交互一致性）范围事项。

## Capabilities

### New Capabilities
- `astro-article-structure-seo-consistency`: 定义文章详情页结构合法性与 SEO 页面类型/封面元数据一致性约束。

### Modified Capabilities
- `astro-taxonomy-and-meta-normalization`: 增补英文分类路由生成约束，要求核心分类入口不因内容稀疏产生 404。

## Impact

- 受影响代码：`src/pages/article/[...article].astro`、`src/pages/en/article/[...article].astro`、`src/layouts/Layout/Layout.astro`、`src/components/Head/Head.astro`、`src/pages/en/categories/[...categories].astro`。
- 受影响行为：文章详情页 DOM 结构、OpenGraph/JSON-LD 输出、英文分类入口可达性。
- 外部依赖：无新增依赖。
- Engine 依赖：无（本变更仅涉及 Astro 渲染与路由生成逻辑）。
