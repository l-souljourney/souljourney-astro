# EdgeOne cache policy

## Scope

基于腾讯云 EdgeOne 官方文档，为 `www.l-souljourney.cn` 设计一套适合当前 Astro 静态博客的缓存策略，目标是：

* 首页和文章页发布后能稳定 revalidate
* RSS / sitemap 不需要手动二次上传 metadata
* 静态资源保持较高命中率
* 与当前已上线的 `purge_host` 工作流兼容

## Current observations

### Live headers

命令：

```sh
curl -I -s https://www.l-souljourney.cn/
curl -I -s https://www.l-souljourney.cn/article/v2-3-2-astro-demo/
```

关键结果：

* `server: tencent-cos`
* `last-modified` 存在
* `etag` 存在
* 当前未返回显式 `Cache-Control`
* 首页首次请求 `eo-cache-status: MISS`，重复请求可命中 `HIT`

结论：

* 现在已经具备条件请求校验所需的 `ETag` / `Last-Modified`
* 但 HTML 层缺少明确的浏览器缓存表达，导致行为不如 Cloudflare Pages 清晰

## Official doc findings

### 1. Node cache TTL

腾讯云官方说明：

* `节点缓存 TTL` 决定资源是否在 EdgeOne 节点缓存以及缓存时长。
* 若源站资源更新后需要立刻更新节点缓存，可用 `清除缓存` 主动清理旧缓存。
* 对整个站点的默认策略是：遵循源站 `Cache-Control`；若源站无该头，则遵循 EdgeOne 默认缓存策略。

对当前站点的含义：

* 不能只依赖默认策略，因为当前 COS 返回 HTML 没有显式 `Cache-Control`
* 需要对 HTML 类资源做单独规则，避免策略不透明

### 2. Browser cache TTL

腾讯云官方说明：

* `浏览器缓存 TTL` 默认遵循源站 `Cache-Control`
* 若源站无 `Cache-Control`，EdgeOne 默认“不做任何更改”或“全局兜底不缓存”
* 支持三类配置：
  * 遵循源站
  * 不缓存
  * 自定义时间

对当前站点的含义：

* 这是一个粗粒度、适合“整类资源”的控制项
* 但如果直接用它统一治理整站，会让 HTML 与静态资源难以分层

### 3. Modify HTTP response headers

腾讯云官方说明：

* 可自定义设置/增加/删除 HTTP 节点响应头
* 修改 HTTP 节点响应头不会影响节点缓存
* `Cache-Control` 可设置，但不支持删除

对当前站点的含义：

* 这是最适合给 HTML / RSS / sitemap 明确补 `Cache-Control` 的能力
* 可以在不改变节点缓存逻辑的前提下，把浏览器行为固定为可预期模式

### 4. Rule engine priority

腾讯云官方说明：

* 规则引擎优先级高于站点加速侧全局配置
* 多条同级规则从上到下执行；若同时命中，下方规则覆盖上方规则

对当前站点的含义：

* 可以把“全局兜底规则”放上面
* 把更细粒度的 `/pagefind/`、`/vh_static/`、`/assets/` 放下面覆盖

### 5. Cache purge semantics

腾讯云官方说明：

* `Hostname` / `目录` / `全部缓存` 这类刷新默认为“标记过期”
* 若节点缓存了 `ETag` / `Last-Modified`，下次请求会携带条件头回源校验
* `URL` 刷新默认为“直接删除”

对当前站点的含义：

* 你当前 workflow 里使用 `purge_host` 是合理的
* 它比对大量 URL 逐条 purge 更适合静态博客整站更新
* 只要 HTML 响应头策略清晰，`purge_host` 足以支持发布后快速 revalidate

## Recommended policy

以下是建议方案，其中“官方文档支持”与“工程建议”需区分：

### A. HTML / 路由页

匹配范围：

* `/`
* `/about/`
* `/archives/`
* `/article/*`
* `/categories/*`
* `/tag/*`
* `/en/`
* `/en/about/`
* `/en/archives/`
* `/en/article/*`
* `/en/categories/*`
* `/en/tag/*`

建议：

* 节点缓存 TTL：`5m` 到 `10m`
* 修改 HTTP 节点响应头：设置 `Cache-Control: public, max-age=0, must-revalidate`
* 发布后继续执行 `purge_host`

原因：

* HTML 需要允许浏览器每次校验，不能长时间静态持有旧首页
* 节点仍可保留短 TTL，配合 `purge_host` 降低首次回源窗口
* 当前线上已具备 `ETag` / `Last-Modified`，适合走条件回源

### B. RSS / Sitemap / robots

匹配范围：

* `/rss.xml`
* `/en/rss.xml`
* `/sitemap-index.xml`
* `/sitemap-*.xml`
* `/robots.txt`

建议：

* 节点缓存 TTL：`5m`
* 修改 HTTP 节点响应头：设置 `Cache-Control: public, max-age=0, must-revalidate`
* 发布后继续执行 `purge_host`

原因：

* 这类文件体积小，但对搜索引擎和订阅器的实时性感知高
* 没必要为它们单独增加二次上传 metadata 步骤

### C. `pagefind/`

匹配范围：

* `/pagefind/*`

建议：

* 节点缓存 TTL：`1d`
* 浏览器缓存 TTL：`1h` 到 `1d`
* 暂不建议长期缓存到 `30d+`

原因：

* `pagefind/` 在新增镜像文章时存在明显的大规模换名
* 浏览器缓存太长容易让搜索索引与页面正文不同步
* 节点层仍可保留较高命中

### D. `vh_static/`

匹配范围：

* `/vh_static/*`

建议：

* 节点缓存 TTL：`30d`
* 浏览器缓存 TTL：`7d` 到 `30d`

原因：

* 这里的文件名已带 hash，更适合长缓存
* 即使发布产生新 hash，旧文件也可通过独立 cleanup 回收

### E. `assets/`

匹配范围：

* `/assets/*`

建议：

* 节点缓存 TTL：`7d`
* 浏览器缓存 TTL：`1d` 到 `7d`

原因：

* 当前 `assets/` 下不全是 hash 文件，也包含图片和静态素材
* 不建议像 `vh_static/` 一样直接给到超长浏览器缓存

## Console tutorial

### 方案 1：先做一个可落地的最小修复

1. 登录 EdgeOne 控制台。
2. 进入 `服务总览 -> 网站安全加速 -> l-souljourney.cn`。
3. 打开 `站点加速 -> 规则引擎`。
4. 创建一条空白规则，最外层先匹配 `HOST = www.l-souljourney.cn`。
5. 在该规则下新增多个 IF 条件：
   * IF `URL 路径` 匹配 HTML 路由集合：
     * 操作 1：`节点缓存 TTL = 5m`
     * 操作 2：`修改 HTTP 节点响应头`
       * 类型：设置
       * 头部名称：`Cache-Control`
       * 头部值：`public, max-age=0, must-revalidate`
   * IF `URL 路径` 为 `/rss.xml`、`/en/rss.xml`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`
     * 同样设置 `节点缓存 TTL = 5m`
     * 同样设置 `Cache-Control: public, max-age=0, must-revalidate`
6. 再创建第二条规则，放在第一条规则下方，匹配：
   * `URL 路径` 以 `/vh_static/` 开头
   * 操作：`节点缓存 TTL = 30d`
   * 操作：`浏览器缓存 TTL = 自定义 7d`
7. 再创建第三条规则，放在第二条规则下方，匹配：
   * `URL 路径` 以 `/pagefind/` 开头
   * 操作：`节点缓存 TTL = 1d`
   * 操作：`浏览器缓存 TTL = 自定义 1h`
8. 再创建第四条规则，放在第三条规则下方，匹配：
   * `URL 路径` 以 `/assets/` 开头
   * 操作：`节点缓存 TTL = 7d`
   * 操作：`浏览器缓存 TTL = 自定义 1d`
9. 保存并发布。
10. 发布后执行一次 `Hostname = www.l-souljourney.cn` 的清除缓存，确认新规则立即生效。

### 规则排序说明

依据腾讯云文档：

* 规则引擎覆盖站点加速全局配置
* 多条同级规则下方覆盖上方

因此建议：

* 上方放 HTML / RSS 这类默认兜底规则
* 下方放 `/vh_static/`、`/pagefind/`、`/assets/` 这种更细粒度路径规则

## Why not use only Browser TTL

这部分是工程判断，不是腾讯云文档原话：

* 如果只用浏览器缓存 TTL 统一管理整站，HTML 与静态资源会共用一套表达，后续排障不够直观。
* 用 `修改 HTTP 节点响应头` 单独给 HTML 补 `Cache-Control`，能让首页与文章页的浏览器行为变得明确，并且不影响节点缓存。
* 对静态目录继续用 TTL 规则，更符合其“同类资源批量治理”的特点。

## Rollout / verify

建议验证顺序：

1. 发布规则前，记录：

```sh
curl -I -s https://www.l-souljourney.cn/ | rg 'cache-control|etag|last-modified|eo-cache-status'
```

2. 发布规则后，重复执行同命令，确认出现预期 `Cache-Control`
3. 触发一次发布，观察：
   * 首页是否在 purge 后快速返回新内容
   * `eo-cache-status` 是否从 `MISS` 变为 `HIT`
   * 浏览器强刷与普通刷新是否都能拿到最新文章

## Sources

* 节点缓存 TTL：<https://cloud.tencent.com/document/product/1552/70777>
* 浏览器缓存 TTL：<https://cloud.tencent.com/document/product/1552/70758>
* 修改 HTTP 节点响应头：<https://cloud.tencent.com/document/product/1552/71011>
* 规则引擎概览：<https://cloud.tencent.com/document/product/1552/70901>
* 清除缓存（刷新缓存）：<https://cloud.tencent.com/document/product/1552/70759>
