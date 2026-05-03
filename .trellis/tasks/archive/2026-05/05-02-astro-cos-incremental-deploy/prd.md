# analyze astro cos incremental deploy regression (summary)

## Goal

保留这次“发布过慢 / 增量发布体感退化”分析任务的历史摘要，用于解释后续为什么会进入发布链路治理与缓存治理方向。

## Historical Outcome

这次任务的历史价值主要在于：

* 证明“发布慢”并不等于“全量上传”
* 暴露了缓存刷新、对象 churn、增量同步体感之间的差异
* 为后续 `v2.3.3` 发布链路治理和 `v2.3.4` 文档公开治理提供了背景

## Why only a summary remains

原始版本包含：

* 运行记录与时长证据
* secrets / vars 状态
* 线上返回头与缓存现象分析
* 面向内部排障的推理过程

这些内容不适合继续作为公开工作笔记长期保留，因此这里只保留摘要。

## Current references

请改读：

* `docs/plans/2026-05-02-github-cnb-mirror-deploy-plan.md`
* `docs/deploy/github-main-cnb-cos-release-chain.md`
* `docs/plans/2026-05-03-v2-3-4-public-docs-governance.md`
