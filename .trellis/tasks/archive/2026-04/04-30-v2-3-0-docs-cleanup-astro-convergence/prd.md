# <v2.3.0> docs cleanup and astro convergence

## Goal

Use `v2.3.0` as a consolidation release for the Astro repository: fully align
documentation and versioning terminology, archive and tidy historical planning
materials, and converge the remaining Astro-side technical architecture so the
blog becomes a cleaner, healthier base for future features and continued
Obsidian-driven publishing.

## What I already know

- The repository has already switched to Trellis-first workflow; OpenSpec is
  historical/reference-only and active changes are archived.
- Current public behavior after `v2.3.0` cleanup is stable:
  `pnpm build` passes and `pnpm check:publish-health` reports
  `blogSize=4 mirrorPairs=2 articleRoutes=4 rssItems=4`.
- The product/runtime progress is effectively at `v2.2.1`; `v2.2.2` was used
  for workflow migration rather than Astro runtime capability expansion.
- There is version/documentation drift today: `README.md` speaks in `v2.2.1`
  terms while `package.json` still reports `2.0.0`.
- Historical `v2.2` planning left several architecture-convergence items not
  fully executed, especially around documentation cleanliness, route/query
  convergence, runtime/script slimming, and broader technical debt cleanup.
- The user wants `v2.3.0` to prioritize:
  1. full documentation/version terminology cleanup
  2. documentation archival and repository cleanliness
  3. Astro technical convergence and broad cleanup of remaining issues
- The user confirmed `v2.3.0` should include **minimal historical content
  cleanup**, not just code/docs cleanup, because the current article inventory
  is small and mostly demo/test oriented.
- The user selected a **mixed policy** for historical content:
  preserve and normalize long-term valuable content where practical, and
  retire/archive mainly test-oriented content from the public baseline.
- The concrete content baseline chosen for `v2.3.0` is:
  - keep `souljourney` as a public zh/en mirror pair
  - normalize and keep the Cursor article set as a public zh/en mirror pair
  - retire/archive `astro 中英文站点生成的参考方案` from the public baseline
- Current content inventory is 4 active blog entries total:
  - 2 complete zh/en mirror pairs (`souljourney`, Cursor)
  - 1 historical Astro bilingual reference file moved to docs archive

## Assumptions (temporary)

- `v2.3.0` is intended as a repository-quality and architecture-convergence
  release, not as a feature release.
- GitHub Issue / Milestone / Project tracking is optional unless the user asks
  for it later.
- We should prefer a clean, bounded scope that can be verified end-to-end over
  a vague “fix everything” release.
- Existing content publication rules from `v2.2.0` / `v2.2.1` remain in force
  unless explicitly revised.

## Open Questions

- None. Scope defaults were confirmed before implementation:
  - repo-facing version labels align to `v2.3.0`
  - historical docs are physically archived under `docs/archive/`
  - Astro convergence stops at low-risk helper/query/runtime cleanup, not a
    broad template rewrite

## Requirements (evolving)

- Align version/documentation terminology across core repo-facing materials.
- Archive, de-duplicate, or reorganize historical docs so the repo is easier to
  navigate and future work does not depend on stale planning artifacts.
- Audit the Astro codebase for convergence opportunities left after `v2.2.1`,
  then implement the highest-value cleanup items within a bounded release scope.
- Perform a minimal cleanup of historical content inventory so the repo is not
  left with obviously mismatched or low-value demo/test content under the new
  `v2.3.0` baseline.
- Use a mixed cleanup policy: normalize and keep valuable demo/reference
  content where it improves the public baseline, and archive or de-publicize
  low-value test-oriented artifacts.
- Preserve current publish-set and publish-health guarantees while cleaning up
  architecture and docs.
- Record the final `v2.3.0` scope and verification evidence in Trellis task
  artifacts.

## Acceptance Criteria (evolving)

- [x] Core version/documentation files reflect a single agreed `v2.3.0` status
- [x] Historical docs/OpenSpec references are either archived, corrected, or
      explicitly labeled so future readers are not misled
- [x] A bounded set of Astro architecture-convergence items is implemented and
      verified
- [x] A minimal historical content cleanup policy is applied and documented
- [x] `pnpm build` passes after the cleanup work
- [x] `pnpm check:publish-health` passes after the cleanup work
- [x] Task artifacts clearly describe scope, tradeoffs, and remaining risks

## Definition of Done

- Requirements are confirmed in this PRD
- Relevant code/docs cleanup is implemented
- Required verification commands pass
- Remaining risks and intentionally deferred items are documented

## Out of Scope (initial)

- New product features unrelated to cleanup/convergence
- Replacing the Trellis workflow introduced in `v2.2.2`
- Arbitrary redesign/rewrite without clear payoff
- External system changes in Obsidian / Engine unless required for Astro-side
  documentation alignment
- Large-scale historical content production or translation backlog work

## Technical Notes

- Current task directory:
  `.trellis/tasks/04-30-v2-3-0-docs-cleanup-astro-convergence/`
- Relevant baseline references:
  - `AGENTS.md`
  - `docs/plans/2026-03-10-v2.x-roadmap.md`
  - `docs/2026-04-08-v2-2-1-content-id-incident-rca.md`
  - `README.md`
  - `package.json`
- Current high-level repo state:
  - `openspec/changes/` contains archive only
  - Trellis is active workflow
  - working tree was clean when this task was created
- Current content inventory:
  - `src/content/blog/zh/souljourney.md`
  - `src/content/blog/en/souljourney.md`
  - `src/content/blog/zh/Cursor号池瘫痪之夜 我从编程之神 原地落地成盒.md`
  - `src/content/blog/en/the-night-cursors-trial-account-pool-crashed-from-coding-god-to-instantly-kod.md`
  - `src/content/blog/zh/astro 中英文站点生成的参考方案.md`
- Confirmed content-baseline target:
  - public keep: `souljourney` zh/en
  - public keep after normalization: Cursor zh/en
  - retire/archive from public baseline: `astro 中英文站点生成的参考方案`
- Likely `v2.3.0` convergence hotspots from quick inspection:
  - version/docs drift between `README.md`, `package.json`, and old plan docs
  - duplicated zh/en page logic across `src/pages/` and `src/pages/en/`
  - runtime/event-binding cleanup around `Search.astro`, `ThemeIcon.astro`,
    `TOC.astro`, `Init.ts`, and related DOM scripts
- Implemented `v2.3.0` convergence:
  - version bump and repo-facing docs alignment to `v2.3.0`
  - historical docs moved under `docs/archive/` with active indexes added
  - Cursor zh/en mirror pair normalized via shared `slug` + `source_id`
  - Astro bilingual reference article moved out of `src/content/blog/`
  - shared published-blog helper introduced for locale-scoped date-sorted
    public entry retrieval
  - theme / TOC / global init scripts made idempotent for page transitions
- Verification evidence:
  - `node --test tests/v2.1.3-regression.test.mjs tests/v2.2.0-public-aggregation.test.mjs tests/v2.2.1-publish-health.test.mjs`
    → 18/18 passing
  - `pnpm build` → success, 34 pages built
  - `pnpm check:publish-health`
    → `blogSize=4 mirrorPairs=2 duplicateIds=0 articleRoutes=4 rssItems=4`
