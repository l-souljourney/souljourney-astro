# edgeone html cache policy and cos optimization

## Goal

在不重新扰动当前已恢复稳定的主发布链路前提下，完成第二轮发布治理规划：一是为 `www.l-souljourney.cn` 设计长期可维护的 EdgeOne HTML / RSS / Sitemap 缓存策略，降低首页更新感知延迟；二是基于真实构建产物差异和 GitHub Actions 运行证据，确认 COS 发布变慢的真正原因，并收敛下一步优化实现范围。

## What I already know

* 当前生产链路已恢复稳定：
  * `github/main` 最新提交包含：
    * `25a1ca6 fix(deploy): refresh edgeone cache after cos sync`
    * `55dcd0d fix(deploy): remove unsupported coscli cp flag`
    * `a0961a8 fix(deploy): drop slow html metadata refresh`
* 当前生产 workflow 保留：
  * `coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive --endpoint "..."`
  * `node ./script/edgeone-purge.js`
* 成功 run `25244782171` 中：
  * `deploy-cos` 总时长约 `2m13s`
  * `Deploy to COS via coscli` 约 `120s`
  * `Purge EdgeOne cache` 成功
* 当前线上请求真实头部：
  * 首页 `https://www.l-souljourney.cn/` 返回 `HTTP/2 200`
  * `server: tencent-cos`
  * `last-modified: Sat, 02 May 2026 05:30:51 GMT`
  * 首次请求 `eo-cache-status: MISS`，随后重复请求可见 `eo-cache-status: HIT`
  * 当前未返回显式 `Cache-Control`
* 腾讯云官方文档已确认：
  * EdgeOne 可分别配置 `节点缓存 TTL`、`浏览器缓存 TTL`、`修改 HTTP 节点响应头`
  * 规则引擎优先级高于站点加速全局配置；多条同级规则时，下方规则覆盖上方规则
  * `Hostname` / `目录` 类型刷新默认为“标记过期”，若缓存了 `ETag` / `Last-Modified`，后续请求会带条件请求头回源校验
* 当前仓库构建产物目录结构包含：
  * HTML 路由：`/`, `/article/*`, `/categories/*`, `/tag/*`, `/en/*`
  * 机器文件：`rss.xml`, `en/rss.xml`, `sitemap-0.xml`, `sitemap-index.xml`, `robots.txt`
  * 静态资源：`vh_static/`, `assets/`, `pagefind/`
* COS 变慢的核心证据已经补强：
  * `25243071252`（仅推中文稿）：
    * `coscli` 约 `102s`
    * `upload 14`
    * `skip 1004`
    * `delete 0`
  * `25243071633`（补齐英文镜像稿）：
    * `coscli` 约 `1227s`
    * `upload 89`
    * `skip 939`
    * `delete 40`
* 本地对比 `1afe498` 与 `939be0c` 两个提交的 `dist/` 后得到：
  * `added 50`
  * `deleted 40`
  * `changed 39`
  * 其中：
    * `pagefind`：`43` 新增、`38` 删除、`1` 变更
    * `vh_static`：`2` 新增、`2` 删除
    * 新页面本身只占很小一部分：`article/` 新增 `1`、`en/article/` 新增 `1`、`tag/` 新增 `1`、`en/tag/` 新增 `2`
* 这说明慢 run 不是“全量上传”，而是：
  * Pagefind 分片索引大规模换名
  * 少量带 hash 的样式文件换名
  * 再叠加 `sync --delete` 对远端旧对象执行清理

## Assumptions (temporary)

* 首页偶发看不到新文章，当前更像 HTML 缓存策略弱化和发布窗口传播体验问题，而不是当前仍然构建失败。
* 第二轮优先不改主发布介质，仍以 COS + EdgeOne 为主公开链路。
* 若要进一步压缩发布耗时，单独拆出“删除陈旧对象”会比继续在主链路上追加二次上传更有效。

## Open Questions

* HTML 层最终策略采用哪一种更稳：
  * A. 主要用 `浏览器缓存 TTL` 控制 HTML 为“不缓存”，再单独给静态资源长缓存
  * B. 主要用 `修改 HTTP 节点响应头` 直接设置 `Cache-Control: public, max-age=0, must-revalidate`
  * C. 两者结合，但要避免规则互相覆盖导致排障困难
* `pagefind/` 是否应该继续跟正文同一批次发布，还是拆成次级发布步骤
* `sync --delete` 是否应移出日常 push 主链路，改为手动 / 定时 cleanup

当前偏好结论：

* HTML / RSS / Sitemap 更适合采用 `修改 HTTP 节点响应头` 明确下发 `Cache-Control: public, max-age=0, must-revalidate`，并保留 `Purge EdgeOne cache`。
* `浏览器缓存 TTL` 更适合做兜底或对静态目录做粗粒度控制。
* COS 性能优化第一优先级应放在减少 `pagefind` churn 带来的上传 + 删除放大，而不是继续追加 metadata 覆写。

## Requirements (evolving)

* 基于腾讯云官方文档，产出一份可直接照着点控制台的 EdgeOne 配置教程。
* 规则设计必须区分：
  * HTML 路由
  * RSS / Sitemap / robots
  * `pagefind/`
  * `vh_static/`
  * `assets/`
* 明确每类资源推荐的：
  * 节点缓存 TTL
  * 浏览器缓存 TTL 或 `Cache-Control`
  * 是否建议配合刷新 / 预刷新
* 基于真实构建产物差异，明确导致慢 run 的根因排序，并区分：
  * 真实新增页面
  * 全站索引重切片
  * hash 文件换名
  * `--delete` 清理旧对象
* 为后续实现阶段收敛最小改动范围：
  * 可能改动 `.github/workflows/deploy.yml`
  * 可能新增专用分析脚本
  * 可能新增独立 cleanup workflow
  * 可能新增构建产物 churn 报告
* 顺手记录 Node 版本告警处理项，但不让其抢占主目标。

## Acceptance Criteria (evolving)

* [ ] 有一份基于腾讯云官方文档的 EdgeOne 配置方案，能直接指导控制台操作
* [ ] 明确解释为什么首页 HTML 需要与静态资源使用不同缓存策略
* [ ] 有一份基于真实 `dist` diff 的 COS 变慢根因分析，而不是只引用 GitHub Actions 总耗时
* [ ] 明确下一轮实现优先级和边界，避免再次把缓存刷新与主发布性能耦合处理
* [ ] Trellis 任务文档、research 和 context 记录完整

## Definition of Done (team quality bar)

* 关键结论均可追溯到命令输出或官方文档
* 后续实现所需受影响文件已被明确列出
* 若进入实现阶段，最小验证口径已预先定义

## Out of Scope (explicit)

* 本轮不直接修改生产缓存规则
* 本轮不重构 Astro 内容模型
* 本轮不更换主发布平台
* 本轮不创建 release / tag

## Technical Notes

* 生产 workflow：`.github/workflows/deploy.yml`
* 生产 purge 脚本：`script/edgeone-purge.js`
* 相关测试：`tests/edgeone-purge.test.mjs`
* 上一轮分析：`.trellis/tasks/05-02-astro-cos-incremental-deploy/research/cos-deploy-analysis.md`
* 本轮新增研究：
  * `research/edgeone-cache-policy.md`
  * `research/cos-sync-root-cause.md`
* GitHub Actions 关键 run：
  * `25243071252`
  * `25243071633`
  * `25244782171`
* 本轮本地验证口径：
  * `curl -I https://www.l-souljourney.cn/`
  * `gh run view ... --json jobs,...`
  * 双提交 `pnpm build` + `dist` 清单对比
