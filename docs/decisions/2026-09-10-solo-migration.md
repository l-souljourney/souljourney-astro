# Solo 治理切换决定

日期：2026-09-10。关联：[本仓 #40](https://github.com/l-souljourney/souljourney-astro/issues/40)、[总控 #13](https://github.com/l-souljourney/souljourney-code/issues/13)。

## 决定

用户明确结束两个陈旧任务，未来通过统一项目规划与 Issue 开发，并另行规划多个仓库的合并。本次仅退出 Astro 仓库的 Trellis 开发治理，不执行仓库合并，不补做旧任务功能，不创建替代旧任务的业务 Issue。

| 旧任务 | 结束理由 | 业务状态边界 |
| --- | --- | --- |
| `05-04-v2-4-publishing-hygiene` | obsolete，由统一规划取代 | 部分文档已落地，但发布字段与完整原验收未完成；不标 completed。 |
| `05-05-image-2-generation-workflow` | obsolete，由统一规划取代 | 没有 PRD，仅有任务元数据与模板上下文；不代表图片能力已实现。 |

两份记录曾移入 `.trellis/tasks/archive/2026-09/`；2026-09-11 进一步物理删除冷历史目录，原始工件和 obsolete 理由保留在 Git 历史。obsolete 不代表功能 completed，不新增 Trellis 状态机，也不调用旧归档脚本。

## 当前执行合同

默认用户级 `solo-dev` + 薄 `AGENTS.md` + 按需工程规则。Git 记录实现事实，Issue 保存长期需求与跨仓 blocker，项目文档保存稳定合同。普通工作不创建 task/PRD/JSONL/journal，不自动注入历史 spec。

项目级 Trellis skills、agents、commands 与 hook 注册退出；保留无关客户端配置和 CNB 技能。`.trellis` 已物理删除。原商业化 roadmap 仅作历史方向参考，不再宣布下一版本自动开工。

## 恢复与范围

迁移前 HEAD：`0897fc930382173c0b5935dfb10bc82eaefe7d5f`。恢复 tag `pre-vibe-coding-3.0` 已推送。治理 PR [#41](https://github.com/l-souljourney/souljourney-astro/pull/41) 已 squash 合并，主线提交为 `b8385602c322bfd2e1bb3229d023f2dccffaa3bb`；本地与远端治理分支均已删除。

Git tag 只覆盖受 Git 跟踪的内容；未跟踪的客户端配置在修改前另存仓库外本地备份。回退需同时考虑受控文件和本地客户端注册，先保护后续修改，不直接 reset 工作区。

未修改全局 OMP 模型映射、安全扩展或系统 Trellis CLI；全局 runtime 消费者清理与卸载由 [l-souljourney/souljourney-code#13](https://github.com/l-souljourney/souljourney-code/issues/13) 管理。本仓迁移已完成提交、推送、PR 合并和 #40 证据回写；未创建 release，仓库合并仍不在本次范围。

## 验收边界

本地切换需验证：旧任务退出 active、项目注册与技能入口退出、配置可解析、文档链接有效、构建与发布健康门通过，且产品代码及发布流水线未改动。

新客户端会话的真实上下文和后续 2～3 个真实需求 Pilot 需单独观察；静态检查不能冒充跨客户端运行验证，不能为 Pilot 制造产品需求。全局迁移与 Pilot 未完成时不关闭总控 Issue。

## 本地验证结果

- 按现有锁文件安装依赖后，`pnpm build` 与 `pnpm check:publish-health` 通过；`git diff --check` 通过。
- 三个客户端配置均可解析且无项目 hook 注册；53 个 Trellis 入口退出，两个 obsolete 记录归档，活动任务与 session 指针为空。
- 当前工程文档的本地链接有效；产品代码、测试、发布流水线、依赖声明与锁文件相对恢复点未改动。
- 构建有浏览器数据过期提示，不阻断本次门禁；未为治理迁移升级依赖。
- 新客户端会话与真实需求 Pilot 尚待验证；本地配置退役不等于全局 CLI 已卸载。PR 与 main 的 GitHub 构建门均通过，main 的 CNB 镜像同步及 Cloudflare Pages 检查成功；未直接读取 CNB 下游 COS/EdgeOne 部署日志。#40 保持开放用于 Pilot。
- 后续物理清理只删除 `.trellis` 冷历史、升级备份和同步上述边界；删除前工作区干净，无未跟踪 task 材料。产品代码、发布合同与流水线未改，不重复执行初次切换已记录的业务构建门禁；全局卸载和真实 Pilot 仍独立待确认。
