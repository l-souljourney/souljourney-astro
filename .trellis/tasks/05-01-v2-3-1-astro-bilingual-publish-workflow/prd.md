# v2.3.1 astro bilingual publish workflow

## Goal

以 `v2.3.1` 作为 `v2.3.0` 之后的小版本收敛补丁，先完成 Astro 仓库侧的文档治理与对接口径收敛，为 Obsidian 插件后续实现“一次点击触发双语推送 -> wxengine -> git push -> Astro 构建部署”的工作流提供唯一、稳定、可验证的前置契约。

## What I already know

- 当前 Astro 仓库版本为 `2.3.0`，公开集合只接受完整 `zh/en` 镜像对。
- 当前活跃文档存在冲突：`docs/README.md` 同时把 `docs/2026-03-09-v3-8-frontend-integration-spec.md` 与 `docs/astro-wxengine-publish-contract-v2.2.md` 标为活跃，但两者字段和流程口径不一致。
- `v3.8` 规格仍使用过期字段与过时流程：`id`、非 canonical `categories`、`lang` 非必填、仅推 `zh/` 等。
- Obsidian 插件目前已实现：
  - 英文镜像稿创建
  - 单稿 Astro 发布
  - Astro 下架
  - 但尚未实现“一键双语同步发布”
- 当前 Astro 端已经具备：
  - 严格 content schema
  - `publishSet` 双语公开集合治理
  - GitHub Actions 构建与 `publish-health` 门禁

## Assumptions

- `v2.3.1` 本仓库优先完成 Astro 侧文档治理与对接标准澄清，再视需要补 Astro 侧最小程序调整。
- Obsidian 仓库会单独开 Trellis 任务承接插件侧改造。
- 这次版本先不联调线上 wxengine，仅把 Astro 侧约束与工作流描述收紧。

## Open Questions

- 当前回合无阻塞问题；先完成 Astro 侧文档定稿。

## Requirements

- 明确 `v2.3.1` 的版本目标是“Obsidian -> wxengine -> git -> Astro 双语部署工作流对齐”。
- 在 `docs/` 中建立本版本活跃计划文档。
- 将失效的 `v3.8` 前端接口规格从活跃口径中移除，并标注为历史文档。
- 统一指出 `docs/astro-wxengine-publish-contract-v2.2.md` 是当前 Astro 消费契约的唯一活跃来源。
- 在计划文档中拆分：
  - Astro 仓库本版本要完成的事项
  - Obsidian 插件仓库要完成的事项
  - 双方联调前置条件与验收标准

## Acceptance Criteria

- [ ] `docs/README.md` 不再把 `v3.8` 规格列为活跃文档。
- [ ] 新增 `v2.3.1` 活跃计划文档，清楚描述 Astro/Obsidian 分工与版本目标。
- [ ] `docs/plans/2026-03-10-v2.x-roadmap.md` 增补 `v2.3.1` 阶段，不再直接从 `v2.3.0` 跳到 `v2.4`。
- [ ] 旧 `v3.8` 规格文件显式标明已失效，不得作为当前实现依据。
- [ ] 本轮输出可直接给 Obsidian 仓库作为 Trellis 启动 prompt 的输入依据。

## Definition of Done

- 所有文档修改都能解释“为什么改”和“替代哪个旧口径”。
- 新旧文档边界清晰，可避免跨仓库开发继续引用过时规格。
- 给出可复制的 Obsidian Trellis prompt。

## Out of Scope

- 本轮不直接修改 Obsidian 插件代码。
- 本轮不联调线上 wxengine。
- 本轮不发布 Astro `package.json` 版本号。

## Technical Notes

- 现行契约：`docs/astro-wxengine-publish-contract-v2.2.md`
- 失效规格：`docs/2026-03-09-v3-8-frontend-integration-spec.md`
- 现行路线图：`docs/plans/2026-03-10-v2.x-roadmap.md`
- 现行文档索引：`docs/README.md`
- 上游 review 参考：`.trellis/tasks/05-01-obsidian-astro-push-review/research/review-findings.md`
