# GitHub -> COS 快速分发方案研究

## Scope

围绕当前 `GitHub Actions -> COS 国内站 -> EdgeOne` 链路，分析为什么发布依然慢，并比较几种可行的提速路线。

## Current workflow evidence

### 1. 当前主链路结构

来自 `.github/workflows/deploy.yml`：

* `build` 在 `ubuntu-latest` 上完成
* `deploy-cos` 也在 `ubuntu-latest` 上完成
* 构建产物通过 `upload-artifact` / `download-artifact` 传给部署 job
* 真正上传 COS 的命令是：

```sh
coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" \
  --force --disable-crc64 --recursive \
  --endpoint "cos.${COS_REGION}.myqcloud.com"
```

这里有两个重要事实：

* 当前已经没有 `--delete`
* 当前仍没有 `--snapshot-path`

### 2. 最新真实 run 说明“构建不是瓶颈”

`gh run view 25245794660 --repo l-souljourney/souljourney-astro --json ...`

关键时间：

* `build / Build`：`2026-05-02T06:27:55Z` -> `2026-05-02T06:28:15Z`
* `build / Upload build artifacts`：`2026-05-02T06:28:16Z` -> `2026-05-02T06:28:18Z`
* `deploy-cos / Download build artifacts`：`2026-05-02T06:28:29Z` -> `2026-05-02T06:28:30Z`
* `deploy-cos / Deploy to COS via coscli`：自 `2026-05-02T06:28:30Z` 开始
* 本地回读时间：`2026-05-02T06:51:21Z`
* 回读结果：该 step 仍在 `in_progress`

结论：

* 不是 `pnpm build` 慢
* 不是 GitHub artifact 传递慢
* 当前主要慢点仍然是 `coscli sync`

### 3. 它不是“全量上传”，但仍然可能“很慢”

前序 run 证据已经确认：

* `25243071252`：`upload 14`，`skip 1004`，约 `102s`
* `25243071633`：`upload 89`，`skip 939`，`delete 40`，约 `1227s`

因此更准确的说法是：

* 不是每次都全量重传
* 但仍是“全量扫描远端 + 差异上传”
* 小文件很多、对象 churn 大、且通过公网从 GitHub runner 往国内 COS 推送时，整体会非常慢

## What the official docs imply

### A. COSCLI `sync` 的增量特征与 `--snapshot-path`

腾讯云 COSCLI 文档说明：

* `sync` 会比较同名文件的 `CRC64`
* `--snapshot-path` 可以保存快照，用于下一次增量同步
* 文档还说明：不使用 `--snapshot-path` 时会有额外 `HEAD` 请求

这意味着：

* 你们现在的 workflow 不是“最粗暴的全量上传”
* 但当前没有用快照，每次 run 都要重新做远端比对
* `--snapshot-path` 值得试，但它优化的是“比对元数据”，不是网络路径本身

来源：

* Tencent COSCLI `sync` 文档：<https://intl.cloud.tencent.com/document/product/436/43257>

### B. GitHub 官方支持 self-hosted runner

GitHub 官方文档说明：

* 可以把 self-hosted runner 添加到仓库/组织
* workflow 可以用 `runs-on: [self-hosted, ...label]` 选择自托管 runner

这意味着：

* 构建仍然可以放在 GitHub Actions 体系里
* 但 `deploy-cos` 可以迁移到腾讯云机器上执行
* 不需要放弃 GitHub，只是把“执行位置”挪到离 COS 更近的地方

来源：

* Adding self-hosted runners：<https://docs.github.com/en/actions/how-tos/managing-self-hosted-runners/adding-self-hosted-runners>
* Using self-hosted runners in a workflow：<https://docs.github.com/en/actions/how-tos/managing-self-hosted-runners/using-self-hosted-runners-in-a-workflow>

### C. 腾讯云文档支持内网访问 COS

腾讯云对象存储文档说明：

* 同地域的云服务器访问 COS，可以通过内网域名访问
* 同地域内网上传下载 COS 产生的流量免费

这意味着：

* 如果部署机器放到腾讯云且与 COS 同地域，上传路径可以从公网切到同地域内网
* 这比继续从 GitHub-hosted runner 走公网推国内 COS 更有可能稳定提速

来源：

* 内网访问 COS：<https://cloud.tencent.com/document/product/436/15359>

### D. 腾讯云支持全球加速 endpoint

腾讯云文档说明：

* COS 有全球加速能力
* 加速域名形如 `bucketname-APPID.cos.accelerate.myqcloud.com`

这意味着：

* 如果仍坚持 GitHub-hosted runner，能尝试把 endpoint 切回 acceleration 路径
* 但这只是公网链路优化，不会消除远端扫描、小文件 metadata 往返和对象 churn

来源：

* 全球加速概述：<https://cloud.tencent.com/document/product/436/38864>

### E. GitHub cache 只能帮助保留快照，不会改变部署位置

GitHub 官方依赖缓存文档说明：

* cache 可在 workflow runs 之间存储常用依赖或其他文件

这意味着：

* 可以把 `coscli --snapshot-path` 的快照目录通过 `actions/cache` 持久化
* 但 cache 只是帮你复用本地比对状态，不会改变 GitHub runner 到 COS 的公网距离

来源：

* Dependency caching：<https://docs.github.com/actions/concepts/workflows-and-actions/dependency-caching>

### F. `rclone` 可接入 Tencent COS，但仍然不改变网络路径

`rclone` S3 backend 文档直接列出了：

* `TencentCOS`
* `Tencent COS Global Acceleration Endpoint`

这意味着：

* `rclone` 是一个可行的替代传输工具
* 甚至支持加速 endpoint
* 但若仍跑在 GitHub-hosted runner，本质问题仍然是“公网把大量小文件推到国内 COS”

来源：

* rclone S3 backend：<https://rclone.org/s3/>

## GitHub projects / tools worth knowing

### 1. `tencentyun/coscli`

* 链接：<https://github.com/tencentyun/coscli>
* 定位：腾讯云官方 CLI
* 结论：当前你们已经在用这一类能力，真正该优化的是参数和执行位置

### 2. `zkqiang/tencent-cos-action`

* 链接：<https://github.com/zkqiang/tencent-cos-action>
* 定位：对 `coscli` 的 Docker Action 包装
* 结论：适合简化 workflow YAML，但不改变核心同步模型

### 3. `sylingd/tencent-cos-and-cdn-action`

* 链接：<https://github.com/sylingd/tencent-cos-and-cdn-action>
* 定位：Node 版上传 + CDN/EdgeOne 刷新 action
* 已暴露的输入项包括：
  * `cos_accelerate`
  * `clean`
  * `eo_zone`
* 结论：适合做“一体化上传+刷新”，但依然不是根因方案

### 4. `rclone/rclone`

* 链接：<https://github.com/rclone/rclone>
* 定位：通用对象存储同步工具
* 结论：是可对比实验对象，不建议在没有先处理执行位置前就贸然替换主链路

## Option ranking

### Option 1. 保持 GitHub-hosted runner，只做最小参数优化

做法：

* 给 `coscli sync` 增加 `--snapshot-path`
* 用 `actions/cache` 保存 snapshot
* 试验切回 COS accelerate endpoint

收益：

* 改动最小
* 能减少重复 `HEAD` / 元数据比对
* 可能把 2 分钟到十几分钟的波动压窄一些

局限：

* 仍然是 GitHub runner 公网推国内 COS
* 仍然要处理大量小文件扫描
* 对“偶发极慢 run”不一定有决定性改善

适合：

* 先做一次低风险 A/B 实验

结论：

* 推荐作为短期实验
* 不推荐当作最终解

### Option 2. GitHub 构建，腾讯云 self-hosted runner 负责部署

做法：

* `build` 仍在 GitHub-hosted runner
* `deploy-cos` 改为 `runs-on: [self-hosted, tencent-cloud, cos-deploy]`
* 腾讯云机器与 COS 选同地域
* 上传时优先走 COS 内网域名 / 同地域链路

收益：

* 基本不改你们现有 GitHub 使用习惯
* 最大程度缩短部署机器到 COS 的物理/网络距离
* 最有希望真正稳定解决“有时快、有时巨慢”的问题

代价：

* 需要维护一台 runner 机器
* 需要处理 runner 安全、自动更新和凭据管理

适合：

* 把 GitHub 作为 CI 控制面保留，同时解决国内 COS 发布慢问题

结论：

* 这是当前最佳性价比方案

### Option 3. GitHub 只产出 artifact，腾讯云机器主动拉取并上传 COS

做法：

* GitHub Actions 只构建并上传 artifact / release asset
* 腾讯云机器通过 webhook、cron 或 GitHub API 拉最新产物
* 在腾讯云侧执行上传与清理

收益：

* 部署与 GitHub runner 完全解耦
* 可以做更灵活的发布编排、回滚、灰度

代价：

* 运维复杂度高于 self-hosted runner
* 需要自己处理拉取、鉴权、状态回写

适合：

* 后续发布流程还要继续复杂化

结论：

* 可行，但当前不是第一选择

### Option 4. 只替换上传工具或社区 Action

做法：

* `coscli` -> `zkqiang/tencent-cos-action`
* `coscli` -> `sylingd/tencent-cos-and-cdn-action`
* `coscli` -> `rclone`

收益：

* YAML 可能更短
* 某些 action 自带 accelerate / purge / clean 选项

局限：

* 不能改变 GitHub runner 到 COS 的公网路径
* 不能消除 Pagefind / assets 小文件 churn

结论：

* 可以作为实现细节选择
* 不应被当作主因修复

### Option 5. 自定义 changed-file uploader

做法：

* 构建前后自己计算 manifest diff
* 只上传新增和变更对象
* 删除动作拆到独立 cleanup job

收益：

* 理论上能把无效扫描降到最低

代价：

* 维护成本最高
* 容易引入一致性问题

结论：

* 只有在 Option 2 之后仍不满足速度目标时才值得考虑

## My recommendation

### 最小改动

先做一轮实验：

1. `coscli sync` 加 `--snapshot-path`
2. 用 `actions/cache` 持久化 snapshot
3. 单独试一次 accelerate endpoint

目标：

* 看是否能把当前 `deploy-cos` 的极端长尾显著压缩

### 最佳性价比

把 `deploy-cos` 迁到腾讯云 self-hosted runner，同地域访问 COS。

这是我当前最推荐的路线，因为它直接处理了当前最可疑的结构性瓶颈：`GitHub-hosted runner -> COS 国内站公网同步`。

### 极致速度

腾讯云侧拉取式部署器 + 可选自定义 diff uploader。

只有当你们后面要做更复杂发布编排时才值得上。

## Key judgment

当前最该解决的不是“换哪个 GitHub Action 包装器”，而是：

**要不要把 deploy 的执行位置从 GitHub-hosted runner 挪到腾讯云侧。**

这是因为本地和历史 run 证据都表明：

* 构建已经很快
* artifact 传递也很快
* 现在真正慢的是 `coscli sync`
* 在已经去掉 `--delete`、收窄 Pagefind 后，仍然能卡在 `Deploy to COS via coscli` 超过 20 分钟

这里最后一句是基于 workflow 结构和 run 时长的工程判断，不是腾讯云官方对你们链路的直接诊断。
