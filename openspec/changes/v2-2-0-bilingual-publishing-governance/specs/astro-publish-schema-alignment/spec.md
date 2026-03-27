## MODIFIED Requirements

### Requirement: Astro frontmatter SHALL enforce strict required fields for publishable content

The blog collection schema for publishable content MUST require: `title`, `date`, `categories`, `slug`, `source_id`, `lang`.

#### Scenario: Missing required field fails build
- **WHEN** a publishable markdown file is missing one of `title/date/categories/slug/source_id/lang`
- **THEN** Astro content validation fails and `pnpm build` exits with an error

### Requirement: Publishable mirror entries SHALL share source_id and slug across zh/en

For entries intended to enter the public publish set, the zh/en mirror pair MUST share the same `source_id` and the same `slug`.

#### Scenario: shared source_id and slug are preserved across mirror entries
- **WHEN** zh and en entries describe the same logical article
- **THEN** they keep identical `source_id` and `slug` values
