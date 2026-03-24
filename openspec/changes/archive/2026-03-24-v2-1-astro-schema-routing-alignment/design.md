## Context

v2.1 的发布链路已明确为：`Obsidian Plugin -> wxengine /api/blog/publish -> GitHub Contents API -> Astro`。
当前问题不是“能不能发”，而是“契约不够硬”：字段可选、布尔可字符串、路由既用 `slug` 又用 `id`，导致上下游对同一篇文章的识别不一致。

本次设计改为严格契约模式：

- Astro 仅接受约定字段与类型，不做兼容回退。
- 路由唯一键是 `slug`，`id` 不再参与发布契约。
- 分类与布尔字段严格校验，非法输入在 wxengine 入口即返回 `422`。
- 成功发布响应必须给出可访问 `route`，用于插件侧回显与校验。

## Goals / Non-Goals

**Goals:**

- 在 `src/content.config.ts` 固化严格 frontmatter 契约（必填、枚举、正则、类型）。
- 全站文章链接统一使用 `slug`，彻底移除 `id` 路径拼接。
- 分类值仅允许 5 个 canonical key，不做 alias 自动兼容。
- `recommend/top/hide` 仅接受 boolean。
- 明确 wxengine 错误与成功响应契约：`422` + message，成功包含 `route`。

**Non-Goals:**

- 不改 Obsidian 插件 UI。
- 不改 wxengine 部署架构（队列、数据库、多租户）。
- 不新增页面形态或视觉重构。
- 不对历史不合规文章做自动兼容兜底（由数据治理单独处理）。

## Decisions

### Decision 1: Frontmatter 严格模式（无兼容）

- **变更文件**: `src/content.config.ts`
- **方案**:
  - 必填：`title`, `date`, `categories`, `slug`, `source_id`
  - 可选：`updated`, `tags`, `description`, `cover`, `lang`, `author`, `word_count`, `reading_time`, `recommend`, `top`, `hide`
  - `categories` 使用枚举：`investment | ai-era | zhejiang-business | philosophy | life`
  - `slug` 使用正则：`^[a-z0-9]+(?:-[a-z0-9]+)*$`
  - `recommend/top/hide` 仅 `z.boolean()`
  - `id` 从 schema 移除，不再是发布输入字段
- **关键 before/after 片段**:

```ts
// BEFORE
id: z.union([z.string(), z.number()]),
recommend: z.union([z.boolean(), z.string()]).optional(),
```

```ts
// AFTER
slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
source_id: z.string(),
categories: z.enum([
  'investment',
  'ai-era',
  'zhejiang-business',
  'philosophy',
  'life'
]),
recommend: z.boolean().optional(),
top: z.boolean().optional(),
hide: z.boolean().optional(),
```

- **备选方案**:
  - 兼容字符串布尔与 `id` 回退。被拒绝：会继续制造双契约。

### Decision 2: 全站路由只认 slug

- **变更文件**:
  - `src/pages/article/[...article].astro`
  - `src/pages/en/article/[...article].astro`
  - `src/components/ArticleCard/ArticleCard.astro`
  - `src/components/Archive/Archive.astro`
  - `src/components/Aside/Aside.astro`
  - `src/components/Copyright/Copyright.astro`
  - `src/pages/rss.xml.ts`
  - `src/pages/en/rss.xml.ts`
- **方案**:
  - `getStaticPaths` 参数统一为 `post.data.slug`
  - 所有文章 URL 统一拼接 `slug`
  - 不再允许 `id` 出现在文章访问路径中
- **关键 before/after 片段**:

```ts
// BEFORE
params: { article: post.data.id }
link: `/article/${post.data.id}`
```

```ts
// AFTER
params: { article: post.data.slug }
link: `/article/${post.data.slug}`
```

### Decision 3: 分类严格 canonical，不做 alias 映射

- **变更文件**:
  - `src/content.config.ts`
  - `src/utils/categoryMapping.ts`
  - `src/utils/getArchive.ts`
  - `src/utils/getPostInfo.ts`
- **方案**:
  - 数据层仅接受 canonical key。
  - 展示层继续由 `categoryMapping` 输出 zh/en 名称。
- **i18n 影响**:
  - URL 保持稳定 key，展示文本按语言切换。

### Decision 4: wxengine API 错误/成功响应契约写入 v2.1 集成规范

- **契约边界**:
  - 该逻辑在 wxengine 实现，但作为 v2.1 的跨仓约束写入本变更。
- **规则**:
  - 缺必填 / 非法 categories / 非法 slug / 非布尔 flag -> `422`
  - 错误体至少包含：`message`
  - 成功响应必须包含：`route`
- **理由**:
  - 插件需要可机器判断的失败原因与成功路由。

## Risks / Trade-offs

- **[Risk] 历史文章不符合新 schema 导致构建失败** -> **Mitigation**: 发布前跑内容治理脚本；对不合规文章先暂停发布。
- **[Risk] slug 冲突导致路径覆盖** -> **Mitigation**: 增加 slug 唯一性检查，冲突即阻断构建。
- **[Risk] 上下游对 422 错误体字段理解不一致** -> **Mitigation**: 在 v2.1 文档固定最小错误体与示例。
- **[Trade-off] 严格模式短期更容易报错** -> 换取长期稳定和可审计性。

## Migration Plan

1. 在 `src/content.config.ts` 切换严格 schema（移除 `id`、移除字符串布尔兼容）。
2. 批量替换所有文章路径拼接为 `slug`。
3. 更新 RSS 与版权组件链接来源。
4. 在分类统计与筛选链路中仅保留 canonical key。
5. 在 v2.1 文档补充 wxengine `422`/`route` 契约说明。
6. 运行构建与路径回归验证。

**Rollback Strategy**

- 若上线初期失败率过高，回滚本次变更并临时冻结自动发布；不得恢复为“部分兼容、部分严格”的混合状态。

## Open Questions

- `source_id` 是否需要唯一性约束（建议在 wxengine 侧保证幂等）。
- `route` 响应字段路径是否固定为 `data.route`（建议固定，便于插件解析）。
