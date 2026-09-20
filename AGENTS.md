# AGENTS.md

本文件保存 Souljourney Blog 的项目事实与硬约束。默认中文沟通，在仓库根目录工作。

## 开发方式

- 默认使用用户级 `solo-dev`（Solo）：读取规则和直接相关代码，明确范围与风险，最小完整实现，按风险验证并报告证据。
- 不默认创建 task、PRD、JSONL 或 session journal。Git 保存代码事实；Issue 保存长期需求、blocker 和跨仓协调；项目文档保存长期决策。
- 后续需求由统一项目规划与 Issue 确定；旧版本路线图不构成实施授权。仓库合并本身不在日常开发的隐含范围内。
- Trellis 运行入口与冷历史目录已物理退役；旧材料仅通过 Git 历史查阅，不是当前规范、任务或执行入口。不得自动读取旧 workflow/spec/task、运行生命周期脚本或恢复 hooks。
- 主会话执行；只有用户明确要求并行、子代理或分工时才派生代理。

## 工程事实与入口

- Astro 6.x + TypeScript + Tailwind CSS，Markdown 中英双语内容站，不是 React SPA。
- Node >=22.12.0、pnpm >=9；依赖版本以 `package.json` 和锁文件为准。
- 内容：`src/content/blog/`；schema：`src/content.config.ts`；公开集合：`src/utils/publishSet.ts`。
- 页面与布局：`src/pages/`、`src/layouts/`；交互：`src/scripts/`；国际化：`src/i18n/`。
- 配置：`astro.config.mjs`、`tailwind.config.mjs`、`src/config.ts`。`.mjs` 保持 ESM，不混用裸 `require()`。
- 改 Astro/客户端交互时按需读 `docs/engineering/astro.md`；改内容、路由、SEO 或发布时读 `docs/engineering/publishing.md` 与其中的现行契约入口；改部署链路、EdgeOne Makers 项目配置或排查构建失败时读 `docs/engineering/makers.md`。

## 不可回退的合同

- 公开输出复用 `publishSet`，不在页面另写公开条件。完整 zh/en 镜像对才能进入公开集合；单语稿允许入库但不公开。
- 保持 `lang::source_id::slug` 内容 ID、镜像配对及冲突检查；不得恢复双语内容相互覆盖。
- 中英文 canonical 指向自身，hreflang 只指向真实镜像；文章语言切换不得错误回退首页。
- 新增发布字段必须核对 Obsidian payload、wxengine frontmatter 生成与 Astro 消费，不能假定上游透传。
- 保留构建后的 publish-health 门禁。健康检查通过不等于外部双语发布全部就绪。
- GitHub 是代码源；生产链路改动按现行部署文档核对，禁止引入双重部署写入或恢复 COS 同步删除。

## 验证

- 常用命令：`pnpm dev`、`pnpm check`、`pnpm test`、`pnpm build`、`pnpm preview`。
- 普通局部改动执行能覆盖风险的最小可靠检查；UI 改动在实际页面验证交互和外观。
- 内容/schema/公开集合/路由/SEO 改动执行相关合同测试、`pnpm build`、`pnpm check:publish-health`；涉及外部双语就绪时再执行 `pnpm check:publish-bilingual-readiness`。
- 发布或大范围集成执行 `pnpm verify:baseline`；部署配置变更还需校验 YAML 与镜像配置一致性，远端运行验证须先获授权。
- 不关闭门禁、降低阈值或修改测试掩盖错误。验证失败先定位原因；报告必须区分已验证结果与未验证范围。

## Git、外部操作与文件保护

- GitHub remote 为 `github`，`main` 跟踪 `github/main`。日常改动直接提交 `main`，不引入 feature 分支流程。注意：**`main` push 会直接触发 EdgeOne Makers 生产部署**，提交即发布；发布门禁是 Makers 构建命令的组成部分，门禁失败则不产生新部署。
- 保留未知工作区与 staged 修改，不通过 reset、stash、强制 checkout 隐藏它们。仅精确暂存当前拥有的改动，禁止 `git add .`。
- 本地修改不自动授权 commit、push、deploy、生产数据写入、破坏性操作、release/tag 或正式外部写回。同一明确对象与范围的授权不重复询问，范围或影响变化时重新确认。
- 批量操作超过 5 个对象、修改 milestone/project、release/tag、任何 `gh api` POST/PATCH/DELETE，先给对象清单与预期效果并取得确认。
- GitHub 实体读写使用非交互 `gh`，显式 `--repo l-souljourney/souljourney-astro`；写后回读。其他仓库操作需独立明确范围。
- 不提交凭证、密钥、Token 或私有运维信息。发现疑似敏感信息进入改动或历史时停止推送/合并并报告受影响路径与提交。
- 根级持续记录只写 `update.md`；技术文档放 `docs/`。公开文档保留契约与职责边界，不公开私有平台地址、凭证配置或内部运维证据。
- 交付说明包含改动、验证证据、风险与后续；不得未经验证宣称完成。
