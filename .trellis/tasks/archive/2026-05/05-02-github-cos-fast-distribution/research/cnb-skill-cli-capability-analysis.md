# 安装 cnb-skill + cnb-cli 后，AI 对 CNB 配置工作的提升边界

## Scope

回答用户问题：

* 如果在当前环境安装 `cnb-cli` 和 `cnb-skill`
* 并阅读 `https://docs.cnb.cool/zh/llms.txt`

那么 AI 是否能更直接完成 CNB 相关配置工作，以及仍然需要用户手动处理哪些内容。

## Sources

* `https://docs.cnb.cool/zh/llms.txt`
* `https://docs.cnb.cool/zh/develops/openapi.html`
* `https://docs.cnb.cool/zh/develops/skills.html`
* `https://cnb.cool/cnb/skills/cnb-skill`

本地落盘：

* `research/cnb-llms.txt`
* `research/cnb-openapi-doc.md`
* `research/cnb-skills-doc.md`
* `research/cnb-skill-page.md`

## Direct evidence

### 1. `llms.txt` 明确把 OpenAPI 和 Skills 作为开发者能力入口

`llms.txt` 中明确列出了：

* `Open API`：介绍服务地址、调用方式、认证方式
* `SKILLS`：介绍基于 CNB OpenAPI 的 Skills 能力

这说明：

* CNB 官方就是把 “OpenAPI + Skills” 作为自动化和 AI 接入的标准路径

### 2. OpenAPI 文档说明了最低接入条件

OpenAPI 文档明确给出：

* 服务地址：`https://api.cnb.cool`
* 认证头：

```text
Authorization: Bearer ${token}
```

这说明：

* 无论是 `cnb-cli` 还是 `cnb-skill`
* 本质上都绕不开一个可用的 CNB 访问令牌

### 3. Skills 文档只给出一句核心定义，但非常重要

Skills 文档原文：

* `基于 OpenAPI 的 Skills，提供 AI 与 云原生构建 平台的完整交互能力`

这句话的含义很强：

* `cnb-skill` 不是静态说明文档
* 它是把 CNB 平台能力封装给 AI 直接调用的桥

### 4. `cnb-skill` 仓库 README 给出了安装方式和依赖关系

从 `https://cnb.cool/cnb/skills/cnb-skill` 读取到：

* 安装所有 skills：

```bash
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --agent codebuddy -y
```

* 安装单个 skill：

```bash
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --skill cnb-api --agent codebuddy -y
```

* 使用 `cnb-skills` 还需安装 `cnb-cli`
* 安装方式包括：
  * 安装脚本
  * 手动下载二进制
  * `npm install @cnbcool/cnb-cli -g`

* 环境变量要求：
  * `CNB_TOKEN`（必须）
  * `CNB_API_ENDPOINT`（必须），示例：`https://api.cnb.cool`
  * `CNB_BRANCH`（选填）

结论：

* 从官方提供的信息看，`cnb-skill` + `cnb-cli` 是一个成套方案
* `cnb-skill` 需要依赖 `cnb-cli`
* 没有 `CNB_TOKEN`，这套方案不能真正工作

## What becomes easier if installed

在有 `CNB_TOKEN` 的前提下，安装 `cnb-cli` 和 `cnb-skill` 之后，我对 CNB 的“可直接操作性”会明显增强。

### A. 我可以更直接读取和核对 CNB 平台状态

例如更有机会直接完成：

* 查询当前组织 / 仓库信息
* 查询仓库是否存在
* 查询默认分支、分支列表、Tag、Issue、PR
* 查询构建记录、触发记录、仓库动态

这类事情现在只能靠：

* 网页阅读
* 公开 Git 访问
* 文档推断

安装后则更接近“真实 API 读数”。

### B. 我更可能直接完成部分平台配置编排

例如：

* 读取/验证某个 CNB 仓库是否已经具备目标流水线配置
* 调用 OpenAPI 触发构建 / `api_trigger`
* 校验 token 是否可用
* 以脚本方式检查某些仓库/组织级资源是否存在

这对你们的 `GitHub -> CNB mirror -> COS` 方案很有价值，因为：

* 我可以直接帮你校验触发链路
* 不用每一步都靠你手动在浏览器里点

### C. 我可以更快迭代“设计 -> 配置 -> 验证”

有了 CLI + Skill 之后，流程更可能变成：

1. 我改本地仓库文件
2. 我调用 CNB 接口做核验或触发
3. 我回读结果
4. 我再调整配置

这比现在“写文档 -> 你手动配 -> 我再猜平台状态”要高效得多。

## What still will NOT become fully automatic

即使装了 `cnb-cli` 和 `cnb-skill`，也不是所有事情都能无感自动完成。

### 1. 仍然需要用户先提供有效授权

最低前提依然是：

* `CNB_TOKEN`
* `CNB_API_ENDPOINT=https://api.cnb.cool`

如果没有 token：

* CLI 不能认证
* Skill 也无法真正调用平台能力

### 2. 某些高风险平台动作仍然应该由你确认

比如：

* 覆盖 CNB 仓库 `main`
* 切换生产触发规则
* 改写现有 `.cnb.yml`
* 删除旧构建逻辑
* 修改生产 secrets / token

这些即使技术上可做，也不应该在没有你确认的情况下直接操作。

### 3. Skills 不等于“拥有浏览器管理员权限”

即便文档说它提供“完整交互能力”，也仍然取决于：

* OpenAPI 实际开放了哪些接口
* 当前 token 拥有哪些权限
* 有些页面动作是否只能在 Web UI 完成

因此这里要避免过度承诺。

更准确的说法应该是：

* **安装后，我将更像一个可以直接调 CNB API 的自动化操作者**
* **但不是无条件拥有全部控制台管理员能力**

## Practical judgment for this repo

对当前任务 `GitHub -> CNB mirror -> COS` 来说，安装 `cnb-cli` + `cnb-skill` 的价值是明显的。

### 最大收益

它能把我现在做不到的两类事情补上：

1. **直接验证 CNB 平台状态**
2. **直接触发 / 读取构建与仓库相关 API**

这意味着：

* 我更有可能直接完成 GitHub/CNB 联调
* 我更有可能减少“你手动点平台，我口头指导”的比例

### 仍需你手动处理的核心内容

即便安装后，以下通常仍需要你先给条件：

1. 创建或提供 `CNB_TOKEN`
2. 确认该 token 的权限范围
3. 对生产仓库的高风险切换给最终确认

## Final answer

**是的，安装 `cnb-cli` 和 `cnb-skill` 之后，我可以更直接、更高效地完成 CNB 相关配置工作。**

但这个结论有一个硬前提：

**你必须给我可用的 `CNB_TOKEN` 和 API endpoint。**

没有它们，我只能：

* 读公开仓库
* 写本地配置文件
* 设计方案
* 让你手动去平台点

有了它们之后，我才更可能直接做：

* 检查 CNB repo / 分支 / 构建状态
* 触发构建
* 校验配置是否生效
* 联调 GitHub -> CNB 的链路

## Recommended next step

如果要最大化我的直接执行能力，推荐顺序是：

1. 安装 `cnb-cli`
2. 安装 `skills`
3. 安装 `cnb-skill`（至少 `cnb-api`）
4. 配置：
   * `CNB_TOKEN`
   * `CNB_API_ENDPOINT=https://api.cnb.cool`
5. 然后再进入 GitHub/CNB 联调与配置切换
