## Purpose
定义 Astro 分类与元数据渲染的规范化约束，确保分类键稳定、双语聚合可镜像、元数据字段按类型消费。

## Requirements

### Requirement: categories SHALL be canonical-only across all aggregations

Category counting, grouping, filtering, and page generation MUST use canonical category keys only.

#### Scenario: Category list does not auto-map aliases
- **WHEN** content includes a non-canonical category value
- **THEN** schema validation fails instead of auto-mapping to a canonical key

### Requirement: Category display SHALL be localized while key remains canonical

All category links MUST use canonical keys in URL, and display text MUST be localized through mapping utilities.

#### Scenario: English page displays localized text but keeps canonical URL
- **WHEN** an English article has `categories: ai-era`
- **THEN** category text is rendered in English and link remains `/en/categories/ai-era`

### Requirement: Public category, tag, and archive aggregations SHALL consume the public publish set

公开聚合页 MUST 只消费完整镜像对构成的 public publish set，而不是所有原始内容文件。

#### Scenario: pending translation content is excluded from public aggregation
- **WHEN** a content entry has no complete zh/en mirror pair
- **THEN** it is excluded from category, tag, and archive public aggregation output

### Requirement: Metadata rendering SHALL use strict typed frontmatter fields

`description`, `author`, `word_count`, and `reading_time` MUST be consumed as typed fields from frontmatter when provided.

#### Scenario: Typed word_count is rendered directly
- **WHEN** frontmatter contains `word_count: 1234`
- **THEN** the article metadata displays `1234` without type coercion from string

#### Scenario: Typed reading_time is rendered directly
- **WHEN** frontmatter contains `reading_time: 5`
- **THEN** the article metadata displays `5` minutes

### Requirement: author field SHALL override site default author

When post-level `author` exists, article metadata and copyright MUST render that value.

#### Scenario: Guest author is displayed
- **WHEN** frontmatter contains `author: "Guest Writer"`
- **THEN** article metadata displays `Guest Writer` instead of site-level default author

### Requirement: Description metadata SHALL prefer explicit frontmatter description

Article description resolution MUST prefer frontmatter `description` when present and non-empty.

#### Scenario: frontmatter description exists
- **WHEN** rendering article meta tags and list excerpts
- **THEN** description text is sourced from frontmatter `description`

#### Scenario: frontmatter description missing
- **WHEN** `description` is absent in frontmatter
- **THEN** system falls back to generated excerpt from sanitized body content

### Requirement: Canonical category routes SHALL still be generated for navigation-level categories

导航中的 canonical category 路由 SHOULD 可稳定访问；若某语言下暂无公开文章，则页面可输出 empty-state 与合适的 noindex 策略，而不是 404。

#### Scenario: canonical category without published entries still resolves
- **WHEN** a canonical category has zero published entries for the current locale
- **THEN** the category route still resolves to a valid empty-state page instead of 404
