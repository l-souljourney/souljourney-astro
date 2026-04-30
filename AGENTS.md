# AGENTS.md

本文件是本仓库唯一强约束执行规则。目标：短、硬、可执行、可审计。
版本：`souljourney-agent-init v1.0`

## 1. 项目基础

- 语言：默认中文（沟通、计划、提交说明、文档）。
- 运行环境：macOS + `node` + `pnpm` + `git` + `gh`。
- 工作目录：仓库根目录。
- 真实优先：所有结论必须基于文件或命令输出，禁止猜测式结论。

## 2. 技术栈与关键入口（项目特有）

- 框架：Astro 5.x + TypeScript
- 样式：Tailwind CSS + 部分自定义 CSS
- 内容：Markdown/MDX 双语博客 (`src/content/blog/`)
- 配置文件：`astro.config.mjs`、`tailwind.config.mjs`、`src/config.ts`

常用命令：

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建
pnpm newpost      # 创建新博客文章
```

## 3. 执行协议（通用，强制）

所有任务按以下顺序执行：

1. Read：读取约束、相关代码和上下文证据
2. Plan：明确目标、范围、风险、验收标准
3. Change：最小改动，优先修复根因，避免无关重构
4. Verify：执行最小相关验证并记录结果
5. Report：按"改动/验证/风险与后续"输出

禁止在未验证的情况下声称"已修复""已完成""已通过"。
- Report 最小格式：`What changed / Evidence(命令+关键输出) / Risk / Follow-ups`
- Verify 失败：必须回到 Plan 先定位根因，不得绕过验证提交。
- 默认不做无关重构/格式化/大面积重排；若必须跨模块改动，先列受影响文件与回滚策略。

## 4. Skills 约束（通用，强制）

- 用户点名 skill 或任务类型匹配 skill 时，必须调用。
- 顺序：先流程型（如 brainstorming / debugging / TDD），再实现型。
- 禁止以"任务简单"为由跳过 skill。
- 若 skill 不可用，必须说明原因并执行等价降级流程，不得停在解释层。

### 4.1 Trellis 默认工作流（项目特有，强制）

- 正式开发任务默认走 Trellis；允许自然语言入口，如：`用 Trellis 开始 vX.Y.Z`、`继续当前 Trellis 任务`、`用 Trellis 检查并收尾`。
- OpenSpec 自本规则生效后仅作为历史参考与归档材料；禁止再为新任务创建 OpenSpec change。存量 OpenSpec 仅允许做回读、收口、归档。
- Codex 在本仓库默认使用**主会话执行** Trellis 流程；仅当用户明确要求`并行`、`子代理`、`分工`、`delegate`时，才允许派生 sub-agent。
- 正式 Trellis 任务的最小流程：建/续 task → 写/改 `prd.md` → Change → Verify → 必要时更新 `.trellis/spec/` → 按 Trellis 任务记录收尾；GitHub 事项按需附加，不再是完成前置条件。
- 在无自动 hook 继承的 shell 中执行 `.trellis/scripts/task.py` 时，显式传入稳定 `TRELLIS_CONTEXT_ID`，避免 current task 丢失。

## 5. Git 与 GitHub 协议（Trellis-first，GitHub 可选）

### 5.1 远程与分支

- GitHub 远程名：`github`
- `main` 上游必须是：`github/main`
- 默认不直接提交到 `main`；正式版本和多步改动优先使用 `feature/<short>` 分支
- 是否创建 GitHub Issue / PR / Milestone / Project 由用户决定；它们不是 Trellis 任务完成的强制前置条件

### 5.2 gh 操作要求

- 仅当本轮确实要读写 GitHub 实体时，才进入 `gh` 流程
- GitHub 实体变更（Issue/PR/Milestone/Project/Release）必须用 `gh`
- 全程非交互；命令显式带 `--repo l-souljourney/souljourney-astro`
- 建议：`export GH_PAGER=cat`
- 写操作必须遵循：Read -> Write -> Verify（写后回读）
- 若 `gh` 因权限/能力不足无法完成 Project/Milestone 字段操作：必须在 Report 附失败证据与缺失 scope，并允许人工仅做字段补齐（禁止代替内容改写、合并或发布）。

### 5.3 Trellis / GitHub 最小记录闭环

- Trellis task（强制）：
  - `title` 或 `id` 可对应版本，如 `<v2.2.2>` / `v2-2-2-*`
  - `prd.md` 必须记录目标、范围、验收和验证口径
  - 关键 research / 约束 / 风险必须回写到 `.trellis/tasks/<task>/`，不能只留在对话里
- Issue（可选）：
  - 若创建，标题包含 `<version>`
  - Milestone / label / project 仅在当前版本确实采用 GitHub 跟踪时再维护
- PR（可选）：
  - 标题包含 `<version>`
  - 若存在对应 Issue，可写 `Fixes #<issue>`；若无，则直接写版本范围摘要
  - 包含 verification 命令和结果摘要

### 5.4 Checkpoints（必须执行）

- TaskReady：Trellis task / `prd.md` / 验证记录完整
- PRReady：仅当本轮使用 PR 时，要求 version / verification 完整
- BranchCleanupReady：仅当本轮走分支合并路径时，执行分支收尾
- ReleaseReady：仅在版本聚合完整时允许 release/tag

分支收尾命令：

```bash
git checkout main
git pull github main
git branch -d feature/<short>
git branch --list
git status --short --branch
```

## 6. 风险动作（需用户确认）

以下动作执行前，必须先给"对象清单 + 预期效果"，并等待确认：

- 批量操作（>5 个对象）
- 修改 milestone/project 字段
- 创建 release / 打 tag
- 任何 `gh api` 的 POST/PATCH/DELETE

## 7. 文档与文件保护

- 根级持续更新只写 `update.md`。
- 技术文档集中写入 `docs/`。
- 禁止将任何敏感信息提交到仓库（如 `.env`、密钥、Token、API Key、凭证示例）；发现后必须脱敏或移除再提交。
- 发现疑似敏感信息已进入改动或提交历史：立即停止后续操作，禁止推送/合并；在 Report 提供受影响文件与提交哈希，待人工确认处置后再继续。

## 8. 参考文档边界

- `docs/` 目录下的技术审计报告是参考文档，不是强制执行文件。
- 强约束以本文件为准。

---
`souljourney-agent-init v1.0`
