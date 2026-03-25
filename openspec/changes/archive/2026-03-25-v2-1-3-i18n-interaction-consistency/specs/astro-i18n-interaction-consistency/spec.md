## ADDED Requirements

### Requirement: Mobile bilingual navigation SHALL keep locale-consistent labels and links
Mobile sidebar navigation MUST render localized labels for the active locale and MUST keep route prefixes locale-consistent (`/` for zh, `/en/` for en) across article, category, and tag entry points.

#### Scenario: English mobile sidebar renders localized labels
- **WHEN** a user opens mobile sidebar on an English route under `/en/*`
- **THEN** labels are rendered as readable English text instead of untranslated key strings (for example `nav.xxx`)

#### Scenario: English mobile sidebar routes keep /en prefix
- **WHEN** a user clicks category or article links from the English mobile sidebar
- **THEN** target URLs remain under `/en/*` and do not fall back to root-language routes

### Requirement: TOC highlight SHALL track heading position consistently
TOC active-state logic MUST use selectors that match the rendered article heading structure in both zh/en article templates so that scroll highlighting remains stable.

#### Scenario: TOC active item updates while scrolling article
- **WHEN** a user scrolls an article detail page with multiple headings
- **THEN** TOC highlight follows the currently visible section without persistent stale highlight

### Requirement: Search overlay listeners SHALL be idempotent across client-side navigation
Search overlay open/close handlers MUST be bound in an idempotent way so repeated `astro:page-load`/swap cycles do not multiply listeners.

#### Scenario: Multiple route switches do not multiply search handlers
- **WHEN** a user navigates between pages multiple times and opens/closes search
- **THEN** each interaction triggers exactly one open/close behavior with no duplicate execution
