# Astro 商业化双语内容平台路线图

**日期：** 2026-05-04
**当前代码版本：** `package.json = v2.3.4`
**目标版本带：** `v2.4.0 -> v2.8.0 -> v3.0.0`
**适用范围：** Souljourney Blog 从双语发布 demo 升级为商业化内容平台

---

## 1. 路线图定位

这份路线图不负责描述单次开发任务的所有实现细节，它负责回答：

* 这个 Astro 站接下来要升级成什么
* 为什么先做哪些版本，再做哪些版本
* 每个版本要解决的核心业务问题是什么
* 每个版本完成后，站点能力会提升到什么阶段

配套执行原则：

* `docs/plans/` 管跨版本 roadmap
* `.trellis/tasks/<task>/prd.md` 管单版本执行范围
* `.trellis/spec/frontend/*.md` 管长期稳定约束

版本号口径：

* `v2.4.0` 起为商业化主线版本；`v2.4` 仅作为历史技术阶段参考
* 单边 / 未翻译内容可以保留为草稿或预览，但不进入公开集合

---

## 2. 当前现状判断

当前站点已经不是从零开始：

* 已有 Astro `^6.2.1`、双语路由、文章页、归档、分类、RSS、sitemap、robots、基础 i18n。
* 发布入口已经具备最小可用性，但整体更像“联调成功的发布站”，不是“正式商业化内容平台”。
* 当前最大问题不是框架能力缺失，而是：
  * 发布治理还不够严格
  * 英文站原生感不足
  * 首页和静态页还没有承担转化职责
  * 服务 / 产品 / 法务 / SEO / 变现闭环还没建立

所以版本策略必须遵循：

**先打地基，再补语言，再做承接页，再做增长，再接商业化。**

---

## 3. 产品目标

目标不是做一个“更好看的博客”，而是做一个：

```text
中文内容资产库
+ 英文出海内容实验场
+ 个人品牌主站
+ 服务转化入口
+ 数字产品承接页
+ 搜索 / 订阅 / 社媒导流中心
```

因此版本规划要围绕用户路径展开：

```text
搜索/社媒发现
-> 首页/Start Here 建立认知
-> About/文章/专题建立信任
-> Newsletter/Services/Products 承接转化
-> Legal/SEO/Tracking 支撑长期商业化
```

---

## 4. 版本规划总览

```text
v2.4.0 发布治理版
v2.5.0 双语体验版
v2.6.0 信息架构版
v2.7.0 增长转化版
v2.8.0 SEO 与商业化就绪版
v3.0.0 商业发布版
```

---

## 5. 各版本说明

### v2.4.0 发布治理版

**目标：** 让站点从“技术联调站”进入“正式可公开发布状态”。

**核心问题：**

* demo/test 内容暴露在首页、归档、RSS、sitemap
* 文章页存在重复 H1
* legacy slug 没有稳定重定向
* RSS / sitemap / robots / canonical 缺少系统性核验

**版本范围：**

* 新增 `draft` / `noindex` / `excludeFromHome` / `excludeFromRSS` / `excludeFromSitemap`
* 统一首页、归档、RSS、sitemap、文章详情页静态路径的可见性规则
* 单边 / 未翻译内容仅保留为草稿或预览，不进入首页、归档、RSS、sitemap 或搜索索引
* 支持 legacy slug / alias redirect
* 修复重复 H1 与公开内容语义问题
* 验证 robots / sitemap / canonical / RSS 真实输出

**版本价值：**

* 搜索引擎看到的是“干净正式站”
* 用户不会先看到测试稿
* 后续所有版本都建立在稳定发布口径之上

---

### v2.5.0 双语体验版

**目标：** 让英文站看起来像独立维护的英文产品，而不是中文镜像页。

**核心问题：**

* 英文 UI 仍有中文残留
* 分类、日期、阅读时长、版权等展示规则不统一
* 双语 canonical / hreflang 还未完全制度化

**版本范围：**

* 建立集中式 i18n 字典
* 分类名、UI 标签、作者信息、CTA、版权文本双语化
* 英文日期格式独立
* 清理英文模板中的中文残留
* 补齐所有双语文章对的 canonical + hreflang

**版本价值：**

* 英文用户首次访问时不会产生“半成品翻译站”观感
* SEO 的多语言语义更稳定

---

### v2.6.0 信息架构版

**目标：** 把“博客”升级为“内容平台”。

**核心问题：**

* 首页和归档是内容列表，但缺少明确导读结构
* 缺少 Start Here、Newsletter、Services、Products 等承接页面
* About 还没有承担品牌与信任职责

**版本范围：**

* 新增 `Start Here`
* 重写 `About`
* 新增 `Newsletter`
* 新增 `Services`
* 新增 `Products`
* 新增 `Contact / Privacy / Terms / Refund Policy`

**版本价值：**

* 任何来源的新访客都能快速理解站点定位
* 站点具备对外商业化承接所需的页面骨架

---

### v2.7.0 增长转化版

**目标：** 让内容页和首页不再只是阅读终点，而是转化入口。

**核心问题：**

* 首页缺少战略入口
* 文章页缺少“下一步行动”
* 缺少作者、系列、相关推荐等留存设计

**版本范围：**

* 首页 hero
* Newsletter CTA
* Service CTA
* Related Articles
* Series Navigation
* Author Card
* 点击埋点事件

**版本价值：**

* 内容站开始承担订阅、咨询、购买前的转化任务
* 可开始评估哪些内容和页面在带来有效线索

---

### v2.8.0 SEO 与商业化就绪版

**目标：** 为搜索流量、广告和数字产品支付做好制度化准备。

**核心问题：**

* SEO 元信息与结构化数据未完全产品化
* AdSense / GSC / Paddle 所需页面与验证位不完整
* 缺少广告位和商品元数据占位

**版本范围：**

* OpenGraph / Twitter cards
* JSON-LD Article schema
* sitemap validation
* `ads.txt`
* Google Search Console verification
* AdSense-ready layout slots
* Paddle compliance pages 与 product metadata

**版本价值：**

* 站点具备被稳定收录、审核和接入商业工具的基础条件

---

### v3.0.0 商业发布版

**目标：** 正式进入“内容 + 服务 + 产品 + 流量”组合模式。

**进入条件：**

* 发布治理稳定
* 英文站可独立对外
* 核心承接页已上线
* SEO / tracking / legal / product 页面具备上线条件

**版本重点：**

* 不是继续铺基础设施，而是验证商业闭环
* 可以开始关注：
  * newsletter 转化
  * service inquiry 转化
  * product click / checkout 转化
  * 搜索与社媒导流质量

---

## 6. 推荐节奏

### 第 1 阶段：0-14 天

完成 `v2.4.0`

目标：

* 站点不再暴露 demo/test 痕迹
* 搜索引擎入口干净
* 为后续版本打稳定基线

### 第 2 阶段：15-30 天

完成 `v2.5.0 + v2.6.0`

目标：

* 英文站原生感明显提升
* Start Here / About / Newsletter / Services / Products / Legal 页面可用

### 第 3 阶段：31-60 天

完成 `v2.7.0`

目标：

* 首页和文章页具备清晰转化路径
* 可以收集基础行为数据

### 第 4 阶段：61-90 天

完成 `v2.8.0`，准备 `v3.0.0`

目标：

* SEO / 广告 / 产品支付材料齐备
* 进入正式商业化验证阶段

---

## 7. 执行约束

* 每个版本单独创建一个 Trellis task，不把多个版本混写到同一个 `prd.md`
* 版本 PRD 只写本版本范围、验收与验证
* 跨版本稳定规则必须回写 `.trellis/spec/frontend/`
* 根级 `update.md` 只记录对外变更，不承担执行约束角色

---

## 8. 下一步

当前推荐直接进入：

* `v2.4.0 发布治理版`

对应 Trellis task：

* `.trellis/tasks/05-04-v2-4-publishing-hygiene/`
