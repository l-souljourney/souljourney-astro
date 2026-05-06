# Publishing & Commercialization Guidelines

> 这份规范服务于“把 Astro 双语博客升级成商业化内容平台”的连续版本开发。重点不是单次页面实现，而是确保后续所有 agent 在发布治理、i18n、SEO、转化入口上遵循同一套长期规则。

---

## When To Read

以下场景必须阅读本文件：

* 改 blog frontmatter schema
* 改首页、归档、分类、RSS、sitemap、robots、canonical、hreflang
* 改 Start Here / About / Newsletter / Services / Products / Legal 页面
* 改 author card、CTA、埋点、商业化入口
* 改英文站文案、日期、分类映射

---

## Product Direction

站点目标不是“更完整的个人博客”，而是：

```text
内容资产中心
+ 双语品牌官网
+ 海外获客承接页
+ 服务转化页
+ 数字产品入口
```

所以开发判断标准应优先考虑：

* 是否提升公开内容质量
* 是否提升中英文站的信任感
* 是否为订阅 / 联系 / 购买创造下一步动作
* 是否避免技术联调痕迹暴露给搜索引擎和陌生访客

---

## Publishing Governance Rules

### Single Source of Truth

所有公开内容口径必须通过统一 publish helper 进入，禁止页面自行定义“公开条件”。

至少这些输出必须共享同一套内容治理逻辑：

* 首页
* 归档
* 分类 / 标签聚合页
* RSS
* sitemap
* 文章详情静态路径
* 搜索索引

### Recommended Content Flags

blog frontmatter 未来默认支持：

* `draft`
* `noindex`
* `excludeFromHome`
* `excludeFromRSS`
* `legacy_slugs` 或等价 alias 字段
* `series`
* `featured`

### Visibility Contract

建议语义：

* `draft=true`：不进入任何公开入口
* `noindex=true`：页面可访问，但输出 `robots=noindex`
* `excludeFromHome=true`：不进首页
* `excludeFromRSS=true`：不进 RSS
* legacy slug：必须有 canonical 目标

### Forbidden

* 在某个页面里单独 hardcode “隐藏测试文章”的条件
* RSS / sitemap 与首页使用不同可见性规则
* 直接用 `getCollection("blog")` 结果作为公开页面输出，不经过 shared helper

---

## Bilingual Experience Rules

### Language Quality

英文站必须看起来像独立维护的英文产品，而不是中文模板镜像。

重点检查：

* 分类名
* 日期格式
* 阅读时长
* 作者信息
* CTA
* 版权与法律页
* 空状态文案

### Canonical / Hreflang

规则：

* 中文页 canonical 指向中文自身
* 英文页 canonical 指向英文自身
* 只有存在镜像稿件时才输出对应 `hreflang`
* 不允许用 canonical 把中英文互相折叠到一个 URL

### Forbidden

* 英文页保留大段中文文案
* 日期、版权、作者信息混杂语言
* 镜像稿件缺失时仍输出错误 `hreflang`

---

## Conversion Architecture Rules

### Required Entry Pages

当站点进入商业化内容平台阶段，应逐步具备：

* Start Here
* About
* Newsletter
* Services
* Products
* Contact
* Privacy
* Terms
* Refund Policy

### Page Role

这些页面不是“补齐站点地图”的静态页面，而是各自承担角色：

* Start Here：新访客导读
* About：品牌与信任
* Newsletter：订阅承接
* Services：高客单人工服务承接
* Products：数字产品承接
* Legal：支付、广告、平台审核合规

### Forbidden

* 只增加页面文件，不定义业务目标
* About 仍停留在传统个人博客自我介绍
* Services / Products 页面没有明确 CTA

---

## Growth Component Rules

后续版本若增加以下组件：

* Hero
* Newsletter CTA
* Service CTA
* Related Articles
* Series Navigation
* Author Card

要求：

* 必须明确组件服务的是哪一步用户路径
* 优先做可复用组件，不在多个页面复制 CTA 结构
* 若引入埋点，事件名要统一命名并可文档化

---

## SEO & Monetization Rules

### Minimum Readiness

面向商业化前，至少要稳定支持：

* OpenGraph
* Twitter cards
* JSON-LD Article schema
* sitemap validation
* `ads.txt`
* GSC verification slot
* 法律页齐全

### Ad / Payment Readiness

* 广告位默认可占位，但必须默认关闭
* 支付 / 商品页必须先有 legal 页面，再做流量导入
* 商品页要有清晰的产品描述、支持方式、退款说明

### Forbidden

* 在没有 legal / support / product metadata 的情况下直接接 Paddle / 广告申请
* 广告组件默认全站打开

---

## Review Checklist

提交前至少检查：

* 公开内容入口是否仍然统一走 shared publish rule
* 中英文页面是否都符合各自语言语义
* 新增页面是否有明确业务职责，而不是仅补空壳
* canonical / hreflang / RSS / sitemap 是否仍然自洽
* 新增 CTA / author card / services / products 是否具备明确下一步动作
