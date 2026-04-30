# chore: trim agent superpowers rule and verify codex hooks

## Goal

Clean up the repository-local AI workflow surface by removing the retired
`using-superpowers` requirement from current project rules and related
documentation, while verifying whether Codex hook injection is actually enabled
on this machine.

## What I already know

- The repo already has local Trellis/Codex integration files under `.trellis/`,
  `.agents/`, and `.codex/`.
- `AGENTS.md` still contains a hard rule saying sessions must call
  `using-superpowers` first.
- The repository does not currently provide a `using-superpowers` skill.
- Archived plan documents under `docs/archive/plans/` still contain historical
  Claude-specific `superpowers:executing-plans` instructions.
- Project-local Codex hook wiring exists in `.codex/hooks.json`.
- User-level `~/.codex/config.toml` currently does not enable
  `[features] codex_hooks = true`, so hook injection is likely not active even
  though the repo-local hook files are present.
- The working tree already contains unrelated in-progress `v2.3.0` changes on
  `feature/v2.3.0-docs-cleanup-astro-convergence`; this task must avoid
  disturbing those edits.

## Assumptions (temporary)

- The user wants `using-superpowers` treated as fully retired in this repo.
- It is acceptable to trim historical archive docs for cleanliness by removing
  obsolete superpowers execution notes while keeping the rest of the document.
- We should inspect but not edit the user's global `~/.codex/config.toml`
  without an explicit request.

## Open Questions

- None. The user explicitly asked to check Codex hooks and remove the retired
  `superpowers` references from agent/docs.

## Requirements (evolving)

- Verify the current Codex hook activation prerequisite from local and
  user-level config.
- Remove the current-project `using-superpowers` requirement from repo rules.
- Remove remaining repository documentation references to retired
  `superpowers` usage where they would mislead future sessions.
- Preserve the rest of the Trellis/Codex local integration behavior.
- Record the result in Trellis task artifacts.

## Acceptance Criteria (evolving)

- [x] `AGENTS.md` no longer requires `using-superpowers`
- [x] Repository search no longer finds active `using-superpowers` or
      `superpowers:executing-plans` references in current docs/rules
- [x] Codex hook status is verified and reported from file evidence
- [x] Relevant verification commands/searches are recorded

## Definition of Done

- Requirements are captured in this PRD
- Required repo docs/rules cleanup is implemented
- Minimal verification is executed
- Remaining risks and manual follow-ups are documented

## Out of Scope (explicit)

- Editing or rotating secrets in user-level Codex config
- Reworking Trellis workflow semantics beyond removing the retired
  `using-superpowers` rule
- Changing `.codex/hooks.json` or hook scripts unless verification shows the
  repo-local wiring itself is broken

## Technical Notes

- Task directory:
  `.trellis/tasks/04-30-agent-superpowers-cleanup/`
- Key files to inspect/update:
  - `AGENTS.md`
  - `.codex/hooks.json`
  - `.codex/config.toml`
  - `docs/archive/plans/2026-02-15-v2.2-sync-hub-integration-plan.md`
  - `docs/archive/plans/2026-02-15-v2.3-legacy-cleanup-bugfix-plan.md`
  - `docs/archive/plans/2026-03-25-v2-2-0-publish-contract-plan.md`
- Verification sources:
  - repo search for `using-superpowers|superpowers`
  - repo search for `codex_hooks|SessionStart|UserPromptSubmit`
  - user-level `~/.codex/config.toml` feature flag presence check
- Implemented cleanup:
  - removed `using-superpowers` hard requirement from `AGENTS.md`
  - removed obsolete `superpowers:executing-plans` note from three archived
    plan documents
- Verified Codex hook status:
  - repo-local hook files are present under `.codex/hooks.json` and
    `.codex/hooks/`
  - project-local `.codex/config.toml` documents the prerequisite but does not
    enable it itself
  - user-level `~/.codex/config.toml` currently lacks
    `[features] codex_hooks = true`
  - `task.py current --source` only resolves this task when
    `TRELLIS_CONTEXT_ID=codex-agent-cleanup-20260430` is provided explicitly,
    which is consistent with hook/session bridge not being active
- Verification evidence:
  - `rg -n "using-superpowers|superpowers:executing-plans" AGENTS.md docs .codex .agents .trellis -g '!**/node_modules/**' -g '!.trellis/tasks/archive/**'`
    now only hits this task PRD, not active project rules/docs
  - `rg -n "codex_hooks|SessionStart|UserPromptSubmit" .codex ~/.codex/config.toml`
    confirms repo-local hook wiring exists and the user-level feature flag is
    absent
