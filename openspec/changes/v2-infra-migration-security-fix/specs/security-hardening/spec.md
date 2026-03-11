## ADDED Requirements

### Requirement: Search results SHALL be XSS-safe

The search experience in v2.0 SHALL avoid custom `innerHTML`-based result rendering and rely on `astro-pagefind` as the active search pipeline. Search result rendering MUST NOT execute scripts from content.

#### Scenario: Malicious article title does not execute script

- **WHEN** an article exists with title `<script>alert(1)</script>` and a user searches for a matching keyword
- **THEN** search result rendering does not execute any script and the page remains interactive

#### Scenario: Search keyword highlighting is preserved

- **WHEN** a user searches for "科技股" and an article's content contains that keyword
- **THEN** keyword search returns readable excerpts as expected (highlight rendering follows Pagefind UI behavior)

#### Scenario: Legacy custom renderer is absent

- **WHEN** codebase search is run for legacy search renderer files and calls
- **THEN** `src/scripts/Search.ts`, `src/utils/vhSearch.ts`, and `setSearchJson(...)` usage are absent

### Requirement: Search implementation SHALL use a single pipeline

The project SHALL use `astro-pagefind` as the only search pipeline in v2.0. Legacy `vh-search.json` generation and legacy runtime renderer (`src/scripts/Search.ts`) SHALL be removed to prevent duplicated behavior and residual injection surface.

#### Scenario: Legacy search artifacts are removed

- **WHEN** the repository is checked after migration
- **THEN** `src/scripts/Search.ts` and `src/utils/vhSearch.ts` are absent, and no `setSearchJson(...)` call exists in page routes

#### Scenario: Search modal event binding remains stable after page transitions

- **WHEN** a user navigates across pages with `astro:transitions` and opens/closes search repeatedly
- **THEN** search open/close behavior remains single-fire (no duplicated handler effects)

### Requirement: Config deduplication eliminates override

The `astro.config.mjs` file SHALL contain exactly one `markdown` configuration block that includes both Shiki dual-theme configuration (light + dark) and all remark/rehype plugins.

#### Scenario: Dual Shiki themes are active after build

- **WHEN** the site is built with `pnpm build`
- **THEN** code blocks render with `github-light` theme in light mode and `github-dark-dimmed` theme in dark mode

#### Scenario: All remark/rehype plugins are active

- **WHEN** a markdown article uses math notation (`$$x^2$$`) or custom directives (`:::note`)
- **THEN** KaTeX renders the math and the directive transforms into an alert component

### Requirement: Dead code and unused dependencies SHALL be removed

The following SHALL be removed from the codebase:
- `src/scripts/TypeWrite.ts` (disabled feature, empty config)
- All references to TypeWrite, Friends link, RSS Reader in `src/scripts/Init.ts`
- `@waline/client` from `package.json` devDependencies (comment system not enabled)
- `@types/dplayer` from `package.json` devDependencies (video player not used)
- `@types/nprogress` from `package.json` devDependencies (progress bar not used)

#### Scenario: Build succeeds after cleanup

- **WHEN** dead code and unused dependencies are removed and `pnpm build` is executed
- **THEN** the build completes successfully with zero errors

#### Scenario: No runtime references to removed modules

- **WHEN** a grep search is run for `TypeWrite`, `waline`, `dplayer`, `nprogress` across `src/`
- **THEN** zero matches are found (excluding `node_modules/`)
