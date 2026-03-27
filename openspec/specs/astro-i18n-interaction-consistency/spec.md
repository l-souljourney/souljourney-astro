# astro-i18n-interaction-consistency Specification

## Purpose
定义 Astro 双语交互一致性约束，确保导航、语言切换、目录高亮与搜索弹层在镜像双语发布模型下保持稳定行为。

## Requirements

### Requirement: Mobile bilingual navigation SHALL keep locale-consistent labels and links

Mobile sidebar navigation MUST render localized labels for the active locale and MUST keep route prefixes locale-consistent across article, category, and tag entry points.

#### Scenario: English mobile sidebar renders localized labels
- **WHEN** a user opens mobile sidebar on an English route under `/en/*`
- **THEN** labels are rendered as readable English text instead of untranslated key strings

#### Scenario: English mobile sidebar routes keep /en prefix
- **WHEN** a user clicks category or article links from the English mobile sidebar
- **THEN** target URLs remain under `/en/*`

### Requirement: Article language switch SHALL resolve by mirrored publish pair

Language switch on published article pages MUST resolve from the mirrored publish pair rather than ad-hoc path slicing or homepage fallback.

#### Scenario: published article switches by mirrored pair
- **WHEN** a user triggers language switch on a published article detail page
- **THEN** the target path is resolved from the mirrored article with the same shared `source_id` and `slug`

### Requirement: Mobile locale prefix helper SHALL be idempotent for English paths

Mobile sidebar link prefix resolution for English pages MUST be idempotent.

#### Scenario: already-prefixed path is kept as-is
- **WHEN** mobile navigation helper receives `/en/archives`
- **THEN** returned path remains `/en/archives`

#### Scenario: unprefixed path gets english prefix
- **WHEN** mobile navigation helper receives `/archives` under English locale
- **THEN** returned path is `/en/archives`

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
