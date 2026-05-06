# v2.4.0 publishing hygiene

## Goal

把当前 Astro 双语站从“联调成功但仍带测试痕迹的发布站”，升级为“正式可公开发布的内容站基线版本”，为后续 i18n、页面架构、增长和商业化改造提供稳定底座，同时收口 docs / roadmap / prompt 的版本与公开规则口径。

该版本必须基于真实链路定义，而不是只按 Astro 单仓视角定义：

`Obsidian Plugin -> wxengine /api/blog/publish -> GitHub content update -> Astro build/deploy`

## Why Now

当前站点已经具备双语路由、RSS、sitemap、robots、文章页与归档等能力，但仍存在以下问题：

* demo/test 内容可能进入首页、归档、RSS、sitemap
* 文章页存在重复 H1 风险
* 旧 slug 缺少稳定 redirect 方案
* RSS / sitemap / robots / canonical 尚未形成完整校验闭环

如果不先解决这些问题，后续所有版本都会建立在不干净的公开发布口径上。

## Scope

### In Scope

* 统一 docs / roadmap / prompt 的版本口径：
  * `v2.x` 作为历史技术底座
  * `v2.4.0` 作为商业化主线起点
* 收敛公开文档导航与历史归档入口，避免活跃文档和历史路线图混用
* 扩展 blog frontmatter schema：
  * `draft`
  * `noindex`
  * `excludeFromHome`
  * `excludeFromRSS`
  * `excludeFromSitemap`
  * `legacy_slugs` 或等价 alias 字段
* 统一公开内容过滤逻辑：
  * 首页
  * 归档
  * RSS
  * sitemap
  * 文章详情路由
* 增加 legacy slug redirect 支持
* 修复文章页重复 H1 问题
* 校验 canonical / robots / RSS / sitemap 输出
* 明确新增 frontmatter 字段在 Obsidian Plugin / wxengine / Astro 三侧的责任边界与最小对齐要求

### Out of Scope

* 不做大规模首页视觉改版
* 不做 Start Here / Newsletter / Services / Products 页面
* 不处理完整 i18n 重构
* 不接入广告 / Paddle / GSC

## User / Business Outcome

* 用户首次访问不会先看到 demo/test 内容
* 搜索引擎不会抓到不应公开的测试内容
* 旧外链和旧 slug 有更高概率落到正确页面
* 后续版本可以在稳定发布集合上继续演进

## Technical Plan

### 1. 内容 schema 与发布规则

* 在 `src/content.config.ts` 增加新字段
* 在 `src/utils/publishSet.ts` 建立统一过滤口径
* 明确：
  * `draft` -> 不公开
  * `excludeFromHome` -> 首页不显示
  * `excludeFromRSS` -> RSS 不显示
  * `excludeFromSitemap` -> sitemap 不显示
  * `noindex` -> 页面输出 `robots=noindex`

### 1.1 上游链路对齐要求

* Obsidian Plugin 是 frontmatter/YAML 的真实入口
* wxengine 会重新生成并写回 Astro frontmatter，不是简单透传
* 因此 `draft/noindex/excludeFromHome/excludeFromRSS/excludeFromSitemap/legacy_slugs` 若要进入正式推送链路，必须：
  * 插件 payload 支持透传
  * wxengine publish contract 支持接收
  * wxengine frontmatter builder 支持落盘
  * Astro schema / publishSet 支持消费

### 2. 公开页面消费统一口径

* 首页 / 归档不再各自用分散条件过滤
* RSS 与 sitemap 必须复用同一套公开集合规则
* legacy 内容 alias 通过统一 helper 处理

### 3. 文章页结构清理

* 页面级 H1 只保留一个
* 若正文首行与标题重复，优先在渲染链路做标准化处理或在模板层规避重复展示

### 4. 回归验证

* `pnpm build`
* `pnpm check:publish-health`
* 相关 `node:test`
* 验证 RSS / sitemap / robots / canonical 输出契约

## Acceptance Criteria

* [ ] `docs/README.md` 的活跃文档 / 历史归档分层清晰，`v2.x` 不再与当前执行主线混列
* [ ] 商业化主线与历史技术底座的版本号口径在 roadmap / docs / prompt 中一致
* [ ] demo/test 内容不再出现在首页
* [ ] demo/test 内容不再进入归档
* [ ] `excludeFromRSS` 内容不进入 RSS
* [ ] `excludeFromSitemap` 内容不进入 sitemap
* [ ] `draft` / `noindex` 内容不进入 sitemap
* [ ] legacy slug 可以稳定重定向到 canonical slug
* [ ] 每篇文章页面只保留一个语义 H1
* [ ] `pnpm build` 与 `pnpm check:publish-health` 通过

## Evidence Targets

完成时需要记录：

* 影响文件
* 核心命令与结果
* 若存在风险项，写清楚哪些内容文件需要补 frontmatter

## Related Specs

* `.trellis/spec/frontend/index.md`
* `.trellis/spec/frontend/quality-guidelines.md`
* `.trellis/spec/frontend/type-safety.md`
* `.trellis/spec/frontend/publishing-commercialization-guidelines.md`
* `docs/astro-wxengine-publish-contract-v2.2.md`
* `docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md`
