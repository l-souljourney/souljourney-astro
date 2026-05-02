# analyze astro cos incremental deploy regression

## Goal

基于当前 `souljourney-astro` 仓库的真实 workflow 与 GitHub Actions 运行记录，确认 Astro 构建后发布到腾讯云 COS 的流程是否退化为“全量发布”，定位发布过慢的根因，并为后续一个新的 Trellis 版本收敛可执行的修复方向。

## What I already know

* 用户观察到：最近从 Obsidian 推送双语 Astro 文章到 GitHub 很快，但 Astro 构建后同步到 COS 很慢。
* 当前发布 workflow 位于 `.github/workflows/deploy.yml`。
* `deploy-cos` 当前执行命令为：
  * `coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive --endpoint "cos.${COS_REGION}.myqcloud.com"`
* 2026-05-02 的两次 `deploy.yml` push run 都成功，但耗时差异极大：
  * run `25243071252`：总时长约 2 分 39 秒，`deploy-cos` 中 `coscli` 耗时 `102s`
  * run `25243071633`：总时长约 21 分 21 秒，`deploy-cos` 中 `coscli` 耗时 `1227s`
* 慢的那次不是“所有文件都重传”：
  * 总对象 `1093`
  * 上传 `89`
  * 跳过 `939`
  * 删除 `40`
* 快的那次也不是零成本：
  * 总对象 `1078`
  * 上传 `14`
  * 跳过 `1004`
  * 删除 `0`
* 说明当前 COS 步骤仍然表现为“扫描全量 + 仅上传差异对象”，但在特定变更集下会退化到极慢。
* 当前 workflow 的 CDN 刷新步骤实际上没有执行成功发布后的 Cloudflare purge：
  * `CLOUDFLARE_ZONE_ID` 和 `CLOUDFLARE_API_TOKEN` 为空
  * 最终日志为 `CDN purge skipped`
* 当前 GitHub repo secrets / vars 状态：
  * 已存在 secrets：`TENCENT_CLOUD_SECRET_ID`、`TENCENT_CLOUD_SECRET_KEY`、`COS_BUCKET`、`COS_REGION`、`CDN_DOMAIN`
  * 已存在 vars：`PRIMARY_DOMAIN=www.l-souljourney.cn`、`PAGES_DOMAIN=souljourney-astro.pages.dev`
  * 不存在：`TEO_ZONE_ID`、`TEO_PURGE_ENDPOINT`、`TEO_PURGE_TOKEN`、`CLOUDFLARE_ZONE_ID`、`CLOUDFLARE_API_TOKEN`
* 线上站点 `https://www.l-souljourney.cn/` 当前已经能看到 `v2.3.2 Astro 双语发布联调 Demo`，`/rss.xml` 也已包含该文章。
* 线上 HTTP 头显示当前响应直接来自 `server: tencent-cos`，并经过 EdgeOne：
  * `eo-cache-status: MISS`
  * `age: 0`
  * 首页 `last-modified: Sat, 02 May 2026 03:54:33 GMT`
  * 中文文章页 `last-modified: Sat, 02 May 2026 03:50:08 GMT`
  * 英文文章页 `last-modified: Sat, 02 May 2026 03:53:15 GMT`
* `www.l-souljourney.cn` 和 `souljourney-astro.pages.dev` 当前正文都包含 `v2.3.2` 新文章，但两者缓存头不同：
  * Pages 返回 `Cache-Control: public, max-age=0, must-revalidate`
  * 主域从 COS/EdgeOne 返回的 HTML 没有显式 `Cache-Control`
* 仓库中没有 service worker / workbox / CacheStorage 持久缓存逻辑；布局层启用了 `astro:transitions` 的 `ClientRouter`。
* 本地工作区当前落后 `github/main` 两个提交：
  * `1afe498 chore(blog): publish v2-3-2-astro-demo`
  * `939be0c chore(blog): publish v2-3-2-astro-demo`
* 因为本地未 fast-forward，到当前工作区执行 `pnpm build` 只会生成旧公开集合，不会包含 `v2.3.2` 文章路由；这不等于线上构建失败。
* 文档 `docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md` 记录的是高层工作流，不包含 COS 增量优化实现。
* 历史文档 `docs/archive/history/v2.0.0-deploy-test-log.md` 记录了从 `TencentCloud/cos-action` 切换到 `coscli sync` 的原因，但没有证明“当前实现已经足够快”。

## Assumptions (temporary)

* 用户提到的“以前一直是增量发布”，更接近“体感上只传变更文件且整体很快”，不一定代表实现层面完全避免全量扫描。
* 本次新版本优先修复 COS 发布性能，不把 Obsidian -> GitHub 推送链路纳入主要改造范围。
* Cloudflare Pages 拉取部署仍由外部系统自动完成，不在当前 workflow 内显式执行。

## Open Questions

* 新版本目标是：
  * A. 继续保留 COS 为主发布面，先补官方 EdgeOne purge 与 HTML 缓存控制，再单独处理 `coscli sync` 性能
  * B. 让 Cloudflare 成为主要公开发布面，COS 只做资源/镜像补充
  * C. 两者都保留，但先只做 COS 增量与耗时治理

当前决策：

* 采用 A 的第一阶段落地：不改主发布面，先修复主域缓存刷新链路。
* 2026-05-02 线上联调追加结论：
  * `coscli sync` 后再用 `coscli cp` 覆写 `html/xml/txt` metadata 的方案已验证过
  * 第一轮失败点是 `coscli cp` 不支持 `--force`
  * 去掉 `--force` 后第二轮不再报参数错误，但 metadata 覆写步骤耗时过长，不适合作为当前生产方案
  * 当前回退策略：保留官方 EdgeOne purge，移除 metadata 覆写，先验证 CDN 刷新是否已经足够解决首页陈旧问题

## Requirements (evolving)

* 基于真实日志确认当前 COS 步骤是否为“全量上传”还是“全量扫描 + 差异上传”。
* 基于线上站点真实返回结果，区分“构建失败”“发布未完成”“CDN 缓存未刷新”“本地版本基线落后”这几类现象。
* 确认“首页旧、分类页新”的现象更像哪一层缓存导致：
  * EdgeOne POP 缓存
  * 浏览器 HTML 缓存
  * ClientRouter 内存快照
* 定位导致慢 run 的主要因素：
  * 构建产物变更数量
  * `--delete` 触发的远端清理
  * `coscli` 本身的扫描/重试/单线程开销
  * Astro 构建产物命名或输出策略导致的大量对象 churn
* 评估是否需要同时做两类修复：
  * 激活 CDN purge
  * 给 HTML 输出显式缓存控制，避免浏览器长期持有旧首页
* 当前实现先收敛为：
  * 新增官方 EdgeOne `CreatePurgeTask` Node 脚本
  * workflow 先仅保留 `coscli sync` + EdgeOne purge
  * purge 目标默认取 `PRIMARY_DOMAIN`，缺失时回退 `CDN_DOMAIN`
* HTML 缓存控制的最终方案后续单独处理：
  * 需要避免在发布路径里增加一条明显放大发布耗时的二次上传
* 明确真实上线联调所需最小额外配置：
  * `TEO_ZONE_ID`（repo variable 优先；secret 兼容）
* 形成一个新的 Trellis 版本范围，明确：
  * 最小修复目标
  * 受影响文件
  * 验证口径

## Acceptance Criteria (evolving)

* [ ] 明确给出当前实现是否“全量上传”的结论，并附 run 证据
* [ ] 明确给出“线上没看到最新文章”在本次事件里的真实状态与证据
* [ ] 明确给出导致慢 run 的主要可疑根因排序
* [ ] 明确给出下一版本建议范围，而不是停留在现象描述
* [ ] 官方 EdgeOne purge 脚本与 workflow 改动完成本地可验证实现
* [ ] 明确线上联调的唯一缺失配置项

## Definition of Done (team quality bar)

* 分析结论已写回 task 文档
* 关键 run / workflow / 日志证据可追溯
* 若进入实现阶段，补最小相关验证并通过

## Out of Scope (explicit)

* 本轮不重写 `coscli sync` 算法，也不承诺直接解决慢同步
* 本轮不处理 Obsidian 插件逻辑
* 本轮不创建 GitHub PR / release / tag

## Technical Notes

* 本地 workflow：`.github/workflows/deploy.yml`
* 历史参考：`docs/archive/history/v2.0.0-deploy-test-log.md`
* 工作流收敛背景：`docs/plans/2026-05-01-v2-3-1-astro-obsidian-bilingual-workflow.md`
* 本轮实现文件：
  * `script/edgeone-purge.js`
  * `tests/edgeone-purge.test.mjs`
  * `.github/workflows/deploy.yml`
  * `package.json`
* GitHub run：
  * `25243071252` (`1afe4987d8a10ae6ccaa591a48c0db8d3d4ded36`)
  * `25243071633` (`939be0cfd869a38d1a86937bae82e3416cf2e3c8`)
* 本地验证：
  * `git fetch github main`
  * `git rev-list --left-right --count HEAD...github/main`
  * `pnpm build`
