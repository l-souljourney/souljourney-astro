## 1. OpenSpec 与范围对齐 [H]

- [ ] 1.1 [H] 校验 `v2-1-3-i18n-interaction-consistency` artifacts 完整；AC: `openspec status --change v2-1-3-i18n-interaction-consistency --json` 中 `proposal/design/specs/tasks` 均为 `done`

## 2. 双语交互一致性修复 [H]

- [ ] 2.1 [H] 修复移动端侧边栏英文文案 key 泄露与路由前缀不一致问题；AC: 英文侧边栏不出现 `nav.xxx`，点击后路径保持 `/en/*`
- [ ] 2.2 [H] 修复 TOC 高亮选择器与文章结构不一致问题；AC: zh/en 文章滚动时 TOC 高亮稳定跟随当前标题
- [ ] 2.3 [H] 修复搜索弹层监听器重复绑定；AC: 多次页面切换后搜索开关行为单次触发、无重复执行

## 3. 文章页语义结构约束修复 [H]

- [ ] 3.1 [H] 调整 `src/pages/article/[...article].astro` 与 `src/pages/en/article/[...article].astro` 主内容容器语义，消除内层 `main`；AC: 文章页模板无 `main` 嵌套且标签闭合正确
- [ ] 3.2 [M] 增加结构回归检查（构建产物或 DOM 规则）；AC: zh/en 文章页均可验证仅保留单主 `main` landmark

## 4. 英文空分类页 empty-state 与 noindex 策略 [H]

- [ ] 4.1 [H] 在英文分类页无文章场景输出明确 empty-state 文案（i18n key）；AC: `/en/categories/{category}` 空列表时可见可理解提示
- [ ] 4.2 [H] 在英文空分类页输出 `robots: noindex, follow`；AC: 空分类页 head 中 robots 为 `noindex, follow`，有内容分类保持 `index, follow`
- [ ] 4.3 [M] 回归 canonical 英文分类全集路径；AC: `/en/categories/{canonical}` 全部可访问且不返回 404

## 5. 构建与关键路径验证 [H]

- [ ] 5.1 [H] 执行 `pnpm build`；AC: 构建通过且无新增错误
- [ ] 5.2 [H] 执行关键路径回归（zh/en 文章页、英文空分类页、移动侧边栏、TOC、搜索弹层）；AC: 交互一致、语义约束满足、空分类索引策略符合预期
