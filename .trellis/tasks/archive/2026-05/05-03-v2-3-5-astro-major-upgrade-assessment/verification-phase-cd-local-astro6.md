# Phase C/D Local Verification

Date: 2026-05-03
Runtime: `Node v22.16.0` via `/opt/homebrew/opt/node@22/bin/node`

## What changed

- Completed local Astro core upgrade to `astro@6.2.1`
- Migrated `experimental.svgo` to `experimental.svgOptimizer`
- Migrated content schema import from `astro:content` `z` to `astro/zod`
- Removed stale `node_modules` state that kept resolving `@astrojs/internal-helpers@0.7.5`
- Replaced `astro-pagefind` wrapper usage with direct `@pagefind/default-ui`
- Removed `@astrojs/tailwind` integration from `astro.config.mjs`
- Added `postcss.config.cjs` so Tailwind CSS continues through standard PostCSS pipeline
- Fixed `src/utils/getCover.ts` so banner lookup stays anchored to repo `public/assets/images/banner`
- Added regression coverage for Pagefind UI decoupling and `getCover` path resolution

## Evidence

### Dependency/runtime alignment

- `pnpm install` after clean `node_modules` rebuild removed:
  - `astro-pagefind 1.8.5`
  - `@astrojs/tailwind 6.0.2`
- `pnpm install` added direct dependency:
  - `@pagefind/default-ui 1.4.0`

### Verification commands

```bash
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm check
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" node --import tsx --test tests/v2.3.3-pagefind-index-scope.test.mjs tests/v2.3.5-get-cover.test.ts
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm verify:baseline
```

### Verification results

- `pnpm check`
  - `0 errors`
- focused tests
  - `5/5 pass`
- `pnpm verify:baseline`
  - `astro check`: pass
  - `node --import tsx --test tests/*.mjs tests/*.ts`: `40/40 pass`
  - `pnpm build`: pass
  - `pnpm check:publish-health`: pass

### Build evidence highlights

- Astro 6 build completed successfully
- `pagefind-articles-only` indexed `6` article pages
- `@astrojs/sitemap` generated `dist/sitemap-index.xml`
- `publish-health` metrics:
  - `mirrorPairs: 3`
  - `articleRoutes: 6`
  - `rssItems: 6`
  - result: `PASS`

## Risks / remaining work

- CI and CNB chain have config updates in this task, but this round only verified local execution
- `baseline-browser-mapping` and `caniuse-lite` warnings remain informational debt
- Search UI was decoupled from `astro-pagefind`; browser-level smoke check is still needed
- Tailwind is now running through standard PostCSS on Astro 6, but visual regression has not yet been manually checked

## Next recommended phase

- Run GitHub Actions path verification
- Run CNB build verification
- Smoke-check local search modal and key zh/en routes in browser
- If all pass, proceed to release-chain rehearsal for COS/EdgeOne
