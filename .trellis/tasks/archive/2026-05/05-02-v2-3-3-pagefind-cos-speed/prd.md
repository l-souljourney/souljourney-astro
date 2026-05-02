# v2.3.3 pagefind scope and cos deploy speed

## Goal

在不处理 EdgeOne 规则的前提下，完成一轮最小但有效的发布性能优化：保留现有 Pagefind 搜索体验，只让搜索索引覆盖文章页正文，并把腾讯云 COS 主发布链路中的 `--delete` 移除，验证实际部署耗时是否明显下降。

## What I already know

* 当前搜索方案不是 Astro 官方内置搜索，而是：
  * `astro-pagefind` integration + `astro-pagefind/components/Search`
* `astro-pagefind` 当前在 `astro:build:done` 时直接对整个 `dist/` 执行 `index.addDirectory({ path: outDir })`
* 现有部署 workflow 在 `.github/workflows/deploy.yml` 中使用：
  * `coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive ...`
* 已有真实 run 证明慢点集中在 COS 同步：
  * `25243071252`：`upload 14`, `delete 0`, `102s`
  * `25243071633`：`upload 89`, `delete 40`, `1227s`
* 本地对比 `dist/` 结果显示，新增英文镜像稿后最大的 churn 来自：
  * `pagefind`：`43` 新增，`38` 删除
  * `vh_static`：`2` 新增，`2` 删除
* 用户当前决策：
  * 不改 EdgeOne 规则
  * 保留 Pagefind
  * 先以“文章正文索引 + 去掉主链路 delete”为本轮实现范围
* 用户要求本轮完成后直接 Git 推送，并回看 GitHub Actions 的真实发布耗时

## Assumptions (temporary)

* 旧的 `pagefind/` orphan files 在不执行 `--delete` 时不会影响当前搜索功能，只会占用存储空间。
* Pagefind 搜索结果只覆盖文章页，对当前博客站点是可接受的；分类页、标签页、首页不必纳入搜索索引。
* 继续保留 `script/edgeone-purge.js`，但不把 EdgeOne 配置调整纳入本轮代码实现。

## Open Questions

* 是否要在本轮顺手新增一个手动 cleanup workflow，用于后续回收旧 `pagefind/` 文件？

当前决策：

* 本轮不新增 cleanup workflow，先只验证主链路去掉 `--delete` 的收益。
* cleanup 作为下一轮可选项记录在 task 文档中。

## Requirements (evolving)

* 保留现有搜索 UI，不替换为其他搜索实现。
* 构建出的 Pagefind 索引只覆盖：
  * `/article/*`
  * `/en/article/*`
* 文章索引内容应聚焦正文，而不是整页布局杂项。
* 主部署 workflow 去掉 `--delete`，其余 COS 凭据、构建、purge 链路保持不变。
* 增加最小回归测试，锁住“只索引 article 路由”的 contract。
* 将 EdgeOne 后续规则建议保留在文档 / Trellis 研究记录中，不在本轮落地。

## Acceptance Criteria (evolving)

* [ ] `pnpm build` 成功
* [ ] 构建日志中的 `Pagefind indexed ... pages` 数量明显低于当前全站索引模式
* [ ] 新增测试通过，锁住 article-only Pagefind glob 约束
* [ ] deploy workflow 主链路不再携带 `--delete`
* [ ] 代码提交并推送后，`main` 上的 GitHub Actions run 可回读真实耗时

## Definition of Done (team quality bar)

* PRD、实现和验证记录完整
* 最小相关测试与构建验证完成
* 推送后回读 Actions 结果，避免只在本地宣称“应该会更快”

## Out of Scope (explicit)

* 本轮不调整 EdgeOne 规则
* 本轮不替换 Pagefind 为其他搜索引擎
* 本轮不处理旧对象清理策略的长期自动化
* 本轮不处理 Node 版本告警

## Technical Notes

* 搜索接入：
  * `astro.config.mjs`
  * `src/components/Search/Search.astro`
* 文章页面：
  * `src/pages/article/[...article].astro`
  * `src/pages/en/article/[...article].astro`
* 部署 workflow：
  * `.github/workflows/deploy.yml`
* 参考分析：
  * `.trellis/tasks/05-02-astro-cos-incremental-deploy/research/cos-deploy-analysis.md`
  * `.trellis/tasks/05-02-edgeone-html-cache-cos-optimization/research/cos-sync-root-cause.md`
  * `.trellis/tasks/05-02-edgeone-html-cache-cos-optimization/research/edgeone-cache-policy.md`
