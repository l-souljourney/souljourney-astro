# GitHub -> CNB Mirror -> COS 发布链路设计

**日期：** 2026-05-02  
**状态：** completed  
**目标：** 在保留 GitHub 作为唯一代码源的前提下，复用现有 CNB Astro 仓库作为腾讯云侧 mirror / deploy repo，让国内构建与 COS 发布重新回到 CNB 执行，以消除 GitHub-hosted runner 到国内 COS 的长尾慢问题。

---

## 0. 最终状态（2026-05-02）

本轮切换已经完成，当前生产口径为：

`GitHub main push -> Cloudflare Pages 自动拉取 -> GitHub Actions build + publish-health -> sync 到 CNB mirror -> CNB main.push -> build + publish-health -> deploy COS -> purge EdgeOne`

本轮已完成的关键动作：

1. GitHub workflow 改为：
   - `build`
   - `sync-cnb`
   - 不再由 GitHub 直接 `deploy-cos`
2. GitHub 源仓库正式纳入根目录 `.cnb.yml`
3. `sync-cnb` 已从 `rebase` 改为 `push`
4. CNB 默认 EdgeOne 刷新已收敛为：
   - `TEO_PURGE_TYPE=purge_all`
5. 稳定文档入口已补齐：
   - `docs/deploy/github-main-cnb-cos-release-chain.md`
   - `docs/deploy/cnb-mirror-main.cnb.yml`

已验证证据：

1. GitHub Secrets：
   - `CNB_TOKEN` 已存在（`gh secret list --repo l-souljourney/souljourney-astro`）
2. GitHub Variables：
   - `TEO_ZONE_ID` 已存在（`gh variable list --repo l-souljourney/souljourney-astro`）
3. GitHub workflow：
   - `25247840220` success：`sync-cnb` 改为 `push` 后通过
   - `25247908000` success：EdgeOne 默认 `purge_all` 后通过
4. CNB 构建：
   - `cnb-4bo-1jnjsttc3` success
   - `build -> publish-health -> deploy to cos -> refresh edgeone cache` 全部通过

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

## 7. 平台侧配置清单

### A. GitHub 仓库

当前主链路必需项：

1. Secret：
   - `CNB_TOKEN`
2. 当前已存在但不再参与主发布链路的历史 Secret：
   - `TENCENT_CLOUD_SECRET_ID`
   - `TENCENT_CLOUD_SECRET_KEY`
   - `COS_BUCKET`
   - `COS_REGION`
   - `CDN_DOMAIN`

### B. CNB 项目 / env 仓库

当前主链路必需项：

1. `COS_SECRET_ID`
2. `COS_SECRET_KEY`
3. `COS_BUCKET`
4. `COS_REGION`
5. `CDN_DOMAIN`
6. `TEO_ZONE_ID`
7. `TEO_PURGE_TYPE`（可选；默认回退 `purge_all`）

如果继续使用 `imports: https://cnb.cool/l-souljourney/env/-/blob/main/env.yml`，还需保证该 env 仓库本身可读且变量有效。

### C. CNB 触发与权限

需要保持：

1. `main.push` 自动构建开启
2. COS 凭据同时具备 EdgeOne 刷新权限
3. `TEO_ZONE_ID` 指向当前生产站点

---

## 8. 本轮已完成内容

1. GitHub workflow 收敛为 `build + sync-cnb`
2. GitHub 源仓库纳入生产 `.cnb.yml`
3. CNB mirror 仓库不再反推 GitHub
4. CNB 构建链路补上 `publish-health`
5. EdgeOne 刷新默认回退为整站 `purge_all`
6. 文档层补齐：
   - 当前生产链路说明
   - `.cnb.yml` 审计镜像
   - 切换设计与验证记录

---

## 9. 后续可选优化

当前不再建议回到 GitHub 直传 COS。更合理的后续顺序是：

1. 用 `api_trigger + sha` 把 CNB 发布与 GitHub commit SHA 绑定
2. 单独设计 EdgeOne HTML / RSS / Sitemap 缓存规则
3. 视需要清理 GitHub 中已不参与主链路的腾讯云历史 Secret
4. 如果将来第三方 action 正式稳定完成 Node 24 升级，再移除兼容 env

---

## 10. 当前结论

这次切换已经把“代码源”和“国内部署执行器”分开：

1. GitHub 继续做唯一代码源与质量门
2. CNB 只做腾讯云侧构建、COS 发布和 EdgeOne 刷新
3. Cloudflare Pages 继续独立自动拉取 GitHub `main`

这条链路比旧的 `CNB -> GitHub` 更干净，也比 GitHub 直传 COS 更接近你们之前的速度目标。
