## ADDED Requirements

### Requirement: Description metadata SHALL prefer explicit frontmatter description

Article description resolution MUST prefer frontmatter `description` when present and non-empty.

#### Scenario: frontmatter description exists
- **WHEN** rendering article meta tags and list excerpts
- **THEN** description text is sourced from frontmatter `description`

#### Scenario: frontmatter description missing
- **WHEN** `description` is absent in frontmatter
- **THEN** system falls back to generated excerpt from sanitized body content
