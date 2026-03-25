## Context

`v2.1.2` 定位为 P0-A 止血版本，仅处理结构与 SEO 的硬失败点。当前问题集中在文章详情页模板与 Head 元数据链路：
1) zh/en 文章模板存在闭合标签不匹配，导致结构不合法；
2) 文章封面与页面类型在 `Layout -> Head` 传参链路上不一致，造成 OG 与 JSON-LD 类型可能偏离文章页语义；
3) 英文分类静态路径只按现有英文文章生成，导航中的规范分类入口可能直接 404。

约束：不改组件架构、不做样式重排、不引入新依赖，确保变更可在一次 `pnpm build` 和关键页面回归内完成。

## Goals / Non-Goals

**Goals:**
- 修复 zh/en 文章详情模板的语义结构和闭合合法性。
- 建立稳定的文章页 SEO 元数据传参（封面、页面类型）。
- 消除英文核心分类入口的确定性 404。

**Non-Goals:**
- 不重构 Header/MobileSidebar 的交互一致性逻辑（归入 v2.1.3）。
- 不调整视觉样式、字体、版式。
- 不触发 schema/内容模型升级。

## Decisions

### 决策 1：直接修复文章页模板结构而非抽象新组件
- 方案：在 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro` 修正错误闭合标签与语义容器，保持现有布局结构。
- 原因：问题是模板级硬错误，局部修正成本最低且风险最可控。
- 备选：抽取共享 ArticleDetail 组件统一渲染。
- 不选原因：跨文件重构超出 `v2.1.2` 止血范围，回归面扩大。

### 决策 2：在 Layout/Head 引入显式页面类型字段
- 方案：`Layout.astro` 支持 `pageType` 与统一 `pageCover` 入口，`Head.astro` 以 `pageType` 决定 `og:type` 与 JSON-LD 类型；文章页显式传 `pageType="article"`。
- 原因：以“封面是否存在”推断页面类型不稳定，且会把类型逻辑与内容素材耦合。
- 备选：继续通过 `PageCover` 推断类型。
- 不选原因：封面缺失或命名偏差会导致文章页被识别为 website，问题会重复出现。

### 决策 3：英文分类路由对齐 canonical 分类全集
- 方案：`src/pages/en/categories/[...categories].astro` 的 `getStaticPaths` 合并“英文文章实际分类”与“配置 canonical 分类键”。
- 原因：导航入口基于 canonical 分类配置，路由生成必须覆盖该集合才能避免入口 404。
- 备选：仅修 Header 导航，隐藏无文章分类。
- 不选原因：隐藏入口属于交互策略变更，且无法保证其他入口（深链、外链）可达。

## Risks / Trade-offs

- [路由数量增加] 英文分类页会生成无文章的空列表页 → 通过复用现有 `Archive` 空态表现控制体验。
- [元数据行为变化] 页面类型判定逻辑从隐式改为显式 → 默认值保持 `website`，仅文章页设置 `article`。
- [模板修复回归] 结构标签调整可能影响样式挂载点 → 仅修改标签匹配，不调整 class 与层级语义。

## Migration Plan

1. 先修改 OpenSpec tasks，并按任务顺序改动 5 个目标文件。
2. 执行 `pnpm build` 进行全量静态构建验证。
3. 使用 `pnpm preview` 抽查关键页面：
   - `/article/{slug}` 与 `/en/article/{slug}`：结构与 meta。
   - `/en/categories/investment`（无英文内容场景）确认非 404。
4. 若任一关键页面回归失败：
   - 回滚对应文件到改动前版本（单文件粒度）；
   - 保留已通过的独立修复项，重新验证。

## Open Questions

- 英文空分类页是否需要专门文案（当前沿用通用空列表表现）？本版本先不新增文案。
- 是否在 v2.1.3 统一 `Layout` 历史 props 命名（`cover/pagecover`）？本版本先做向后兼容。
