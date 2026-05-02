# GitHub -> CNB mirror -> COS 发布切换

## Goal

把当前 `GitHub Actions 直传 COS` 的生产发布链路，切换为：

`GitHub main push -> GitHub build + publish-health -> sync 到 CNB mirror repo -> CNB 在腾讯云侧 build/deploy COS/purge EdgeOne`

目标不是再做一轮抽象分析，而是在本轮直接完成第一阶段可上线的实现骨架，并把 CNB 侧需要的 `.cnb.yml` 纳入 GitHub 源仓库后同步到现有仓库。

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
- GitHub `sync-cnb` 首次实跑日志已确认：
  - `rebase` 模式在目标仓库独有 `.cnb.yml` 上产生冲突
  - 结果是 `No branches were successfully rebased, nothing to push`

## Scope

本轮只做第一阶段落地：

1. 改 GitHub workflow
   - 保留 `build`
   - 保留 `pnpm check:publish-health`
   - 删除 GitHub 侧 `deploy-cos`
   - 改为 `sync-cnb`
2. 在 GitHub 源仓库根目录维护 `.cnb.yml`
   - 删除 `deploy to github`
   - 保留 `build -> publish-health -> deploy to cos -> refresh edgeone cache`
3. 将 GitHub 仓库通过 `push` 模式同步到现有 CNB 仓库
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
  -> GitHub Actions git-sync(push) 到 CNB repo
  -> CNB main.push
  -> CNB build
  -> CNB publish-health
  -> CNB deploy COS
  -> CNB purge EdgeOne
```

### Why `push`

首次实跑已经证明：

- `rebase` 模式在“源仓库没有 `.cnb.yml`、目标仓库独有 `.cnb.yml` 提交”的情况下会冲突
- GitHub workflow 虽显示成功，但实际上不会把新的 `main` 推到 CNB

因此第一阶段切换为：

- GitHub 源仓库正式维护根目录 `.cnb.yml`
- GitHub `sync-cnb` 使用 `push` 模式强制镜像到 CNB

这样做的收益：

- 同步语义直接、可验证
- CNB `main` 与 GitHub `main` 一致
- 不再依赖 `rebase` 对平台特有文件的保留行为

## Requirements

- GitHub 仍是唯一代码源
- GitHub push 到 `main` 后，仍必须先过 `pnpm build` 与 `pnpm check:publish-health`
- CNB 只负责 mirror + 国内构建发布，不再回推 GitHub
- GitHub 根目录 `.cnb.yml` 必须能直接构建当前仓库主分支内容
- CNB 侧 COS 上传命令继续保持：
  - 无 `--delete`
  - 显式 `--endpoint "cos.${COS_REGION}.myqcloud.com"`
- EdgeOne 刷新继续复用仓库里的 `script/edgeone-purge.js`

## Acceptance criteria

- [x] `.github/workflows/deploy.yml` 不再包含 GitHub 侧 `deploy-cos`
- [x] `.github/workflows/deploy.yml` 新增 `sync-cnb`
- [x] 本仓库保留可审计的 CNB `.cnb.yml` 配置
- [x] CNB 仓库中的 `.cnb.yml` 已更新，不再反推 GitHub
- [x] 本地已完成最小相关验证：
  - `pnpm build`
  - `pnpm check:publish-health`
- [x] 输出用户仍需手动补齐的平台配置清单

## Risks

- 生产发布配置进入 GitHub 源仓库后：
  - 后续改动必须同时考虑 GitHub Actions 和 CNB pipeline 兼容性
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
