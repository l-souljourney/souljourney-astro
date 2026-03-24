## Why

v2.1 已完成发布契约与 slug 路由统一，但线上新文章暴露两个缺口：

- 正文污染（重复 frontmatter 块）会进入页面与 SEO 描述，降低内容质量与搜索质量。
- `hreflang` 与语言切换目前按路径机械拼接，文章无对应英文稿时会产生 404 目标。

v2.1.1 目标是增加 Astro 展示层与构建期守卫，避免错误内容继续放大。

## What Changes

- 为文章页面增加“跨语言稿件存在性判断”，仅在存在对应稿件时输出 `hreflang=en/zh` 与文章页语言切换链接。
- 引入正文污染检测守卫：若正文起始出现疑似第二段 frontmatter（`--- ... ---`）则构建失败。
- `description` 生成策略调整为：优先 frontmatter `description`，否则回退正文摘要（先通过污染检测）。
- 清理已落库污染样例 `obs-1e2bf5c7` 的重复 frontmatter 段，恢复单 frontmatter 文档结构。

## Non-goals

- 不修改 Obsidian 插件与 wxengine 逻辑（由各自仓库负责）。
- 不改动站点视觉、路由结构、分类与 schema 契约字段。
- 不做历史全量内容治理脚本，仅处理当前已确认污染样例。

## Impact

- 代码范围：`src/components/Head/Head.astro`、`src/components/Header/Header.astro`、`src/utils/index.ts`、`src/plugins/*`、`src/content/blog/zh/obs-1e2bf5c7.md`
- 行为影响：SEO alternate 与语言切换更严格；正文污染从“上线后可见问题”前移为“构建失败问题”。
- 发布收益：减少脏内容上线概率，避免无效 hreflang 导致的 SEO 噪音。
