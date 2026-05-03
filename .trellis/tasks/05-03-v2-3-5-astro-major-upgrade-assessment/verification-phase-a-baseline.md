# Phase A Verification - Baseline Hardening

Date: 2026-05-03

## Goal

Establish a repeatable local verification baseline before Astro major-version migration.

## Changes applied

- Added local verification dependencies:
  - `@astrojs/check`
  - `typescript@5.8.3`
  - `tsx`
- Added package scripts:
  - `pnpm check`
  - `pnpm test`
  - `pnpm verify:baseline`
- Declared Node engine floor in `package.json` as `>=22.12.0`
- Added `.nvmrc` with `22.12.0`
- Updated GitHub Actions to:
  - use `node-version: 22.12.0`
  - run `pnpm check`
  - run `pnpm test`
  - then `pnpm build`
  - then `pnpm check:publish-health`
- Updated `.cnb.yml` to:
  - use `node:22-alpine`
  - run `pnpm run check`
  - run `pnpm run test`
  - then `pnpm run build`
- Updated current deploy-chain doc to reflect the new gate order

## Issues discovered during baseline setup

### 1. Wrong TypeScript major selected by default

- Initial install pulled `typescript@6.0.3`
- `astro@5.16.0` peer range still expects TypeScript `^5`
- Fixed by pinning to `typescript@5.8.3`

### 2. Existing Astro diagnostics debt surfaced by `astro check`

Errors found and fixed:

- `src/components/TOC/TOC.astro`
  - implicit `any` in headings filter/map
- `src/components/ThemeIcon/ThemeIcon.astro`
  - `is:inline` script blocked TypeScript syntax in script block
- `src/layouts/Layout/Layout.astro`
  - invalid / unused destructuring from config and props

## Verification commands

### `pnpm check`

Result:

- Passed
- `astro check` reports `0 errors`
- There are still hints from legacy files / vendor assets, but no blocking errors

### `pnpm test`

Result:

- Passed
- `36` tests passed
- `0` failed

### `pnpm build`

Result:

- Passed
- Built `39` pages
- `pagefind-articles-only` indexed `6` article pages
- sitemap generated successfully

### `pnpm check:publish-health`

Result:

- Passed
- Metrics:
  - `mirrorPairs=3`
  - `pendingTranslations=0`
  - `duplicateIds=0`
  - `articleRoutes=6`
  - `rssItems=6`

### `pnpm verify:baseline`

Result:

- Passed end-to-end
- Sequence:
  - `pnpm check`
  - `pnpm test`
  - `pnpm build`
  - `pnpm check:publish-health`

## Remaining risk

- The current Codex shell is still running on `Node v20.19.2`
- Because of that, all local verification in this session ran with an engine mismatch warning
- The repo is now configured for Node 22+, but **actual runtime validation on Node 22 is still pending**
- That becomes the first hard gate of Phase B

## Next recommended action

Phase B should validate the upgraded runtime itself:

1. run the same baseline commands under real Node 22.12+
2. verify GitHub Actions runtime behavior
3. verify CNB `node:22-alpine` build behavior
4. then start Astro / integration package upgrades
