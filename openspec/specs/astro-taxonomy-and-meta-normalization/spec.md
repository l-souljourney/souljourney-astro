## ADDED Requirements

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
