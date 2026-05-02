![logo](/images/favicon.png)

 [cnb/](/cnb)[skills/](/cnb/skills)[cnb-skill](/cnb/skills/cnb-skill)

Public23

45

WeChat LoginLogin

[Code](/cnb/skills/cnb-skill)[Issues

3

](/cnb/skills/cnb-skill/-/issues)[Pull requests

1

](/cnb/skills/cnb-skill/-/pulls)[Events](/cnb/skills/cnb-skill/-/build/logs)[Packages](/cnb/skills/cnb-skill/-/packages)[Insights](/cnb/skills/cnb-skill/-/insights/contributors)

main

[Branch

20

](/cnb/skills/cnb-skill/-/branches)[Tag

46

](/cnb/skills/cnb-skill/-/tags)

![](/users/jingjingwu/avatar/s)

[晶晶](/u/jingjingwu)

chore: update cnb-api by ci

[4f6d23df](/cnb/skills/cnb-skill/-/commit/4f6d23df82a49a2992b40750b3f47ef154fde0ca)

[

133 commits

](/cnb/skills/cnb-skill/-/commits/main)

| [.cnb](/cnb/skills/cnb-skill/-/tree/main/.cnb ".cnb") |  |  |
| --- | --- | --- |
| [.codebuddy](/cnb/skills/cnb-skill/-/tree/main/.codebuddy ".codebuddy") |  |  |
| [.ide](/cnb/skills/cnb-skill/-/tree/main/.ide ".ide") |  |  |
| [bin](/cnb/skills/cnb-skill/-/tree/main/bin "bin") |  |  |
| [cli](/cnb/skills/cnb-skill/-/tree/main/cli "cli") |  |  |
| [skills](/cnb/skills/cnb-skill/-/tree/main/skills "skills") |  |  |
| [.cnb.yml](/cnb/skills/cnb-skill/-/blob/main/.cnb.yml ".cnb.yml") |  |  |
| [.gitignore](/cnb/skills/cnb-skill/-/blob/main/.gitignore ".gitignore") |  |  |
| [DEVELOPMENT.md](/cnb/skills/cnb-skill/-/blob/main/DEVELOPMENT.md "DEVELOPMENT.md") |  |  |
| [LICENSE.md](/cnb/skills/cnb-skill/-/blob/main/LICENSE.md "LICENSE.md") |  |  |
| [README.md](/cnb/skills/cnb-skill/-/blob/main/README.md "README.md") |  |  |
| [bun.lock](/cnb/skills/cnb-skill/-/blob/main/bun.lock "bun.lock") |  |  |
| [cag.config.js](/cnb/skills/cnb-skill/-/blob/main/cag.config.js "cag.config.js") |  |  |
| [install.ps1](/cnb/skills/cnb-skill/-/blob/main/install.ps1 "install.ps1") |  |  |
| [install.sh](/cnb/skills/cnb-skill/-/blob/main/install.sh "install.sh") |  |  |
| [package-lock.json](/cnb/skills/cnb-skill/-/blob/main/package-lock.json "package-lock.json") |  |  |
| [package.json](/cnb/skills/cnb-skill/-/blob/main/package.json "package.json") |  |  |

# CNB SkillsCNB 平台技能集合，在一个仓库中维护多个 CodeBuddy Skill，可通过 `npx skills` 便捷安装。

## 安装方式### 安装 skills```bash
# 一键安装所有 Skill
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --agent codebuddy -y
```

### 只安装指定的 Skill```bash
# 列出所有可用的 Skill
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --list

# 安装单个 Skill
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --skill cnb-api --agent codebuddy -y

# 安装多个指定 Skill
npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --skill cnb-api --skill code-review --skill pr-diff --agent codebuddy -y
```

### 安装 cnb-cli使用 cnb-skills 还需安装 cnb-cli，支持以下安装方式：

#### 方式一：一键安装脚本（推荐）自动检测操作系统和 CPU 架构，下载对应的二进制文件：

**Linux / macOS**：

```bash
curl -fsSL https://cnb.cool/cnb/skills/cnb-skill/-/git/raw/main/install.sh | sh
```

安装指定版本：

```bash
curl -fsSL https://cnb.cool/cnb/skills/cnb-skill/-/git/raw/main/install.sh | sh -s 1.4.5
```

**Windows（PowerShell）**：

```powershell
irm https://cnb.cool/cnb/skills/cnb-skill/-/git/raw/main/install.ps1 | iex
```

安装指定版本：

```powershell
$v="1.4.3"; irm https://cnb.cool/cnb/skills/cnb-skill/-/git/raw/main/install.ps1 | iex
```

#### 方式二：手动下载前往 [Releases](https://cnb.cool/cnb/skills/cnb-skill/-/releases) 页面，下载最新版本中对应平台的文件：

| 平台 | 文件名 |
| --- | --- |
| macOS (Apple Silicon) | `cnb-darwin-arm64` |
| macOS (Intel) | `cnb-darwin-x64` |
| Linux (x64) | `cnb-linux-x64` |
| Linux (ARM64) | `cnb-linux-arm64` |
| Windows (x64) | `cnb-windows-x64.exe` |

下载后将文件重命名为 `cnb`（Windows 为 `cnb.exe`），放入 PATH 目录中即可使用。

#### 方式三：npm 安装```bash
# 运行环境要求 Node.js 20.x 及以上版本
npm install @cnbcool/cnb-cli -g
```

安装完成后运行 `cnb --help` 验证是否安装成功。

## AI 安装提示词将以下提示词复制后发送给 AI 智能体（如 CodeBuddy），即可自动完成所有安装：

```
请帮我安装 CNB Skills 的运行环境，依次执行以下步骤：

1. 全局安装 cnb-cli：
   npm install @cnbcool/cnb-cli -g
   安装完成后运行 cnb --help 验证是否安装成功。

2. 全局安装 skills 工具：
   npm install skills -g

3. 通过 skills 工具安装所有 skill 到当前工作目录：
   npx skills add https://cnb.cool/cnb/skills/cnb-skill.git --agent codebuddy -y --copy

每一步执行完后告诉我结果，如果有报错请帮我解决。
```

## 环境变量- **CNB\_TOKEN** — 访问凭证（必须）
- **CNB\_API\_ENDPOINT** — API 端点地址（必须），示例：`https://api.cnb.cool`
- **CNB\_BRANCH** — 默认分支（选填），示例：`main`

## 关键词CNB、云原生构建、组织、代码仓库、Issue、PR、合并请求、流水线、代码评审、CI/CD

### Sponsor

![](/users/jingjingwu/avatar/s)

[jingjingwu(晶晶)](/u/jingjingwu)

![](/users/LamHo/avatar/s)

[LamHo(Lam)](/u/LamHo)

![](/users/youkun/avatar/s)

[youkun(哪嘟通临时工 )](/u/youkun)

![](/users/alibaba/avatar/s)

[alibaba(宋冬冬🦕)](/u/alibaba)

![](/users/loviselu/avatar/s)

[loviselu(卢嘉辉)](/u/loviselu)

### About

CNB专属Skill

1.73 MiB

Skills

[23 forks](/cnb/skills/cnb-skill/-/insights/forks?tabId=current)[45 stars](/cnb/skills/cnb-skill/-/stargazers)[20 branches](/cnb/skills/cnb-skill/-/branches)[46 Tag](/cnb/skills/cnb-skill/-/tags)READMEMIT license

### [Release](/cnb/skills/cnb-skill/-/releases)

7

[1.4.6](/cnb/skills/cnb-skill/-/releases/tag/1.4.6)

[1.4.5](/cnb/skills/cnb-skill/-/releases/tag/1.4.5)

[1.4.4](/cnb/skills/cnb-skill/-/releases/tag/1.4.4)

[Packages](/cnb/skills/cnb-skill/-/packages)

1

[dockerfile-caches](/cnb/skills/cnb-skill/-/packages/docker/cnb-skill/dockerfile-caches)

### Sponsor

![](/users/jingjingwu/avatar/s)

[jingjingwu(晶晶)](/u/jingjingwu)

![](/users/LamHo/avatar/s)

[LamHo(Lam)](/u/LamHo)

![](/users/youkun/avatar/s)

[youkun(哪嘟通临时工 )](/u/youkun)

![](/users/alibaba/avatar/s)

[alibaba(宋冬冬🦕)](/u/alibaba)

![](/users/loviselu/avatar/s)

[loviselu(卢嘉辉)](/u/loviselu)

### [Contributors](/cnb/skills/cnb-skill/-/insights/contributors)

9

![](/users/LamHo/avatar/s)

![](/users/jingjingwu/avatar/s)

![](/users/youkun/avatar/s)

![](/users/alibaba/avatar/s)

![](/users/loviselu/avatar/s)

![](/users/Zhihang.Li/avatar/s)

![](/users/qilongzhu/avatar/s)

![](/users/sixther/avatar/s)

![](/users/xuyyixu/avatar/s)

Language

JavaScript98.6%

Shell0.9%

Dockerfile0.1%

Others0.4%© 2026 Tencent, Inc. Supported by Tencent Cloud

[About Us](https://docs.cnb.cool/en/saas/about.html)

[Privacy Policy](https://docs.cnb.cool/en/saas/privacy.html)

[Terms of Service](https://docs.cnb.cool/en/saas/terms.html)

[SLA](https://docs.cnb.cool/en/saas/sla.html)

[API](https://api.cnb.cool)

[Docs](https://docs.cnb.cool/en/)

[Showcase](https://cnb.cool/examples/showcase)

[Feedback](https://cnb.cool/cnb/feedback)

35/F,Tencent Building,Kejizhongyi Avenue,Nanshan District,Shenzhen

[京ICP备11018762号-111](https://cnb.cool/110?url=https%3A%2F%2Fbeian.miit.gov.cn%2F%23%2FIntegrated%2Findex)

![粤公网安备44030002006058号](https://cnb.cdn-go.cn/monorepo/d900f17b/5839b07958f71155/images/security-icon.png)[粤公网安备44030002006058号](https://cnb.cool/110?url=https%3A%2F%2Fbeian.mps.gov.cn%2F%23%2Fquery%2FwebSearch%3Fcode%3D44030002006058)