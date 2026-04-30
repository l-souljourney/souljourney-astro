# L-Souljourney Blog

基于 Astro 5.x + TypeScript 构建的中英双语静态博客。

## 当前状态

当前仓库口径已对齐到 `v2.3.0` 收敛版本：

- 工作流：Trellis-first，OpenSpec 只保留历史归档
- 内容治理：公开集合仅包含完整 `zh/en` 镜像对
- 发布门禁：构建后必须通过 `publish-health`
- 目标定位：为后续功能迭代与 Obsidian 持续推送提供更干净、更稳定的基础

## 项目概览

- 框架：Astro 5.x
- 语言：TypeScript
- 样式：Tailwind CSS + 自定义样式
- 内容：Markdown/MDX（`src/content/blog/`）
- 部署：GitHub Actions 构建后发布到 COS + CDN

## `v2.3.0` 收敛重点

- 统一版本与文档口径，消除 `README` / `package.json` / 历史计划漂移
- 对历史文档做物理归档，保留活跃索引
- 规范当前最小公开内容基线：
  - 保留 `souljourney` zh/en 镜像对
  - 规范 Cursor zh/en 镜像对
  - 将测试性质较强的 Astro 双语参考稿移出公开 blog 基线
- 收敛 Astro 侧遗留技术点，包括：
  - 公开内容查询 helper 复用
  - 初始化脚本与页面切换场景下的事件绑定去重

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
- 当前文档入口：`docs/README.md`
- 路线图：`docs/plans/2026-03-10-v2.x-roadmap.md`
- 事故复盘：`docs/2026-04-08-v2-2-1-content-id-incident-rca.md`
- OpenSpec 历史归档：`openspec/changes/archive/`

## 许可证

MIT
