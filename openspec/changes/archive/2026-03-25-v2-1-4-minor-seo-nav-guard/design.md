## Context

`v2.1.4` 是 `v2.1.3` 发布后的小范围回归补丁。问题集中在两个行为边界：

- 英文分类页在“有内容”场景下显式设置 `index, follow`，导致覆盖 Head 默认 robots 扩展策略。
- 移动端英文导航前缀拼接缺少幂等判断，若配置项本身已带 `/en` 会出现 `/en/en/*`。

该变更仅做最小行为修正，不做架构重构。

## Goals / Non-Goals

**Goals:**
- 保持英文空分类页继续下发 `noindex, follow`。
- 让英文非空分类页回退到站点默认 robots 策略（不显式覆盖）。
- 为移动端英文路径前缀函数补齐幂等保护。

**Non-Goals:**
- 不改页面视觉与交互样式。
- 不调整 i18n 路由架构和导航数据结构。
- 不新增依赖或构建步骤。

## Decisions

### 决策 1：分类页 robots 改为“仅空分类显式覆盖”
- 目标文件：`src/pages/en/categories/[...categories].astro`
- 策略：当 `articleList.length === 0` 时显式传 `noindex, follow`；否则不传 page-level robots，回落 Head 默认值。

### 决策 2：英文前缀 helper 幂等化
- 目标文件：`src/components/MobileSidebar/MobileSidebar.astro`
- 策略：`withLangPrefix` 在英文场景下先判断输入路径是否已是 `/en` 前缀；已前缀直接返回，未前缀再拼接。

## Risks / Trade-offs

- [robots 误配置风险] 通过“仅空数组触发”单条件收敛，避免对非空分类误下发 noindex。
- [导航链接回归风险] 保持原 helper 调用面不变，仅调整内部前缀判断，回归覆盖已前缀/未前缀两类输入。

## Verification

- `node --test tests/v2.1.3-regression.test.mjs`
- `pnpm build`

