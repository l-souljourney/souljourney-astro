## Purpose
定义 Astro 文章路由的稳定约束，确保 `slug` 作为唯一主键并在中英文路由、列表链接、RSS 输出与语言切换路径中保持一致，从而避免路由漂移与死链。

## Requirements

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

### Requirement: Article hreflang SHALL only reference existing counterpart content

For article detail routes, hreflang alternate links MUST be emitted only when the corresponding opposite-language article exists for the same slug.

#### Scenario: zh article without en counterpart
- **WHEN** rendering `/article/{slug}` and no `/en/article/{slug}` content exists
- **THEN** page head MUST NOT emit `hreflang="en"` pointing to that missing route

#### Scenario: bilingual article pair exists
- **WHEN** both zh and en entries exist for the same slug
- **THEN** page head emits valid `hreflang="zh"` and `hreflang="en"` alternates

### Requirement: Article language switch SHALL avoid dead-end route

Language switch behavior on article pages MUST avoid linking to non-existent counterpart article routes.

#### Scenario: missing counterpart article
- **WHEN** current article has no opposite-language entry
- **THEN** language switch target falls back to language homepage instead of dead article route
