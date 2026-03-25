# astro-article-structure-seo-consistency Specification

## Purpose
TBD - created by archiving change v2-1-2-core-structure-seo-hotfix. Update Purpose after archive.
## Requirements
### Requirement: Article detail templates SHALL render valid semantic structure
Article detail templates for both zh/en routes MUST keep semantic containers valid and tag closures balanced. Templates MUST NOT close with mismatched tags (for example, closing `</main>` for an opened `<article>`).

#### Scenario: zh article template has balanced structural tags
- **WHEN** building `/article/{slug}` pages
- **THEN** page template renders with matched open/close tags for article metadata block and content block

#### Scenario: en article template has balanced structural tags
- **WHEN** building `/en/article/{slug}` pages
- **THEN** page template renders with matched open/close tags for article metadata block and content block

### Requirement: Article page SEO cover SHALL be passed through layout contract
Article detail pages MUST provide resolved article cover through the shared Layout-to-Head contract so that metadata image output is article-scoped instead of site default.

#### Scenario: article with custom cover uses article cover in metadata
- **WHEN** an article has frontmatter `cover`
- **THEN** Head metadata output uses the resolved article cover URL for OG/Twitter/JSON-LD image fields

#### Scenario: article without cover falls back to site cover
- **WHEN** an article has no frontmatter `cover`
- **THEN** Head metadata output falls back to site-level cover URL without breaking build

### Requirement: Head metadata type SHALL be explicit for article pages
Head metadata generation MUST support explicit page type input and article pages MUST set this type to `article`. `og:type` and JSON-LD type selection MUST follow explicit page type instead of inferring from cover availability.

#### Scenario: article page outputs article metadata type
- **WHEN** rendering an article detail page
- **THEN** `og:type` is `article` and JSON-LD uses BlogPosting schema

#### Scenario: non-article page keeps website metadata type
- **WHEN** rendering non-article routes (homepage, category, tag, archive)
- **THEN** `og:type` is `website` and JSON-LD uses WebSite schema

