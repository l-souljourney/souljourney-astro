## 1. Publish Contract And Pairing [H]

- [x] 1.1 [H] 将 `src/content.config.ts` 中的 `lang` 改为必填，并确认 `slug`、`source_id`、`categories` 的发布契约与 v2.2.0 spec 一致；验收：缺失 `lang` 或无效 `slug/categories` 的内容会在构建阶段失败
- [x] 1.2 [H] 新增统一 publish-set helper（建议 `src/utils/publishSet.ts`），按 `source_id + slug` 聚合 zh/en 镜像对并输出 `published` / `pending_translation` 结果；验收：只有完整镜像对进入 `published`
- [x] 1.3 [H] 为配对治理补充最小验证样例，覆盖完整镜像、单边稿件、`source_id` 冲突、`slug` 冲突四类情况；验收：每类情况都有明确的 include/exclude 结果

## 2. Article Route And I18n Governance [H]

- [x] 2.1 [H] 更新 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro` 的 `getStaticPaths()`，改为只从 public publish set 生成公开详情页；验收：未配对内容不再生成 article route
- [x] 2.2 [H] 重写 `src/utils/articleI18n.ts`，从镜像公开对解析文章语言切换目标，而不是仅靠 `lang + slug` 集合判断；验收：文章页只在镜像稿件存在时返回目标路径
- [x] 2.3 [H] 更新 `src/components/Head/Head.astro` 与 `src/components/Header/Header.astro`，让文章级 hreflang 和语言切换只引用公开镜像稿件；验收：不再输出指向缺失稿件或首页 fallback 的文章级 alternate 逻辑

## 3. Public Aggregation Convergence [H]

- [x] 3.1 [H] 更新 `src/pages/[...page].astro`、`src/pages/en/[...page].astro`，首页文章列表只消费 public publish set；验收：`pending_translation` 内容不再出现在公开首页分页中
- [x] 3.2 [H] 更新 `src/utils/getArchive.ts` 与 `src/utils/getPostInfo.ts`，分类、标签、归档、推荐、统计统一从 public publish set 读取；验收：zh/en 聚合结果与公开详情页集合一致
- [x] 3.3 [M] 对 RSS、sitemap 与搜索输入集合做同口径收敛；验收：zh/en feed、站点地图与 Pagefind 索引均不包含未配对稿件

## 4. Rollout And Verification [M]

- [x] 4.1 [M] 扫描 `src/content/blog/zh/` 与 `src/content/blog/en/`，输出未配对稿件清单，作为启用强镜像前的治理基线；验收：清单能按 `source_id + slug + lang` 定位问题文件
- [x] 4.2 [M] 执行 `pnpm build`，抽样验证 zh/en article、首页、归档、分类、标签、RSS、sitemap、搜索在镜像规则下行为一致；验收：公开入口只暴露完整镜像对
- [x] 4.3 [L] 回写文档与发布字段约束，确保后续 Obsidian/Engine 发布模板继续使用共享 `source_id` + 共享 `slug`；验收：仓库内规划文档与发布口径一致，无旧宽松规则残留
