---
title: "L-Engine v3.8 对外接口规格 — Astro 博客 & 小程序对接"
date: "2026-03-09"
status: legacy
scope: "Engine v3.8 多渠道分发的前端对接契约"
audience: "前端开发者 / AI 辅助开发"
---

# L-Engine v3.8 对外接口规格

> 失效说明（2026-05-01）：
> 本文档保留为历史草案，不再作为当前 Astro / Obsidian 对接依据。
> 当前实现请改读：
> - `docs/astro-wxengine-publish-contract-v2.2.md`
> - `docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md`

## 0. 文档用途

本文档定义 Engine v3.8 多渠道分发对外输出的数据格式和接口契约。
前端项目（Astro 博客、微信小程序）根据本文档进行对接改造。

**Engine 的职责**：接收内容 → AI 处理 → 推送到各渠道
**前端的职责**：消费 Engine 推送的数据，展示给用户

---

## 1. 渠道总览

| 渠道 | 数据载体 | 前端项目 | Engine 动作 |
|------|----------|----------|-------------|
| **Astro 博客** | Git 仓库中的 .md 文件 | souljourney-blog | Engine 生成 .md → git push 到博客仓库 |
| **微信小程序** | OSS 静态 JSON 文件 | souljourney-wxapp | Engine 生成 JSON → 上传 OSS |
| **微信公众号** | Coze API | — | Engine 调 Coze API（已有，v3.6） |

---

## 2. Astro 博客对接

### 2.1 Engine 的输出动作

Engine 执行 `soul publish --target git` 时：

1. 将处理后的 markdown 文件推送到 `souljourney-blog` 仓库的 `src/content/blog/zh/` 目录
2. 如果有英文翻译版本（v4.0），同时推送到 `src/content/blog/en/`
3. Git push 触发 Astro 自动构建和部署

### 2.2 Markdown 文件格式

Engine 生成的 .md 文件**必须匹配** Astro 现有的 Content Collection Schema。

**文件路径规则**：
```
src/content/blog/zh/{id}.md      ← 中文
src/content/blog/en/{id}.md      ← 英文（v4.0）
```

**Frontmatter 格式（完整字段）**：

```yaml
---
title: "市场复盘：科技股回调中的机会"
date: 2026-03-09 10:30:00
categories: investment-notes
tags:
  - 科技股
  - 市场分析
  - 投资复盘
id: 2026-03-09-tech-stock-pullback-opportunities
cover: ""
recommend: false
top: false
hide: false
---

正文 Markdown 内容...
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 | Engine 如何生成 |
|------|------|------|------|----------------|
| `title` | string | 是 | 文章标题 | 从 markdown frontmatter 或文件名提取 |
| `date` | datetime | 是 | 发布时间 | 发布时的时间戳 |
| `categories` | string | 是 | 分类（单个） | 从 AI 分析结果或配置默认值 |
| `tags` | string[] | 否 | 标签数组 | 从 AI 提取的 tags 或原文 frontmatter |
| `id` | string | 是 | 唯一标识，用作 URL slug | 格式：`{date}-{slug}`，如 `2026-03-09-market-review` |
| `cover` | string | 否 | 封面图 URL | 从原文提取或留空 |
| `recommend` | boolean | 否 | 是否推荐 | 默认 false |
| `top` | boolean | 否 | 是否置顶 | 默认 false |
| `hide` | boolean | 否 | 是否隐藏 | 默认 false |
| `lang` | string | 否 | 语言标记 | 中文不填，英文填 `"en"` |

### 2.3 Astro 侧需要的改造

**可能不需要改造**，如果 Engine 严格按照上述 frontmatter 格式生成文件。

**可能需要的调整**：
- 如果当前 `categories` 的值域是固定的（如 `ai-era`），需要新增 Engine 使用的分类值（如 `investment-notes`、`weekly-report`）
- 如果需要区分"手动发布"和"Engine 自动发布"的文章，可在 frontmatter 新增 `source: engine` 字段

### 2.4 Git Push 方式

Engine 通过 GitHub API 或 deploy key 推送：

```
仓库：souljourney-blog (GitHub)
分支：main
目标路径：src/content/blog/zh/
认证：deploy key（只读/写 content 目录）
```

推送后 Astro 的 CI/CD（如 Cloudflare Pages、Vercel）自动触发构建。

---

## 3. 微信小程序对接

### 3.1 当前小程序的数据获取方式

小程序当前通过 HTTP API 获取文章数据：

```
GET /articles?page=1&perPage=6&contentType=note
GET /articles/{articleId}/detail
```

**当前后端地址**：`localhost:8090`（本地开发），生产环境地址待配置

### 3.2 Engine v3.8 提供的两种对接方案

#### 方案 A：OSS 静态 JSON（推荐）

Engine 发布时生成 JSON 文件上传 OSS，小程序直接读 OSS。

**优点**：最快、最稳、零服务器成本、CDN 加速
**缺点**：不支持动态分页（但总量不大，可全量加载）

#### 方案 B：Engine FastAPI 直接提供 API

小程序调用 Engine 的 API 端点。

**优点**：支持动态查询和分页
**缺点**：依赖 FC 可用性、多一跳延迟

**建议方案 A**，原因：
- 文章总量不大（每天 1-3 篇），全量 JSON 索引完全可行
- OSS + CDN 比 FC API 快 5-10 倍
- 零运维，不依赖 Engine 运行状态

### 3.3 OSS 目录结构

```
oss://souljourney-bucket/
  published/
    original/                        ← 原创内容
      index.json                     ← 文章列表索引（小程序首页用）
      articles/
        2026-03-09-market-review.json    ← 单篇文章详情
        2026-03-08-tech-analysis.json
        ...
    curated/                         ← 聚合内容（v4.0，RSS 抓取整理的）
      index.json
      articles/
        ...
```

### 3.4 index.json 格式（文章列表）

小程序首页加载此文件获取文章列表。

```json
{
  "total": 42,
  "updated_at": "2026-03-09T10:30:00+08:00",
  "items": [
    {
      "id": "2026-03-09-market-review",
      "title": "市场复盘：科技股回调中的机会",
      "summary": "今日科技板块出现明显回调...",
      "tags": ["科技股", "市场分析"],
      "date": "2026-03-09T10:30:00+08:00",
      "content_type": "note",
      "category": "investment-notes",
      "sentiment": "neutral",
      "score": 78,
      "original_url": "https://mp.weixin.qq.com/s/xxxxx",
      "cover": ""
    },
    {
      "id": "2026-03-08-tech-analysis",
      "title": "...",
      "summary": "...",
      "tags": ["..."],
      "date": "2026-03-08T09:00:00+08:00",
      "content_type": "note",
      "category": "...",
      "sentiment": "bull",
      "score": 85,
      "original_url": "",
      "cover": ""
    }
  ]
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 | 对应小程序现有字段 |
|------|------|------|------|-------------------|
| `id` | string | 是 | 唯一标识 | `Article.id` |
| `title` | string | 是 | 文章标题 | `Article.title` |
| `summary` | string | 是 | 摘要（AI 生成） | `Article.summary` |
| `tags` | string[] | 否 | 标签数组 | `Article.tags`（当前是 JSON string，需适配） |
| `date` | string (ISO 8601) | 是 | 发布时间 | `Article.date` |
| `content_type` | string | 否 | 类型：note / daily / weekly | `Article.contentType` |
| `category` | string | 否 | 分类 | `Article.category` |
| `sentiment` | string | 否 | 情绪：bull / bear / neutral | `Article.sentiment` |
| `score` | number | 否 | 质量评分 0-100 | `Article.score` |
| `original_url` | string | 否 | 微信公众号原文链接 | `Article.originalUrl` |
| `cover` | string | 否 | 封面图 URL | — |

### 3.5 单篇文章详情 JSON 格式

小程序文章详情页加载此文件。

```json
{
  "id": "2026-03-09-market-review",
  "title": "市场复盘：科技股回调中的机会",
  "summary": "今日科技板块出现明显回调...",
  "content": "完整的 Markdown 正文内容...",
  "tags": ["科技股", "市场分析"],
  "date": "2026-03-09T10:30:00+08:00",
  "content_type": "note",
  "category": "investment-notes",
  "sentiment": "neutral",
  "score": 78,
  "original_url": "https://mp.weixin.qq.com/s/xxxxx",
  "cover": "",
  "ai_essence": {
    "summary": "AI 审计摘要...",
    "key_points": [
      "科技股短期回调幅度约5%，属于正常波动范围",
      "半导体板块基本面未变，回调或为买入机会",
      "需关注美联储下周议息会议对科技股估值的影响"
    ],
    "cognition_gap": {
      "human_point": "作者认为此次回调是买入机会",
      "ai_correction": "历史数据显示类似回调中有40%继续下探，建议分批建仓而非一次性买入",
      "has_discrepancy": true
    },
    "historical_mirrors": [
      {
        "id": "2026-02-15-tech-correction",
        "title": "2月科技股修正复盘",
        "date": "2026-02-15",
        "similarity": 82
      }
    ]
  }
}
```

**`ai_essence` 字段说明**：

| 字段 | 说明 | 来源 |
|------|------|------|
| `summary` | AI 审计总结 | Engine AI 分析产物（v3.9 深度分析） |
| `key_points` | 关键要点列表 | Engine AI 提取 |
| `cognition_gap` | 认知差异（人 vs AI） | Engine AI 分析（v3.9） |
| `historical_mirrors` | 历史相似文章 | DashVector 检索（v3.9） |

**注意**：`ai_essence` 在 v3.8 阶段可能为空或只有 `summary` + `key_points`。完整的 `cognition_gap` 和 `historical_mirrors` 在 v3.9 知识库上线后才有数据。小程序应做好字段缺失的兼容处理。

### 3.6 小程序侧需要的改造

**核心改造：数据源切换**

当前小程序的 `/src/api/config.ts` 配置了后端 API 地址。需要改为 OSS 地址，或新增 OSS 数据源。

```typescript
// 改造前
const API_BASE = {
  local: 'http://localhost:8090',
  production: 'https://api.xxx.com'  // 待配置
}

// 改造后 - 方案 A (OSS 静态)
const OSS_BASE = 'https://souljourney-bucket.oss-cn-xxx.aliyuncs.com/published/original'

// 文章列表：GET {OSS_BASE}/index.json
// 文章详情：GET {OSS_BASE}/articles/{id}.json
```

**需要适配的差异**：

| 差异点 | 当前小程序 | Engine OSS 输出 | 适配方式 |
|--------|-----------|-----------------|----------|
| 字段命名 | camelCase (`contentType`) | snake_case (`content_type`) | 现有 adapter.ts 已处理 snake_case 转换 |
| tags 格式 | JSON string `'["a","b"]'` | 原生数组 `["a","b"]` | adapter 需兼容两种格式 |
| 分页 | 后端分页 `page/perPage` | 无分页，全量 index.json | 前端本地分页/过滤 |
| 详情 URL | `/articles/{id}/detail` | `{OSS}/articles/{id}.json` | 修改请求地址 |

**前端本地分页方案**：

index.json 包含所有文章的元数据（不含正文），文件大小可控：
- 1000 篇文章 × 每篇约 300 字节 ≈ 300KB
- 小程序首次加载一次，后续缓存

在前端用现有的筛选逻辑（contentType、tags、时间范围）做本地过滤即可。

---

## 4. Engine API 端点（可选直连）

如果前端需要直接调用 Engine API（方案 B），以下是可用端点。

**Base URL**: `https://engine.skyweninfo.cn`
**鉴权**: `Authorization: Bearer <API_SECRET_KEY>`

### 4.1 发布接口

```
POST /api/v1/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "source_path": "notes/2026-03-09-market-review.md",
  "target": "all",
  "dry_run": false
}

Response:
{
  "results": [
    {"target": "coze", "route": "wechat-main", "status": "ok", "draft_media_id": "xxx"},
    {"target": "oss", "status": "ok"},
    {"target": "git", "status": "ok"}
  ]
}
```

### 4.2 发布记录查询

```
GET /api/v1/records?target=oss&limit=20
Authorization: Bearer <token>

Response:
{
  "records": [
    {
      "id": 1,
      "source_path": "notes/2026-03-09.md",
      "target": "oss",
      "title": "市场复盘",
      "status": "ok",
      "created_at": "2026-03-09T10:30:00"
    }
  ],
  "total": 1
}
```

### 4.3 健康检查（免鉴权）

```
GET /health

Response:
{
  "status": "ok",
  "service": "souljourney-engine",
  "version": "0.3.7"
}
```

---

## 5. 版本对照：各阶段可用能力

| 能力 | v3.7.2 | v3.8 | v3.9 | v4.0 |
|------|--------|------|------|------|
| Coze → 微信公众号 | ✅ 已有 | ✅ | ✅ | ✅ |
| OSS → 小程序 JSON | — | ✅ 新增 | ✅ | ✅ |
| Git → Astro 博客 | — | ✅ 新增 | ✅ | ✅ |
| RDS 发布记录 | ✅ 新增 | ✅ | ✅ | ✅ |
| API 鉴权 | ✅ 新增 | ✅ | ✅ | ✅ |
| AI summary + key_points | ✅ 已有 | ✅ | ✅ | ✅ |
| AI cognition_gap | — | — | ✅ 新增 | ✅ |
| AI historical_mirrors | — | — | ✅ 新增 | ✅ |
| 英文翻译 | — | — | — | ✅ 新增 |
| 聚合内容 (RSS) | — | — | — | ✅ 新增 |

---

## 6. 前端对接开发建议

### 6.1 Astro 博客

**改造量**：极小。Engine 按照现有 frontmatter schema 生成文件，Astro 无需改代码。

**需确认**：
1. `categories` 新增哪些值（Engine 会用 `investment-notes`、`market-review`、`weekly-report` 等）
2. 是否需要在 `content.config.ts` 的 schema 中新增 `source` 字段区分来源

**可选优化**：
- Astro 构建时间优化（如果文章量大，考虑增量构建）
- 新增 Engine 推送的分类页面

### 6.2 微信小程序

**改造量**：中等。主要是数据源切换 + 本地分页。

**改造步骤建议**：
1. 新增 OSS 配置（`api/config.ts` 增加 OSS base URL）
2. 修改文章列表请求：`GET {OSS}/index.json` 替代 `GET /articles`
3. 修改文章详情请求：`GET {OSS}/articles/{id}.json` 替代 `GET /articles/{id}/detail`
4. 适配 `adapter.ts`：兼容 OSS JSON 格式（tags 格式、字段命名）
5. 实现前端本地分页和筛选（替代后端分页）
6. `ai_essence` 字段缺失时的兼容处理
7. 缓存策略：index.json 本地缓存 + 定时刷新

**可选：保留 Engine API 作为 fallback**：
- OSS 读取失败时降级到 Engine API
- 实时性要求高的场景走 API

---

*本文档由 Engine 项目维护。前端项目根据此契约独立开发，接口变更需同步更新本文档。*
