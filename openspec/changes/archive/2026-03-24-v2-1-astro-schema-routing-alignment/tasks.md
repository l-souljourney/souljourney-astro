## 1. Astro 严格 Schema 落地 [H]

- [x] 1.1 [H] 修改 `src/content.config.ts`：必填 `title/date/categories/slug/source_id`；AC: 缺任一字段时 `pnpm build` 失败
- [x] 1.2 [H] 在 `src/content.config.ts` 对 `categories` 使用 5 项 canonical enum；AC: 非法分类值触发 schema 报错
- [x] 1.3 [H] 在 `src/content.config.ts` 对 `slug` 使用正则 `^[a-z0-9]+(?:-[a-z0-9]+)*$`；AC: 非法 slug 触发 schema 报错
- [x] 1.4 [H] 在 `src/content.config.ts` 将 `recommend/top/hide` 改为 boolean-only；AC: `"true"/"false"` 输入触发 schema 报错
- [x] 1.5 [H] 从发布契约中移除 `id`；AC: schema 不再声明 `id` 发布字段

## 2. Slug 唯一路由改造 [H]

- [x] 2.1 [H] 修改 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro`：`getStaticPaths` 仅使用 `post.data.slug`；AC: 代码中不再出现 `params.article = post.data.id`
- [x] 2.2 [H] 修改 `src/components/ArticleCard/ArticleCard.astro`、`src/components/Archive/Archive.astro`、`src/components/Aside/Aside.astro`、`src/components/Copyright/Copyright.astro`：文章链接统一使用 slug；AC: 全站 grep 不再新增 `/article/${post.data.id}`
- [x] 2.3 [H] 修改 `src/pages/rss.xml.ts` 与 `src/pages/en/rss.xml.ts`：item link 使用 slug；AC: RSS 链接与页面卡片链接一致

## 3. 分类与元数据严格消费 [M]

- [x] 3.1 [M] 在 `src/utils/getArchive.ts` 与 `src/utils/getPostInfo.ts` 仅按 canonical 分类聚合；AC: 不存在 alias 自动归一化逻辑
- [x] 3.2 [M] 保持 `src/utils/categoryMapping.ts` 仅做显示映射（不做输入容错）；AC: 显示层正常，数据层无兼容分支
- [x] 3.3 [M] 校验 `description/author/word_count/reading_time` 在页面渲染链路可正常读取；AC: 页面显示类型正确，无字符串布尔等脏数据兜底

## 4. wxengine API 契约联调（跨仓）[H]

- [x] 4.1 [H] 在 wxengine `/api/blog/publish` 增加必填校验（`title/date/categories/slug/source_id`）；AC: 缺失字段返回 `422`
- [x] 4.2 [H] 在 wxengine 增加 `categories` 枚举与 `slug` 正则校验；AC: 非法值返回 `422`
- [x] 4.3 [H] 在 wxengine 增加 boolean-only 校验（`recommend/top/hide`）；AC: 非布尔值返回 `422`
- [x] 4.4 [H] 统一错误体与成功体：失败至少返回 `message`，成功返回 `route`；AC: 插件可直接消费响应字段

## 5. 验证与验收 [H]

- [x] 5.1 [H] 执行 `pnpm build`；AC: 合规样例构建通过
- [x] 5.2 [H] 制造 3 类非法样例（非法分类/非法 slug/字符串布尔）；AC: 均构建失败并有可读错误
- [x] 5.3 [H] 抽样验证 zh/en 页面与 RSS 的 slug 路由一致性；AC: 各抽 3 篇文章路径一致且可访问
- [x] 5.4 [M] 记录最终契约文档到 `docs/`（字段、类型、422 错误体、成功 route）；AC: Obsidian 插件与 wxengine 可按文档联调
