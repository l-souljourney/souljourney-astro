## 0. Search — Single Pipeline Consolidation [H]

- [x] 0.1 Remove legacy search index generation call from `src/pages/[...page].astro` (`setSearchJson(posts)`)
- [x] 0.2 Delete legacy search implementation file `src/scripts/Search.ts`
- [x] 0.3 Delete legacy search index builder `src/utils/vhSearch.ts`
- [x] 0.4 Remove any remaining imports/references to legacy search from `src/scripts/Init.ts` and project-wide grep
- [x] 0.5 Refactor `src/components/Search/Search.astro` modal init to be idempotent (prevent duplicate event listeners across `astro:page-load`)
- [x] 0.6 Improve search trigger semantics in `src/components/Header/Header.astro` (`span.search-btn` -> keyboard-accessible button semantics)
- [x] 0.7 Verify: navigation across pages does not multiply search open/close handlers, and search still works in zh/en

## 1. Security — XSS Fix [H]

- [x] 1.1 Verify project no longer contains any custom `innerHTML` search result renderer (`src/scripts/Search.ts` removed)
- [x] 1.2 Verify search works via `astro-pagefind` only, with no dependency on `vh-search.json`
- [x] 1.3 Verify: create a test article with title `<script>alert(1)</script>`, search for it, confirm no script execution

## 2. Security — i18n Route Fix [H]

- [x] 2.1 Fix `src/pages/en/article/[...article].astro:90` — change `href={/tag/${i}}` to `href={/en/tag/${i}}`
- [x] 2.2 Fix `src/components/ArticleCard/ArticleCard.astro:49` — add i18n prefix to category link using existing `lang` prop pattern (match line :56 style)
- [x] 2.3 Fix `src/components/ArticleCard/ArticleCard.astro:69` — add i18n prefix to tag link using existing `lang` prop
- [x] 2.4 Run full grep on `src/pages/en/` for any remaining hardcoded `/tag/` or `/categories/` without `/en/` prefix, fix any found
- [x] 2.5 Verify: navigate English article page, click tag → confirm URL is `/en/tag/xxx`, click category → confirm URL is `/en/categories/xxx`
- [x] 2.6 Fix `src/i18n/utils.ts:getRouteFromUrl()` to preserve full non-default locale route path (avoid losing parent segments)
- [x] 2.7 Verify language switch on `/en/article/*`, `/en/tag/*`, `/en/categories/*` keeps valid target path (no 404 due to truncated route)

## 3. Config — astro.config.mjs Deduplication [H]

- [x] 3.1 Merge the two `markdown` blocks in `astro.config.mjs` into one: combine Shiki dual-theme (light: `github-light`, dark: `github-dark-dimmed`) with all remark/rehype plugins
- [x] 3.2 Verify: `pnpm build` succeeds, code blocks have correct dark/light themes, math rendering works

## 4. CI/CD — Deploy Pipeline Optimization [M]

- [x] 4.1 Update `.github/workflows/deploy.yml` — switch coscli to COS global acceleration endpoint (`cos.accelerate.myqcloud.com`)
- [x] 4.2 Add CDN cache purge step to deploy.yml (compatible strategy: `TEO_ZONE_ID` first, `CDN_DOMAIN` fallback, warning+skip if none configured)
- [x] 4.3 Check if `.cnb.yml` exists in repo root, delete it if present
- [x] 4.4 Search for and remove any other CNB-specific configuration files or references

## 5. Cleanup — Dead Code & Unused Dependencies [M]

- [x] 5.1 Delete `src/scripts/TypeWrite.ts`
- [x] 5.2 Remove TypeWrite import and function call from `src/scripts/Init.ts`
- [x] 5.3 Grep for any remaining references to `TypeWrite` across `src/`, remove all
- [x] 5.4 Remove Friends link and RSS Reader references from `src/scripts/Init.ts` (commented/disabled imports and calls)
- [x] 5.5 Remove `@waline/client` from `package.json` devDependencies
- [x] 5.6 Remove `@types/dplayer` from `package.json` devDependencies
- [x] 5.7 Remove `@types/nprogress` from `package.json` devDependencies
- [x] 5.8 Run `pnpm install` to update lockfile, then `pnpm build` to verify no breakage

## 6. Config — Environment Variables [L]

- [x] 6.1 Create `.env.example` with `PUBLIC_SITE_URL` only (lightweight scope for v2.0)
- [x] 6.2 Migrate `src/config.ts` hardcoded `Site` URL to use `import.meta.env.PUBLIC_SITE_URL` with fallback to current value
- [x] 6.3 Add `.env` to `.gitignore` (if not already present)
- [x] 6.4 Verify: `pnpm dev` and `pnpm build` work with and without `.env` file (fallback values kick in)

## 7. Verification & Release

- [x] 7.1 Full local build: `pnpm build` succeeds with zero errors
- [x] 7.2 Local preview: `pnpm preview` — check Chinese homepage, English homepage, article pages, search, categories, tags
- [x] 7.3 Bump version in `package.json` from `1.9.5` to `2.0.0`
- [ ] 7.4 Commit all changes with message `feat: v2.0 infrastructure migration and security fixes`
- [ ] 7.5 Push feature branch and create PR, verify merge to `main` triggers Actions build + COS deploy succeeds
- [ ] 7.6 Verify Cloudflare Pages auto-build triggers (requires Dashboard binding to be done separately)
