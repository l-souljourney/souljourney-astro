# brainstorm: astro docs public governance version

## Goal

为 `souljourney-blog` 开一个专门的 Trellis 版本，系统治理当前公开仓库中的文档面：统一 README / docs / update / roadmap / Trellis 记录的版本口径，清理或降级不适合公开暴露的历史材料与运维细节，建立“活跃文档 / 内部运维文档 / 历史归档 / 敏感信息边界”的长期规则，让 Astro 博客作为 GitHub 开源项目时，公开文档既能支持协作，也不会继续泄露不必要的内部上下文。

## What I already know

* 仓库当前已经是 GitHub 开源访问场景，README 和 `docs/` 不再只是内部工作笔记，而是公开面的一部分。
* 本轮版本号已确定为 `v2.3.4`，定位为承接 `v2.3.3` 之后的文档公开治理补丁版本，而不是把 `v2.4` 改成文档治理版。
* 本轮治理范围已确定采用“选 2”：
  * 纳入 `README.md`、`docs/**`、`update.md`
  * 纳入 `.trellis/tasks/archive/**`
  * 暂不纳入 `.trellis/workspace/**`
* 当前活跃文档分层已经存在：`docs/README.md` 负责活跃入口，`docs/archive/README.md` 负责历史归档入口。
* 当前版本口径并未完全收敛：
  * `update.md` 已记录 `v2.3.3 (2026-05-02)`
  * `README.md` 的“当前状态”仍停在 `v2.3.0`
  * `docs/plans/2026-03-10-v2.x-roadmap.md` 仍写“最近更新 2026-05-01 / 当前代码版本 v2.3.0 / 已启动 v2.3.1”
* 当前公开文档中已经存在一批“对内部执行有用，但未必适合长期公开暴露”的信息类型：
  * secret / variable 名称与存在性检查命令，如 `CNB_TOKEN`、`TEO_ZONE_ID`、`COS_SECRET_ID`
  * 第三方平台仓库地址、mirror 地址、env import 地址，如 `cnb.cool/...`
  * 鉴权 header 示例、token 约定、运维路径说明
  * 历史文档中的“token 已泄露，已修复”这类安全事件文字
  * 本地开发地址、内部接口草案、旧部署调试痕迹
* 当前高风险候选文件至少包括：
  * `README.md`
  * `docs/README.md`
  * `docs/plans/2026-03-10-v2.x-roadmap.md`
  * `docs/plans/2026-05-02-github-cnb-mirror-deploy-plan.md`
  * `docs/deploy/github-main-cnb-cos-release-chain.md`
  * `docs/deploy/cnb-mirror-main.cnb.yml`
  * `docs/astro-wxengine-publish-contract-v2.2.md`
  * `docs/2026-03-09-v3-8-frontend-integration-spec.md`
  * `docs/archive/history/2.0-GitHub-Deploy-Migration.md`
  * `docs/archive/history/v2.0.0-deploy-test-log.md`
  * `docs/archive/reference/spoke-setup-reference_副本.md`
  * `.trellis/tasks/archive/2026-05/05-02-github-cos-fast-distribution/**`
  * `.trellis/tasks/archive/2026-05/05-02-astro-cos-incremental-deploy/**`
* Trellis spec 本身并非完全失控；部署链路、`publish-health`、GitHub -> CNB mirror 约束已经回写到 `.trellis/spec/frontend/quality-guidelines.md`，说明问题主要在“公开文档治理”和“版本快照统一”，不是没有规范。
* 只读盘点结果显示，`.trellis/tasks/archive/**` 中至少已存在以下公开风险模式：
  * token / secret 名称与存在性说明
  * 第三方平台仓库地址、API endpoint、install 命令
  * “token 已泄露，已修复”这类历史安全事件描述
  * 面向内部决策的研究笔记和运维验证清单
* 当前治理面规模可控：
  * `docs/**` 约 25 个文件
  * `.trellis/tasks/archive/**` 约 52 个文件

## Assumptions (temporary)

* 这次版本的主目标是文档治理与公开面收敛，不默认包含大规模代码重构。
* 对外仍需保留必要的架构说明、发布契约和协作入口，但应减少可被误用的运维细节与安全上下文。
* 一部分文档不会直接删除，而是需要重新分类为：
  * 活跃公开文档
  * 历史归档
  * 内部/敏感，不应继续留在公开仓库主入口
* 需要形成一套今后持续适用的文档分级规则，而不只是一次性清理。
* 已确定默认治理策略采用混合模式：
  * 一般历史资料保留在公开仓库，但降级到 archive / reference，并做脱敏改写
  * 明显敏感、内部性过强或会持续暴露运维上下文的材料，直接从公开仓库移除，只保留必要摘要或索引

## Open Questions

* 暂无阻塞性开放问题；关键范围与深度决策已收敛，可以进入执行规划。

## Requirements (evolving)

* 盘点当前 README、`docs/`、`update.md`、Trellis 历史记录中的公开面风险。
* 明确哪些文档必须保留公开，哪些应归档，哪些应删减，哪些内容应脱敏。
* 统一当前对外版本口径、当前阶段口径、生产部署链路口径。
* 为未来新增文档建立公开治理规则，避免再次把内部运维记录直接写进公开主入口。
* 输出一个专门版本的 PRD / 范围 / 风险 / 验收标准，而不是只给口头建议。
* `v2.3.4` 必须作为明确的文档治理版本被写入 roadmap / README / update / Trellis 记录。
* 对于历史材料，必须区分“适合公开的历史背景”和“只适合内部保留的工作记录”。
* `.trellis/workspace/**` 暂不纳入 `v2.3.4`，避免把本轮治理面扩到开发者个人工作日志。
* 对仍需保留在公开仓库里的“部署/对接说明”，默认公开深度采用中层说明：
  * 保留链路、职责边界、公开协作所需语义
  * 移除 secrets 名称、平台地址、运行证据、操作细节、验证命令

## Acceptance Criteria (evolving)

* [ ] 新版本的目标、范围、风险边界和验收标准被明确记录到 Trellis task
* [ ] 形成文档分级模型：活跃公开 / 历史归档 / 敏感降级 / 待删除
* [ ] 找出至少一批需要治理的具体文件，并说明治理动作
* [ ] `v2.3.4` 与 `v2.3.3` / `v2.4` 的关系被明确
* [ ] `.trellis/tasks/archive/**` 的治理边界被明确，不再默认公开所有研究/运维记录
* [ ] 后续执行阶段可以直接按该 PRD 开始文档治理，不需要重新做需求澄清
* [ ] 公开保留的部署/对接文档被收敛到“中层说明”，不再继续暴露运维执行细节

## Definition of Done (team quality bar)

* 治理范围、优先级、验收标准完整
* 公开文档边界和敏感信息边界被写清楚
* 版本口径统一策略明确
* 需要时补充 docs / spec 约束，避免回退

## Out of Scope (explicit)

* 本轮不直接修改远端 GitHub 仓库设置
* 本轮不处理业务代码功能升级（如 Astro 6 升级）
* 本轮不默认联动 Obsidian / wxengine 仓库一起改
* 本轮不做无证据的“安全合规”承诺，只基于仓库现有文件做治理

## Technical Notes

* 已审计文件：
  * `README.md`
  * `docs/README.md`
  * `docs/archive/README.md`
  * `docs/plans/2026-03-10-v2.x-roadmap.md`
  * `docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md`
  * `docs/plans/2026-05-02-github-cnb-mirror-deploy-plan.md`
  * `docs/deploy/github-main-cnb-cos-release-chain.md`
  * `docs/deploy/cnb-mirror-main.cnb.yml`
  * `docs/astro-wxengine-publish-contract-v2.2.md`
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/quality-guidelines.md`
  * `update.md`
* 当前已识别的公开面风险模式：
  * 版本口径漂移
  * 历史草案仍可直接访问且含过时接口/本地地址
  * 运维 secrets / vars 名称与存在性验证命令公开暴露
  * 第三方平台和部署基础设施细节写入活跃文档
  * 历史安全事故描述继续放在公开归档中但缺少公开级别说明
