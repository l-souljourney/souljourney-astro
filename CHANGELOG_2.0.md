# Astro 2.0 迁移与更信记录

## 2026-01-08: 域名迁移与基础架构更新

### 1. 基础设施变更 (Infrastructure)
- **SCF 源站组配置**: 
  - 成功定位后端云函数 `souljourneyengine` 的触发器域名。
  - 在 EdgeOne 创建了新的源站组 `scf-backend-group` (ID: `og-3l4asuegt13k`)，用于承接 API 回源流量。
- **EdgeOne 路由规则**: 
  - 尝试自动化创建 `www.l-souljourney.cn` 的 `/api` 转发规则，因 MCP 工具参数验证受限失败。
  - **已完成**: 用户已通过控制台手动配置 `/api` 路由规则（使用正则匹配 `/api/.*|/api` 指向 `scf-backend-group`），并验证了 Host Header 重写配置。
  - **原因**: 验证得知 EdgeOne API 针对当前 Zone 不开放 `Origin` 动作权限，必须手动介入。

### 2. 代码库重构 (Codebase)
- **配置文件更新**:
  - 修改 `src/config.ts`: 将站点主域名 `Site` 属性从 `blog.l-souljourney.cn` 更新为 `www.l-souljourney.cn`。
  - 修改 `.cnb.yml`: 更新构建部署脚本中的 CDN 缓存刷新目标域名。
- **全局域名替换**:
  - 完成了全项目的域名字符串替换 (`blog.` -> `www.`)，涉及 SEO 配置文件、Markdown 文档头部及帮助文档等。

### 3. 已知问题 (Known Issues)
- **MCP 工具限制**: `mcp-router` 中的 `edgeone_create_rule` 工具在处理复杂动作（如 `Origin` 修改源站）时，存在参数类型映射问题，导致无法通过 API 自动完成高级路由配置。
