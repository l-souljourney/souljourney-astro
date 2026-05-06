# astro bilingual platform roadmap

## Goal

把当前可用的 Astro 双语博客，从“能发布内容的 demo”升级为“可对外商业化的双语内容平台”，优先补齐发布治理、再做 i18n 与站点架构，最后完善增长、SEO 和变现能力。

## What I already know

* 当前站点基于 Astro `^6.2.1`，Node 要求 `>=22.12.0`。
* 已有双语路由、`hreflang`、canonical、RSS、sitemap、robots.txt、i18n UI 字典、`publishSet` 这类基础能力。
* 现状仍有明显 demo 痕迹：文章页中英模板混杂、文章页存在硬编码中文文案、首页/归档/RSS/内容发布治理还不够完整。
* 文章内容来自 `src/content/blog/`，发布口径主要经由 `src/utils/publishSet.ts` 和 `src/utils/publishedBlog.ts`。

## Assumptions (temporary)

* 不引入 CMS，不重做技术栈，优先在现有 Astro 内容体系内演进。
* 产品化目标以“内容站 + 服务/产品转化”为主，不做复杂会员系统。
* 先完成站内基础治理，再做外部商业化对接。

## Requirements (evolving)

### Priority 1: publishing hygiene

* 增加 `draft` / `noindex` / `excludeFromHome` / `excludeFromRSS` 支持。
* 让测试/演示文章不再出现在首页、归档、RSS、sitemap。
* 去掉文章页重复 H1 问题。
* 增加 legacy slug 重定向支持。
* 复核 RSS、sitemap、robots.txt、canonical。

### Priority 2: i18n polish

* 建立 zh/en 的集中式字典。
* 翻译分类名、UI 标签、阅读时长、作者信息、CTA、版权文案。
* 修正英文日期格式。
* 清理英文文章模板中的中文残留。
* 为双语文章对补齐 `hreflang` + canonical 关系。

### Priority 3: site architecture

* 增加 Start Here、About、Newsletter、Services、Products、Contact、Privacy、Terms、Refund Policy 页面。
* 页面需要按 zh/en 成对落地，且适配商业化定位。

### Priority 4: growth and conversion

* 增加首页 hero。
* 增加 newsletter / service CTA。
* 增加 related articles、series navigation、author card。
* 补齐点击埋点。

### Priority 5: SEO and monetization readiness

* 补齐 OpenGraph / Twitter card / JSON-LD Article schema。
* 增加 sitemap 质量校验、`ads.txt`、GSC 验证位。
* 预留 AdSense 布局槽位，但默认关闭。
* 增加 Paddle 商品元数据与合规页面。

## Proposed Roadmap

### Phase 0: 现状加固与边界确认

* 固化内容 schema 变更方案。
* 确认哪些页面/列表/输出源共享同一发布过滤口径。
* 先定义“公开内容”的单一来源，避免后面重复修复。

### Phase 1: 发布治理

* 扩展内容 schema 与 publish helper。
* 统一首页、归档、RSS、sitemap、文章静态路径的过滤逻辑。
* 处理旧 slug 路由与重定向。
* 修复文章页结构语义与 robots/canonical 细节。

### Phase 2: i18n 体系化

* 把分散文案收敛到统一字典。
* 补齐分类/作者/CTA/版权等所有站点文案翻译。
* 统一日期、数字、阅读时长等展示规则。
* 清理英文模板中的中文残留。

### Phase 3: 内容产品页

* 先做 Start Here / About / Newsletter / Services / Products。
* 再补 Contact / Privacy / Terms / Refund Policy。
* 所有页面按“内容说明 + 转化入口”设计，而不是纯静态介绍页。

### Phase 4: 增长组件

* 首页 hero、CTA、related articles、series nav、author card。
* 统一埋点事件名与触发时机。

### Phase 5: SEO / 变现

* 完成结构化数据、站点验证、广告位占位、Paddle 元信息。
* 最后做整体验收：RSS / sitemap / robots / canonical / hreflang / 404 / 归档 / 首页。

## Trellis Documentation Strategy

* `docs/plans/` 承载跨版本 roadmap，解决“为什么做、先做什么、版本怎么排”。
* `.trellis/tasks/<task>/prd.md` 承载单个版本或单个执行任务，解决“这一版具体做什么、验收是什么、怎么验证”。
* `.trellis/tasks/<task>/research/*.md` 承载技术研究、竞品参考、方案比选、风险记录。
* `.trellis/spec/frontend/*.md` 承载长期稳定的 agent 约束，解决“以后类似任务都必须遵守什么规则”。
* `update.md` 只做外部可见的变更记录，不作为 roadmap 或 agent 约束的唯一来源。

推荐执行方式：

* 当前 `astro-bilingual-roadmap` task 作为总路线规划任务保留。
* 从 `v2.4.0` 开始，每个版本单独创建一个 Trellis task，例如：
  * `v2-4-publishing-hygiene`
  * `v2-5-i18n-polish`
  * `v2-6-site-architecture`
* 版本 task 的 `prd.md` 只写本版本范围，不把后续版本任务混进去。
* 若某类规则会跨多个版本反复出现，应提炼进 `.trellis/spec/frontend/`，而不是一直复制到每个 `prd.md`。

## Acceptance Criteria (evolving)

* 公开列表页不再暴露 demo/test 内容。
* 中英文文章页文案、日期、链路都符合各自语言。
* 每篇文章有稳定 canonical，并且双语配对正确。
* 新增营销页可直接承接 newsletter / service / product 转化。
* 站点可作为商业化内容平台对外发布。

## Out of Scope

* 不重做为 CMS 驱动。
* 不做复杂会员、登录、支付闭环。
* 不先追求视觉大改，优先信息架构与发布治理。

## Technical Notes

* 当前版本：Astro `^6.2.1`，已经具备双语、RSS、sitemap、robots 基础。
* 关键文件：`astro.config.mjs`、`src/components/Head/Head.astro`、`src/i18n/ui.ts`、`src/utils/publishSet.ts`、`src/pages/rss.xml.ts`、`src/pages/robots.txt.ts`。
* 现阶段更像“内容平台产品化”而不是“框架升级”。
