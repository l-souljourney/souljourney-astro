## Why

v2.0 已完成基础设施与安全收敛，但内容发布链路（Obsidian 插件 -> wxengine -> GitHub -> Astro）仍存在“字段可选、类型宽松、路由主键不一致”的问题。v2.1 需要改为严格契约，确保发布失败尽早暴露，避免线上出现路由冲突、分类脏数据和不可追踪内容。

## What Changes

- Astro frontmatter 改为严格字段契约：必填 `title/date/categories/slug/source_id`，`id` 退出发布契约
- 分类字段严格限制为 canonical key：`investment`、`ai-era`、`zhejiang-business`、`philosophy`、`life`
- `recommend/top/hide` 仅接受 boolean，不再接受字符串
- `slug` 采用严格规则：全小写短横线，正则 `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- 文章路由统一使用 `slug`，全站链接（列表/详情/RSS/版权）禁止再拼接 `id`
- 明确 wxengine 发布 API 错误与成功响应契约：非法输入返回 `422`，成功响应返回 `route`

## Non-goals

- 不在 v2.1 重构 Obsidian 插件 UI/交互（仅约定字段契约）
- 不在 v2.1 实现 wxengine 云端队列/多租户能力
- 不做历史文章兼容层（本版本按严格契约推进，新旧数据分批治理）
- 不引入新的 Astro 页面信息架构（仅做既有页面字段与路由对齐）

## Capabilities

### New Capabilities
- `astro-publish-schema-alignment`: 定义 Astro 消费端的严格字段、类型、枚举与正则约束
- `astro-slug-route-stability`: 定义 `slug` 唯一路由键与全站链接一致性（含 RSS）
- `astro-taxonomy-and-meta-normalization`: 定义分类 canonical 强约束与元数据字段严格消费
- `wxengine-publish-api-error-contract`: 定义 wxengine 发布 API 的 `422` 错误结构与成功 `route` 响应约定

### Modified Capabilities

（无现有 specs，首次建立）

## Impact

- **代码范围**: `src/content.config.ts`, `src/pages/article/[...article].astro`, `src/pages/en/article/[...article].astro`, `src/pages/rss.xml.ts`, `src/pages/en/rss.xml.ts`, `src/components/**`（文章卡片/归档/侧栏/版权）
- **内容约定**: Obsidian YAML 与 Astro schema 建立严格映射（非兼容模式）
- **外部系统**: 依赖 GitHub Contents API 的写入结果可被 Astro 构建直接消费
- **Engine 依赖**: 依赖 wxengine 在发布入口执行严格校验并返回标准错误体（`422`）与成功 `route`
- **版本定位**: 属于 `v2.x roadmap` 的 v2.1（发布链路与内容模型对齐阶段）
