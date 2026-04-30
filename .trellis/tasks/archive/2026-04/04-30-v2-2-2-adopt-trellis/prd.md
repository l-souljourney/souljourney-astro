# <v2.2.2> migrate openspec to trellis

## Goal

Migrate this repository's active AI development workflow from OpenSpec to
Trellis, while preserving existing OpenSpec artifacts as historical reference.
The result should let Codex operate through Trellis with natural-language
version/task entry, repository-local rules, and a workflow where Trellis task
records are the primary source of truth and GitHub tracking is optional.

## What I already know

- `openspec list --json` now returns no active changes; the two previously
  active changes have been moved under `openspec/changes/archive/2026-04-30-*`.
- Trellis `0.5.0-beta.19` is installed and `.trellis/`, `.agents/`, `.codex/`,
  and `.claude/` local integration files were generated.
- `.trellis/spec/frontend/` has been populated with project-specific frontend
  conventions, and the bootstrap task has already been archived.
- `.codex/config.toml` states that Trellis hooks require user-level
  `features.codex_hooks = true` in `~/.codex/config.toml`.
- This repository's hard rules are defined in `AGENTS.md`, including Chinese
  docs/comms, `Read -> Plan -> Change -> Verify -> Report`, and the local
  Trellis workflow constraints.
- Current `.trellis/workflow.md` has been localized for this repository's
  Codex path: main-session execution by default, sub-agents only on explicit
  user request, and GitHub tracking treated as optional.

## Assumptions

- OpenSpec will stop being the active workflow after this change, but its
  existing specs and archived changes remain in the repository as historical
  reference.
- Codex main-session execution should be the default for this repo, with
  explicit opt-in for parallel or delegated sub-agent work.
- Trellis should be adapted locally so task directory records are enough to
  close a version, with GitHub workflow retained as an optional auxiliary path.
- `v2.2.2` is the migration/version label for the workflow transition itself.

## Open Questions

- No blocking workflow questions remain. Existing GitHub Issue `#36` may remain
  as a historical artifact for this migration, but it is no longer a completion
  prerequisite for `v2.2.2`.

## Requirements

- Make Trellis the default project workflow for formal development work.
- Keep a simple natural-language entry for Codex, such as starting, continuing,
  checking, and finishing version tasks.
- Adapt Trellis workflow rules so Codex main-session execution is the default in
  this repository.
- Make Trellis task / `prd.md` / task research the formal record of version
  work, without requiring GitHub Issue / Milestone / Project metadata.
- Preserve optional compatibility with GitHub workflows when the user chooses to
  use them.
- Stop using OpenSpec as an active planning/execution system for new work.
- Keep historical OpenSpec materials readable after migration.
- Record any project-local Trellis conventions in repository-local files rather
  than relying on chat memory.

## Acceptance Criteria

- [x] `AGENTS.md` explicitly states that Trellis is the default active workflow
      and OpenSpec is historical/reference-only.
- [x] `.trellis/workflow.md` reflects this repository's actual Codex mode:
      main-session by default, sub-agent only when explicitly requested.
- [x] A repository-local Trellis entry point exists for natural-language version
      work in Codex.
- [x] The migration task documents how to start, continue, verify, and wrap up
      version work with Trellis in this repo.
- [x] Repository rules state that Trellis task records are the required source
      of truth and GitHub tracking is optional.
- [x] OpenSpec active-flow ambiguity is removed: active changes are archived or
      otherwise clearly marked as non-active for future work.
- [x] Minimal verification proves Trellis task creation/current-task handling
      works in this repo with explicit `TRELLIS_CONTEXT_ID` in shell commands.

## Definition of Done

- Repository workflow docs are updated.
- Trellis local behavior is aligned with repo constraints.
- Verification commands are recorded with outcome.
- Remaining risks and any manual follow-up are documented.

## Out of Scope

- Rewriting historical OpenSpec capability specs into new product specs.
- Changing Astro site runtime behavior unrelated to workflow migration.
- Global Trellis CLI source changes outside this repository.
- Release/tag operations for `v2.2.2`.

## Technical Notes

- Primary workflow files:
  `AGENTS.md`, `.trellis/workflow.md`, `.trellis/config.yaml`,
  `.codex/config.toml`, `.codex/hooks.json`
- Current migration task:
  `.trellis/tasks/04-30-v2-2-2-adopt-trellis/`
- Working context:
  branch `feature/v2.2.2-adopt-trellis`, optional historical Issue `#36`
- Existing bootstrap task:
  `.trellis/tasks/00-bootstrap-guidelines/`
- OpenSpec state source:
  `openspec list --json`, `openspec/changes/*`, `openspec/specs/*`
