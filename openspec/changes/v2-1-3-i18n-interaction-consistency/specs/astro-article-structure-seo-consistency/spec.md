## MODIFIED Requirements

### Requirement: Article detail templates SHALL render valid semantic structure
Article detail templates for both zh/en routes MUST keep semantic containers valid and tag closures balanced. Templates MUST NOT close with mismatched tags (for example, closing `</main>` for an opened `<article>`). Article templates MUST NOT introduce a nested `main` landmark when rendered inside the shared layout `main`; the detail content container SHALL use `article` or `section`.

#### Scenario: zh article template has balanced structural tags
- **WHEN** building `/article/{slug}` pages
- **THEN** page template renders with matched open/close tags for article metadata block and content block

#### Scenario: en article template has balanced structural tags
- **WHEN** building `/en/article/{slug}` pages
- **THEN** page template renders with matched open/close tags for article metadata block and content block

#### Scenario: article detail does not nest main landmark
- **WHEN** rendering article detail pages through shared layout
- **THEN** output contains only one page-level `main` landmark and article content is wrapped by `article`/`section` instead of inner `main`
