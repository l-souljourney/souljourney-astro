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

### Remote execution and hotfix loop

- first remote run
  - GitHub Actions run `25268987086`
  - title: `docs(v2.3.5): record astro6 verification and release-chain readiness`
  - updated at `2026-05-03T03:41:07Z`
  - result: `build` failed, `sync-cnb` skipped
- failed log evidence
  - `gh run view 25268987086 --repo l-souljourney/souljourney-astro --job 74088177369 --log-failed | rg -n 'ReferenceError|require is not defined|tailwind\\.config\\.mjs'`
  - matched:
    - `tailwind.config.mjs:112`
    - `ReferenceError: require is not defined`
- root cause
  - `tailwind.config.mjs` 已切到 ESM 文件，但仍保留 `require('@tailwindcss/typography')`
  - 在 GitHub Node 22 ESM 运行时下触发 `require is not defined`
- hotfix
  - commit `4504885 fix(v2.3.5): align tailwind config with esm runtime`
  - changed to `import typography from '@tailwindcss/typography'`
  - `plugins: [typography]`
- second remote run
  - GitHub Actions run `25269114269`
  - title: `fix(v2.3.5): align tailwind config with esm runtime`
  - updated at `2026-05-03T03:49:04Z`
  - result: `build` success, `sync-cnb` success
- successful job breakdown
  - `build`: `Astro check` / `Test` / `Build` / `Publish health guard` all success
  - `sync-cnb`: `Validate CNB sync secret` / `Sync repository to CNB mirror` / `Show sync target` all success

### CNB mirror readback

- command
  - `git ls-remote https://cnb.cool/l-souljourney/souljourney-astro.git refs/heads/main`
- result
  - `4504885f250a416277fd6c34e983e11a5a1cdeda refs/heads/main`
- judgment
  - CNB `main` mirror is aligned with the successful hotfix commit used by GitHub Actions

### Production readback

- commands
  - `curl -sI https://www.l-souljourney.cn/ | rg -i 'last-modified|date|etag|server|eo-cache-status'`
  - `curl -s https://www.l-souljourney.cn/ | rg -n 'Astro v6\\.2\\.1|\\[\\[Pasted image'`
  - `curl -s https://www.l-souljourney.cn/en/ | rg -n 'Astro v6\\.2\\.1|\\[\\[Pasted image'`
- results
  - zh site headers
    - `server: tencent-cos`
    - `last-modified: Sun, 03 May 2026 03:50:14 GMT`
    - `eo-cache-status: MISS`
  - zh html
    - contains `Astro v6.2.1`
    - no `[[Pasted image ...]]`
  - en html
    - contains `Astro v6.2.1`
    - no `[[Pasted image ...]]`

## Risks / remaining work

- `baseline-browser-mapping` and `caniuse-lite` warnings remain informational maintenance debt
- future config edits under Node 22 should avoid CommonJS-only calls inside `.mjs` config files
- Theme toggle browser behavior was not part of this phase's explicit smoke assertion, although listener regression tests still pass

## Current judgment

- **Local Astro 6 upgrade closure: pass**
- **Local browser smoke after upgrade: pass**
- **Release-chain configuration migration to Node 22: pass**
- **GitHub Actions remote verification: pass**
- **CNB mirror synchronization: pass**
- **COS/EdgeOne production readback: pass**
- **v2.3.5 Astro major upgrade closure: ready to archive**
