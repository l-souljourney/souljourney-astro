# Spoke 仓库同步配置参考 (v4.3.2)

本文件供所有需要接入 GitHub -> Notion 同步中枢的 Spoke 仓库参考。

## 1. 准备工作
在目标仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中配置以下 Secret：

| Secret 名称 | 描述 |
| :--- | :--- |
| `GH_SYNC_TOKEN` | 具备 `repo` 权限的 Personal Access Token (PAT)，用于触发 Hub 仓库的 Action |

## 2. Workflow 配置
在目标仓库创建 `.github/workflows/dispatch-to-hub.yml`，内容如下：

```yaml
name: Dispatch to Sync Hub

on:
  # 监听 Issue 的所有变动
  issues:
    types: [opened, edited, closed, reopened, labeled, unlabeled, assigned, unassigned, milestoned, demilestoned]
  # 监听 PR 的关闭（含合并）
  pull_request:
    types: [closed]

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Send Event to Hub
        run: |
          curl -L \
            -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${{ secrets.GH_SYNC_TOKEN }}" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            https://api.github.com/repos/l-souljourney/souljourney-code/dispatches \
            -d "{\"event_type\": \"github_sync\", \"client_payload\": {\"repo\": \"${{ github.repository }}\", \"event\": ${{ toJson(github.event) }}}"
```

## 3. 常见问题
- **权限错误**: 确保 `GH_SYNC_TOKEN` 是由具备 `souljourney-code` 写入权限（或至少是能触发 dispatch 权限）的账号生成的。
- **同步延迟**: 触发后会有 1-2 分钟的 GitHub Action 调度延迟。
