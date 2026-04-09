# L-Souljourney Blog

基于 Astro 5.x + TypeScript 构建的中英双语个人博客。

## 项目概览

- 框架：Astro 5.x
- 语言：TypeScript
- 样式：Tailwind CSS + 自定义样式
- 内容：Markdown/MDX（`src/content/blog/`）
- 部署：GitHub Actions 构建后发布到 COS + CDN

当前文档口径已对齐到 `v2.2.1`（2026-04-08）事故修复版本。

## v2.2.1 关键修复

`v2.2.1` 主要修复的是双语内容在加载阶段被同 `slug` 覆盖，导致公开集合归零的问题。

- 在 `src/content.config.ts` 显式定义 `generateId`：`lang::source_id::slug`
- 新增发布健康检查：`script/publish-health.js`
- 在 CI build 阶段接入 `pnpm check:publish-health`，异常直接阻断部署
- 删除误推稿件：`src/content/blog/zh/1723-4k.md`

参考文档：`docs/2026-04-08-v2-2-1-content-id-incident-rca.md`

## 快速开始

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm dev                 # 本地开发
pnpm build               # 生产构建
pnpm preview             # 预览构建产物
pnpm newpost             # 新建文章
pnpm check:publish-health # 发布健康检查
```

## 内容发布约束

为避免“构建成功但公开内容为空”的静默故障，当前发布约束如下：

- frontmatter 必填：`title/date/categories/slug/source_id/lang`
- 公开集合仅包含完整 `zh/en` 镜像对
- 单语稿件允许入库，但不会进入 article/RSS/搜索公开面
- CI 必须通过 `check:publish-health` 后才会进入部署步骤

## CI/CD 说明

工作流：`.github/workflows/deploy.yml`

- `build`：安装依赖、执行 `pnpm build`、执行发布健康门禁
- `deploy-cos`：仅在 `main` 分支 push 时运行
- 支持可选 CDN 刷新步骤

## 文档索引

- 版本变更记录：`update.md`
- 事故复盘：`docs/2026-04-08-v2-2-1-content-id-incident-rca.md`
- OpenSpec 变更：`openspec/changes/v2-2-1-content-id-stability-guard/`

## 许可证

MIT
