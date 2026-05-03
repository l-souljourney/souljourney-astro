# L-Souljourney Blog

基于 Astro 5.x + TypeScript 构建的中英双语静态博客。

## 当前状态

当前仓库口径已进入 `v2.3.4` 文档公开治理阶段：

- 工作流：Trellis-first，OpenSpec 只保留历史归档
- 内容治理：公开集合仅包含完整 `zh/en` 镜像对
- 发布门禁：构建后必须通过 `publish-health`
- 文档治理：公开入口与历史归档正在按开源仓库标准收敛
- 目标定位：作为长期维护的开源双语博客平台，而不只是一次性个人站点模板

## 项目概览

- 框架：Astro 5.x
- 语言：TypeScript
- 样式：Tailwind CSS + 自定义样式
- 内容：Markdown/MDX（`src/content/blog/`）
- 部署：GitHub `main` push 后由 Cloudflare Pages 自动拉取一版，同时 GitHub Actions 同步到 CNB mirror，由 CNB 在腾讯云侧构建并发布到 COS / EdgeOne

## `v2.3.4` 当前重点

- 统一 `README`、`docs`、`update`、roadmap 与 Trellis 记录的版本口径
- 收缩公开文档深度，保留架构与协作语义，移除不必要的运维细节
- 对历史材料做公开级别治理：
  - 活跃公开文档只保留当前有效入口
  - 历史文档继续归档，但不再默认暴露内部工作记录
  - 明显敏感或内部性过强的材料改为摘要或移出公开仓库
- 保持 Astro 侧既有内容契约、双语公开规则与发布健康门禁不回退

## 快速开始

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm dev                  # 本地开发
pnpm build                # 生产构建
pnpm preview              # 预览构建产物
pnpm newpost              # 新建文章
pnpm check:publish-health # 发布健康检查
pnpm check:publish-bilingual-readiness # 严格双语发布就绪检查
```

## 内容发布约束

为避免“构建成功但公开内容为空”的静默故障，当前发布约束如下：

- frontmatter 必填：`title/date/categories/slug/source_id/lang`
- 公开集合仅包含完整 `zh/en` 镜像对
- 单语稿件允许入库，但不会进入 article/RSS/搜索公开面
- CI 必须通过 `check:publish-health` 后才会进入部署步骤
- 若要验证“外部双语推送已经完整落地”，可执行 `pnpm check:publish-bilingual-readiness`

## 发布说明

工作流：`.github/workflows/deploy.yml`

- GitHub `main` 更新后，会触发站点构建与公开发布流程
- 公开协作层面只需了解：
  - GitHub 是唯一代码源
  - 站点构建前会执行发布健康检查
  - 国内公开主站与 GitHub 集成部署属于不同发布面
- 更具体的链路说明见文档索引中的“当前生产发布链路”

## 文档索引

- 版本变更记录：`update.md`
- 当前文档入口：`docs/README.md`
- 当前生产发布链路：`docs/deploy/github-main-cnb-cos-release-chain.md`
- 路线图：`docs/plans/2026-03-10-v2.x-roadmap.md`
- 事故复盘：`docs/2026-04-08-v2-2-1-content-id-incident-rca.md`
- OpenSpec 历史归档：`openspec/changes/archive/`

## 许可证

MIT
