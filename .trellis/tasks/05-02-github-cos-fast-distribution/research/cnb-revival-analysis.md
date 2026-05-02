# CNB 旧链路回读与恢复必要性分析

## Scope

根据仓库中的历史文档、Git 历史和旧 `.cnb.yml`，确认过去 CNB 构建/发布链路的真实形态，分析它为什么快，以及今天是否值得恢复。

## Repo evidence

### 1. 2.0 迁移文档明确写了“目标是替代 CNB 构建”

文件：`docs/archive/history/2.0-GitHub-Deploy-Migration.md`

关键原文：

* `目标：替代 CNB 构建，实现 GitHub Actions 自动部署`
* `当前项目使用 CNB (cnb.cool) 进行构建部署`
* `CNB → GitHub 同步依赖 token（已泄露，已修复）`
* `部署链路冗余：CNB → GitHub → COS → EdgeOne`
* `目标架构：GitHub 为唯一代码源，通过 GitHub Actions 直接部署到 Cloudflare Pages 和腾讯云 COS`

结论：

* 当时迁移离开 CNB，不只是为了“统一写法”，而是出于：
  * 代码源单一化
  * 凭据安全
  * 链路简化

### 2. CTO 审计文档确认了 CNB 的旧流水线结构

文件：`docs/archive/history/cto-comprehensive-review-2026-02-10.md`

关键原文：

* `.cnb.yml` 的完整流程为 build → deploy to github → deploy to cos → refresh edgeone cache`
* `部署架构：CNB → COS → EdgeOne CDN，完整自动化`
* `CI 加入测试阶段 | .cnb.yml`

结论：

* CNB 旧链路的确已经具备：
  * 构建
  * 推 GitHub
  * 推 COS
  * 刷 EdgeOne
* 但测试能力薄弱，当时连 CI 质量门都不完整

### 3. 删除前最后一版 `.cnb.yml` 显示：CNB 是主入口，不是 GitHub

证据命令：

```bash
PRE_DELETE=$(git rev-parse f715ed1^)
git show ${PRE_DELETE}:.cnb.yml
```

对应提交：`97cbd6665a9c5a93baab5594226f65b673f22691`

关键内容：

* `main.push` 触发 CNB 流水线
* stage 顺序为：
  1. `build project`
  2. `deploy to github`
  3. `deploy to cos`
  4. `refresh edgeone cache`
* `deploy to github` 脚本中明确执行：

```sh
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/l-souljourney/souljourney-astro.git"
git push origin HEAD:main
```

* `deploy to cos` 使用：

```sh
coscli sync dist/ "cos://${COS_BUCKET}/" --delete --force --disable-crc64 --recursive
```

结论：

* 从仓库内最后留存的证据看，CNB 时代的真实主链路是：

```text
CNB 仓库 push
  -> CNB build
  -> CNB push GitHub
  -> CNB sync COS
  -> CNB purge EdgeOne
```

* 这和“GitHub 是唯一入口，GitHub push 后再触发 CNB 构建”不是同一个架构
* 如果你记忆中后来变成了 `GitHub -> CNB`，那部分更可能是平台侧配置或仓库外同步规则；仓库里没有直接证据证明它已经被提交保存

### 4. 2.0 删除 `.cnb.yml` 的提交说明也是“清理冗余构建配置”

证据命令：

```bash
git show --stat --summary f715ed1
```

提交：`f715ed1 chore: 移除冗余构建配置并更新文档 (v2.0.0)`

结论：

* 当时的设计决策不是“CNB 坏了才删”，而是主动把它视为冗余链路清理掉

## Why CNB felt fast

基于旧 `.cnb.yml` 和当前问题，可以合理解释 CNB 快的原因：

### A. 构建和上传都在腾讯云侧

CNB 本质上在国内云环境执行：

* `pnpm build` 在 CNB 侧跑
* `coscli sync` 也在 CNB 侧跑

这天然避开了今天 GitHub-hosted runner 到国内 COS 的公网同步长尾。

### B. 构建机离 COS 更近

即使旧链路也用 `coscli sync --delete`，它仍然会：

* 扫描远端
* 做差异上传
* 删除旧对象

但这些请求是在腾讯云近端发起，不是 GitHub 公网 runner 发起，所以延迟和抖动显著更小。

### C. 使用了国内镜像和缓存

删除前最后一版 `.cnb.yml` 里有：

* `pnpm config set registry https://mirrors.cloud.tencent.com/npm/`
* `copy-on-write` volumes / pnpm cache

这也解释了为什么用户体感里“构建和发布都很快”。

## What you would get back if you restore CNB

如果恢复 CNB 侧构建部署，你大概率会重新获得：

1. 国内侧构建稳定性
2. 到 COS 的近端同步速度
3. EdgeOne purge 与 COS 部署在同一平台收口

也就是说，**从纯速度角度，恢复 CNB 很可能是有效的。**

## What you would re-introduce

但恢复 CNB 不是“只拿回速度，不带副作用”。

### 1. GitHub 不再是唯一真实入口

这是 2.0 当时明确要解决的问题。

一旦 CNB 重新成为构建入口，你就会重新面对：

* 仓库源头在哪边算准
* 哪边是发布真相
* 发生回滚时以哪边为准

### 2. 再次引入跨平台 Git 同步与凭据风险

迁移文档明确记了：

* `CNB → GitHub 同步依赖 token（已泄露，已修复）`

如果恢复类似结构，就要重新处理：

* GitHub token 在第三方平台保存
* force push / 历史分叉
* 同步失败时的状态一致性

### 3. 质量门可能再次分裂

旧 CNB 流水线被 CTO 审计指出：

* 没有完整 test 阶段
* PR 检查薄弱

如果恢复 CNB，但不把今天 GitHub 这边已有的 `publish-health`、检查脚本、后续测试门禁同步过去，就会出现：

* GitHub 过一套
* CNB 过另一套

最后变成“双 CI、双真相”。

## Decision framing

### 方案 A：完全恢复 CNB 为主入口

含义：

* 回到 CNB 构建、CNB 部署、CNB 推 GitHub 的模式

优点：

* 大概率最快

缺点：

* 直接回滚 2.0 的核心架构决策
* 再次引入 token 与双源管理问题

结论：

* 不推荐直接完整恢复

### 方案 B：GitHub 为唯一代码源，CNB 只做“受控部署执行器”

含义：

* GitHub 仍是唯一代码源
* `main` push 后，由 GitHub 触发或通知 CNB
* CNB 只负责：
  * 拉 GitHub 当前 commit
  * build
  * deploy to COS
  * purge EdgeOne

优点：

* 速度接近旧 CNB 方案
* 保留 GitHub 作为唯一代码源
* 比旧的 `CNB -> GitHub` 更干净

缺点：

* 仍然是双平台
* 要重新设计触发、鉴权和状态回传

结论：

* 如果你们已经有成熟的 CNB 项目和触发能力，这是可以认真考虑的路线

### 方案 C：不恢复 CNB，直接上 Tencent self-hosted runner

含义：

* GitHub 仍是唯一平台控制面
* 只把 deploy 执行位置迁到腾讯云 CVM

优点：

* 解决当前慢点
* 不重新引入 CNB 作为第二控制面
* workflow、日志、权限、分支规则仍然集中在 GitHub

缺点：

* 需要维护 runner 机器

结论：

* 从“治理复杂度 / 可维护性 / 保持单一控制面”的平衡上，这仍是更稳的方案

## My recommendation

如果只看速度，恢复 CNB 很可能有效。

但如果看你们在 2.0 之后已经建立的工程方向，我不建议“回到旧 CNB 主入口模式”。

更合理的判断是：

* **如果你们手里现成就有一个稳定的 CNB 项目，而且能做到 GitHub 为唯一源、CNB 只做受控构建部署执行器，那么它值得列为和 self-hosted runner 并列的候选方案。**
* **如果恢复意味着重新回到 `CNB -> GitHub` 或双向同步，那不值得。**

## Practical conclusion

当前应该比较的不是：

* `GitHub Actions` vs `CNB`

而是：

1. `GitHub + Tencent self-hosted runner`
2. `GitHub as source of truth + CNB as downstream deploy executor`

这两个方案本质上都在解决同一个问题：

**把“构建 + COS 同步”搬回腾讯云侧执行。**

区别只在于：

* self-hosted runner：控制面仍在 GitHub
* CNB：引入第二个平台作为执行控制面
