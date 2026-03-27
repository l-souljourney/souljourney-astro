# astro-bilingual-pair-governance Specification

## Purpose
定义 Astro 双语内容的镜像配对、公开发布集合、语言切换与搜索分桶约束，确保双语发布在大规模内容下仍保持一致性。

## Requirements

### Requirement: Mirror articles SHALL share the same source_id across zh/en

同一篇文章的中英文镜像稿件 MUST 使用同一个 `source_id`。

#### Scenario: zh/en mirror pair uses shared source_id
- **WHEN** one Chinese article and one English article represent the same logical content
- **THEN** both entries use the same `source_id`

### Requirement: Mirror articles SHALL share the same slug across zh/en

同一篇文章的中英文镜像稿件 MUST 使用相同的 `slug`。

#### Scenario: zh/en mirror pair uses shared slug
- **WHEN** one Chinese article and one English article represent the same logical content
- **THEN** both entries use the same `slug`

### Requirement: Public publish set SHALL include only complete mirror pairs

只有完整 zh/en 镜像对可以进入公开发布集合。任何缺失镜像的一侧都 MUST NOT 进入 article route、RSS、sitemap、搜索索引与公开聚合页。

#### Scenario: complete mirror pair enters public publish set
- **WHEN** both `lang=zh` and `lang=en` entries exist with the same `source_id` and `slug`
- **THEN** both entries are included in the public publish set

#### Scenario: single-language entry is excluded from public publish set
- **WHEN** only one language entry exists for a `source_id` + `slug` pair
- **THEN** that entry is treated as pending translation and excluded from public routes and public indexes

### Requirement: Mirror articles SHALL keep canonical category key alignment

镜像文章的分类键 MUST 保持一致，以保证 zh/en 聚合页结构镜像。

#### Scenario: mirrored entries use the same category key
- **WHEN** zh/en mirror entries belong to the same logical article
- **THEN** their `categories` values are identical canonical keys

### Requirement: Article language switch SHALL target the mirrored counterpart

公开文章的语言切换 MUST 指向同 `source_id` + `slug` 的镜像稿件，而不是首页或其他降级路径。

#### Scenario: language switch targets mirror article
- **WHEN** a user is on a published zh article page
- **THEN** language switch points to the corresponding published en article page with the same `slug`

### Requirement: Search indexing SHALL be bucketed by locale from the public publish set

搜索索引 MUST 按语言分桶，并且只消费本语言公开发布集合中的文章。

#### Scenario: zh search excludes en content
- **WHEN** zh search index is generated
- **THEN** it contains only zh entries from the public publish set

#### Scenario: en search excludes pending translation content
- **WHEN** en search index is generated
- **THEN** it excludes entries whose zh/en mirror pair is incomplete
