## Purpose
定义 Astro 对发布入站 frontmatter 的字段契约，保证双语镜像内容可稳定消费，并与公开发布集合规则保持一致。

## Requirements

### Requirement: Astro frontmatter SHALL enforce strict required fields for publishable content

The blog collection schema for publishable content MUST require: `title`, `date`, `categories`, `slug`, `source_id`, `lang`.

#### Scenario: Missing required field fails build
- **WHEN** a publishable markdown file is missing one of `title/date/categories/slug/source_id/lang`
- **THEN** Astro content validation fails and `pnpm build` exits with an error

### Requirement: Astro frontmatter SHALL deprecate id as publish input

`id` MUST NOT be part of the publishing contract and MUST NOT be used as a required or fallback route input in schema-level validation.

#### Scenario: Route generation does not read id
- **WHEN** route static path generation runs for article pages
- **THEN** no route param is generated from `post.data.id`

### Requirement: categories SHALL be constrained to canonical enum

`categories` MUST be one of the site canonical keys.

#### Scenario: Non-canonical category fails validation
- **WHEN** a markdown file sets `categories` outside the canonical category enum
- **THEN** schema validation fails and build is blocked

### Requirement: recommend/top/hide SHALL be boolean-only

`recommend`, `top`, and `hide` MUST accept only boolean values.

#### Scenario: String boolean is rejected
- **WHEN** a markdown file sets `hide: "true"`
- **THEN** schema validation fails because the value is not boolean

### Requirement: Optional metadata fields SHALL remain available

The following optional fields MUST be accepted when present: `updated`, `tags`, `description`, `cover`, `author`, `word_count`, `reading_time`, `target`, `article_type`, `render_profile`, `cover_image_url`.

#### Scenario: Optional metadata is accepted without affecting strict required fields
- **WHEN** a markdown file includes valid required fields and any subset of optional fields
- **THEN** schema validation succeeds

### Requirement: Publishable mirror entries SHALL share source_id and slug across zh/en

For entries intended to enter the public publish set, the zh/en mirror pair MUST share the same `source_id` and the same `slug`.

#### Scenario: shared source_id and slug are preserved across mirror entries
- **WHEN** zh and en entries describe the same logical article
- **THEN** they keep identical `source_id` and `slug` values
