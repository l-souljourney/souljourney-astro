# Docs Index

`docs/` 按现行工程合同与历史规划分层。默认使用 Solo；后续产品需求由统一项目规划与 Issue 确定，旧版本计划不自动续作。

## 活跃文档

- [Astro 开发规则](./engineering/astro.md)
- [内容与发布规则](./engineering/publishing.md)
- [EdgeOne Makers 部署规则](./engineering/makers.md)
- [Trellis 退役决定与边界](./decisions/2026-09-10-solo-migration.md)
- [v2.3.1 Astro / Obsidian 双语发布工作流收敛](./plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md)
- [当前生产发布链路：GitHub main -> EdgeOne Makers](./deploy/github-edgeone-makers-release-chain.md)
- [v2.2.1 事故复盘](./2026-04-08-v2-2-1-content-id-incident-rca.md)
- [Astro 发布契约 v2.2](./astro-wxengine-publish-contract-v2.2.md)

## 历史归档

- [归档总入口](./archive/README.md)
- [原商业化双语内容平台路线图](./plans/2026-05-04-astro-commercial-roadmap.md)：保留方向参考，执行计划已由统一规划取代。
- [原 v2.3.4 公开文档治理计划](./plans/2026-05-03-v2-3-4-public-docs-governance.md)：历史范围，现行规则见内容与发布规则。
- `archive/history/`：旧版本迁移、审计、基线快照
- `archive/plans/`：已完成或失效的历史计划文档
- `archive/reference/`：保留参考价值但不再纳入当前 blog 基线的资料
- `v2.x 路线图`：历史技术底座，不作为当前需求入口。
- `2026-03-09-v3-8-frontend-integration-spec.md`：旧对外接口草案，已被 `Astro 发布契约 v2.2` 与 `v2.3.1` 计划文档取代
- `plans/2026-05-02-github-cnb-mirror-deploy-plan.md`：保留为阶段切换历史记录，不再作为当前公开主入口

## 使用原则

- 新的活跃技术文档继续写在 `docs/`
- 跨版本产品 roadmap 优先写在 `docs/plans/`
- 新需求以已确认的统一规划与 Issue 为准；旧 `v2.x/v2.4+` 路线图不构成实施授权。
- 历史材料优先归档，不直接删除
- 对接开发默认只认活跃文档；同主题若存在历史草案，以活跃文档为准
- 活跃公开文档只保留当前有效口径，不承载内部运维验证细节
- 根级持续更新记录只写 `update.md`
