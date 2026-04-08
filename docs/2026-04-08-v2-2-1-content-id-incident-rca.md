# v2.2.1 事故复盘：双语内容 ID 覆盖导致公开集合归零

更新时间：2026-04-08

## 1. 事故摘要

- 现象：线上首页文章区为空，侧栏统计为 0，RSS 无 item
- 误导信号：GitHub Actions 构建全部成功，但公开内容实际为 0
- 影响范围：article route、首页列表、分类/标签聚合、RSS、搜索索引

## 2. 根因

1. Astro `glob` loader 默认优先使用 frontmatter `slug` 作为 content entry id。  
2. zh/en 镜像稿件复用同一 `slug` 时，后加载条目覆盖先加载条目。  
3. `v2.2.0` 强镜像规则要求公开集合必须是完整 zh/en 配对。  
4. 覆盖后每组只剩单语，`publishSet` 结果塌缩为 0，公开面随之归零。

说明：误推的单篇文章（如 `1723-4k.md`）会被镜像规则排除，但不是导致“全站清空”的单独根因。

## 3. v2.2.1 修复

- 在 `src/content.config.ts` 显式配置 `generateId`，采用 `lang::source_id::slug` 作为唯一 entry id
- 新增发布健康检查脚本 `script/publish-health.js`
  - 检查项：`blogSize`、`mirrorPairs`、`articleRoutes`、`rssItems`
  - 阈值项：`MIN_MIRROR_PAIRS`、`MIN_ARTICLE_ROUTES`、`MIN_RSS_ITEMS`
- 在 `.github/workflows/deploy.yml` build 阶段接入健康检查，异常时阻断部署
- 删除误推稿件 `src/content/blog/zh/1723-4k.md`

## 4. 发布口径（Obsidian -> Astro）

- 允许推送单语稿件入库（仓库保存）
- 公开面仍按 `v2.2.0` 规则：仅完整 zh/en 镜像对进入 article/RSS/搜索
- 结论：误推单语稿件不会再触发“全站归零”，最多该稿件不公开

## 5. 回滚与排查

回滚：
- 直接回滚 `v2.2.1` 合并提交（无状态迁移）

快速排查命令：

```bash
pnpm build
pnpm check:publish-health
```

若失败，优先检查：
- `src/content.config.ts` 的 `generateId` 是否被回退
- 最新内容是否破坏镜像配对（`source_id + slug + lang`）
