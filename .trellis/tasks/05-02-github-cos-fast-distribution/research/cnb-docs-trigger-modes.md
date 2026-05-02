# CNB 文档能力边界：GitHub 触发 CNB 构建/部署

## Scope

基于 CNB 官方文档与官方插件页面，确认以下问题：

* CNB 构建是否必须依赖 CNB 仓库
* 是否支持从 GitHub 导入/同步代码到 CNB
* 是否支持 API / 自定义事件触发
* 是否支持按指定分支和指定 commit SHA 构建
* 对本仓库最合适的 GitHub -> CNB 设计是什么

## Sources

* Trigger Rules: <https://docs.cnb.cool/en/build/trigger-rule.html>
* Built-in Plugin: <https://docs.cnb.cool/en/build/internal-steps.html>
* Migration Tools: <https://docs.cnb.cool/en/guide/migration-tools.html>
* Git Sync plugin: <https://cnb.cool/cnb/plugins/tencentcom/git-sync>
* git-clone plugin: <https://cnb.cool/cnb/plugins/tencentcom/git-clone/-/blob/74cb9181ec15f44b70c3915e388863fbdcf49e3f/README.md>
* Open API: <https://docs.cnb.cool/zh/openapi.html>

## Key findings

### 1. CNB 是“仓库中心”的流水线，不是纯执行器

Trigger Rules 文档写得很直接：

* CNB 接收到事件后，会从**对应仓库、对应分支**读取 `.cnb.yml`
* 再解析该分支下对应事件的流水线配置

证据：

* Trigger Rules 文档第 172-173 行：CNB receives events and retrieves `.cnb.yml` from the corresponding branch of the repository
* 第 213-217 行：实际执行依赖触发分支上的 `.cnb.yml`

结论：

* **CNB 不是“没有仓库也能直接跑项目构建”的一等模型**
* 如果想走 CNB 原生触发与流水线，CNB 侧需要有一个仓库项目

### 2. CNB 支持导入 GitHub 仓库，也支持 Git 平台同步

Migration Tools 文档说明：

* `CNB Code Import` 支持从 GitHub 等第三方平台迁移仓库到 CNB
* `Git Sync` 是跨 Git 平台同步代码的插件

证据：

* Migration Tools 文档第 116-128 行

结论：

* CNB 官方提供的正统做法之一，就是先把 GitHub 仓库导入/同步到 CNB

### 3. Git Sync 官方插件明确支持“GitHub Actions -> CNB 仓库”

Git Sync 官方插件页面给了直接示例：

* 在 GitHub Actions 中运行 `tencentcom/git-sync`
* 目标仓库可写成 `https://cnb.cool/username/repo.git`

证据：

* Git Sync 页面第 86-107 行：GitHub Actions push mode 同步到 CNB Repository
* 第 125-146 行：GitHub Actions rebase mode 同步到 CNB Repository

两种模式：

1. `push` 模式
   * 直接把源仓库内容推到目标仓库
   * 适合目标仓库完全由 GitHub 镜像控制

2. `rebase` 模式
   * 保留目标仓库上的特定文件
   * 官方明确举例：适合从 GitHub 同步到 CNB 时保留 `.cnb.yml`

证据：

* 第 70-72 行：push mode 直接推送
* 第 108-110 行：rebase mode 适合保留 `.cnb.yml`

结论：

* **GitHub -> CNB 镜像仓库** 是官方插件明确支持的模式

### 4. CNB 支持 API 触发自定义事件

Trigger Rules 文档说明：

* 支持 `api_trigger` 自定义事件
* 触发方式包括：
  * `cnb:apply`
  * `cnb:trigger`
  * OPENAPI

证据：

* Trigger Rules 第 418-432 行

结论：

* GitHub Actions 在同步代码到 CNB 后，完全可以再调用 CNB API 触发一次专用部署事件

### 5. CNB 支持指定 branch 和 commit SHA 触发构建

最关键的能力在 Built-in Plugin 文档里：

`cnb:trigger` 支持：

* `slug`
* `event`
* `branch`
* `sha`
* `env`
* `sync`

证据：

* Built-in Plugin 第 648-655 行：参数列表里包含 `branch` 和 `sha`
* 第 683-694 行：
  * `branch` 默认目标仓库主分支
  * `sha` 为触发分支中的 CommitId，默认取分支最新提交

Trigger Rules 文档也确认：

* `api_trigger` 的版本可以指定

证据：

* Trigger Rules 第 548-560 行的 Code Version Selection 表：
  * `api_trigger` -> `Version can be specified`

结论：

* **CNB 不只是“按分支头构建”，而是具备“按指定 commit SHA 构建”的能力**
* 虽然这里的直接参数说明来自 `cnb:trigger` 内置任务，但 Trigger Rules 明确说 `cnb:apply` / `cnb:trigger` 是 OPENAPI 的 wrapper，因此可合理推断 OPENAPI 也支持相同的版本选择能力

> 上面最后一句属于基于官方文档结构的推断，不是我已经拿到具体 OPENAPI schema 字段名的直接证据。

### 6. 如果完全不想把业务代码镜像到 CNB，也可以用“控制仓库 + git-clone”

官方 `git-clone` 插件支持：

* 在 CNB 流水线里 clone 任意 HTTPS Git 仓库

证据：

* git-clone README 第 34-42 行：原理是 `git clone https://{user}:{password}@{url}`
* 第 66-85 行：需要 `git_url`, `git_user`, `git_password`

这意味着：

* 你可以在 CNB 里只保留一个“控制仓库”
* `.cnb.yml` 里通过 GitHub token 去 clone GitHub 仓库，再 checkout 指定 SHA 后构建

但这不是最优。

原因：

* 每次构建都要从 GitHub 重新拉源码
* 速度和稳定性不如“CNB 本地镜像仓库”
* 还要在流水线里自己写 checkout SHA 逻辑

## Architecture options

### Option A1. GitHub -> CNB 镜像仓库，CNB `push` 自动构建

链路：

```text
GitHub main push
  -> GitHub Actions 质量门
  -> GitHub Actions 用 tencentcom/git-sync 推送到 CNB mirror repo
  -> CNB mirror repo 收到 push
  -> CNB 按 main.push 执行 build / deploy COS / purge EdgeOne
```

优点：

* 最贴近 CNB 原生模型
* 最少自己写触发逻辑
* 代码已在 CNB 仓库内，构建体验和旧链路最接近

缺点：

* 如果使用 `rebase` 保留 `.cnb.yml`，CNB 提交 SHA 可能和 GitHub SHA 不一致
* 如果使用 `push` 模式，需要把 `.cnb.yml` 放回 GitHub 源仓库，一起同步过去

适合：

* 想要最简单恢复“腾讯云侧构建快”的能力

### Option A2. GitHub -> CNB 镜像仓库，随后 API 触发 `api_trigger` 指定 SHA 部署

链路：

```text
GitHub main push
  -> GitHub Actions 质量门
  -> GitHub Actions 同步代码到 CNB mirror repo
  -> GitHub Actions 调 CNB OPENAPI / api_trigger
     branch=main
     sha=$GITHUB_SHA
  -> CNB 在 main.api_trigger 下执行 build / deploy
```

优点：

* 质量门与部署触发解耦
* 可显式要求“只部署这一个 SHA”
* 以后容易扩展手动回滚、重发指定版本

缺点：

* 比 A1 多一层 API 触发逻辑
* 需要处理 CNB token 和 API 调用

适合：

* 要求更强的可审计性和可回滚性

### Option B. CNB 控制仓库 + git-clone GitHub 源仓库

链路：

```text
GitHub main push
  -> GitHub Actions 调 CNB api_trigger
  -> CNB 控制仓库流水线启动
  -> git-clone 拉 GitHub 仓库
  -> git checkout 指定 SHA
  -> build / deploy
```

优点：

* GitHub 更像唯一仓库，CNB 不存业务代码镜像

缺点：

* 不是 CNB 最顺手的模式
* 每次都要从 GitHub 拉源码
* 性能和稳定性通常不如镜像仓库

适合：

* 极度不想维护 CNB mirror repo

## Recommendation for this repository

### 结论

对你们这个仓库，**最好的方式不是“CNB 纯构建无 Git”**，而是：

**GitHub 为唯一代码源 + CNB 保留一个 mirror repo + GitHub Actions 负责把通过质量门的 commit 同步到 CNB。**

然后再分两档：

#### 推荐 1：最实用版本

* CNB mirror repo
* GitHub Actions 用 `tencentcom/git-sync` 同步 `main`
* CNB 的 `main.push` 自动 build/deploy

如果你愿意把 `.cnb.yml` 放回 GitHub 仓库：

* 用 `push` 模式更好
* 这样 Git commit SHA 与 GitHub 保持一致

如果你坚持 `.cnb.yml` 只留在 CNB：

* 用 `rebase` 模式
* 官方文档也明确说这是保留 `.cnb.yml` 的典型场景
* 但要接受 CNB 侧 SHA 可能与 GitHub SHA 不完全一致

#### 推荐 2：治理更强版本

* 仍然使用 CNB mirror repo
* GitHub 同步成功后，再调 CNB `api_trigger`
* `.cnb.yml` 用 `main.api_trigger`
* 显式指定 `branch + sha`

这个版本最适合：

* 要做严格“某个 SHA 才允许发布”
* 要支持未来手动回滚到旧 SHA

## Final judgment

用户提出的判断是对的：

* **CNB 如果完全没有 Git 项目，不能很好地承载这个方案。**

但更准确地说，不是“CNB 必须是主仓库”，而是：

* **CNB 需要至少有一个 repository 作为流水线承载点。**

对这个仓库，最佳工程解法不是“无仓库纯执行器”，也不是“回到旧 CNB 主入口”，而是：

**GitHub 主仓库 -> 同步到 CNB mirror repo -> 由 CNB 仓库触发或 API 触发构建部署。**
