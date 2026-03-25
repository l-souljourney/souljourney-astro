## Context

`v2.1.3` 原计划聚焦双语交互一致性（移动端侧边栏、TOC、搜索弹层生命周期），在 `v2.1.2` 回归后新增两项必须收敛的问题：文章页 `main` 嵌套语义违规、英文空分类页缺少 empty-state/noindex 策略。  
当前站点是 Astro SSG，语义结构和索引策略问题会直接反映到构建产物与爬虫行为，因此本版本将“交互一致性 + 语义/索引补强”合并在一次可控发布中完成。

## Goals / Non-Goals

**Goals:**
- 修复双语交互一致性：移动端中英文入口行为一致，TOC 高亮稳定，搜索弹层监听器不重复绑定。
- 修复语义结构：文章详情页不再出现 `main` 嵌套，保持 landmark 合法。
- 修复英文空分类页策略：对无文章分类输出可理解 empty-state，并加 noindex 避免薄内容索引。

**Non-Goals:**
- 不做视觉设计重构或主题系统升级。
- 不引入新依赖或新的外部服务。
- 不改动内容 schema 与发布 API 契约。

## Decisions

### 决策 1：沿用 `v2-1-3-i18n-interaction-consistency` 作为统一收敛版本
- 方案：保留原 change 名称，不再拆分新版本号，把新增两项问题纳入同一 `v2.1.3`。
- 原因：两个问题都属于发布质量门槛（语义与索引），与交互一致性同为 P0-B 收敛面，合并能减少跨版本返工。
- 备选：新开 `v2.1.4` 专门修语义/索引。
- 不选原因：会拖延修复窗口，并增加一次额外发布回归成本。

### 决策 2：文章页采用“单主地标”约束，禁止 `main` 嵌套
- 目标文件：`src/layouts/Layout/Layout.astro`、`src/pages/article/[...article].astro`、`src/pages/en/article/[...article].astro`
- 方案：保留布局层唯一 `main`，文章详情页内容容器使用 `article`/`section`，不再使用第二个 `main`。
- 关键变更（示意）：

```astro
<!-- Before -->
<main class="main ...">
  ...
  <main class="prose ...">...</main>
</main>

<!-- After -->
<main class="main ...">
  ...
  <article class="prose ...">...</article>
</main>
```

### 决策 3：英文空分类页使用“可达 + 可解释 + 不索引”策略
- 目标文件：`src/pages/en/categories/[...categories].astro`、`src/components/Head/Head.astro`（或分类页级头部传参）
- 方案：维持 canonical 分类路由全部可达；当 `articleList` 为空时渲染明确 empty-state 文案，并输出 noindex 元信息。
- 关键变更（示意）：

```astro
<!-- Before -->
<Layout title={info.title} description={info.description} activeNav={categories}>
  <Archive articleList={articleList} />
</Layout>

<!-- After -->
<Layout
  title={info.title}
  description={info.description}
  activeNav={categories}
  pageType="website"
  robots={articleList.length === 0 ? "noindex, follow" : "index, follow"}
>
  {articleList.length === 0 ? <EmptyCategoryState lang="en" category={categoryDisplayName} /> : <Archive articleList={articleList} />}
</Layout>
```

### 决策 4：i18n 交互行为保持 URL 前缀一致，不做路由重构
- 目标文件：`src/components/MobileSidebar/MobileSidebar.astro`、`src/components/Header/Header.astro`、`src/components/TOC/TOC.astro`、`src/components/Search/Search.astro`
- 方案：仅修正现有交互入口与监听生命周期，不引入新的路由抽象层。
- i18n 影响：英文页面中的分类/标签/文章入口保持 `/en/*`；中文页面保持根路径，不做跨目录结构变化。

## Risks / Trade-offs

- [语义容器替换影响样式选择器] → 仅替换标签名，不改 class 与 DOM 层级；回归文章页样式与 TOC。
- [空分类 noindex 误伤有内容页面] → 以 `articleList.length === 0` 作为唯一条件，并在构建产物中抽检 meta robots。
- [搜索弹层幂等修复不完整] → 在 `astro:page-load`、`astro:after-swap` 场景执行多次切页验证，确保监听器不叠加。

## Migration Plan

1. 先完成 `proposal/specs/tasks` 对齐，锁定 2.1.3 边界。
2. 按 task 顺序实施：交互一致性 → 语义修复 → 空分类策略。
3. 执行 `pnpm build` 与 `pnpm preview`，覆盖中英文文章页、英文空分类页、移动端导航/搜索/TOC。
4. 若回归失败：按文件粒度回滚至本变更前状态，保留已通过的独立修复项。

## Open Questions

- empty-state 文案是否需要产品化可配置（i18n key）？本版本默认走 i18n key，避免硬编码。
- noindex 策略是否扩展到其他空聚合页（如空标签页）？本版本仅覆盖英文空分类页。
