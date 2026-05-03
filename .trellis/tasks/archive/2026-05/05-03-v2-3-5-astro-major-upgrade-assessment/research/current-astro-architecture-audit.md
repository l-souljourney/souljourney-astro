# Current Astro Architecture Audit

## Snapshot

- Repo app version: `2.3.4`
- Current framework: `astro@5.16.0`
- Current runtime in local shell: `node v20.19.2`, `pnpm 9.10.0`
- Current CI runtime: GitHub Actions `node-version: 20`
- Current CNB runtime: `.cnb.yml` uses `node:20-alpine`

## Key framework dependencies

- Official Astro integrations:
  - `@astrojs/mdx@4.3.12`
  - `@astrojs/rss@4.0.14`
  - `@astrojs/sitemap@3.6.0`
  - `@astrojs/tailwind@6.0.2`
- Third-party Astro ecosystem:
  - `astro-icon@1.1.5`
  - `astro-pagefind@1.8.5`
  - `@playform/compress@0.1.9`
  - `pagefind@1.4.0`

## Compatibility signals from lockfile

- `@astrojs/mdx@4.3.12` peer depends on `astro: ^5.0.0`
- `@astrojs/tailwind@6.0.2` peer depends on `astro: ^3 || ^4 || ^5`
- `astro-pagefind@1.8.5` peer depends on `astro: ^2.0.4 || ^3 || ^4 || ^5`
- `@playform/compress@0.1.9` is resolved against current `astro@5.16.0`

Implication: current installed ecosystem is pinned to the Astro 5 generation. Framework upgrade cannot be done alone.

## Architecture hotspots

### 1. Config and integration layer

- `astro.config.mjs` includes:
  - `experimental.svgo: true`
  - `i18n` with `defaultLocale: "zh"`, `locales: ["zh", "en"]`, `routing.prefixDefaultLocale: false`
  - custom Markdown pipeline (`remark-math`, `remark-directive`, `rehype-katex`, `rehype-slug`, local plugins)
  - custom integration `src/integrations/pagefindArticlesOnly.mjs`
  - `@playform/compress`
  - `@astrojs/tailwind`
- `validateMarkdownIntegrityInDir()` scans `src/content/blog` synchronously during config evaluation.

### 2. Content layer

- `src/content.config.ts` uses:
  - `glob()` loader from `astro/loaders`
  - `defineCollection()`
  - `z` imported from `astro:content`
  - custom `generateId()` for stable bilingual IDs
- Public routes are generated from `astro:content` entries and depend on schema correctness.

### 3. Navigation / client lifecycle

- Shared layout imports `ClientRouter` from `astro:transitions`
- Multiple components bind to:
  - `astro:page-load`
  - `astro:before-swap`
  - `astro:after-swap`
- This creates upgrade sensitivity around view transitions lifecycle and script ordering.

### 4. Route structure debt

- `src/pages` and `src/pages/en` are mirrored manually
- Current file count sample:
  - `src/pages/en`: 8 files
  - root-level `src/pages` files: 4
  - nested route files under `src/pages/*/*`: 8
- Several route handlers repeat the same `getCollection("blog")` and locale filtering logic.

### 5. Type-safety debt

- Widespread `any` in route pages and utilities:
  - RSS handlers
  - tag/category routes
  - article routes (`const post: any = Astro.props`)
  - archive/tag/category aggregators
- This increases migration debugging cost because type regressions will surface late.

## Verification baseline

### Build

`pnpm build` passes locally on `2026-05-03`.

Observed warnings:

- `baseline-browser-mapping` data is outdated
- `caniuse-lite` / Browserslist data is outdated
- Vite warns about unused imports inside Astro internals during build

### Type-check

- `pnpm astro check` cannot run because `@astrojs/check` is not installed
- There is no dedicated `typecheck` script in `package.json`

Implication: upgrade work currently lacks a first-class Astro diagnostics gate.

### Tests

- `node --test tests/*.mjs tests/*.ts` result:
  - `.mjs` tests pass
  - `.ts` tests fail with `ERR_UNKNOWN_FILE_EXTENSION`

Implication: test runner for TypeScript tests is not configured as an executable CI-grade contract.

## Deployment/runtime blockers

- `.github/workflows/deploy.yml` hardcodes `node-version: 20`
- `.cnb.yml` hardcodes `node:20-alpine`
- Production release chain depends on GitHub main -> CNB -> COS -> EdgeOne, with build executed on Node 20

Implication: even if code is migrated, Astro 6 cannot be promoted until release infrastructure is upgraded to Node 22+.

## Initial judgment

The repo is not yet ready for a direct “bump Astro and ship” move.

Primary blockers:

1. Runtime baseline is below Astro 6 requirement
2. Installed Astro ecosystem packages are still aligned to Astro 5
3. Tailwind integration path is legacy
4. Type-check/test gates are incomplete
5. Custom integrations and duplicated route logic increase migration surface area
