## ADDED Requirements

### Requirement: slug SHALL be the only route key

Article route generation MUST use `slug` as the only key. Route generation MUST NOT fallback to `id`.

#### Scenario: Article route param uses slug only
- **WHEN** `getStaticPaths` runs for article pages
- **THEN** `params.article` is generated from `post.data.slug`

### Requirement: slug SHALL match strict kebab-case regex

`slug` MUST match `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

#### Scenario: Invalid slug format is rejected
- **WHEN** a markdown file contains `slug: "Hello_World"`
- **THEN** schema validation fails and build is blocked

### Requirement: All article links SHALL use slug consistently

Article links in list cards, archive, sidebar recommendations, article detail, copyright, and RSS MUST all use the same slug-based path.

#### Scenario: RSS link equals card link for same post
- **WHEN** a post is shown in homepage card and included in RSS
- **THEN** both links resolve to `/article/{slug}` (or `/en/article/{slug}`)

### Requirement: zh/en static path selection SHALL remain language-isolated

Language filtering MUST ensure one post appears in only one language route set.

#### Scenario: en post excluded from zh routes
- **WHEN** a post is marked as English (`lang: "en"`)
- **THEN** it is excluded from zh static paths and zh RSS

#### Scenario: zh post excluded from en routes
- **WHEN** a post is marked as Chinese (`lang: "zh"`)
- **THEN** it is excluded from en static paths and en RSS
