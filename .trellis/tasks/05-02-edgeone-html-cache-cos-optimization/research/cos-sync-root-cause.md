# COS sync root cause

## Scope

确认当前腾讯云 COS 发布慢的真实原因，区分：

* 是否全量上传
* 哪些产物变化真正放大了上传/删除数量
* 哪些因素适合进入下一轮优化

## Evidence

### 1. 当前 workflow 行为

文件：`.github/workflows/deploy.yml`

关键命令：

```sh
coscli sync /workspace/dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive --endpoint "cos.${COS_REGION}.myqcloud.com"
```

从腾讯云官方文档可确认：

* `sync` 会先对比同名文件的 `crc64`，相同则不传输
* `--delete` 会删除目标路径中额外存在的文件
* `--snapshot-path` 可以保存快照，用于下一次增量同步并加速目录同步
* 未使用 `--snapshot-path` 时，会产生额外 `HEAD` 请求；首次生成快照也会产生，非首次则不会

结论：

* 当前行为不是“无脑全量重传”
* 但仍是“全量扫描 + 差异上传/删除”
* 当前主路径尚未利用 `--snapshot-path`

## 2. GitHub Actions run evidence

### Run 25243071252

* commit: `1afe4987d8a10ae6ccaa591a48c0db8d3d4ded36`
* `deploy-cos` 约 `102s`
* `upload 14`
* `skip 1004`
* `delete 0`

### Run 25243071633

* commit: `939be0cfd869a38d1a86937bae82e3416cf2e3c8`
* `deploy-cos` 约 `1227s`
* `upload 89`
* `skip 939`
* `delete 40`

### Run 25244782171

* commit: `a0961a883f79e02fa04adb84754164bee304c431`
* `deploy-cos` 约 `120s`
* `Purge EdgeOne cache` 约 `2s`

结论：

* 真正慢的是 `coscli sync`
* `EdgeOne purge` 不是慢点
* 只要上传/删除集合变小，当前生产链路是可以回到 2 分钟级别的

## 3. Build artifact diff

为避免只看 run 总时长，本地对两个提交分别构建并比较 `dist/`：

### Commands

```sh
git worktree add /tmp/.../zh-only 1afe4987d8a10ae6ccaa591a48c0db8d3d4ded36
git worktree add /tmp/.../zh-en 939be0cfd869a38d1a86937bae82e3416cf2e3c8
pnpm install --frozen-lockfile
pnpm build
```

### Build summary

* `zh-only`：`34` pages built，Pagefind indexed `34` pages
* `zh-en`：`39` pages built，Pagefind indexed `39` pages

### Manifest diff

结果：

* `added 50`
* `deleted 40`
* `changed 39`

分桶：

* `pagefind`
  * `43` 新增
  * `38` 删除
  * `1` 变更
* `vh_static`
  * `2` 新增
  * `2` 删除
* `article`
  * `1` 新增
  * `2` 变更
* `en`
  * `3` 新增
  * `17` 变更
* `tag`
  * `1` 新增
  * `7` 变更

关键观察：

* `新增文章页面本身` 不是大头
* 最大 churn 来自 `pagefind` 分片、索引和 meta 文件换名
* 其次是 `vh_static` 下少量带 hash 的 CSS 文件换名
* 这与 GitHub run 中的 `upload 89` / `delete 40` 精确对应：
  * `50` 新增 + `39` 变更 = `89` 上传
  * `40` 删除 = 远端清理对象数

## 4. Root cause ranking

### P1. Pagefind 文件换名导致大规模对象 churn

证据最强。

只要收录页数变化，`pagefind/fragment/*`、`pagefind/index/*`、`pagefind/pagefind.*.pf_meta` 就会批量换名。对 COS 来说，这不是“改内容”，而是“新增一批 + 删除一批”。

### P2. `sync --delete` 把 churn 直接放大成远端删除成本

如果没有 `--delete`，慢 run 至少不会再承担 `40` 个对象删除。

这并不意味着主链路应永久不删，而是日常 push 发布不应默认承担 cleanup 成本。

### P3. 未使用 `--snapshot-path`

官方文档明确指出 `--snapshot-path` 可用于加速目录同步；当前 workflow 未启用，意味着每次都需要重新做远端比对。

这更像“放大器”，不是首因，但值得进入实现验证。

### P4. `vh_static` 少量 hash 文件换名

存在，但影响远小于 `pagefind/`。

## 5. What is not the root cause

* 不是 EdgeOne purge 慢
* 不是“全量上传全部 1000+ 文件”
* 不是本次生产环境构建失败
* 不是 HTML metadata 覆写缺失本身导致 COS 同步变慢

## 6. Optimization directions

### Option A. 从主发布路径移除 `--delete`

建议优先级：最高

方式：

* push 主链路只做差异上传
* 单独做手动或定时 cleanup job

预期收益：

* 直接消除慢 run 里的远端删除成本
* 避免每次发布都承担 pagefind 旧分片回收

### Option B. 验证 `--snapshot-path`

建议优先级：高

方式：

* 在 workflow cache 或 artifact 中持久化快照目录
* 对比启用前后的 `coscli` 耗时和 HEAD 请求表现

风险：

* GitHub Actions 的临时 runner 需要额外持久化机制
* 如果快照失效，仍可能退回到完整比对

### Option C. 拆分 `pagefind/` 发布

建议优先级：中

方式：

* 页面正文先发布
* 搜索索引在次级步骤或次级 workflow 更新

收益：

* 正文上线速度更稳定

代价：

* 搜索会有短暂滞后

### Option D. 做构建 churn 报告

建议优先级：中

方式：

* 对连续两次 build 输出 path + size + hash diff
* 每次发布自动产出对象变化分类统计

收益：

* 后续每次性能回退都能快速定位是正文、pagefind 还是 hash 文件

## 7. Recommendation

下一轮实现建议顺序：

1. 从主 workflow 中拆出 cleanup，不再让 push 主链路默认承担 `--delete`
2. 给 `coscli sync` 试验 `--snapshot-path`
3. 增加 build churn 报告，持续量化 `pagefind/` 影响
4. 如仍波动明显，再评估拆分 `pagefind/` 发布

## Sources

* COSCLI `sync` 官方文档：<https://cloud.tencent.com/document/product/436/63670>
