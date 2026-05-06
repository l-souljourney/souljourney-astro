# Prompt：Astro 双语博客 v0.2 工程迭代规划

你是我的资深 Astro 工程架构师、前端技术负责人、SEO 顾问和内容产品设计师。

请基于我当前的 Astro 双语博客项目，帮我制定一个低复杂度、可持续迭代、适合个人开发者执行的工程改造方案。

---

## 0. 版本口径与公开规则

- 当前执行主线以 `v2.4.0` 商业化路线图为准，`v2.x` 仅作为历史技术底座参考。
- 未翻译 / 单边内容可以保留为草稿或预览，但不得进入公开集合。
- 公开集合默认只包含会被首页、归档、分类、标签、RSS、sitemap、搜索索引消费的正式发布内容。

---

## 一、项目背景

我正在开发一个 Astro 双语博客主站，项目名为 `l-souljourney`。

这个站点不是普通博客，而是我的长期内容资产中心，承担以下角色：

1. 中文历史文章的精选沉淀；
2. 英文内容出海的主权阵地；
3. Substack / X / Reddit / TikTok / YouTube 的承接中心；
4. 未来服务和产品的转化入口；
5. 未来申请 AdSense、Paddle、Airwallex、WorldFirst 等平台时的网站可信证明；
6. 未来数字产品 / SaaS / AI workflow 工具的官网基础。

当前我已经搭建了基础版本：

- Astro 双语首页；
- 中文和英文路由；
- 文章页；
- 分类；
- 标签；
- 归档；
- 关于页；
- RSS / Sitemap 入口；
- 公众号导流；
- 基础 i18n；
- 基础内容发布流程。

现在需要把它从「能发布的技术站」升级为：

```txt
正式个人品牌主站
+ 双语内容资产库
+ Newsletter 承接页
+ Services 服务转化页
+ Products 数字产品页
+ SEO / AdSense / Paddle 审核友好的可信网站
```

---

## 二、总体工程原则

请遵守以下原则：

1. 不要过度工程化。
2. 当前不接 Stripe。
3. 当前不接真实支付。
4. 当前不做用户系统。
5. 当前不做复杂数据库。
6. 当前优先静态内容、Markdown、Content Collections。
7. 当前优先保证内容发布速度和维护成本低。
8. 所有新增功能都应服务于：
   - 内容发布；
   - 双语体验；
   - SEO；
   - newsletter 转化；
   - 服务转化；
   - 产品页准备；
   - 平台审核可信度。
9. 所有任务请按 P0 / P1 / P2 排序。
10. 如果需要改代码，请先给出文件级别计划，不要直接大规模重构。

---

## 三、当前阶段目标

请把当前阶段目标定义为：

```txt
v0.2：Commercial-ready bilingual content platform
```

含义：

- 不是完整 SaaS；
- 不是电商系统；
- 不是会员系统；
- 不是复杂 CMS；
- 而是一个可以持续发布、被搜索收录、能沉淀用户、能承接服务咨询、能准备数字产品审核的双语内容主站。

---

## 四、请你先检查并规划的模块

请从以下模块逐一分析。

---

### 1. 路由结构

请评估并规划以下路由是否合理：

```txt
/
  中文首页

/en
  英文首页

/article/[slug]
  中文文章页

/en/article/[slug]
  英文文章页

/categories/[category]
/en/categories/[category]

/tags/[tag]
/en/tags/[tag]

/archives
/en/archives

/about
/en/about

/start-here
/en/start-here

/newsletter
/en/newsletter

/services
/en/services

/products
/en/products

/projects
/en/projects

/tools
/en/tools

/contact
/en/contact

/privacy
/en/privacy

/terms
/en/terms

/refund-policy
/en/refund-policy
```

请判断：

- 哪些必须现在做；
- 哪些可以后置；
- 哪些应该隐藏或 noindex；
- 中英文 URL 是否应该完全对应；
- 是否需要 `/zh/` 前缀，还是中文放根路径更好；
- 哪些页面应该进入 sitemap；
- 哪些页面适合 noindex；
- 哪些页面需要在导航中显示；
- 哪些页面只放 footer 即可。

---

### 2. Content Collections 设计

请帮我设计 Astro Content Collections 的 schema。

我希望每篇文章支持：

```yaml
title:
description:
slug:
lang:
date:
updated:
category:
tags:
series:
draft:
noindex:
featured:
excludeFromHome:
excludeFromRSS:
excludeFromSitemap:
source:
source_id:
translation_of:
canonical:
wechat_source:
substack_url:
x_thread_url:
youtube_url:
reddit_url:
cover:
author:
readingTime:
wordCount:
license:
type:
aliases:
```

请帮我判断：

- 哪些字段必须；
- 哪些字段可选；
- 哪些字段应该自动生成；
- 哪些字段会影响 SEO；
- 哪些字段会影响 RSS / Sitemap；
- 哪些字段会影响首页/分类/归档；
- 如何处理中英文互链；
- 如何处理旧 slug redirect；
- 如何让 Obsidian 导出的 Markdown 和 Astro schema 对齐。

请输出 TypeScript schema 建议。

---

### 3. Draft / Noindex / Exclude 机制

我需要支持以下内容状态：

```txt
draft: 不构建或不公开展示；
noindex: 页面可访问，但不进入搜索引擎；
excludeFromHome: 不在首页展示；
excludeFromRSS: 不进入 RSS；
excludeFromSitemap: 不进入 sitemap；
type: article / note / demo / devlog / page；
```

请帮我设计：

- 数据层如何处理；
- 列表页如何过滤；
- RSS 如何过滤；
- Sitemap 如何过滤；
- robots / meta robots 如何配合；
- 测试文章和联调文章如何处理；
- 开发环境和生产环境是否不同；
- 是否需要 `PUBLIC_SHOW_DRAFTS` 之类环境变量。

请给出实现方案和伪代码。

---

### 4. 双语 i18n 完善

我需要避免英文站出现中文残留。

请帮我规划统一 i18n 字典，包括：

- 导航；
- 分类名；
- 标签名是否翻译；
- 日期格式；
- 阅读时长；
- 字数；
- 作者；
- 版权声明；
- 公众号 CTA；
- Substack CTA；
- 相关文章；
- 上一篇 / 下一篇；
- 空状态；
- 404 页面；
- 表单文案；
- 服务页文案；
- 产品页文案；
- footer；
- RSS 文案；
- meta title template；
- meta description template。

请输出以下文件的建议结构：

```txt
src/i18n/zh.ts
src/i18n/en.ts
src/i18n/categories.ts
src/i18n/routes.ts
src/i18n/date.ts
```

请说明：

- category slug 是否统一使用英文；
- 中文显示名和英文显示名如何映射；
- 标签是否需要翻译；
- 未翻译标签如何处理；
- 日期格式如何使用 `Intl.DateTimeFormat`。

---

### 5. 中英文文章互链 / Canonical / Hreflang

我的双语站需要支持：

- 中文文章对应英文文章；
- 英文文章对应中文原文；
- 未翻译文章可以保留为草稿或预览页，但不得进入公开集合；
- 首页、分类页、标签页、归档页都有合理 canonical；
- 搜索引擎能识别中英文版本关系。

请帮我设计：

- `source_id`；
- `translation_of`；
- `canonical`；
- `hreflang`；
- `x-default`；
- `og:locale`；
- `alternate` links；
- Sitemap 中如何包含中英文 URL；
- 没有对应翻译的页面如何处理；
- 是否应该在页面上显示“Read in English / 阅读中文”。

请给出 HTML head 输出示例。

---

### 6. 首页改造

当前首页不能只是文章列表。

请帮我设计中文首页和英文首页。

中文首页应该表达：

```txt
这是一个从公众号出发的长期内容实验：
用 AI、Obsidian、Astro 和真实经历，
把投资、AI、商业与人生重构成可长期沉淀的知识资产。
```

英文首页应该表达：

```txt
I’m rebuilding years of Chinese writing into a global AI-powered creator system.
Writing about AI workflows, bilingual publishing, solo building, and the China-to-global creator journey.
```

请帮我设计首页模块：

- Hero；
- Start Here；
- Featured Articles；
- Topics；
- Newsletter CTA；
- Services CTA；
- Products teaser；
- About card；
- Latest posts；
- Footer。

请给出：

- 组件拆分；
- 数据来源；
- 中文文案骨架；
- 英文文案骨架；
- 移动端布局建议；
- 哪些模块可以先静态写死；
- 哪些模块后续从 content collection 自动生成。

---

### 7. Start Here 页面

请帮我设计：

```txt
/start-here
/en/start-here
```

这个页面要解决：

- 新用户第一次访问应该先看什么；
- 中文读者和英文读者分别如何理解这个站；
- 公众号老读者如何迁移到独立站；
- 海外读者如何理解一个中国创作者的内容资产重构实验；
- 如何引导到 Newsletter、Services、Products、精选文章。

请输出：

- 中文页面大纲；
- 英文页面大纲；
- 每个 section 的文案骨架；
- 推荐文章列表组件；
- CTA 组件；
- 是否进入主导航；
- SEO title / description。

---

### 8. Newsletter 页面

我已经有 Substack。

请帮我设计：

```txt
/newsletter
/en/newsletter
```

目标：

- 承接 Astro 读者；
- 引导订阅 Substack；
- 解释 newsletter 的价值；
- 不只是“博客更新通知”；
- 英文 newsletter 可以叫 `Archive Rebuild Log`。

请输出：

- 中文页面结构；
- 英文页面结构；
- Substack embed 放置方式；
- 隐私说明；
- 最近几期 newsletter 展示；
- CTA 组件设计；
- 如果 Substack embed 加载失败，fallback 如何写；
- 是否需要自建 email capture 占位。

---

### 9. Services 页面

我需要先做服务转化，不做自动支付。

请帮我设计：

```txt
/services
/en/services
```

中文服务可能包括：

- 公众号历史文章资产盘点；
- AI 内容操作系统搭建；
- Obsidian + Astro + AI 发布工作流；
- 中文创作者出海内容重构；
- 独立开发者内容系统咨询。

英文服务可能包括：

- Chinese Essay Global Reframing Audit；
- Global Content Package；
- AI Content Operating System Setup；
- Monthly Content System Retainer。

请帮我输出：

- 服务页信息架构；
- 每个服务的卡片结构；
- 适合的价格区间；
- CTA 文案；
- 表单字段；
- 如何说明付款方式是 invoice / Airwallex / bank transfer；
- 如何避免一开始做复杂 checkout；
- 如何写服务流程；
- 如何写交付物；
- 如何写“不适合谁”；
- 如何写 FAQ；
- 如何和 Contact 页面联动。

---

### 10. Products 页面

我未来准备通过 Paddle 卖数字产品 / toolkit / SaaS。

请帮我设计：

```txt
/products
/en/products
```

第一个产品暂定：

```txt
AI Bilingual Content Engine Kit
```

它可能包含：

- Obsidian vault template；
- DeepSeek 中文提炼 prompt；
- English market reframing prompt；
- Astro publishing checklist；
- Substack issue template；
- X thread template；
- Content scoring sheet；
- Publishing workflow map。

请帮我设计：

- 产品页结构；
- Paddle 审核友好的表述；
- 不要把它写成人工咨询服务；
- 交付方式说明；
- refund policy 链接；
- support email；
- future checkout placeholder；
- 产品状态：coming soon / beta / available；
- 如何区分 free lead magnet 和 paid product；
- 产品 metadata；
- FAQ；
- 技术支持说明；
- 版本更新说明。

---

### 11. Legal / Trust 页面

为了 AdSense、Paddle、Airwallex 以及海外用户信任，需要补齐：

```txt
/privacy
/en/privacy

/terms
/en/terms

/refund-policy
/en/refund-policy

/contact
/en/contact
```

请帮我设计：

- 每个页面的最小内容；
- 哪些内容必须中英文都有；
- 是否需要显示公司主体；
- 如果前台是个人 IP，后台是中国公司服务主体，应该如何表述；
- Contact 页面应包含哪些联系方式；
- 是否需要 business inquiry form；
- 退款政策如何区分：
  - 服务；
  - 数字产品；
  - 订阅；
  - 免费资源；
- Privacy 页面如何说明 Substack、Analytics、第三方嵌入；
- Terms 页面如何说明内容仅供信息参考，不构成投资/法律/税务建议。

注意：你不是律师，请只给信息架构和页面内容建议，不要提供正式法律意见。

---

### 12. SEO / AdSense / Analytics 准备

请帮我规划：

- title template；
- meta description；
- OpenGraph；
- Twitter Card；
- JSON-LD Article schema；
- sitemap；
- RSS；
- robots.txt；
- ads.txt placeholder；
- Google Search Console；
- Google Analytics / Plausible；
- canonical；
- noindex；
- 404；
- redirects；
- legacy slug alias；
- image alt；
- page speed；
- mobile layout；
- content freshness；
- internal links；
- breadcrumb；
- author schema；
- organization/person schema。

请输出检查清单，并按 P0 / P1 / P2 排序。

---

### 13. 组件拆分建议

请帮我建议组件结构，例如：

```txt
src/components/
  layout/
  article/
  i18n/
  seo/
  cta/
  newsletter/
  services/
  products/
  navigation/
  footer/
  legal/
  forms/
```

请说明：

- 每个组件负责什么；
- 哪些现在必须做；
- 哪些可以后置；
- 哪些应该保持纯静态；
- 哪些未来可能接入 API；
- 哪些要避免过度抽象。

---

### 14. Codex 执行计划

最后请输出一个可执行的工程任务计划。

格式：

```txt
P0：必须立即做
- 任务
- 目的
- 涉及文件
- 验收标准

P1：近期做
- 任务
- 目的
- 涉及文件
- 验收标准

P2：后置做
- 任务
- 目的
- 涉及文件
- 验收标准
```

要求：

- 先小步迭代；
- 每一步都能独立提交；
- 每一步都有验收标准；
- 不要一次性大重构；
- 不要引入不必要依赖；
- 不要接真实支付；
- 不要做数据库；
- 不要做用户登录。
