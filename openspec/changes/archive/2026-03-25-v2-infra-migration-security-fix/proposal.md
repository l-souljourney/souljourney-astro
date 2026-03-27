## Why

Souljourney Blog v1.9.5 依赖 CNB 构建部署，链路冗余（CNB → GitHub → COS → EdgeOne），且 2026-02-10 技术审计发现 3 个高危漏洞（XSS 注入、i18n 路由偏转、配置覆盖）。v2.0 需要将 GitHub 确立为唯一代码源，建立国内/国际双线自动部署，同时修复所有高危问题并清理历史技术债务，为后续 Engine v3.8 对接（v2.1）奠定基础。

执行原则：轻量优先，避免过度工程化。仅解决核心问题（安全、路由、构建、部署），不引入高维护成本方案。

## What Changes

- **修复搜索 XSS 注入漏洞** — `Search.ts` 中 `innerHTML` 直接拼接未转义内容，改为安全渲染方式
- **修复英文路由路径偏转** — 英文文章页标签/分类链接缺少 `/en/` 前缀，统一使用 i18n 路径生成器
- **修复 astro.config 配置重复覆盖** — 两个 `markdown` 配置块合并，确保 Shiki 主题正确生效
- **搜索模块单链路收敛** — 统一采用 `astro-pagefind`，移除遗留 `vh-search.json + Search.ts` 双轨实现，降低安全与维护风险
- **迁移 CI/CD 到 GitHub Actions** — 清理 CNB 构建配置，优化 deploy.yml 使用 COS 全球加速端点，添加兼容式 CDN 缓存刷新（缺配置 warning+skip）
- **配置 Cloudflare Pages 自动部署** — CF Dashboard 直连 GitHub 仓库，海外用户通过 Cloudflare CDN 访问
- **DNS 分线路解析** — DNSPod 国内线路指向腾讯云 CDN，海外线路指向 Cloudflare
- **清理死代码和无用依赖** — 移除 TypeWrite、Waline、Friends 等已禁用功能代码，清理 `@waline/client` 等无用依赖
- **站点配置环境变量化** — 仅迁移 `PUBLIC_SITE_URL`（保持轻量范围）

## Non-goals

- 不升级 Tailwind CSS v4（v3.4 稳定，破坏性变更风险大）
- 不引入 SSR 模式（纯 SSG 满足需求）
- 不做中英文页面去重重构（属于 v2.2 范围）
- 不对接 Engine v3.8（属于 v2.1 范围）
- 不新增功能特性（本版本聚焦基础设施和安全）
- 不引入外部搜索服务（Algolia/Meilisearch），v2.0 仅做站内搜索链路收敛
- 不引入复杂工程化改造（如多浏览器测试矩阵、大规模重构、额外平台依赖）

## Capabilities

### New Capabilities

- `security-hardening`: 搜索链路 XSS 面收敛（移除遗留 `innerHTML` 搜索渲染）
- `search-consolidation`: 统一搜索实现为 Pagefind，移除遗留搜索链路与构建副作用
- `dual-deploy-pipeline`: GitHub Actions → COS（全球加速）+ Cloudflare Pages 双线自动部署
- `i18n-route-fix`: 英文路由路径生成修复，统一使用 i18n 工具函数

### Modified Capabilities

（无现有 specs，首次建立）

## Impact

- **代码变更**: `src/components/Search/Search.astro`, `src/scripts/Search.ts`, `src/utils/vhSearch.ts`, `src/pages/[...page].astro`, `src/pages/en/article/[...article].astro`, `astro.config.mjs`, `src/config.ts`, `src/scripts/Init.ts`
- **CI/CD**: `.github/workflows/deploy.yml` 优化, `.cnb.yml` 删除
- **依赖**: 移除 `@waline/client`, `@types/dplayer`, `@types/nprogress`
- **外部系统**: Cloudflare Pages 绑定（Dashboard 操作）, DNSPod 解析配置（Dashboard 操作）
- **Engine 依赖**: 无。v2.0 完全独立，不依赖 Engine
