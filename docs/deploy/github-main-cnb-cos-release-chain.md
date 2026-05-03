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

## 4. 协作边界

这份文档用于说明**当前公开发布拓扑与职责边界**，不是完整运维手册。

公开协作层面需要理解的是：

- GitHub 是唯一代码源
- 站点构建前存在发布健康检查
- 国内公开主站与 GitHub 集成部署属于不同发布面
- 内容入库成功，不等于所有公开发布面已经同步完成

更细的环境配置、平台变量、运行验证、切换审计与历史排障记录，不再放在公开主入口文档中。

## 5. 当前未纳入本说明的主题

以下主题属于后续治理或内部运维层，不在本公开说明内展开：

1. HTML / RSS / Sitemap 的长期缓存策略
2. 更细粒度的精确版本发布机制
3. 历史搜索索引旧对象清理策略

如果未来要继续演进发布系统，应新增对应版本任务和文档，而不是把运维执行细节继续堆叠到当前公开说明中。
