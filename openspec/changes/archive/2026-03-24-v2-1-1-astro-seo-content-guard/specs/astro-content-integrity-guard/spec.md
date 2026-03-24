## ADDED Requirements

### Requirement: Build SHALL fail on duplicate frontmatter at body start

Astro markdown processing MUST reject content whose body begins with a second frontmatter block (`--- ... ---`) after the primary frontmatter has already been parsed.

#### Scenario: duplicated frontmatter is detected
- **WHEN** markdown body starts with `---` followed by key-value YAML-like lines and closing `---`
- **THEN** build fails with a readable error containing file identity

### Requirement: Summary extraction SHALL run after integrity check

Any fallback summary extraction from markdown body MUST run only after content-integrity checks pass.

#### Scenario: integrity violation before summary extraction
- **WHEN** duplicate frontmatter exists in body start
- **THEN** fallback summary extraction is aborted and build fails
