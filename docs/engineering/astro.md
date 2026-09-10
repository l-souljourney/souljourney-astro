# Astro 开发规则

涉及组件、布局、客户端交互或构建配置时按需读取。项目使用用户级 Solo，不需要工作流状态工件。

## 结构与类型

- 页面与静态路径放 `src/pages/`，布局放 `src/layouts/`，可复用 UI 放 `src/components/`，共享纯逻辑放 `src/utils/`。
- 使用 Astro props 与现有 Tailwind/custom CSS 模式，不引入 React SPA 状态层替代现有结构。
- 内容字段以 `src/content.config.ts` 的 Zod schema 为准；不要把历史路线图中的建议字段当成已支持字段。
- 新代码不增加裸 `any`、重复 union 或不经校验的类型断言；优先复用相邻类型与工具。
- `.mjs` 配置使用 ESM；构建成功不能替代公开集合验证。

## 客户端生命周期

交互代码主要位于 `src/scripts/` 与组件 `<script>`。初始化必须兼顾首次加载及 `astro:page-load`/页面切换，重复进入不能重复绑定监听器或累积第三方实例。需要清理时沿用现有实例销毁和事件解绑模式。语言切换、搜索、主题等分别验证受影响的真实页面，不新增另一套初始化框架。

## 验证选择

- 局部视觉与交互变更：启动 `pnpm dev`，在对应页面确认显示、交互与切换后的行为，补充适用的类型检查或构建。
- 共享 util 或类型变化：运行受影响的 `node:test` 用例（TypeScript 用例需要 `--import tsx`），必要时运行 `pnpm check`。
- 内容、路由或 SEO：按 [发布规则](./publishing.md) 验证。
- 发布或大范围集成：`pnpm verify:baseline`；不得用局部检查结论代替完整发布门禁。

不为普通成功任务写 journal，不为每次开发创建新的工程文档。新文档只保存确需长期复用的合同或决定。
