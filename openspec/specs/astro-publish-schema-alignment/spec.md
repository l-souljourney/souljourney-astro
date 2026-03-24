## ADDED Requirements

### Requirement: Astro frontmatter SHALL enforce strict required fields

The blog collection schema in `src/content.config.ts` MUST require the following fields for published articles: `title`, `date`, `categories`, `slug`, `source_id`.

#### Scenario: Missing required field fails build
- **WHEN** a published markdown file is missing one of `title/date/categories/slug/source_id`
- **THEN** Astro content validation fails and `pnpm build` exits with an error

### Requirement: Astro frontmatter SHALL deprecate id as publish input

`id` MUST NOT be part of the publishing contract and MUST NOT be used as a required or fallback route input in schema-level validation.

#### Scenario: Route generation does not read id
- **WHEN** route static path generation runs for article pages
- **THEN** no route param is generated from `post.data.id`

### Requirement: categories SHALL be constrained to canonical enum

`categories` MUST be one of: `investment`, `ai-era`, `zhejiang-business`, `philosophy`, `life`.

#### Scenario: Non-canonical category fails validation
- **WHEN** a markdown file sets `categories: market-review`
- **THEN** schema validation fails and build is blocked

### Requirement: recommend/top/hide SHALL be boolean-only

`recommend`, `top`, and `hide` MUST accept only boolean values.

#### Scenario: String boolean is rejected
- **WHEN** a markdown file sets `hide: "true"`
- **THEN** schema validation fails because the value is not boolean

### Requirement: Optional metadata fields SHALL remain available

The following optional fields MUST be accepted when present: `updated`, `tags`, `description`, `cover`, `lang`, `author`, `word_count`, `reading_time`.

#### Scenario: Optional metadata is accepted without affecting strict required fields
- **WHEN** a markdown file includes valid required fields and any subset of optional fields
- **THEN** schema validation succeeds
