# GitHub -> CNB Mirror -> COS 发布链路设计

**日期：** 2026-05-02  
**状态：** active  
**目标：** 在保留 GitHub 作为唯一代码源的前提下，复用现有 CNB Astro 仓库作为腾讯云侧 mirror / deploy repo，让国内构建与 COS 发布重新回到 CNB 执行，以消除 GitHub-hosted runner 到国内 COS 的长尾慢问题。

---

## 0. 实施状态（2026-05-02）

当前已经完成的动作：

1. 本仓库 `.github/workflows/deploy.yml` 已改为：
   - `build`
   - `sync-cnb`
   - 不再由 GitHub 直接 `deploy-cos`
2. 本仓库新增版本化 CNB 流水线镜像：
   - `docs/deploy/cnb-mirror-main.cnb.yml`
3. GitHub 仓库 Secret 已写入：
   - `CNB_TOKEN`
4. CNB 仓库已创建回滚分支：
   - `backup/pre-github-mirror-cutover-20260502`
5. CNB `main` 已写入新的 `.cnb.yml`
   - commit: `c4170614cf27b4a81079da7d0474b474e70c2a44`
   - commit title: `build: switch CNB pipeline to mirror deploy only [ci skip]`
6. 已通过 CNB OpenAPI 回读确认：
   - 该次提交的流水线被正确 `skipped`
7. 已实跑 GitHub workflow `25247700460`
   - `build` 成功
   - `sync-cnb` 表面成功，但 `rebase` 实际未推送任何 branch
   - 根因是目标仓库独有 `.cnb.yml` 与源仓库缺失 `.cnb.yml` 发生 rebase 冲突

当前还没完成的动作：

1. 将根目录 `.cnb.yml` 并入 GitHub 源仓库
2. 将 `sync-cnb` 从 `rebase` 改为 `push`
3. 再次推送 GitHub `main`
4. 观察 CNB `main.push`
5. 核对 COS / EdgeOne 的首次正式切换结果

---

## 1. 为什么切到这条链路

当前 GitHub Actions 真实慢点不在构建，而在 COS 同步：

- `build` 约 `20s`
- artifact 上传 / 下载约 `1-2s`
- `Deploy to COS via coscli` 可长时间卡住

仓库内已有研究也说明：

- 当前并不是全量上传
- 但仍然是“全量扫描 + 差异上传”
- GitHub-hosted runner 通过公网推送到国内 COS，是当前最可疑的结构性瓶颈

与此同时，历史 CNB 链路的快感受也有明确证据：

- CNB 仓库当前仍存在：`https://cnb.cool/l-souljourney/souljourney-astro`
- `git ls-remote https://cnb.cool/l-souljourney/souljourney-astro.git` 可直接读到 `main`
- 当前 CNB `main` 指向：
  - `552dea43fce4c7a28c7c1da34fe18909bc28c17a`
- 浅克隆该仓库后可确认：
  - 仍有旧 `.cnb.yml`
  - 旧链路为：
    - `build project`
    - `deploy to github`
    - `deploy to cos`
    - `refresh edgeone cache`

这说明：

1. CNB 仓库还活着
2. 它本身就是一个 Git 仓库
3. 它仍然保留旧的腾讯云侧构建/部署能力

---

## 2. 这次不回到旧模式

这次要恢复的是“腾讯云侧构建与部署能力”，不是“CNB 反推 GitHub”的旧模式。

### 不再采用

```text
CNB main push
  -> CNB build
  -> CNB push GitHub
  -> CNB deploy COS
```

### 改为采用

```text
GitHub main push
  -> GitHub Actions 质量门
  -> GitHub Actions sync 到 CNB mirror repo
  -> CNB 在腾讯云侧 build
  -> CNB deploy COS
  -> CNB purge EdgeOne
```

核心原则：

1. GitHub 是唯一代码源
2. CNB 不再写回 GitHub
3. 国内 COS 只允许 CNB 写入
4. GitHub Actions 不再直接 deploy COS

---

## 3. 目标架构

### 3.1 Phase 1：最小可落地版本

```text
Local / Obsidian / wxengine
  -> push GitHub main
  -> GitHub Actions:
       - pnpm build
       - pnpm check:publish-health
       - git-sync (GitHub -> CNB)
  -> CNB mirror repo main.push
       - pnpm build
       - deploy to COS
       - purge EdgeOne
```

特点：

- 复用现有 CNB repo
- GitHub 源仓库正式包含根目录 `.cnb.yml`
- GitHub 通过 `tencentcom/git-sync` 的 `push` 模式同步业务代码
- CNB mirror 仓库与 GitHub `main` 保持一致

### 3.2 Phase 2：治理加强版本

```text
GitHub main push
  -> GitHub Actions:
       - quality gate
       - sync to CNB mirror
       - call CNB api_trigger(branch=main, sha=$GITHUB_SHA)
  -> CNB main.api_trigger
       - pnpm build
       - deploy to COS
       - purge EdgeOne
```

特点：

- 明确要求部署指定 SHA
- 更适合后续回滚、重发指定版本、发布审计
- 比 Phase 1 多一层 CNB API 触发

---

## 4. 为什么 Phase 1 改成 push + main.push

你们现在已经有一个历史 CNB repo，它的 `main` 里包含旧 `.cnb.yml`，但代码非常老。

一开始的设想是：

1. 不先把 `.cnb.yml` 放回 GitHub 主仓库
2. GitHub Actions 用 `rebase` 模式同步到现有 CNB repo
3. 通过 `rebase` 保留目标仓库里的 `.cnb.yml`

但真实运行 `25247700460` 后，`git-sync` 日志证明这条路不成立：

- `CONFLICT (modify/delete): .cnb.yml deleted in HEAD and modified in c417061`
- `No branches were successfully rebased, nothing to push`

因此第一阶段改为：

1. 把生产 `.cnb.yml` 正式纳入 GitHub 源仓库根目录
2. GitHub Actions 用 `push` 模式同步到 CNB mirror repo
3. 让 CNB 的 `main.push` 跑国内构建/发布

这样做的收益：

- 同步结果确定，不依赖 `rebase` 的冲突处理
- CNB `main` 与 GitHub `main` 一致
- 以后进入 `api_trigger + sha` 也更自然

代价：

- 生产 `.cnb.yml` 进入 GitHub 主仓库，需要按正式配置管理

这也是为什么建议后续进入 Phase 2。

---

## 5. GitHub 侧职责

GitHub 侧保留：

- 代码源
- 质量门
- 同步到 CNB 的编排

### GitHub Actions 需要保留/新增的事情

1. `build`
   - `pnpm install --frozen-lockfile`
   - `pnpm build`
2. `publish-health`
   - `pnpm check:publish-health`
3. `sync-cnb`
   - 仅在 `main` push 且前置检查通过时执行
   - 使用 `tencentcom/git-sync`
   - 同步到：
     - `https://cnb.cool/l-souljourney/souljourney-astro.git`
   - 第一阶段建议：
     - `sync_mode: push`

### GitHub 侧当前状态

这一项已经落地：

- 现有 `.github/workflows/deploy.yml` 中的 `deploy-cos` 已移除
- GitHub 当前只做：
  - build
  - publish-health
  - sync-cnb

因此不会出现 GitHub / CNB 双写 COS。

---

## 6. CNB 侧职责

CNB 只负责：

- 腾讯云侧构建
- COS 上传
- EdgeOne 刷新

### CNB `.cnb.yml` Phase 1 改造原则

当前旧配置里最需要去掉的是：

- `deploy to github`

保留并更新的是：

- `build project`
- `deploy to cos`
- `refresh edgeone cache`

并建议额外补一个最小门禁：

- `pnpm check:publish-health`

这样可以避免：

- GitHub 检查通过
- CNB 构建时又出现“构建成功但公开集异常”而无人察觉

---

## 7. 你需要手动处理的内容

下面这些是平台侧、权限侧、密钥侧的手动项，我不能直接替你完成。

### A. CNB 仓库确认与备份

这一项已经处理：

1. 目标仓库已确认：
   - `l-souljourney/souljourney-astro`
2. 已创建回滚分支：
   - `backup/pre-github-mirror-cutover-20260502`

### B. CNB 环境变量 / Secrets

你需要在 CNB 项目里确认或补齐：

1. `COS_SECRET_ID`
2. `COS_SECRET_KEY`
3. `COS_BUCKET`
4. `COS_REGION`
5. `CDN_DOMAIN`
6. `TEO_ZONE_ID`

如果 `imports: https://cnb.cool/l-souljourney/env/-/blob/main/env.yml` 还在使用，也要确认：

7. `l-souljourney/env` 仓库仍存在且变量内容有效

### C. CNB 仓库写入凭据

这一项已经处理：

1. 已验证 CNB token 可用于 HTTPS Git push
2. GitHub Actions 所需仓库 Secret 已写入：
   - `CNB_TOKEN`

### D. CNB 构建触发

你需要在 CNB 平台确认：

1. `main.push` 事件仍然允许自动构建
2. 构建资源和运行时没被禁用
3. 若项目曾被停用或冻结，需要重新启用构建

### E. EdgeOne 刷新权限

旧 `.cnb.yml` 用的是腾讯云 Python SDK 直接调刷新接口。

你需要确认：

1. `COS_SECRET_ID / COS_SECRET_KEY` 这组凭据对 EdgeOne 刷新也有权限
2. `TEO_ZONE_ID` 对应的站点仍是当前生产站点

---

## 8. 我可以继续自动处理的内容

这些已经完成：

### 1. GitHub workflow 改造

已直接改 `.github/workflows/deploy.yml`，现在是：

- `build + publish-health`
- `sync-cnb`

### 2. CNB `.cnb.yml` 新版本模板

已产出并落地：

- 本仓库实际文件：`.cnb.yml`
- 本仓库模板：`docs/deploy/cnb-mirror-main.cnb.yml`
- CNB 仓库实际文件：`.cnb.yml`

当前版本已经：

- 去掉 `deploy to github`
- 保留 `build -> publish-health -> deploy to cos -> purge EdgeOne`

### 3. 切换手册

当前剩余需要继续推进的是：

- 把根目录 `.cnb.yml` 并入 GitHub
- 把 `sync-cnb` 从 `rebase` 改为 `push`
- 再做一次正式 push
- 观察 CNB 是否开始真实构建与发布

### 4. 回滚手册

我可以补：

- 如何把 GitHub 恢复为直接 deploy-cos
- 如何把 CNB repo 回滚到 cutover 前 tag

---

## 9. 当前剩余执行顺序

### Step 1

我把根目录 `.cnb.yml` 并入 GitHub 源仓库。

### Step 2

我把 GitHub `sync-cnb` 从 `rebase` 改成 `push`。

### Step 3

再次推送 GitHub `main`，观察：

- GitHub 检查
- GitHub -> CNB sync
- CNB build
- COS 部署耗时
- EdgeOne 刷新

### Step 4

如果这轮跑通，再考虑是否进入：

- `api_trigger + sha`
- Node 24 Actions 升级

---

## 10. 关键决策

当前不建议第一步就做：

- `api_trigger + sha`
- CNB / GitHub 双端同时大改

更稳的路径是：

1. 先用 GitHub 根目录 `.cnb.yml` + CNB mirror 跑通国内部署
2. 再决定要不要升级到严格 SHA 发布模型

这样做更符合“逐步推动”的目标。
