## ADDED Requirements

### Requirement: English article page tag links SHALL include /en/ prefix

In `src/pages/en/article/[...article].astro`, all tag links MUST use the `/en/tag/{tag}` path instead of `/tag/{tag}`.

#### Scenario: Clicking a tag on an English article stays in English

- **WHEN** a user is viewing an English article at `/en/article/xxx` and clicks a tag link
- **THEN** the browser navigates to `/en/tag/{tag-name}` (not `/tag/{tag-name}`)

#### Scenario: Tag page renders in English

- **WHEN** a user arrives at `/en/tag/{tag-name}` from an English article
- **THEN** the page renders with English UI text and shows only English articles with that tag

### Requirement: ArticleCard component SHALL generate language-aware links

The `ArticleCard` component (`src/components/ArticleCard/ArticleCard.astro`) SHALL generate category and tag links based on the current language context. The component already receives a `lang` prop and uses it for article links (line :56); category links (line :49) and tag links (line :69) MUST follow the same pattern.

#### Scenario: Chinese ArticleCard links point to root paths

- **WHEN** an ArticleCard is rendered in Chinese context (`lang === 'zh'`)
- **THEN** category links point to `/categories/{category}` and tag links point to `/tag/{tag}`

#### Scenario: English ArticleCard links point to /en/ paths

- **WHEN** an ArticleCard is rendered in English context (`lang === 'en'`)
- **THEN** category links point to `/en/categories/{category}` and tag links point to `/en/tag/{tag}`

### Requirement: All internal navigation links SHALL be language-aware

No internal link across the entire site SHALL hardcode a language-free path when the page is rendered in a non-default locale. All occurrences of `/tag/`, `/categories/`, `/article/` in English pages MUST include the `/en/` prefix.

#### Scenario: Full grep finds no hardcoded paths in English pages

- **WHEN** a grep is performed on `src/pages/en/` for patterns like `href={"/tag/` or `href={"/categories/` (without `/en/` prefix)
- **THEN** zero matches are found

### Requirement: Language switch route mapping SHALL preserve full path

The language switch helper (`src/i18n/utils.ts:getRouteFromUrl`) SHALL preserve the complete route path when mapping between default and non-default locales, instead of truncating to the last segment.

#### Scenario: Switching language from nested English route keeps target path valid

- **WHEN** a user switches language from `/en/tag/ai` or `/en/categories/investment`
- **THEN** the target route keeps the full mapped path (e.g. `/tag/ai`, `/categories/investment`) and does not drop parent segments
