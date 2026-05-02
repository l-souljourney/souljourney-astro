# GitHub -> CNB mirror -> COS 发布切换

## Goal

把当前 `GitHub Actions 直传 COS` 的生产发布链路，切换为：

`GitHub main push -> GitHub build + publish-health -> sync 到 CNB mirror repo -> CNB 在腾讯云侧 build/deploy COS/purge EdgeOne`

目标不是再做一轮抽象分析，而是在本轮直接完成第一阶段可上线的实现骨架，并把 CNB 侧需要的 `.cnb.yml` 同步到现有仓库。

## Why now

基于当前仓库与真实 run 证据，瓶颈已经足够清楚：

- GitHub 构建不慢：
  - `.github/workflows/deploy.yml` 的 `build` job 只有安装、构建、健康检查
- GitHub artifact 也不慢：
  - 之前 run 中 upload / download artifact 只要 `1-2s`
- 慢点集中在 `deploy-cos`：
  - 现有 workflow 仍由 GitHub-hosted runner 通过公网访问 `cos.${COS_REGION}.myqcloud.com`
- 现有优化只能减少上传对象数量，不能改变公网链路：
  - 已经去掉 `--delete`
  - 已经把 Pagefind 收窄为文章正文索引

因此本轮直接把“构建与发 COS 的执行位置”切回腾讯云侧，而不是继续在 GitHub Actions 上微调上传参数。

## Current evidence

- 当前生产 workflow：
  - `.github/workflows/deploy.yml`
- 当前 GitHub 生产链路结构：
  - `build`
  - `deploy-cos`
- 当前 CNB 仓库存在且可读：
  - `https://cnb.cool/l-souljourney/souljourney-astro`
- 当前 CNB `main` 历史快照包含旧 `.cnb.yml`
- 当前 CNB 仓库旧 `.cnb.yml` 仍包含：
  - `deploy to github`
  - `deploy to cos`
  - `refresh edgeone cache`
- 本地已验证：
  - `cnb repositories get-by-id --repo l-souljourney/souljourney-astro`
  - 当前账号对 CNB 仓库权限为 `Owner`
  - 通过 HTTPS Git + token 可进行 `git push --dry-run`

## Scope

本轮只做第一阶段落地：

1. 改 GitHub workflow
   - 保留 `build`
   - 保留 `pnpm check:publish-health`
   - 删除 GitHub 侧 `deploy-cos`
   - 改为 `sync-cnb`
2. 产出并校对新的 CNB `.cnb.yml`
   - 删除 `deploy to github`
   - 保留 `build -> publish-health -> deploy to cos -> refresh edgeone cache`
3. 将新的 `.cnb.yml` 推送到现有 CNB 仓库
4. 记录需要用户在 GitHub/CNB 平台补齐的配置项

## Explicit non-goals

- 本轮不改 EdgeOne 缓存规则
- 本轮不上 `api_trigger + sha` 精确触发
- 本轮不实现自定义 uploader
- 本轮不恢复 GitHub 直传 COS 作为双写兜底
- 本轮不处理网站首页内容逻辑本身

## Architecture decision

### Phase 1

```text
GitHub main push
  -> GitHub Actions build
  -> GitHub Actions publish-health
  -> GitHub Actions git-sync(rebase) 到 CNB repo
  -> CNB main.push
  -> CNB build
  -> CNB publish-health
  -> CNB deploy COS
  -> CNB purge EdgeOne
```

### Why `rebase`

第一阶段继续使用现有 CNB 仓库，并保留 `.cnb.yml` 在 CNB 仓库内。

这样做的原因：

- 不需要把 `.cnb.yml` 立即并回 GitHub 主仓库
- 能最快验证“腾讯云侧构建 + COS 发布”是否恢复到可接受速度
- 兼容当前已有的 CNB 仓库与触发模型

## Requirements

- GitHub 仍是唯一代码源
- GitHub push 到 `main` 后，仍必须先过 `pnpm build` 与 `pnpm check:publish-health`
- CNB 只负责 mirror + 国内构建发布，不再回推 GitHub
- CNB `.cnb.yml` 必须能直接构建当前仓库主分支内容
- CNB 侧 COS 上传命令继续保持：
  - 无 `--delete`
  - 显式 `--endpoint "cos.${COS_REGION}.myqcloud.com"`
- EdgeOne 刷新继续复用仓库里的 `script/edgeone-purge.js`

## Acceptance criteria

- [x] `.github/workflows/deploy.yml` 不再包含 GitHub 侧 `deploy-cos`
- [x] `.github/workflows/deploy.yml` 新增 `sync-cnb`
- [x] 本仓库保留一份可审计的 CNB `.cnb.yml` 目标配置
- [x] CNB 仓库中的 `.cnb.yml` 已更新，不再反推 GitHub
- [x] 本地已完成最小相关验证：
  - `pnpm build`
  - `pnpm check:publish-health`
- [x] 输出用户仍需手动补齐的平台配置清单

## Risks

- GitHub 仓库和 CNB 仓库在第一阶段不是完全同构：
  - `.cnb.yml` 仍只保留在 CNB
- 如果 GitHub Secret 未补齐：
  - `sync-cnb` 会失败
- 如果 CNB `env.yml` 或 COS/EdgeOne 变量失效：
  - CNB 构建或部署会失败

## Rollback

- GitHub 侧：
  - 回滚 `.github/workflows/deploy.yml`
- CNB 侧：
  - 回退 `.cnb.yml`
  - 或切回本轮前备份分支

## Verification plan

- 本地校验 GitHub workflow YAML
- 本地跑：
  - `pnpm build`
  - `pnpm check:publish-health`
- 用 Git 命令验证当前 token 对 CNB repo 具备 push 能力
- 完成后给出需要你在 GitHub/CNB 控制台补齐的 secrets / vars 清单
