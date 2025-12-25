# CNB 构建流程集成 EdgeOne 缓存刷新可行性分析报告

## 1. 结论
**完全可行**。

虽然 `.cnb.yml` 目前使用的 `tencentcom/coscli` 镜像主要用于对象存储操作，不包含 EdgeOne (Teo) 的控制功能，但 CNB 的 docker 原生架构允许我们在构建流程中添加任意环境的 stage。

我们可以通过添加一个轻量级的 Python 环境 stage，利用腾讯云官方 SDK (`tencentcloud-sdk-python-teo`) 调用 `CreatePurgeTask` 接口来实现构建后的自动刷新缓存。

## 2. 方案概览

### 核心机制
1.  **新增 Stage**: 在 `.cnb.yml` 的 `deploy to cos` 步骤之后，增加名为 `refresh cdn` 的步骤。
2.  **运行环境**: 使用轻量级 `python:3.9-slim` 镜像。
3.  **操作逻辑**:
    -   安装 `tencentcloud-sdk-python-teo`。
    -   读取环境变量（复用 `COS_SECRET_ID`/`KEY` 或新增专用密钥）。
    -   调用 EdgeOne API 执行全站或指定 URL 刷新。

### 必要依赖
需要在 CNB 环境变量中配置以下参数：
-   `TEO_ZONE_ID`: EdgeOne 的站点 ID (格式如 `zone-xxxxxx`)，可在腾讯云 EdgeOne 控制台获取。
-   `COS_SECRET_ID` / `COS_SECRET_KEY`: 现有的密钥需要具备 EdgeOne 的 API 调用权限 (`teo:CreatePurgeTask`)。

## 3. 实现指南

您可以直接复制以下配置添加到您的 `.cnb.yml` 文件末尾（`deploy to cos` 阶段之后）：

### 修改后的 .cnb.yml 片段

```yaml
        # ... (之前的 deploy to cos 阶段)

        - name: refresh edgeone cache
          image: python:3.9-slim
          script: |
            echo "🚀 开始刷新 EdgeOne 缓存..."
            
            # 1. 检查必要变量
            if [ -z "${TEO_ZONE_ID}" ]; then
              echo "⚠️ 未配置 TEO_ZONE_ID，跳过刷新"
              exit 0
            fi
            
            # 2. 安装腾讯云 EdgeOne SDK
            echo "📦 安装依赖..."
            pip install --no-cache-dir tencentcloud-sdk-python-teo
            
            # 3. 执行刷新脚本
            echo "🔄 调用 API 刷新全站缓存..."
            python -c "
            import os
            import sys
            import json
            from tencentcloud.common import credential
            from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
            from tencentcloud.teo.v20220901 import teo_client, models

            try:
                # 初始化认证
                cred = credential.Credential(
                    os.environ.get('COS_SECRET_ID'), 
                    os.environ.get('COS_SECRET_KEY')
                )
                
                # 初始化客户端
                client = teo_client.TeoClient(cred, 'ap-guangzhou')
                
                # 构造请求: 刷新全站 (purge_host)
                # 如果只想刷新首页，Type改为 purge_url，Targets填 ['https://your-domain.com/']
                req = models.CreatePurgeTaskRequest()
                req.ZoneId = os.environ.get('TEO_ZONE_ID')
                req.Type = 'purge_host' 
                req.Targets = [ os.environ.get('CDN_DOMAIN', 'blog.l-souljourney.cn') ] 
                
                # 发送请求
                resp = client.CreatePurgeTask(req)
                print(f'✅ 刷新任务提交成功! TaskId: {resp.JobId}')
                
            except TencentCloudSDKException as err:
                print(f'❌ 刷新失败: {err}')
                sys.exit(1)
            except Exception as e:
                print(f'❌ 系统错误: {e}')
                sys.exit(1)
            "
```

## 4. 关键参数说明

-   **Type**: 
    -   `purge_url`: 刷新具体的 URL（如更新了某篇文章）。
    -   `purge_host`: 刷新整个域名（建议发布新版本时使用此选项，确保所有资源更新）。
-   **Targets**: 要刷新的目标列表。
-   **Method**: 默认为 `invalidate` (软刷新，验证过期)，也可设为 `delete` (强制删除缓存)。API 默认行为通常足够。

## 5. 权限验证
请确保您的 `COS_SECRET_ID` 对应的子账号或 CAM 角色拥有 `teo:CreatePurgeTask` 权限。如果使用的是全权限账号则无需调整。

## 6. 建议
建议您在 CNB 的该仓库设置中，新增一个环境变量 `TEO_ZONE_ID`，填入您的 EdgeOne 站点 ID。这样无需修改代码即可启用此功能。
