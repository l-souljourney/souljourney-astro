## Context

当前仓库已经具备双语静态站点基础能力，但关键公开链路仍建立在“按语言过滤原始内容”的宽松模型上，而不是“按正式发布集合输出”的强约束模型上。

现状证据：

- `src/content.config.ts` 已要求 `slug` 和 `source_id`，但 `lang` 仍是 optional，导致“可发布内容”的 schema 契约还不完整。
- `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro` 的 `getStaticPaths()` 目前只按 `post.data.lang` 过滤，仍会从原始内容直接生成公开详情页。
- `src/utils/articleI18n.ts` 当前只缓存 `lang + slug` 集合；只要另一语言存在同 slug 内容，就可能被当作切换目标，并没有验证 `source_id` 是否一致，也没有验证它是否属于正式公开发布集合。
- `src/components/Head/Head.astro` 与 `src/components/Header/Header.astro` 仍保留文章语言切换与 hreflang 的默认 fallback 路径逻辑。
- `src/pages/[...page].astro`, `src/pages/en/[...page].astro`, `src/utils/getArchive.ts`, `src/utils/getPostInfo.ts` 仍然直接从 `getCollection("blog")` 后按 `lang/hide` 过滤，尚未排除 `pending_translation`。

这意味着当前站点虽然“能发布”，但还没有形成单一、可验证的公开发布边界。`v2.2.0` 的工作不是增加功能，而是先把规则层做硬收口。

## Goals / Non-Goals

**Goals:**
- 建立基于 `source_id + slug` 的双语镜像配对模型
- 明确定义 public publish set，并让 article route、hreflang、聚合页、RSS、sitemap、搜索统一消费它
- 让未配对内容停留在仓库层，不再进入任何公开发布入口
- 为 `v2.2.1` 的路由/模板/查询收敛与 `v2.2.2` 的轻量化优化建立稳定前提

**Non-Goals:**
- 不改外部发布器、Webhook、GitHub Actions 或部署平台
- 不在本版本做页面组件去重、视觉重构或交互翻新
- 不在本版本引入新搜索服务或额外数据库/缓存层
- 不在本版本执行 Astro 6 升级

## Decisions

### Decision 1: 引入显式 public publish set，而不是继续在每个页面各自过滤原始内容

**选择：** 新增统一的发布集合 helper（建议落在 `src/utils/publishSet.ts` 或同级命名文件），从 `getCollection("blog")` 读取原始内容后，按 `source_id + slug` 聚合成镜像对，只把完整 zh/en 镜像对暴露给公开页面层使用。

**原因：** 当前 `src/pages/[...page].astro`、`src/pages/en/[...page].astro`、`src/utils/getArchive.ts`、`src/utils/getPostInfo.ts` 都各自按语言过滤原始内容。继续沿用这种做法，会把“是否公开”分散到页面层，后续每个聚合点都要重复处理例外。

**替代方案：** 继续保留 `getCollection("blog")` + 页面层过滤。否决原因：规则会继续分散，后续 `v2.2.1` 和 `v2.2.2` 无法建立在统一数据边界上。

**变更前：**
```ts
const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const zhPosts = posts.filter(i => i.data.lang !== 'en' && !i.data.hide);
```

**变更后：**
```ts
const zhPosts = await getPublishedPostsByLocale("zh");
const enPosts = await getPublishedPostsByLocale("en");
```

### Decision 2: 镜像配对键使用 `source_id + slug` 双键，而不是单独依赖其中一个字段

**选择：** 把 `source_id` 作为跨语言逻辑主键，把 `slug` 作为跨语言共享路由键。只有两者同时一致，才视为正式镜像对。

**原因：** 只依赖 `slug`，无法防止不同文章误用同一路由键；只依赖 `source_id`，又无法防止镜像内容出现 slug 漂移，最终破坏 `/article/{slug}` 与 `/en/article/{slug}` 的稳定对照关系。

**替代方案 A：** 仅用 `slug` 配对。否决原因：无法表达“同一逻辑文章”的强约束。
**替代方案 B：** 仅用 `source_id` 配对。否决原因：无法阻止路由分叉。

### Decision 3: 把 `lang` 提升为显式必填发布字段，并让 schema 与镜像治理协同工作

**选择：** 在 `src/content.config.ts` 中把 `lang` 从 optional 改为 required，并在发布集合 helper 中对 `source_id + slug + lang` 做镜像完整性校验。

**原因：** 目前 `src/content.config.ts` 的 schema 允许 `lang` 缺失，这与“zh/en 成对镜像发布”目标冲突。schema 负责字段级约束，发布集合 helper 负责跨文件配对约束，两者必须配合。

**替代方案：** 继续只在页面层假定默认语言。否决原因：会把数据质量问题推迟到路由生成阶段，难以稳定治理。

**变更前：**
```ts
lang: z.enum(['zh', 'en']).optional(),
```

**变更后：**
```ts
lang: z.enum(['zh', 'en']),
```

### Decision 4: 文章级 hreflang 与语言切换只从镜像发布对解析，不再接受默认 fallback 作为公开策略

**选择：** 更新 `src/utils/articleI18n.ts`，改为基于 public publish set 解析镜像稿件；更新 `src/components/Head/Head.astro` 与 `src/components/Header/Header.astro`，只在镜像公开对存在时输出文章级 alternate 链接与切换目标。

**原因：** 当前实现仍允许文章页在缺失镜像时回落到默认路径或首页，这种宽松兜底会让 SEO 和用户感知长期处于不确定状态。既然新规则规定“未配对稿件不公开”，前台就不应该继续为未配对稿件设计 fallback。

**替代方案：** 保留文章页缺失镜像时回首页或按路径前缀猜测。否决原因：与强镜像发布模型冲突，也会让 hreflang 语义继续漂移。

**变更前：**
```ts
const set = await getArticleLangSlugSet();
if (!set.has(buildKey(targetLang, parsed.slug))) {
  return null;
}
```

**变更后：**
```ts
const pair = await getPublishedMirrorPairByRoute(parsed.lang, parsed.slug);
if (!pair) return null;
return pair[targetLang].route;
```

**i18n 影响：**
- `src/components/Head/Head.astro` 的文章级 `hreflang` 只指向公开镜像对
- `src/components/Header/Header.astro` 的文章语言切换只指向公开镜像稿件
- 非文章页仍可继续使用 locale prefix 规则切换，不在本版本扩大改动范围

### Decision 5: 分类/标签/归档/RSS/sitemap/搜索统一消费 public publish set，搜索 UI 不承担配对逻辑

**选择：** 公开聚合入口统一改为读取 public publish set；`src/components/Search/Search.astro` 保持 UI 组件定位，不在搜索弹层里自行判断镜像关系。

**原因：** Pagefind 索引来源本质上由公开页面集合决定。只要 article route、聚合页、RSS、sitemap 的输入收口到 public publish set，搜索索引就不会再混入 `pending_translation` 内容。

**替代方案：** 仅在搜索层单独排除未配对内容。否决原因：这会形成新的例外分支，无法解决公开聚合页与 SEO 入口的漂移。

### Decision 6: `v2.2.0` 先做规则收口，不在同一 change 混入模板去重与性能改造

**选择：** 本 change 只定义并落地规则层；模板去重与查询入口合并进入 `v2.2.1`，搜索/runtime/资产减脂进入 `v2.2.2`。

**原因：** 当前项目的真正风险不是“功能不够多”，而是规则层还不稳。把规则层、架构层、性能层拆开，才能降低回滚和验收成本。

## Risks / Trade-offs

- **[风险] 历史内容存在大量未配对稿件，启用强镜像后会立刻失去公开路由** -> **缓解：** 先输出 `pending_translation` 清单，再开启公开集合硬门禁
- **[风险] 规则切换后，文章级 hreflang 与语言切换数量短期下降** -> **缓解：** 这是正确暴露数据事实，不再继续输出错误互链
- **[风险] 多个公开入口同时改读 publish set，初次实现容易漏点** -> **缓解：** 先收敛 helper，再按 article/detail、home/list、archive/category/tag、RSS/sitemap/search 四类入口逐步替换
- **[风险] 构建阶段做跨文件配对校验可能增加一点实现复杂度** -> **缓解：** v2.2.0 只引入最小必要 helper，不提前引入额外服务或缓存层

## Migration Plan

1. 盘点 `src/content/blog/` 下所有内容，输出共享 `source_id + slug` 的镜像对、未配对稿件和冲突稿件清单
2. 在 `src/content.config.ts` 与新的 publish-set helper 中同时建立字段级与配对级约束
3. 先替换 article detail route、`src/utils/articleI18n.ts`、`src/components/Head/Head.astro`、`src/components/Header/Header.astro`
4. 再替换首页、归档、分类、标签、RSS、sitemap 与搜索输入集合
5. 用 `pnpm build` 和前台抽样验证确认未配对内容已退出公开面；若异常，可先回滚到旧 helper 调用，而不触碰外部发布链路

## Open Questions

- 是否在 `v2.2.0` 直接让构建对“未配对稿件”报错，还是先只将其从公开集合排除并输出清单。当前建议：先排除公开输出，再决定是否升级为硬失败。
- 现有约 1000 篇内容中，未配对稿件的实际数量和分布如何；这会影响规则切换窗口。
- RSS 与 sitemap 是否已有独立 helper 可复用；若没有，`v2.2.0` 需要顺手补一层统一入口，但不扩大到模板层重构。
