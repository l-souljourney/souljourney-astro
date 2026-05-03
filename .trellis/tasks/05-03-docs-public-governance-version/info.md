# v2.3.4 Public Docs Governance Execution Plan

## Objective

将 `souljourney-blog` 从“内部开发/运维文档混入公开仓库”的状态，收敛为“适合 GitHub 开源访问的公开博客仓库文档面”。

本文件是 `v2.3.4` 的执行矩阵，定义每类文件的治理动作与优先级。

## Governance Model

### Public Active

保留在公开主入口，可被 README / `docs/README.md` 直接链接。内容只允许：

* 项目定位
* 当前版本与当前状态
* 架构边界
* 对外协作契约
* 中层部署/对接说明

不允许：

* secrets / vars 名称
* 平台私有地址
* 运维执行命令
* run id / build id / 控制台验证证据
* 历史安全事件细节

### Public Archive

可公开保留的历史资料，但必须：

* 明确标注已失效/仅供历史背景
* 去除敏感细节
* 不再作为当前入口直接推荐

### Summary Only

原文不继续公开，仅保留一页摘要，说明：

* 原材料主题
* 失效原因或移除原因
* 当前替代文档

### Remove From Public Repo

直接从公开仓库删除，不保留完整原文。适用于：

* 明显内部运维记录
* token / secret / 权限 / endpoint 导向材料
* 历史安全事件细节
* 第三方平台验证、调试、研究抓取原文

## File Action Matrix

### Batch 1: Main Public Entry

#### `README.md`

* Action: `Keep + Rewrite`
* Target state:
  * 对齐 `v2.3.4`
  * 重写“当前状态”为公开版项目说明
  * 保留开源博客定位、内容治理规则、贡献入口、文档索引
  * 去掉过深运维口径

#### `docs/README.md`

* Action: `Keep + Rewrite`
* Target state:
  * 只列公开活跃文档
  * 将 deploy / integration 文档限制为中层说明入口
  * 明确 archive 与当前主入口的边界

#### `docs/plans/2026-03-10-v2.x-roadmap.md`

* Action: `Keep + Rewrite`
* Target state:
  * 新增 `v2.3.4`
  * 明确 `v2.3.4` 是文档公开治理补丁版
  * 顺延 `v2.4`
  * 去掉与当前口径冲突的阶段状态

#### `update.md`

* Action: `Keep + Append / Adjust`
* Target state:
  * 新增 `v2.3.4`
  * 用 changelog 语言记录公开文档治理动作
  * 不再把过深运维执行细节继续放进最新版本记录

### Batch 2: Public Integration / Deploy Docs

#### `docs/astro-wxengine-publish-contract-v2.2.md`

* Action: `Keep + Rewrite`
* Target state:
  * 保留内容契约、双语规则、返回语义
  * 保留“接口成功不等于公开发布成功”的边界
  * 去掉不必要的深运维描述

#### `docs/deploy/github-main-cnb-cos-release-chain.md`

* Action: `Keep + Rewrite`
* Target state:
  * 保留发布链路拓扑与职责边界
  * 去掉 secrets 名称、平台 env、验证 run id、故障细节矩阵中的内部执行视角
  * 让它成为公开说明，而不是运维手册

#### `docs/plans/2026-05-02-github-cnb-mirror-deploy-plan.md`

* Action: `Archive + Sanitize` or `Summary Only`
* Initial recommendation:
  * 当前更像“内部变更设计 + 执行审计”
  * 不应继续作为公开活跃资料保留原文
* Target state:
  * 若保留，则移入更明确的 archive 语境并脱敏
  * 更优方案是留下摘要，原文移除

#### `docs/deploy/cnb-mirror-main.cnb.yml`

* Action: `Summary Only` or `Remove`
* Initial recommendation:
  * 这是接近运维实现镜像的说明性文件，不适合作为公开 docs 暴露完整细节
* Target state:
  * 公开面只保留“存在腾讯云侧构建发布配置镜像”这一事实
  * 原始说明型 YAML 不继续出现在公开 docs 主路径

### Batch 3: Legacy / Archive Docs

#### `docs/2026-03-09-v3-8-frontend-integration-spec.md`

* Action: `Archive + Sanitize`
* Target state:
  * 明确旧草案、不可作为当前依据
  * 去掉本地地址、OSS 地址、鉴权 header 深细节

#### `docs/archive/history/2.0-GitHub-Deploy-Migration.md`

* Action: `Summary Only`
* Reason:
  * 含“token 已泄露，已修复”等不适合长期公开保留的措辞

#### `docs/archive/history/v2.0.0-deploy-test-log.md`

* Action: `Remove` or `Summary Only`
* Reason:
  * 过深的历史部署调试记录，对公开协作价值低
  * 含 secrets 名称、参数、故障修复路径

#### `docs/archive/reference/spoke-setup-reference_副本.md`

* Action: `Remove`
* Reason:
  * 含授权头与同步 token 场景，不适合继续公开保留

### Batch 4: Trellis Archive

#### `.trellis/tasks/archive/2026-05/05-02-github-cos-fast-distribution/**`

* Action: `Summary Only` for task shell, `Remove` for deep research raw files
* Reason:
  * 包含 token、endpoint、CNB 平台研究抓取、安装命令、权限判断

#### `.trellis/tasks/archive/2026-05/05-02-astro-cos-incremental-deploy/**`

* Action: `Summary Only` for task shell, `Remove` or `Sanitize` for sensitive research sections
* Reason:
  * 包含 secrets / vars 状态、生产验证细节、缓存排障过程

#### `.trellis/tasks/archive/2026-05/05-01-v2-3-1-astro-bilingual-publish-workflow/**`

* Action: `Archive + Sanitize`
* Reason:
  * 主要是产品/流程收敛，可保留，但需要控制公开深度

## Implementation Order

1. 主入口口径统一
2. 活跃 deploy / contract 文档降到中层说明
3. 历史 docs 归档脱敏
4. `.trellis/tasks/archive/**` 精简与摘要化
5. 补公开文档治理规则到合适位置

## Verification Plan

### Content verification

* 确认 `README.md` / `docs/README.md` / roadmap / `update.md` 对 `v2.3.4` 口径一致
* 确认活跃 docs 不再直接出现：
  * secret / token / variable 名称
  * 平台私有地址
  * 运维验证证据
  * 历史安全事件细节

### Repo verification

* `rg` 搜索高风险模式，检查治理后残留
* `pnpm build`

## Notes

* 本轮重点是公开文档面，不追求一次把所有历史材料做完美知识库重构。
* 优先级是“去掉不该公开的东西”与“统一当前入口”，其次才是历史文档体验。
