# COS deploy analysis

## Scope

分析当前 Astro 构建产物同步到腾讯云 COS 的 GitHub Actions 行为，判断是否已经退化成全量发布，并识别慢发布的主要原因。

## Evidence

### 1. 当前 workflow 实现

文件：`.github/workflows/deploy.yml`

关键命令：

```sh
coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive --endpoint "cos.${COS_REGION}.myqcloud.com"
```

结论：

* 使用的是 `sync` 而不是裸 `cp`
* 打开了 `--delete`
* 每次都会扫描整个 `dist/` 与远端 bucket 前缀
* 从命令本身看，不足以证明“只处理变更文件且常数时间很小”

### 2. 2026-05-02 两次真实 push run 对比

#### Run 25243071252

* CreatedAt: `2026-05-02T03:49:02Z`
* UpdatedAt: `2026-05-02T03:51:41Z`
* Head SHA: `1afe4987d8a10ae6ccaa591a48c0db8d3d4ded36`
* Commit payload:
  * `src/content/blog/zh/v2-3-2-astro-demo.md` added

`deploy-cos` 关键统计：

* `Deploy to COS via coscli` step duration: `102s`
* `Total source num: 1078`
* `destination num: 1078`
* `object will be deleted count: 0`
* `upload 14 files`
* `skip 1004 files`
* `cost 100.544000(s)`

结论：

* 这次不是全量上传
* 但仍然扫描了全部 `1078` 个对象
* 单加一篇中文文章，也触发了 `14` 个对象上传和全量对象比对

#### Run 25243071633

* CreatedAt: `2026-05-02T03:49:03Z`
* UpdatedAt: `2026-05-02T04:10:24Z`
* Head SHA: `939be0cfd869a38d1a86937bae82e3416cf2e3c8`
* Commit payload:
  * `src/content/blog/en/v2-3-2-astro-demo.md` added

`deploy-cos` 关键统计：

* `Deploy to COS via coscli` step duration: `1227s`
* `Total source num: 1093`
* `destination num: 1078`
* `object will be deleted count: 40`
* `upload 89 files`
* `skip 939 files`
* `cost 1224.835000(s)`

异常现象：

* 日志在 `03:54:39Z` 到 `04:10:22Z` 之间几乎无进展
* 进度从 `87.896%` 长时间卡住，随后一次性到 `100%`

结论：

* 这次同样不是全量上传
* 但远端对象清理和更多对象 churn 明显放大了耗时
* 只补一篇英文镜像稿，就导致：
  * `+15` source objects
  * `+75` uploaded objects
  * `+40` deletions
  * 总耗时从 `102s` 飙到 `1227s`

### 3. Cloudflare / CDN 步骤现状

两次 run 的 `Purge CDN cache (optional)` 都输出：

* `CDN purge skipped: missing TEO or Cloudflare purge config`

环境缺失：

* `TEO_ZONE_ID` 空
* `TEO_PURGE_ENDPOINT` 空
* `TEO_PURGE_TOKEN` 空
* `CLOUDFLARE_ZONE_ID` 空
* `CLOUDFLARE_API_TOKEN` 空

结论：

* 当前 workflow 并没有真实执行 Cloudflare purge
* 用户说的“Cloudflare 拉取发布应该很快”更可能指 GitHub -> Cloudflare Pages 的外部自动部署链路，而不是这里的 workflow 步骤

### 3.1 当前线上站点状态

实时检查：

* `https://www.l-souljourney.cn/`
* `https://www.l-souljourney.cn/article/v2-3-2-astro-demo/`
* `https://www.l-souljourney.cn/en/article/v2-3-2-astro-demo/`
* `https://www.l-souljourney.cn/rss.xml`

结果：

* 首页已出现 `v2.3.2 Astro 双语发布联调 Demo`
* RSS 已包含该文章
* 中文 / 英文详情页均返回 `HTTP/2 200`

关键响应头：

* `server: tencent-cos`
* `eo-cache-status: MISS`
* `age: 0`

Last-Modified：

* 首页：`Sat, 02 May 2026 03:54:33 GMT`
* 中文文章页：`Sat, 02 May 2026 03:50:08 GMT`
* 英文文章页：`Sat, 02 May 2026 03:53:15 GMT`
* RSS：`Sat, 02 May 2026 03:54:21 GMT`

结论：

* 当前线上公开站点已经是新版本内容
* 当前抓到的响应不是“旧缓存命中”，而是 EdgeOne MISS 后从 COS 返回
* 因此“现在网页上没有最新文章”这个状态已经消失；若用户先前没看到，更像是：
  * 当时 deploy run 尚未完成
  * 或观察发生在传播窗口内
  * 而不是现在仍有长期缓存卡死

### 3.2 主域与 Pages 域名的缓存策略差异

对照：

* 主域：`https://www.l-souljourney.cn/`
* Pages：`https://souljourney-astro.pages.dev/`

观测：

* 两边首页正文都包含 `v2.3.2 Astro 双语发布联调 Demo`
* Pages 响应头：
  * `server: cloudflare`
  * `cache-control: public, max-age=0, must-revalidate`
* 主域响应头：
  * `server: tencent-cos`
  * 首页多次请求仍可见 `eo-cache-status: MISS`
  * 分类页可见 `eo-cache-status: HIT`
  * **没有显式 `Cache-Control`**

结论：

* Astro 构建产物本身没有缺失，Pages 和主域都能拿到新内容
* 主域链路在缓存控制上弱于 Pages
* 即使后续启用 CDN purge，若 HTML 没有明确的 `must-revalidate` / `no-cache` 策略，浏览器侧仍可能保留旧首页

### 3.3 前端侧缓存逻辑排查

代码搜索结果：

* 未发现 service worker / workbox / CacheStorage 持久缓存实现
* `src/layouts/Layout/Layout.astro` 使用了 `astro:transitions` 的 `ClientRouter`
* `localStorage` 只用于主题模式，不用于文章列表数据缓存

结论：

* 没有证据表明仓库自己实现了离线缓存或 HTML 数据缓存
* `ClientRouter` 可能导致同一浏览器会话中的页面快照复用，但不足以解释跨刷新长期旧首页
* 更高概率仍是主域 HTML 缓存策略 + 缺少 CDN purge 的组合问题

### 4. Workflow 历史变更

`git log -- .github/workflows/deploy.yml` 显示：

* 2026-02-15 从 `TencentCloud/cos-action@v1` 切到 `docker run tencentcom/coscli:latest`
* 2026-03-11 从 `cos.accelerate.myqcloud.com` 切到 `cos.<region>.myqcloud.com`
* 2026-04-08 / 2026-04-30 的修改主要是 `publish-health` 和验证逻辑，不是 COS 上传算法变化

结论：

* “最近突然从增量改成全量”的证据目前不足
* 更接近的真实情况是：
  * 实现一直是 `coscli sync`
  * 行为是“全量扫描 + 差异上传/删除”
  * 某些构建输出会让差异集合变大，导致极慢 run

### 4.1 本地工作区基线与线上不同步

本地检查：

* `git fetch github main`
* `git rev-list --left-right --count HEAD...github/main` -> `0 2`
* `git log --oneline HEAD..github/main`

结果：

* 本地 `main` 落后 `github/main` 两个提交：
  * `1afe498 chore(blog): publish v2-3-2-astro-demo`
  * `939be0c chore(blog): publish v2-3-2-astro-demo`

本地 `pnpm build` 结果：

* 构建成功
* 但输出路由不包含 `v2-3-2-astro-demo`
* 当前工作区只生成旧的 `souljourney` 和 `cursor-pool-failure-night-programming-god-fall` 文章路由

结论：

* 如果直接在当前工作区分析 dist 结果，会误判为“最新文章没有被构建”
* 真实原因是本地代码尚未 fast-forward 到线上最新 `main`
* 后续 Astro 优化实现前，必须先把工作基线对齐到 `github/main`

### 4.2 当前 purge 逻辑为什么永远跳过

仓库现状：

* workflow 代码支持：
  * `TEO_ZONE_ID + TEO_PURGE_ENDPOINT + TEO_PURGE_TOKEN`
  * 或 `CDN_DOMAIN + CLOUDFLARE_ZONE_ID + CLOUDFLARE_API_TOKEN`
* 实际 GitHub repo secret 只有：
  * `TENCENT_CLOUD_SECRET_ID`
  * `TENCENT_CLOUD_SECRET_KEY`
  * `COS_BUCKET`
  * `COS_REGION`
  * `CDN_DOMAIN`
* repo vars 只有：
  * `PRIMARY_DOMAIN`
  * `PAGES_DOMAIN`
* 缺少：
  * `TEO_ZONE_ID`
  * `TEO_PURGE_ENDPOINT`
  * `TEO_PURGE_TOKEN`
  * `CLOUDFLARE_ZONE_ID`
  * `CLOUDFLARE_API_TOKEN`

结论：

* 当前 purge 步骤不是“偶发失败”，而是**设计上必跳过**
* 如果不补配置，主域缓存刷新永远不会被 workflow 主动触发

### 4.3 官方能力边界

官方资料（主来源）：

* Tencent COSCLI 参数文档：`coscli sync` 支持：
  * `--snapshot-path`
  * `--meta`
  * `--skipmd5`
  * `--delete`
* Tencent EdgeOne 官方 API：`CreatePurgeTask`
  * 支持 `purge_all`
  * 支持按 host / prefix / URL 刷新

分析含义：

* 后续性能优化可以不止于 `coscli sync --delete`
  * 可先尝试 `snapshot-path` 降低全量扫描成本
  * 可给 HTML 对象加 `Cache-Control` metadata
* 后续缓存刷新也不必绑定当前自定义 `TEO_PURGE_ENDPOINT`
  * 理论上可改成官方 EdgeOne API 路线
  * 但仍需要 `ZoneId`，本地也没有 `tccli`

## Preliminary diagnosis

### 公开集合规则会放大第二次提交的输出变更

代码证据：

* `src/utils/publishSet.ts`
  * 只有 `zhEntries.length === 1 && enEntries.length === 1` 时，条目才会进入 `published` / `publishedByLang`
  * 否则进入 `pendingTranslation`
* `src/pages/[...page].astro`
  * 首页分页直接取 `getSortedPublishedBlogEntriesByLang(posts, "zh")`
* `src/pages/rss.xml.ts`
  * RSS 直接取 `getSortedPublishedBlogEntriesByLang(posts, 'zh')`
* `src/utils/publishedBlog.ts`
  * 公开集合统一委托给 `publishSet`

对 2026-05-02 两次 push 的解释：

* 第一次 run (`1afe498...`) 只新增中文稿，英文镜像还不存在
  * 该文章仍属于 `pendingTranslation`
  * 所以公开页面 churn 较小，最终只上传 `14` 个对象
* 第二次 run (`939be0c...`) 新增英文镜像稿
  * 这篇文章第一次满足“完整 zh/en 镜像对”
  * 于是会同时进入：
    * article route
    * 首页/分页
    * RSS
    * sitemap/search 等公开集合衍生物
  * 因此对象新增、替换、删除都会明显放大

这说明慢 run 不只是“加了一篇英文稿”，而是“完成了一对公开镜像稿，触发公开集合重排”。

### 已确认

1. 当前实现不是纯全量上传
2. 当前实现一定会做全量扫描
3. 当前线上站点已经发布出最新文章，构建结果对外可见
4. 本地工作区当前不是线上最新基线
5. 当前 workflow 不会执行任何实际 CDN purge
6. 主域 HTML 缺少显式 `Cache-Control`，缓存策略弱于 Pages
7. 慢发布主要发生在：
   * 远端需要删除旧对象时
   * 构建后对象集合变化明显增大时
   * `coscli` 某些阶段出现长时间停顿时

### 高概率根因排序

1. **Astro 构建产物 churn 太大**
   * 新增英文镜像稿后，该对文章首次进入 `publishSet` 的正式公开集合
   * 首页、分页、RSS、搜索、sitemap 等衍生输出会一起变化
   * 哈希文件名会让“少量内容变更”转化成“多对象新增 + 多对象删除”

2. **`coscli sync --delete` 的远端对比/删除阶段开销大**
   * 慢 run 明确有 `40` 个对象待删
   * 删除和比对都依赖远端对象列表与 API 往返

3. **`coscli` 容器方案本身缺少更细粒度控制与缓存**
   * 每次 runner 都重新拉镜像
   * 没有把对象 diff 前移到 workflow 中做更精细裁剪
   * 日志显示存在长时间停顿，工具内部重试不可见

4. **主域 HTML 缓存控制不足**
   * 主域没有像 Pages 那样返回 `must-revalidate`
   * 即使部署完成，浏览器或部分边缘节点仍可能继续提供旧首页

5. **区域 endpoint 的吞吐/稳定性可能一般，但不是唯一根因**
   * 同一 endpoint 下仍然既有 `102s` 也有 `1227s`

## Suggested next-version direction

推荐把新版本范围收敛为：

### Option C (recommended)

两条发布面都保留，但本版本只解决 COS 增量与耗时治理。

理由：

* 用户当前痛点明确在 COS
* Cloudflare 不是当前 workflow 的主阻塞点
* 不需要同时改公开架构，风险更小

### Candidate work items

1. 在 build 后产物层面统计对象清单，确认哪些页面/资源在单稿双语发布时被连带改动
2. 先修主域缓存一致性：
   * 激活 EdgeOne purge
   * 给 HTML 资源写显式 `Cache-Control`
3. 评估把 `dist/` 中高 churn 文件与稳定资源拆分发布
4. 评估去掉直接 `sync --delete`，改成：
   * 显式 diff
   * 批量上传 changed/new
   * 独立删除 stale
5. 给 deploy job 增加更细的 telemetry：
   * changed file count
   * deleted file count
   * 大文件列表
   * 单步骤耗时
6. 在正式改发布逻辑前，先对齐本地基线到 `github/main`，避免基于旧 dist 做错误判断
7. 如果 COS 继续作为主站面，评估更稳定的上传工具/参数，而不是继续黑盒使用当前 `coscli` 容器

## Open question for scope lock

新版本更建议先做：

* `A` 只优化当前 `coscli sync` 参数和可观测性
* `B` 重写 COS 发布为“先 diff 再 upload/delete”的显式增量流程
* `C` 降低 COS 在公开发布中的权重，把它退为镜像/资源层
