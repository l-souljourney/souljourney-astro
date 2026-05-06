# v2.4.0 链路分析：Obsidian -> wxengine -> Astro

日期：2026-05-04

## 结论摘要

`v2.4.0` 不能只按 Astro 单仓视角定义，必须按真实发布链路拆责任：

```text
Obsidian Plugin
  -> frontmatter/YAML 生成与校验
  -> 英文镜像稿翻译与双语发布编排
  -> wxengine /api/blog/publish
wxengine
  -> 请求校验
  -> 清洗 markdown frontmatter
  -> 重新生成 Astro frontmatter
  -> GitHub Upsert src/content/blog/{lang}/{slug}.md
Astro
  -> schema 校验
  -> publishSet 公开集合治理
  -> build / publish-health / deploy
```

对 `v2.4.0` 来说：

* **主工作仍在 Astro 仓库**，因为公开内容可见性、RSS、sitemap、canonical、H1、redirect 都是 Astro 侧最终决定。
* **但字段设计不能只改 Astro**，因为 frontmatter 字段的真实上游是 Obsidian 插件和 wxengine frontmatter builder。
* **wxengine 目前不是纯 Git push 壳**，它还承担 frontmatter 重建，因此如果新增 frontmatter 字段，wxengine 也需要同步支持。

---

## 1. 真实链路证据

### 1.1 活跃契约

当前 Astro 活跃文档：

* `docs/astro-wxengine-publish-contract-v2.2.md`
* `docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md`

核心契约已经明确：

* 发布链路是 `Obsidian Plugin -> wxengine publish -> GitHub repo update -> Astro`
* `source_id` 与 `slug` 是跨语言镜像主键
* 单语稿件允许入库，但不进入公开集合

### 1.2 Obsidian Plugin 责任

关键文件：

* `frontmatter.ts`
* `yamlPublishNormalizer.ts`
* `translationDraft.ts`
* `sidebar.ts`
* `publishService.ts`

已确认事实：

* 插件负责本地 frontmatter 解析与写回。
* `yamlPublishNormalizer.ts` 会把 Obsidian frontmatter 归一化成 Astro publish payload。
* 插件会在发布前阻断非法 frontmatter，例如：
  * 缺少 `slug`
  * `slug` 不符合正则
  * `source_id` 缺失
  * `categories` 非 canonical key
  * `markdown_content` 仍含 frontmatter
* 插件承担英文镜像稿翻译请求构造：
  * `translationDraft.ts` 负责 `buildTranslateRequest()`
  * `buildEnglishFrontmatter()` 负责生成英文镜像稿 frontmatter
* 插件已经具备 “Astro 双语同步发布” 编排，不只是按钮：
  * `sidebar.ts:onAstroBilingualPublishClick()`
  * 要求从中文源稿出发
  * 要求英文镜像稿已存在
  * 要求 `source_id / slug / categories / lang` 一致
  * 先发布 zh，再发布 en
  * 中文成功、英文失败时返回 `partial_failed`

重要判断：

* 插件**不会在点击双语发布时临时调用翻译再发布**。
* 插件当前模式是：**先有英文镜像稿，再执行双语同步发布**。
* 所以 `v2.4.0` 不应把“自动翻译并发布”当作当前主路径目标。

### 1.3 wxengine 责任

关键文件：

* `internal/blogpublish/service.go`
* `internal/blogpublish/frontmatter.go`

已确认事实：

* wxengine 在 `POST /api/blog/publish` 接收 payload。
* 服务端会主动清洗 plugin 传来的 `markdown_content`，移除正文中的前置 frontmatter。
* 服务端**不是原样保存插件 frontmatter**，而是重新构造 Astro frontmatter。
* frontmatter.go 当前生成字段包括：
  * `title`
  * `date`
  * `updated`
  * `categories`
  * `slug`
  * `source_id`
  * `tags`
  * `description`
  * `cover`
  * `recommend`
  * `top`
  * `hide`
  * `lang`
  * `author`
  * `word_count`
  * `reading_time`
  * `target`
  * `article_type`
  * `render_profile`
  * `cover_image_url`
* 最终写入路径：
  * `src/content/blog/zh/{slug}.md`
  * `src/content/blog/en/{slug}.md`

重要判断：

* wxengine 不只是“转发 Git push”。
* 它是 **Astro frontmatter 的服务端生成器**。
* 因此 `draft/noindex/excludeFromHome/excludeFromRSS/legacy_slugs` 这类新字段，如果要进入标准推送链路，**wxengine 必须新增支持**。

### 1.4 Astro 责任

关键文件：

* `src/content.config.ts`
* `src/utils/publishSet.ts`
* `src/pages/rss.xml.ts`
* `src/pages/en/rss.xml.ts`
* `src/pages/[...page].astro`
* `src/pages/archives/index.astro`
* `src/components/Head/Head.astro`

已确认事实：

* Astro 严格消费 `lang::source_id::slug` 作为 entry id。
* 公开集合逻辑以 `publishSet` 为核心。
* 当前公开可见性主要只有一层 `hide`，尚不足以承载 `draft/noindex/excludeFromHome/excludeFromRSS` 细分治理。

---

## 2. 对 v2.4.0 的影响

### 2.1 哪些属于 Astro 主工作

这些仍然是 `v2.4.0` 的主版本范围：

* schema 扩展
* publishSet 过滤口径扩展
* 首页 / 归档 / RSS / sitemap / canonical 的统一治理
* 重复 H1 修复
* legacy slug redirect
* publish-health / regression 验证

原因：

* 最终哪些内容公开，仍由 Astro 仓库决定。

### 2.2 哪些不能只在 Astro 改

如果 `v2.4.0` 要把新字段纳入正式推送链路，以下字段必须三方对齐：

* `draft`
* `noindex`
* `excludeFromHome`
* `excludeFromRSS`
* `legacy_slugs`

最小对齐路径：

1. Obsidian 插件允许 frontmatter 持有这些字段，并在 payload 中透传
2. wxengine `BlogPublishRequest` / frontmatter builder 接收并写回这些字段
3. Astro schema / publishSet 正确消费

否则：

* Astro 本地手改 markdown 可以工作
* 但从 Obsidian 正常点击发布时，这些字段不会真正入库

### 2.3 哪些不应纳入 v2.4.0

* 自动翻译后立即双语发布
* 更大范围的 YAML 体系重构
* Start Here / Newsletter / Services / Products 页面
* 完整 i18n 文案统一

原因：

* 这些属于 `v2.5+` 或插件独立版本，不是“发布卫生基线版”的最短路径

---

## 3. 建议的 v2.4.0 责任划分

### Astro 仓库（必须做）

* 扩 frontmatter schema
* 扩 publishSet 可见性规则
* 统一首页/归档/RSS/sitemap 消费口径
* 修复重复 H1
* 增加 legacy slug 消费与 redirect
* 增加测试和验证

### Obsidian Plugin（建议并行或紧随其后）

* frontmatter/YAML 允许新增字段
* publish payload 透传新增字段到 `/api/blog/publish`
* 若需要，metadata reconcile 支持这些字段不被错误覆盖

### wxengine（必须跟进）

* `/api/blog/publish` 请求结构支持新增字段
* `internal/blogpublish/frontmatter.go` 写回新增字段
* 如有 delete/replace 场景，确认 legacy slug 不影响既有 path 定位

---

## 4. 对 v2.4.0 的最终确认

`v2.4.0` 应定义为：

> 以真实发布链路为边界的“发布治理基线版”，由 Astro 侧完成公开消费治理与验证闭环，同时推动 Obsidian 插件和 wxengine 对新增 frontmatter 字段完成最小对齐。

换句话说：

* **版本核心在 Astro**
* **字段入口在 Obsidian**
* **字段落盘在 wxengine**

这三者必须一起考虑，不能只把 `v2.4.0` 当作 blog 仓库内部补丁。
