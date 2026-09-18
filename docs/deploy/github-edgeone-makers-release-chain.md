# 当前生产发布链路：GitHub main -> EdgeOne Makers

更新时间：2026-09-18
状态：current

## 1. 真实链路

```text
Obsidian / wxengine / 本地 Git
  -> push GitHub main
  -> EdgeOne Makers（Git 集成型项目，生产分支 main）
       - pnpm install --frozen-lockfile
       - pnpm verify:baseline
            = pnpm check
            && pnpm test
            && pnpm build
            && pnpm check:publish-health
       - 构建成功 -> 部署到 Production
       - 构建失败 -> 不产生新部署，线上保持上一版
  -> www.l-souljourney.cn（DNSPod 默认线路 CNAME -> Makers）
```

主域 `www.l-souljourney.cn` 的境内外公开发布由**同一条 EdgeOne Makers 链路**承担，境内与境外由平台按访客位置就近调度，不再按线路拆分两个发布面。

## 2. 职责边界

### GitHub

- 唯一代码源
- 质量门禁（`pnpm verify:baseline`，与 Makers 侧构建命令使用同一条命令）
- Node 22.12+ 构建基线

### EdgeOne Makers

- 在平台侧执行生产构建，门禁作为构建命令的一部分
- 构建产物直接进入 Production 环境
- 境内外边缘加速、HTTPS 证书、HTTP->HTTPS 跳转、OCSP 装订
- 重定向 / headers / rewrites / 缓存策略由仓库内配置文件声明（见 `docs/engineering/makers.md`）

### Obsidian / wxengine

- 只负责内容生成、入库和推送 GitHub
- 不直接触发任何平台侧写入

## 3. 已退出的发布面

以下链路已不参与生产发布，保留在此仅为避免重新引入：

| 已退役 | 退出原因 |
| --- | --- |
| CNB 镜像同步与 CNB 侧构建 | 与 Makers 的 Git 集成重复，且 Makers 门禁已覆盖构建前校验 |
| COS 站点托管（网站桶） | www 不再从 COS 取源 |
| `script/edgeone-purge.js` 与 TEO 缓存刷新 | 站点不再是 COS 源站，无需回源刷新 |
| Cloudflare Pages | 境外线路已合并到 Makers，无第二个公开面 |

## 4. COS 与 EdgeOne TEO 的保留范围

COS 与 TEO **没有整体退役**，但职责已收缩：

- `cloudcos.l-souljourney.cn` -> EdgeOne TEO -> COS **图片资产桶**，仍在生产链路上
- 网站托管桶已孤立，仅作冷备保留

因此后续调整不得把「站点 Hosting 迁移」理解为「COS 全部下线」。图片资产链的演进（全球加速、响应式尺寸、content-hash 命名、缓存策略）属于独立议题。

## 5. 触发方式

只要有新的 commit 进入 `github/main`，无论来源是：

1. 本地 `git push`
2. `wxengine` 通过 GitHub API / Git push 写入内容
3. 其他自动化脚本提交内容

都会触发 Makers 生产构建。**构建即门禁**：任一环节失败都不会产生新部署。

## 6. 发布身份与验证

每次构建产出 `/.well-known/sj-release.json`，让公开面能用机器回答「线上跑的是哪一版」：

```json
{
  "schema": 1,
  "source": "github:l-souljourney/souljourney-astro",
  "commit": "<40 位提交号>",
  "commit_source": "env | git | unknown",
  "built_at": "<构建时间>",
  "content_digest": "sha256:<已发布内容集合摘要>",
  "content_entries": 6
}
```

验证方式：

```sh
curl -s https://www.l-souljourney.cn/.well-known/sj-release.json
```

应返回与当前 `main` 提交一致的 `commit`。`commit_source` 为 `unknown` 表示构建环境既没有 CI 变量、也读不到 git 元数据，此时不应把该文件当作可信证据。

`content_digest` 覆盖已发布内容集合，不覆盖渲染产物（封面随机化会让 HTML 每次构建不同）。发布身份的存在性是 `pnpm check:publish-health` 的检查项之一。

## 7. 协作边界

这份文档用于说明**当前公开发布拓扑与职责边界**，不是完整运维手册。

公开协作层面需要理解的是：

- GitHub 是唯一代码源
- 构建前存在发布健康检查，且该检查是构建的组成部分
- 内容入库成功，不等于公开发布面已经更新
- 只有一个公开交付目标，不再维护多目标一致性状态

更细的环境配置、平台变量、运行验证与切换审计，不在公开主入口文档中展开。
