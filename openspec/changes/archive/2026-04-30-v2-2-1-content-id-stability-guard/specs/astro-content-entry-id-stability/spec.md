## ADDED Requirements

### Requirement: Blog content loader SHALL generate locale-aware deterministic entry IDs

Astro blog collection loader MUST generate a deterministic unique id for each content entry using `lang`, `source_id`, and `slug`, to avoid zh/en entries overriding each other in the content store.

#### Scenario: zh/en entries share slug but keep distinct entry IDs
- **WHEN** two markdown entries have the same `slug` and `source_id` but different `lang` (`zh` and `en`)
- **THEN** the loader writes two distinct entry IDs to the content store

#### Scenario: repeated build keeps entry IDs stable
- **WHEN** the same content files are built multiple times without frontmatter changes
- **THEN** generated entry IDs remain unchanged across builds

### Requirement: Entry ID strategy SHALL be independent from public route schema

Entry ID generation MUST NOT change public route format, which remains slug-driven (`/article/{slug}` and `/en/article/{slug}`).

#### Scenario: route generation still uses slug
- **WHEN** article `getStaticPaths()` builds zh/en routes
- **THEN** route params are generated from `post.data.slug` rather than internal entry ID
