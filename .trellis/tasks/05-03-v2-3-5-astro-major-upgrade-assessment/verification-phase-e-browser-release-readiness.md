# Phase E Browser + Release Readiness Verification

Date: 2026-05-03
Runtime: `Node v22.16.0` via `/opt/homebrew/opt/node@22/bin/node`

## What changed

- Hardened `src/utils/getCover.ts` so invalid Obsidian wikilink-style frontmatter covers fall back to site banner images
- Added regression coverage for invalid `cover` frontmatter values
- Re-ran full local baseline after the runtime guard
- Smoke-checked built Astro 6 output in a real browser against zh/en home pages, search UI, and article routes
- Re-read GitHub Actions and CNB release-chain config after the Node 22 upgrade

## Evidence

### Code-level follow-up

- `src/utils/getCover.ts`
  - explicit valid cover values are preserved
  - blank / null / `[[...]]` cover values now fall back to `public/assets/images/banner`
- `tests/v2.3.5-get-cover.test.ts`
  - added regression for `[[Pasted image 20260324113724.png]]`

### Verification commands

```bash
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm check
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" node --import tsx --test tests/v2.3.3-pagefind-index-scope.test.mjs tests/v2.3.5-get-cover.test.ts
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm verify:baseline
env PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm preview --host 127.0.0.1 --port 4322
playwright-cli goto http://127.0.0.1:4322/
playwright-cli console error
playwright-cli goto http://127.0.0.1:4322/en/
playwright-cli console error
playwright-cli goto http://127.0.0.1:4322/article/v2-3-2-astro-demo/
playwright-cli console error
ruby -e 'require "yaml"; [".github/workflows/deploy.yml", ".cnb.yml"].each { |f| YAML.load_file(f); puts "OK #{f}" }'
gh run list --workflow deploy.yml --limit 5 --repo l-souljourney/souljourney-astro
```

### Verification results

- focused tests
  - `6/6 pass`
- `pnpm verify:baseline`
  - `astro check`: pass
  - `node --import tsx --test tests/*.mjs tests/*.ts`: `41/41 pass`
  - `pnpm build`: pass
  - `pnpm check:publish-health`: pass
- browser smoke
  - zh home `/`: console `0 error`
  - en home `/en/`: console `0 error`
  - zh article `/article/v2-3-2-astro-demo/`: console `0 error`
  - search UI on zh home renders and returns `2` `Astro` matches
- YAML parse
  - `OK .github/workflows/deploy.yml`
  - `OK .cnb.yml`

### Release-chain config readback

- `.github/workflows/deploy.yml`
  - uses `actions/setup-node@v5`
  - pins `node-version: 22.12.0`
  - executes `pnpm check`, `pnpm test`, `pnpm build`, `pnpm check:publish-health`
- `.cnb.yml`
  - uses `node:22-alpine`
  - main and pull_request stages both run `pnpm run check`, `pnpm run test`, `pnpm run build`
  - production main push keeps `publish health guard -> deploy to cos -> refresh edgeone cache`

### Remote-chain boundary evidence

- latest remote workflow records from GitHub are:
  - `25266298129` `chore: record journal` at `2026-05-03T01:07:13Z`
  - `25248964907` `chore(task): archive 05-02-v2-3-3-pagefind-cos-speed` at `2026-05-02T09:32:26Z`
- implication:
  - current Astro 6 / Node 22 task changes are still local and uncommitted
  - no remote GitHub Actions or CNB run has executed this exact upgrade state yet

## Risks / remaining work

- Real GitHub Actions and CNB verification still requires pushing the current task changes to the tracked branch
- CNB -> COS -> EdgeOne production release chain has only been config-audited locally in this round, not executed
- `baseline-browser-mapping` and `caniuse-lite` warnings remain informational maintenance debt
- Theme toggle browser behavior was not part of this phase's explicit smoke assertion, although listener regression tests still pass

## Current judgment

- **Local Astro 6 upgrade closure: pass**
- **Local browser smoke after upgrade: pass**
- **Release-chain configuration migration to Node 22: ready for remote execution**
- **Actual production-chain verification: pending push-triggered GitHub/CNB runs**
