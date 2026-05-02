# 当前生产发布链路：GitHub main -> CNB -> COS

更新时间：2026-05-02  
状态：current

## 1. 真实链路

```text
Obsidian / wxengine / 本地 Git
  -> push GitHub main
  -> Cloudflare Pages 自动拉取部署
  -> GitHub Actions:
       - pnpm install --frozen-lockfile
       - pnpm build
       - pnpm check:publish-health
       - sync-cnb
  -> CNB mirror repo main.push
       - pnpm build
       - pnpm check:publish-health
       - deploy to cos
       - purge EdgeOne
```

当前主域 `www.l-souljourney.cn` 的国内公开发布，以 **CNB -> COS -> EdgeOne** 这一条线为准。  
Cloudflare Pages 继续作为 GitHub 集成的自动拉取部署，不参与国内主站写入。

## 2. 职责边界

### GitHub

- 唯一代码源
- 构建与发布健康门禁
- 把当前 `main` 同步到 CNB mirror

### CNB

- 在腾讯云侧执行生产构建
- 发布到 COS
- 刷新 EdgeOne

### Cloudflare Pages

- 继续从 GitHub `main` 自动拉取一版
- 主要承担境外 Pages 侧公开面

### Obsidian / wxengine

- 只负责内容生成、入库和推送 GitHub
- 不直接触发 COS 写入

## 3. 触发方式

只要有新的 commit 进入 `github/main`，无论来源是：

1. 本地 `git push`
2. `wxengine` 通过 GitHub API / Git push 写入内容
3. 其他自动化脚本提交内容

都会触发两条下游：

1. Cloudflare Pages 自动拉取
2. GitHub Actions `Build + Sync to CNB`

## 4. 当前必需配置

### A. GitHub 仓库

必需 Secret：

- `CNB_TOKEN`

当前 workflow 已不再直接使用以下历史腾讯云 Secret，但它们仍存在于仓库中：

- `TENCENT_CLOUD_SECRET_ID`
- `TENCENT_CLOUD_SECRET_KEY`
- `COS_BUCKET`
- `COS_REGION`
- `CDN_DOMAIN`

### B. CNB 项目 / env

必需变量：

- `COS_SECRET_ID`
- `COS_SECRET_KEY`
- `COS_BUCKET`
- `COS_REGION`
- `CDN_DOMAIN`
- `TEO_ZONE_ID`

可选变量：

- `TEO_PURGE_TYPE`
  - 未设置时默认回退 `purge_all`

如果使用：

- `imports: https://cnb.cool/l-souljourney/env/-/blob/main/env.yml`

则需要保证该 env 仓库仍然可读，且变量内容有效。

## 5. 当前已验证状态

### GitHub

- `gh secret list --repo l-souljourney/souljourney-astro`
  - 已确认存在 `CNB_TOKEN`
- `gh variable list --repo l-souljourney/souljourney-astro`
  - 已确认存在 `TEO_ZONE_ID`

### GitHub Actions

- run `25247840220`
  - `sync-cnb` 切换到 `push` 后成功
- run `25247908000`
  - `build`
  - `sync-cnb`
  - 全部成功

### CNB

- build `cnb-4bo-1jnjsttc3`
  - `build project` success
  - `publish health guard` success
  - `deploy to cos` success
  - `refresh edgeone cache` success

## 6. 故障判断口径

### GitHub build 失败

- `sync-cnb` 不会执行
- Cloudflare Pages / CNB 都不应视为已完成当前版本发布

### GitHub sync-cnb 失败

- Cloudflare Pages 可能仍会更新
- 但 CNB 不会拿到最新仓库内容
- `www.l-souljourney.cn` 大概率不会更新到新版本

### CNB build 或 deploy to cos 失败

- 说明 mirror 已收到代码，但国内发布失败
- 这时优先看 CNB 构建日志，不要误判为 GitHub push 失败

### EdgeOne purge 失败

- COS 中可能已经是新文件
- 但首页、RSS、分类页等 HTML 可能仍受缓存影响
- 这类问题更像“缓存未收敛”，不是“构建未成功”

## 7. 本轮没有处理的事

这轮已经解决的是“谁来构建和部署 COS 更快”。

这轮没有处理：

1. EdgeOne HTML / RSS / Sitemap 长期缓存规则
2. `api_trigger + sha` 的精确版本发布
3. Pagefind 旧对象清理策略

因此如果未来再出现“分类页先新、首页后新”的现象，优先检查：

1. EdgeOne 刷新是否成功
2. 浏览器是否命中旧 HTML
3. 是否需要单独落地 HTML 缓存规则
