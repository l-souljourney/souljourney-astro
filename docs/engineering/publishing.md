# 内容与发布规则

修改 schema、公开内容集合、文章路由、RSS、搜索、SEO、图片字段或发布配置时读取。

## 当前合同

- frontmatter 与类型入口为 `src/content.config.ts`；发布链路以 [Astro 发布契约](../astro-wxengine-publish-contract-v2.2.md) 为准。
- 内容 ID 使用 `lang::source_id::slug`。完整中英镜像对及一致分类才能进入公开集合；单语内容允许入库但不公开，冲突不能静默放行。
- 页面、归档、RSS、搜索等公开消费者复用 `src/utils/publishSet.ts`，不各自定义公开规则；保留现有 `hide` 语义。
- 历史计划中的 `draft/noindex/excludeFromHome/excludeFromRSS/excludeFromSitemap/legacy_slugs` 并非当前已实现能力，新增支持必须有明确需求，不能在治理切换中补做。
- 新字段或语义变化核对 Obsidian payload、wxengine frontmatter 生成及 Astro 消费；不能仅凭本地 Markdown 成功证明上游支持。
- canonical 指向当前语言自身；hreflang 仅指向真实镜像，文章语言切换不能退回错误首页。路由变更检查中英文文章页、Head、Header 及直接消费者。
- 图片字段沿用现有 schema 与封面工具；旧 image-2 task 已结束，不代表存在新的图片生成流程。

## 发布门禁

内容/schema/公开集合/路由/SEO 变更至少执行相关测试、`pnpm build` 和 `pnpm check:publish-health`。测试入口为 `pnpm test`，定向用例可用 `node --import tsx --test <用例路径>`。

`check:publish-health` 验证公开面与冲突阈值，默认允许仓库保留单语稿。`check:publish-bilingual-readiness` 额外要求 pending translations 为零；只有涉及外部双语推送就绪时才用它证明就绪，不能混淆两者。

保留 mirror pairs、路由/RSS 数量、重复 ID、source ID/slug/语言/分类冲突检查。不通过降低阈值绕过失败。

## 生产与公开文档边界

生产职责见 [当前发布链路](../deploy/github-main-cnb-cos-release-chain.md)。GitHub 是代码源，GitHub 构建/健康门通过后同步 CNB；CNB 负责腾讯云侧发布，不能恢复 GitHub/CNB 双重写入或 COS 同步删除。

变更发布配置时核对 `.github/workflows/deploy.yml`、`.cnb.yml` 与 `docs/deploy/cnb-mirror-main.cnb.yml` 的对应关系，校验 YAML 并执行适用门禁。生产、推送与外部验证需明确授权，治理改动不授权触发部署。

公开文档只保存项目事实、契约、架构与协作边界；不公开私有地址、凭证配置、内部运维命令或原始运行证据。历史资料按公开深度保留摘要，不把冷历史重新挂成当前执行规范。
