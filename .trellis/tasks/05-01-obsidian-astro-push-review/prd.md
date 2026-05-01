# review obsidian astro push workflow gap

## Goal

基于当前 `souljourney-blog` 与 `obsidian-lengine-plugin` 的真实实现、活跃文档和遗留设计文档，梳理 Obsidian -> wxengine -> Git/Astro 构建部署 -> 双语公开发布 的现状闭环，识别当前缺口、失效文档和落地阻塞点。

## What I already know

- Astro 博客当前仓库版本为 `v2.3.0`，技术栈为 Astro 5.x + TypeScript，公开集合只接受完整 zh/en 镜像对。
- Obsidian 插件运行时版本为 `2.0.0`，已具备微信发布、Astro 单稿发布、Astro 下架、英文镜像稿翻译能力。
- Astro 侧已经把公开集合规则、路由规则和发布契约收紧到 `source_id + slug + lang` 的双语镜像治理。
- Obsidian 侧存在历史 OpenSpec / README / CHANGELOG / 实现并存的情况，需区分“已实现”“文档宣称”“历史未完成设计”。

## Assumptions

- 本次任务以 review 和差距分析为目标，不直接改代码。
- “距离可用工作流还有多少问题”以当前两个本地仓库的真实状态为准，不假设远端 wxengine 已额外补齐未见实现。

## Open Questions

- 无阻塞问题；先基于仓库与验证结果完成 review。

## Requirements

- 梳理 Astro 博客当前技术版本、契约和发布门禁。
- 梳理 Obsidian 插件当前实现版本、Astro 相关能力和命令/UI 入口覆盖情况。
- 明确区分：
  - 已实现且已验证的链路
  - 文档声明存在但代码未落地的链路
  - 文档彼此冲突或与代码冲突的部分
- 给出从 Obsidian 点击触发到 wxengine、Git、Astro 构建发布、双语部署的完整缺口清单。

## Acceptance Criteria

- [ ] 给出 Astro 侧当前版本、双语公开约束和部署方式的证据化结论。
- [ ] 给出 Obsidian 侧当前版本、Astro 发布相关实现覆盖面的证据化结论。
- [ ] 给出至少一份按严重度排序的问题清单，并区分实现缺口与文档漂移。
- [ ] 给出端到端工作流的当前完成度判断和下一步整改优先级建议。

## Definition of Done

- 结论均基于文件或命令输出。
- 关键判断有可追溯文件路径。
- 验证结果包含 Astro 构建 / publish-health，以及 Obsidian test/build/lint 状态。

## Out of Scope

- 不直接修改 Obsidian 插件或 Astro 博客代码。
- 不联调线上 wxengine 服务。
- 不创建 GitHub Issue / PR。

## Technical Notes

- Astro 关键证据：`package.json`、`README.md`、`src/content.config.ts`、`src/utils/publishSet.ts`、`docs/astro-wxengine-publish-contract-v2.2.md`
- Obsidian 关键证据：`package.json`、`manifest.json`、`README.md`、`CHANGELOG.md`、`main.ts`、`sidebar.ts`、`yamlPublishNormalizer.ts`、`publishService.ts`
- 历史/遗留证据：`docs/2026-03-09-v3-8-frontend-integration-spec.md`、`openspec/specs/v1.8.0/tasks.md`
