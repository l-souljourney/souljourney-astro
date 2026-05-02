# Obsidian / Astro Push Workflow Review Findings

## Scope

- Astro repo: `/Users/lweeinli/Downloads/starlight/souljourney-blog`
- Obsidian repo: `/Users/lweeinli/Downloads/starlight/obsidian-lengine-plugin`
- Review date: `2026-05-01`

## Verified facts

### Astro

- `package.json` shows blog runtime version `2.3.0`, Astro `^5.16.0`, and build / publish-health scripts.
- `README.md` states current public baseline only includes complete zh/en mirror pairs.
- `src/content.config.ts` enforces canonical categories, strict slug regex, explicit `lang`, and unique ID generation by `lang::source_id::slug`.
- `src/utils/publishSet.ts` only promotes complete zh/en mirror pairs into published routes/RSS/search; single-language drafts stay pending.
- Local verification passed:
  - `pnpm build`
  - `pnpm check:publish-health`
  - metrics: `blogSize=4`, `mirrorPairs=2`, `duplicateIds=0`, `articleRoutes=4`, `rssItems=4`

### Obsidian plugin

- `package.json` and `manifest.json` runtime version is `2.0.0`.
- `main.ts` registers commands for metadata reconcile, WeChat publish, and English draft creation, but not Astro publish / bilingual Astro publish / Astro delete commands.
- `sidebar.ts` contains platform actions for preview, English draft creation, Astro publish, and Astro delete, all fixed to `mp2`.
- `sidebar.ts` Astro publish path is single-note only; there is no bilingual publish orchestration.
- `translationDraft.ts` only creates the English mirror draft; it does not auto-publish zh/en.
- Local verification passed:
  - `npm test` -> 52 / 52 passed
  - `npm run build` passed
  - `npm run lint` returned success earlier in this session with no type errors emitted

## Key gaps

1. Current working flow is **single-note Astro publish**, not **one-click bilingual publish**.
2. Current flow is **plugin -> wxengine publish API**; Git push to Astro repo is assumed to be handled by wxengine, not implemented in either reviewed repo.
3. Active Astro contract is `docs/astro-wxengine-publish-contract-v2.2.md`, while `docs/2026-03-09-v3-8-frontend-integration-spec.md` is stale and conflicts with current schema.
4. Obsidian historical plan `openspec/specs/v1.8.0/tasks.md` still lists bilingual Astro publish as unfinished.
5. Plugin docs intentionally describe `README`/`CHANGELOG` versions `v2.1.x`, but runtime remains `2.0.0`; this is explainable but easy to misread during release tracking.

## Preliminary conclusion

The Astro side is ready for bilingual public consumption once valid mirrored files land in the repo and CI passes. The Obsidian side is ready for:

- WeChat publish
- English mirror draft generation
- Single-note Astro publish
- Astro delete

But it is **not yet ready** for the target workflow:

`click once in Obsidian -> trigger wxengine -> push git -> Astro build/deploy -> bilingual public publish`

because the bilingual orchestration layer and the end-to-end operational contract are still missing or only exist in stale design docs.
