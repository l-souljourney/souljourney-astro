## MODIFIED Requirements

### Requirement: Astro frontmatter SHALL enforce strict required fields for publishable content

The blog collection schema for publishable content MUST require: `title`, `date`, `categories`, `slug`, `source_id`, `lang`.  
These required fields MUST also be available for entry-id generation strategy so content loading can remain deterministic under bilingual publishing.

#### Scenario: Missing required field fails build
- **WHEN** a publishable markdown file is missing one of `title/date/categories/slug/source_id/lang`
- **THEN** Astro content validation fails and `pnpm build` exits with an error

#### Scenario: Required fields support deterministic entry-id generation
- **WHEN** a valid blog entry is loaded by content collection loader
- **THEN** loader can derive deterministic id using `lang + source_id + slug` without fallback to unstable defaults
