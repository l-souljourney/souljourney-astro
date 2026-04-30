# Astro 发布契约 v2.2（Obsidian / wxengine / Astro）

更新时间：2026-03-25

## 1. 发布链路

`Obsidian Plugin -> wxengine /api/blog/publish -> GitHub Contents API -> Astro`

## 2. wxengine 发布接口

- 方法：`POST /api/blog/publish`
- 认证：`Authorization: Bearer <token>`

### 2.1 必填字段（请求体）

- `title` (string)
- `source_id` (string)
- `slug` (string)
- `lang` (`zh` | `en`)
- `markdown_content` (string)
- `astro.date` (string)
- `astro.categories` (string)

### 2.2 规则

- `id` 已退出契约，不再参与回退和 slug 生成。
- `lang` 为显式必填字段，不再允许缺省。
- 同一篇文章的 zh/en 镜像稿件必须共用同一个 `source_id`。
- 同一篇文章的 zh/en 镜像稿件必须共用同一个 `slug`。
- 同一篇文章的 zh/en 镜像稿件必须使用相同的 `astro.categories` 分类键。
- `astro.categories` 仅允许：
  - `investment`
  - `ai-era`
  - `zhejiang-business`
  - `philosophy`
  - `life`
- `astro.recommend` / `astro.top` / `astro.hide` 仅允许 boolean。
- `slug` 必须匹配：`^[a-z0-9]+(?:-[a-z0-9]+)*$`

### 2.3 错误返回约定

- 业务校验失败（缺必填、非法 categories、非法 slug）：`HTTP 422`
- JSON 结构/类型错误（如 boolean 传字符串）：`HTTP 400`
- 错误体至少包含：`message`

### 2.4 成功返回约定

- 成功响应包含 `route`，字段路径：`data.route`
- 路由制式：
  - 中文：`/article/{slug}`
  - 英文：`/en/article/{slug}`

### 2.5 双语镜像发布约束

- 只有完整 zh/en 镜像对可以进入正式公开发布集合。
- 未形成镜像对的稿件视为 `pending_translation`：
  - 保留在仓库
  - 不进入 article route
  - 不进入首页、归档、分类、标签
  - 不进入 RSS、sitemap、Pagefind 搜索索引
- 因此发布器在生成翻译稿时，必须复用原稿的 `source_id` 与 `slug`，只能变更：
  - `title`
  - `description`
  - `markdown_content`
  - 语言文本相关字段

## 3. Astro 端消费契约（frontmatter）

### 3.1 必填字段

- `title: string`
- `date: datetime`
- `categories: enum[investment, ai-era, zhejiang-business, philosophy, life]`
- `slug: string`（正则同上）
- `source_id: string`
- `lang: 'zh' | 'en'`

### 3.2 可选字段

- `updated: datetime`
- `tags: string[]`
- `description: string`
- `cover: string`
- `recommend: boolean`
- `top: boolean`
- `hide: boolean`
- `author: string`
- `word_count: number`
- `reading_time: number`
- `target: string`
- `article_type: string`
- `render_profile: string`
- `cover_image_url: string`

## 4. 路由与页面规则

- 文章详情页参数统一使用 `slug`（不再使用 frontmatter `id`）。
- 文章卡片、首页、归档、分类、标签、侧栏推荐、RSS 全部使用公开 publish set 生成链接。
- 中文链接：`/article/{slug}`；英文链接：`/en/article/{slug}`。
- 文章级语言切换和 `hreflang` 只指向同 `source_id + slug` 的公开镜像稿件。
- 不再允许“缺失镜像时回首页”或“只按 `lang + slug` 猜测对稿”的宽松策略。
