---
name: souljourney-trellis
description: "Use when the user asks to start, continue, verify, finish, archive, or version Trellis work in this repository, especially requests like '用 Trellis 开始 vX.Y.Z' or '继续当前 Trellis 任务'."
---

# Souljourney Trellis

Repository-local Trellis entry for Souljourney Blog.

## When to Use

- The user asks to start a version task with Trellis.
- The user asks to continue the current Trellis task.
- The user asks to verify, finish, or archive Trellis work.
- The user asks how to use Trellis naturally in this repository.

## Local Rules

- Formal development work defaults to Trellis.
- OpenSpec is historical/reference-only. Do not create new OpenSpec changes.
- Codex defaults to main-session execution in this repository.
- Only use sub-agents when the user explicitly asks for parallel, delegation, or split work.
- Trellis task + `prd.md` are the primary source of truth for version work in this repository.
- GitHub Issue / Milestone / Project are optional tracking layers, not task completion prerequisites.
- Follow `AGENTS.md` for branch discipline and `Read -> Plan -> Change -> Verify -> Report`.

## Natural-Language Entry Mapping

- `用 Trellis 开始 vX.Y.Z`:
  create/continue a Trellis task, write `prd.md`, establish branch context, and add GitHub tracking only if the user wants it.
- `继续当前 Trellis 任务`:
  load current task context and resume at the next required workflow step.
- `用 Trellis 检查`:
  run Trellis-style verification in the main session.
- `用 Trellis 收尾`:
  ensure verification, commit planning, and wrap-up prerequisites are complete.
- `用 Trellis 归档`:
  archive only after the task's code and Trellis lifecycle are complete; if GitHub was used, confirm its lifecycle too.

## Shell Note

If shell commands do not inherit Trellis session identity automatically, use a stable `TRELLIS_CONTEXT_ID` when calling `.trellis/scripts/task.py`.
