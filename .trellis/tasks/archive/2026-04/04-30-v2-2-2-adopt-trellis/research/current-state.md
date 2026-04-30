# Research: current trellis migration state

- Query: What repository-local constraints and existing workflow files define the OpenSpec -> Trellis migration scope?
- Scope: internal
- Date: 2026-04-30

## Findings

- `AGENTS.md` is the repository's only hard-constraint file and already fixes the delivery contract: Chinese-first communication, `Read -> Plan -> Change -> Verify -> Report`, Trellis-first execution, and optional GitHub tracking at [AGENTS.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/AGENTS.md:1), [AGENTS.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/AGENTS.md:44), and [AGENTS.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/AGENTS.md:60).
- This migration added repository-local Trellis rules into `AGENTS.md`, making Trellis the default active workflow, limiting OpenSpec to historical/reference use, setting Codex to main-session execution by default, and making Trellis task records the required completion source of truth.
- `.trellis/workflow.md` originally assumed delegated Trellis agents for Codex; the local workflow now has a Codex-specific branch that defaults to `trellis-before-dev` + main-session implementation and reserves sub-agents for explicit user requests at [.trellis/workflow.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/workflow.md:151) and [.trellis/workflow.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/workflow.md:190).
- The local workflow now binds commit planning to branch discipline plus Trellis task completeness in Phase 3.4, while treating GitHub Issue / PR tracking as optional per-task metadata at [.trellis/workflow.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/workflow.md:501).
- Workflow-state reminders were customized so Codex main-session work is the normal in-progress path in this repo at [.trellis/workflow.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/workflow.md:514).
- Project-scoped Codex config already documents a hidden prerequisite: user-level `~/.codex/config.toml` must enable `features.codex_hooks = true`, otherwise `.codex/hooks.json` is ignored at [.codex/config.toml](/Users/lweeinli/Downloads/starlight/souljourney-blog/.codex/config.toml:1).
- `.gitignore` currently ignores `.codex/` and `.claude/`, but not `.trellis/` or `.agents/`, which means repository-visible Trellis customizations should live in `.trellis/` and `.agents/` if they need to persist in git at [.gitignore](/Users/lweeinli/Downloads/starlight/souljourney-blog/.gitignore:26).
- The bootstrap Trellis task has already been completed and archived, and
  `.trellis/spec/frontend/*` now contains project-specific frontend conventions
  for this Astro repo at [.trellis/spec/frontend/index.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/spec/frontend/index.md:1) and [.trellis/tasks/archive/2026-04/00-bootstrap-guidelines/prd.md](/Users/lweeinli/Downloads/starlight/souljourney-blog/.trellis/tasks/archive/2026-04/00-bootstrap-guidelines/prd.md:1).
- The migration already has a historical GitHub Issue `#36` with title
  `<v2.2.2> adopt trellis workflow and retire openspec active flow`, but the
  current repository policy no longer requires an Issue to complete a Trellis
  version task.
- The two previously active OpenSpec changes were reconciled and moved into
  archive during this task:
  - `2026-04-30-v2-2-0-bilingual-publishing-governance`
  - `2026-04-30-v2-2-1-content-id-stability-guard`
- `v2-2-1-content-id-stability-guard` task `4.2` was completed based on merged
  PR evidence: PR `#31` landed the main change set, and PR `#33` restored a
  green `build` workflow on `main` after the CI dependency hotfix.

## Files found

- `AGENTS.md`: repo-level hard constraints and new Trellis-default rules
- `.trellis/workflow.md`: local workflow source of truth for Codex/Trellis behavior
- `.codex/config.toml`: Codex hook prerequisite note
- `.gitignore`: visibility boundary for platform vs repository-local workflow files
- `.trellis/spec/frontend/index.md`: populated frontend spec index for the repo
- `.trellis/tasks/archive/2026-04/00-bootstrap-guidelines/prd.md`: archived bootstrap task showing the spec-fill work is complete

## Caveats / Not Found

- Shell commands do not inherit Trellis session identity automatically in this environment; `task.py` commands need an explicit stable `TRELLIS_CONTEXT_ID`.
- The current `gh` authentication token is missing `read:project`, but that no
  longer blocks this migration because GitHub Project tracking is optional in
  the repository's Trellis-first workflow.
