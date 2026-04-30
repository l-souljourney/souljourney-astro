# Frontend Development Guidelines

> Souljourney Blog 前端真实约束。目标是让后续 AI 按当前 Astro 站点的实际模式继续写，而不是发明一套新的前端栈。

---

## Overview

当前项目是 **Astro + TypeScript + Tailwind** 的双语内容站，不是 React SPA。
前端代码的主轴是：

- 页面与布局用 `.astro`
- 内容聚合与路由治理放在 `src/utils/`
- 客户端交互用 `src/scripts/` 和少量组件内 `<script>`
- 国际化由 `src/i18n/` 管理
- 内容契约与运行时校验从 `src/content.config.ts` 和相关 util 进入

---

## Pre-Development Checklist

开始改前端前，至少读这些文件：

1. 本文件
2. `directory-structure.md`
3. `component-guidelines.md`
4. `quality-guidelines.md`
5. 若改客户端交互：再读 `hook-guidelines.md` 与 `state-management.md`
6. 若改 schema / util / shared types：再读 `type-safety.md`
7. 共享思考指南：`.trellis/spec/guides/index.md`

---

## Quality Check

提交前至少确认：

- 公开内容入口仍走 `publishSet` 口径，不绕过 `src/utils/publishSet.ts`
- 双语路由、`hreflang`、语言切换没有退回旧的首页 fallback 模式
- 客户端脚本在 `astro:page-load` / page transition 下不会重复绑定
- 类型没有新增裸 `any`、重复 union、随意 `as any`
- 跑过最小相关验证：`pnpm build`，以及必要的 `node --test tests/*.test.*`

---

## Guidelines Index

| Guide | Focus | Current Reality |
| --- | --- | --- |
| `directory-structure.md` | 目录与模块边界 | 页面、布局、组件、utils、scripts 分层明确 |
| `component-guidelines.md` | Astro 组件与样式模式 | 以 Astro props + Tailwind 为主 |
| `hook-guidelines.md` | 交互与生命周期模式 | 无 React hooks，主要是 DOM init + Astro events |
| `state-management.md` | 状态归属 | Build-time data + URL state + 少量 DOM/localStorage 状态 |
| `quality-guidelines.md` | 禁止项、测试与审查口径 | 双语发布治理与回归验证是重点 |
| `type-safety.md` | 类型与运行时校验 | TS strict + Zod content schema + util local types |

---

## Representative Files

- `src/layouts/Layout/Layout.astro`
- `src/components/Head/Head.astro`
- `src/components/Header/Header.astro`
- `src/components/Search/Search.astro`
- `src/content.config.ts`
- `src/utils/publishSet.ts`
- `src/i18n/utils.ts`
- `tests/v2.2.0-publish-set.test.ts`

---

## Notes

- 这套规范描述的是**当前真实代码**，不是理想蓝图。
- 旧文件里存在少量 `any` 和脚本式 DOM 操作；新改动优先在相邻风格内收敛，而不是顺手引入另一套框架抽象。
