# GitHub -> CNB mirror -> COS 发布切换（摘要）

## Goal

保留这次发布切换任务的历史摘要，说明为什么仓库会从“GitHub 侧直接承担国内主站发布”收敛到“GitHub 作为唯一代码源，CNB 负责腾讯云侧构建与发布”的结构。

`v2.3.4` 起，原始研究材料与运维验证记录不再继续以公开工作笔记形式保留。

## Historical Outcome

这次任务最终促成了以下公开可理解的结果：

* GitHub 保持唯一代码源
* 国内主站发布执行位置收敛到 CNB 侧
* 发布链路从混杂的阶段性方案，收敛为职责更清晰的结构

## Why only a summary remains

原始版本包含：

* 平台验证记录
* token / secret / endpoint 相关研究
* 第三方平台能力与权限判断
* 详细运维切换过程

这些内容对历史回顾有价值，但不适合继续长期公开暴露，因此这里只保留摘要。

## Current references

若要看当前有效口径，请改读：

* `docs/deploy/github-main-cnb-cos-release-chain.md`
* `docs/plans/2026-05-02-github-cnb-mirror-deploy-plan.md`
* `docs/plans/2026-05-03-v2-3-4-public-docs-governance.md`
