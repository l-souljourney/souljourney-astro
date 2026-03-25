## 1. OpenSpec 与基线对齐 [H]

- [x] 1.1 [H] 校验 `v2-1-2-core-structure-seo-hotfix` artifacts 完整；AC: `openspec status --change v2-1-2-core-structure-seo-hotfix --json` 中 `tasks` 为 `ready` 或 `done`

## 2. 文章页结构止血 [H]

- [x] 2.1 [H] 修复 `src/pages/article/[...article].astro` 的语义容器闭合（`section/article` 标签成对）；AC: 页面模板无错配闭合标签
- [x] 2.2 [H] 修复 `src/pages/en/article/[...article].astro` 的语义容器闭合（`div/article` 标签成对）；AC: 页面模板无错配闭合标签

## 3. SEO 元数据传参修复 [H]

- [x] 3.1 [H] 在 `src/layouts/Layout/Layout.astro` 统一 `pageCover/pageType` 入参并向后兼容旧 `cover/pagecover`；AC: Layout 可稳定向 Head 传递封面与页面类型
- [x] 3.2 [H] 在 `src/components/Head/Head.astro` 改为基于显式 `PageType` 输出 `og:type` 与 JSON-LD 类型；AC: `article` 页面输出 BlogPosting，其他页面输出 WebSite
- [x] 3.3 [H] 在 zh/en 文章页调用 Layout 时显式传递 `pageCover` 与 `pageType="article"`；AC: 文章页 OG 图片与类型符合预期

## 4. 英文核心分类入口 404 修复 [H]

- [x] 4.1 [H] 调整 `src/pages/en/categories/[...categories].astro` 路由生成逻辑：合并 canonical 分类键与英文已用分类；AC: `/en/categories/{canonical}` 全部可生成
- [x] 4.2 [M] 回归英文分类空数据场景；AC: 无英文文章的分类路径返回有效页面（非 404）

## 5. 构建与关键页面回归 [H]

- [x] 5.1 [H] 执行 `pnpm build`；AC: 构建通过且无新增错误
- [x] 5.2 [H] 执行关键页面回归（文章页 zh/en、英文无文章分类页）；AC: 结构闭合正确、SEO 元数据类型正确、核心入口不再 404
