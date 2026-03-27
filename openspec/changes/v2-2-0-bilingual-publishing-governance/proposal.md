## Why

Souljourney Blog 的外部发布链路已经完成，`Obsidian -> HTTP -> GitHub -> Astro build/deploy` 不再是当前瓶颈。真正的问题在 Astro 站点内部：双语文章仍按宽松约定消费，公开路由、hreflang、聚合页和搜索索引都还没有建立在同一套“成对镜像发布”规则上。在现有约 1000 篇存量、日均 2-3 篇新增的规模下，如果不先把规则层收紧，后续的模板收敛与性能优化都会继续建立在漂移约束之上。

`v2.2.0` 是 v2.2 系列的规则层版本。它先定义什么内容才算“正式公开发布”，再让后续 `v2.2.1` 和 `v2.2.2` 在同一口径上做路由收敛与轻量化优化。

## What Changes

- 建立双语镜像发布能力：`source_id` 跨语言共用，`slug` 跨语言共用，zh/en 必须成对存在才进入正式公开发布集合
- 明确未配对稿件策略：单边内容视为 `pending_translation`，保留在仓库但不进入 article route、RSS、sitemap、搜索索引与公开聚合页
- 收紧 Astro 发布契约：把 `lang` 明确纳入可发布内容的必填字段，并把镜像对一致性写成 spec 约束
- 收紧文章级 SEO 与语言切换：文章页 hreflang 与语言切换只指向镜像稿件，不再沿用缺失稿件时的宽松 fallback
- 统一公开聚合内容来源：首页、归档、分类、标签、RSS、sitemap、搜索只消费正式公开发布集合

## Non-goals

- 不改动 Obsidian / HTTP / GitHub 外部发布链路
- 不升级 Astro 主版本；框架升级留给 `v2.3.0`
- 不做 UI 风格重构或视觉改版
- 不在本 change 中完成模板去重和大规模性能调优；这些分别留给 `v2.2.1` 与 `v2.2.2`
- 不引入外部搜索服务或新的运行时依赖

## Capabilities

### New Capabilities
- `astro-bilingual-pair-governance`: 定义双语镜像配对、公网发布集合、语言切换与搜索分桶的统一约束

### Modified Capabilities
- `astro-publish-schema-alignment`: 发布 frontmatter 契约改为显式要求 `lang`，并要求公开镜像对共享 `source_id` 与 `slug`
- `astro-slug-route-stability`: 文章详情页、hreflang 与语言切换改为只从完整镜像对生成，继续保持 `/article/{slug}` 与 `/en/article/{slug}`
- `astro-i18n-interaction-consistency`: 文章页语言切换从镜像发布对解析，不再接受首页兜底式回退作为公开策略
- `astro-taxonomy-and-meta-normalization`: 分类、标签、归档等公开聚合只消费正式公开发布集合，并保持镜像分类键一致

## Impact

- **受影响代码路径**: `src/content.config.ts`, `src/utils/articleI18n.ts`, `src/pages/article/[...article].astro`, `src/pages/en/article/[...article].astro`, `src/pages/[...page].astro`, `src/pages/en/[...page].astro`, `src/utils/getArchive.ts`, `src/utils/getPostInfo.ts`, `src/components/Head/Head.astro`, `src/components/Header/Header.astro`
- **受影响公开能力**: article route, hreflang, 语言切换, 首页列表, 分类/标签/归档聚合, RSS, sitemap, Pagefind 搜索输入集合
- **受影响内容模型**: `src/content/blog/zh/` 与 `src/content/blog/en/` 下的 frontmatter 需要满足共享 `source_id` + 共享 `slug` 的镜像约束
- **Engine 依赖**: 无新增依赖。外部发布系统已实现，本 change 仅治理 Astro 仓库的内容消费与公开发布规则
