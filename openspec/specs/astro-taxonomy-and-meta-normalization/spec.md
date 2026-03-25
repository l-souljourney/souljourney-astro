## Purpose
定义 Astro 分类与元数据渲染的规范化约束，确保分类键稳定、展示可本地化、元数据字段按类型消费。
## Requirements
### Requirement: categories SHALL be canonical-only across all aggregations

Category counting, grouping, filtering, and page generation MUST use canonical category keys only. Alias-based normalization MUST NOT be used in v2.1.

#### Scenario: Category list does not auto-map aliases
- **WHEN** content includes a non-canonical category value
- **THEN** schema validation fails instead of auto-mapping to a canonical key

### Requirement: Category display SHALL be localized while key remains canonical

All category links MUST use canonical keys in URL, and display text MUST be localized through mapping utilities.

#### Scenario: English page displays localized text but keeps canonical URL
- **WHEN** an English article has `categories: ai-era`
- **THEN** category text is rendered in English and link remains `/en/categories/ai-era`

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

### Requirement: English category core routes SHALL be generated for all canonical category keys
English category page static path generation MUST include the full canonical category key set defined by site taxonomy configuration, even when no English article currently belongs to a specific category. For categories with zero English articles, the page MUST render an explicit empty-state message and MUST output `robots` meta as `noindex, follow` to avoid thin-content indexing. For categories with content, page-level robots override MUST be omitted and Head default robots policy MUST be used.

#### Scenario: canonical category without en posts still resolves
- **WHEN** a canonical category has zero English articles
- **THEN** `/en/categories/{category}` is still generated and renders a valid empty-state page instead of 404

#### Scenario: empty english category uses noindex strategy
- **WHEN** rendering `/en/categories/{category}` with no article items
- **THEN** page output includes empty-state guidance text and `robots` meta is `noindex, follow`

#### Scenario: canonical category with en posts remains accessible
- **WHEN** a canonical category has English articles
- **THEN** `/en/categories/{category}` renders article list normally with localized display text and does not hardcode page-level `index, follow`
