# Quality Guidelines

> 这个仓库的前端质量重点不是像业务后台那样的复杂表单，而是双语内容契约、静态路由正确性、客户端交互在 Astro 页面切换下的稳定性。

---

## Required Patterns

- 改公开内容入口时，统一走 `src/utils/publishSet.ts`
- 改文章路由、语言切换、`hreflang` 时，同时检查：
  - `src/pages/article/[...article].astro`
  - `src/pages/en/article/[...article].astro`
  - `src/components/Head/Head.astro`
  - `src/components/Header/Header.astro`
- 改分类、标签、归档、RSS、搜索集合时，确认中英文公开集合口径一致
- 改客户端脚本时，确认 `astro:page-load` / transition 场景下不会重复绑定
- 改常量、配置、分类 key、SEO 口径前，先全文搜索联动点

---

## Forbidden Patterns

- 绕过 `publishSet`，直接把 `getCollection("blog")` 结果用于公开页面输出
- 恢复旧的文章级语言切换 fallback 到首页
- 在组件或页面里复制粘贴 shared util 逻辑
- 在 page transition 场景下直接绑定事件而不做 cleanup / 去重
- 因为“小改动”跳过 `pnpm build`

---

## Testing Requirements

- 纯逻辑变更：补 `tests/*.test.*`，优先 `node:test`
- 路由 / SEO / 双语治理变更：至少补一个能锁住 contract 的回归测试
- 内容 schema / publish health 变更：执行
  - `pnpm build`
  - `node --test tests/*.test.*` 的相关用例
  - `node script/publish-health.js` 或 `pnpm check:publish-health`（当改动涉及发布集合时）
  - 若变更与外部双语推送工作流有关，再执行 `pnpm check:publish-bilingual-readiness`

### Scenario: Publish Health vs Bilingual Readiness

#### 1. Scope / Trigger
- Trigger: 修改 `publishSet`、content schema、`script/publish-health.js`、发布门禁脚本，或为 Obsidian / wxengine / Git 推送链路提供 Astro 侧验证口径。

#### 2. Signatures
- 默认健康检查命令：`pnpm check:publish-health`
- 严格双语就绪命令：`pnpm check:publish-bilingual-readiness`
- 底层脚本入口：`node ./script/publish-health.js`

#### 3. Contracts
- 基础阈值 env：
  - `MIN_MIRROR_PAIRS`
  - `MIN_ARTICLE_ROUTES`
  - `MIN_RSS_ITEMS`
  - `MAX_DUPLICATE_IDS`
- 双语治理阈值 env：
  - `MAX_PENDING_TRANSLATIONS`（可选；未设置表示默认不阻断 standalone 稿件）
  - `MAX_SOURCE_ID_CONFLICTS`
  - `MAX_SLUG_CONFLICTS`
  - `MAX_DUPLICATE_LOCALE_CONFLICTS`
  - `MAX_CATEGORY_CONFLICTS`
- 指标输出至少包含：
  - `mirrorPairs`
  - `pendingTranslations`
  - `sourceIdConflicts`
  - `slugConflicts`
  - `duplicateLocaleConflicts`
  - `categoryConflicts`
  - `duplicateIds`
  - `articleRoutes`
  - `rssItems`

#### 4. Validation & Error Matrix
- 完整 zh/en 镜像对不足 -> fail `minMirrorPairs`
- 路由 / RSS 公开面低于阈值 -> fail `minArticleRoutes` / `minRssItems`
- entry id 冲突 -> fail `maxDuplicateIds`
- `source_id` 对应多个 pair key -> fail `maxSourceIdConflicts`
- `slug` 对应多个 pair key -> fail `maxSlugConflicts`
- 同 pair key 下出现重复 locale -> fail `maxDuplicateLocaleConflicts`
- 同 pair key 下分类不一致 -> fail `maxCategoryConflicts`
- 只存在单语稿件且开启严格双语模式 -> fail `maxPendingTranslations`

#### 5. Good / Base / Bad Cases
- Good: 当前公开集合只有完整镜像对，所有 conflict 指标为 `0`
- Base: 仓库允许保留单语草稿，但默认健康检查不因此阻断构建
- Bad: 外部双语发布工作流仍推入 standalone 中文稿，却没有执行严格双语就绪检查

#### 6. Tests Required
- `tests/v2.2.1-publish-health.test.mjs`
  - 断言默认阈值
  - 断言 `pendingTranslations` 可被严格阈值阻断
  - 断言 `sourceIdConflicts` / `categoryConflicts` 被检测并 fail
- 修改脚本后至少再跑：
  - `pnpm build`
  - `pnpm check:publish-health`
  - `pnpm check:publish-bilingual-readiness`

#### 7. Wrong vs Correct
##### Wrong
- 认为 `pnpm check:publish-health` 通过，就等于“外部双语推送已完整落地”
- 只检查 `mirrorPairs/articleRoutes/rssItems`，忽略 `pendingTranslations` 和镜像冲突指标

##### Correct
- 默认健康检查负责“站点公开面不归零”
- 严格双语就绪检查负责“外部双语推送工作流没有留下 standalone / conflict 数据”

---

## Review Checklist

- 需求是否保持双语公开口径一致
- 新逻辑是否放在了正确层级：page / component / util / script
- 是否复用了现有 i18n、publish、archive、route util
- 是否增加了必要测试或至少更新了现有断言
- 是否引入了新的硬编码、重复 union、无 cleanup 的客户端事件

---

## Known Historical Pitfalls

- 同 slug 双语稿件在内容层互相覆盖，后来通过 `generateId` 修复
- 文章级语言切换曾错误回退到首页
- 构建成功但公开集合归零的问题，后来通过 publish-health 门禁补上

这些都是需要持续防回归的高优先级风险点。
