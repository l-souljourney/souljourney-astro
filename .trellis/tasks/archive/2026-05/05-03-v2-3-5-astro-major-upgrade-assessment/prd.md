# v2.3.5 Astro Major Upgrade Assessment

## Goal

在 `v2.3.5` 版本内完成 Astro 大版本升级的完整执行方案与实施推进，覆盖 `Node`/CI/CD/构建配置/三方依赖/自定义集成的同步迁移；采用“边升级、边报错、边分析、边修复、边验证”的方式，分阶段把仓库从 `astro@5.x` 平稳升级到当前稳定主版本，并达到可上线状态。

## What I already know

* 仓库当前应用版本为 `2.3.4`，本轮 Trellis 任务目标版本为 `2.3.5`
* 当前核心框架为 `astro@^5.16.0`
* Astro 官方当前稳定主线已到 `6.2.1`（官方 `Astro 6.2` 发布文确认）
* 关键 Astro 生态依赖包括：`@astrojs/mdx`、`@astrojs/rss`、`@astrojs/sitemap`、`@astrojs/tailwind`、`astro-icon`、`astro-pagefind`
* 项目使用 `astro:content` 的集合 schema，且启用了 `glob()` loader 和自定义 `generateId()`
* 项目存在自定义 integration：`src/integrations/pagefindArticlesOnly.mjs`
* `astro.config.mjs` 中启用了 `@playform/compress`、`experimental.svgo`、`i18n`、`markdown.remark/rehype`、Vite alias、自定义内容完整性校验
* 前端存在 `astro:transitions` / `ClientRouter` 与多个 `astro:page-load`、`astro:before-swap`、`astro:after-swap` 事件监听
* 当前没有 active Trellis task，本任务已创建并设为 current task
* 本地与发布链路当前都仍在 Node 20：本机 `v20.19.2`、GitHub Actions `node-version: 20`、`.cnb.yml` 使用 `node:20-alpine`
* 当前基线构建 `pnpm build` 可通过，但 `pnpm astro check` 无法执行，因为仓库未安装 `@astrojs/check`
* 现有 `node --test tests/*.mjs tests/*.ts` 中 `.mjs` 用例通过，`.ts` 测试因未配置 TS test runner 失败

## Assumptions (temporary)

* 本轮最终目标不是停在评估，而是为 `v2.3.5` 形成并推进可落地的大版本升级路径
* 若推进到 Astro 6，必须同步评估 Node、Vite、Tailwind、内容集合 API、集成插件兼容性
* 自定义 Pagefind integration 和 Markdown 插件是最高风险点之一
* 现有中英文双路由复制结构与 `any` 类型扩散会放大迁移改动面

## Open Questions

* 当前依赖树中哪些包不支持目标 Astro 主版本
* 该项目是否应采取“一步到最新”还是“先清债再跳大版本”的升级策略
* 完整生产链路验证中，哪些环节可以在灰度阶段先跑 dry-run，哪些必须真实发布验证

## Requirements (evolving)

* 盘点当前 Astro 框架版本、生态依赖、配置与自定义扩展点
* 核对 Astro 官方最新稳定版本与迁移要求
* 判断仓库是否具备升级到目标主版本的基础条件
* 列出阻塞升级的技术债、代码模式与依赖兼容风险
* 覆盖构建环境、CI/CD、发布链路对新版本的运行时要求
* 输出“分阶段迁移 + 分阶段验证 + 分阶段回滚点”的执行规划
* 在迁移规划中显式包含报错排查与修复闭环，而不是一次性大爆改
* 给出升级执行路径、验证策略、回滚关注点与上线前检查项
* 汇总升级后能获得的性能、维护性和功能能力提升点

## Acceptance Criteria (evolving)

* [x] `prd.md` 明确记录当前架构、目标版本、升级目标与范围
* [x] 形成基于仓库证据和官方文档的升级可行性结论
* [x] 输出主要技术债与风险清单，并标注阻塞级别
* [x] 给出可执行的升级实施方案、阶段拆分、验证路径与回滚策略
* [x] 升级完成时，必须满足完整闭环验收：本地构建/检查、关键回归、GitHub Actions、CNB 构建、COS/EdgeOne 发布链

## Definition of Done (team quality bar)

* Lint / typecheck / 构建验证口径明确
* 影响上线稳定性的风险与回滚点被显式记录
* 必要的 Trellis 研究结论落盘到 `research/`
* 若进入实施阶段，需补充对应的验证记录

## Planned Phases

### Phase A. 升级前基线加固

* 补齐 `astro check`、TypeScript 测试执行链、构建与发布健康门禁
* 固化当前 `pnpm build`、关键页面、搜索、RSS、i18n、Pagefind 的基线行为
* 升级 Node 运行时基线设计，覆盖本地、GitHub Actions、CNB

### Phase B. 运行时与工具链迁移

* Node 20 升级到 Astro 6 所需基线
* 校准 `pnpm`、CI、CNB 构建镜像、可能受影响的脚本执行环境
* 先保证“环境已可承载 Astro 6”，再进入框架升级

### Phase C. Astro 核心升级

* 升级 `astro` 与官方集成包
* 处理 `Vite 7`、`Zod 4`、`astro:schema`、content collections、`redirectToDefaultLocale` 等破坏性变化
* 逐步消化编译/类型/运行时报错

### Phase D. 生态与自定义集成修复

* 校验 `astro-pagefind`、`astro-icon`、`@playform/compress`
* 评估并迁移 `@astrojs/tailwind` 到官方推荐路径
* 修复自定义 `pagefindArticlesOnly` integration 与 Markdown 插件链

### Phase E. 回归验证与上线收口

* 分层验证：构建、类型、测试、局部页面、全站路由、搜索、RSS、sitemap、压缩、GitHub Actions、CNB、COS/EdgeOne
* 收口剩余技术债，整理上线检查表、回滚策略、升级收益总结

## Out of Scope (explicit)

* 不引入与 Astro 升级无关的大型功能重构
* 不在没有验证口径的前提下直接推进生产发布

## Technical Notes

* 已检查文件：`package.json`、`astro.config.mjs`、`src/content.config.ts`、`src/plugins/markdown.custom.ts`、`src/utils/contentIntegrityFs.ts`、`src/integrations/pagefindArticlesOnly.mjs`
* 当前内容层高度依赖 `astro:content` schema 和自定义 ID 生成策略
* 当前搜索层同时使用 `astro-pagefind` 组件和本地 `pagefind` build hook，自定义程度较高
* 当前页面交互对 Astro view transitions 事件有显式绑定，升级时需验证导航生命周期是否有破坏性变化
* 当前发布链路依赖 `.github/workflows/deploy.yml` 和 `.cnb.yml`，两端都显式锁定 Node 20
* 当前 Tailwind 仍是 `@astrojs/tailwind` + Tailwind 3 配置，需单独评估迁移到官方推荐路径的成本

## Research References

* [`research/current-astro-architecture-audit.md`](./research/current-astro-architecture-audit.md) — 本地框架结构、依赖面、发布链路与验证债审计
* [`research/astro-v6-official-notes.md`](./research/astro-v6-official-notes.md) — Astro 6 官方版本现状、升级要求、Tailwind 与 `svgOptimizer` 变化

## Final Outcome

* 已完成 `astro@6.2.1` 升级，并移除 `@astrojs/tailwind` 旧接入方式，改为 PostCSS + Tailwind 4 推荐路径
* 已将 Node 运行时基线上提到 `22.12.0+`，覆盖本地开发、GitHub Actions 与 `.cnb.yml`
* 本地验证闭环通过：`astro check`、`41/41` 测试、`pnpm build`、`pnpm check:publish-health`
* 远端验证闭环通过：GitHub Actions run `25269114269` 成功，`sync-cnb` 成功，CNB `main` 镜像对齐到 `4504885f250a416277fd6c34e983e11a5a1cdeda`
* 生产站点已回读确认：`https://www.l-souljourney.cn/` 与 `https://www.l-souljourney.cn/en/` 均输出 `Astro v6.2.1`，且无 `[[Pasted image ...]]` 无效封面残留
