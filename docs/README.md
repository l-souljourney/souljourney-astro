# Docs Index

`v2.3.4` 起，`docs/` 目录按“活跃公开 / 历史归档”分层管理，并明确控制公开深度。

## 活跃文档

- [v2.x 路线图](./plans/2026-03-10-v2.x-roadmap.md)
- [v2.3.4 公开文档治理与历史材料收敛](./plans/2026-05-03-v2-3-4-public-docs-governance.md)
- [v2.3.1 Astro / Obsidian 双语发布工作流收敛](./plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md)
- [当前生产发布链路：GitHub main -> CNB -> COS](./deploy/github-main-cnb-cos-release-chain.md)
- [v2.2.1 事故复盘](./2026-04-08-v2-2-1-content-id-incident-rca.md)
- [Astro 发布契约 v2.2](./astro-wxengine-publish-contract-v2.2.md)

## 历史归档

- [归档总入口](./archive/README.md)
- `archive/history/`：旧版本迁移、审计、基线快照
- `archive/plans/`：已完成或失效的历史计划文档
- `archive/reference/`：保留参考价值但不再纳入当前 blog 基线的资料
- `2026-03-09-v3-8-frontend-integration-spec.md`：旧对外接口草案，已被 `Astro 发布契约 v2.2` 与 `v2.3.1` 计划文档取代
- `plans/2026-05-02-github-cnb-mirror-deploy-plan.md`：保留为阶段切换历史记录，不再作为当前公开主入口

## 使用原则

- 新的活跃技术文档继续写在 `docs/`
- 历史材料优先归档，不直接删除
- 对接开发默认只认活跃文档；同主题若存在历史草案，以活跃文档为准
- 活跃公开文档只保留当前有效口径，不承载内部运维验证细节
- 根级持续更新记录只写 `update.md`
