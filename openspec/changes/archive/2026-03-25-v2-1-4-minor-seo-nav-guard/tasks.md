## 1. SEO robots 回退策略修正 [H]

- [x] 1.1 [H] 英文分类页仅在空分类输出 `noindex, follow`；AC: 非空分类不再显式传递 `index, follow`

## 2. 英文路由前缀幂等保护 [H]

- [x] 2.1 [H] 移动端侧边栏增加 `/en` 前缀保护；AC: 已带 `/en` 的路径不重复前缀

## 3. 回归验证 [H]

- [x] 3.1 [H] 执行 `node --test tests/v2.1.3-regression.test.mjs`；AC: 新增回归项通过
- [x] 3.2 [H] 执行 `pnpm build`；AC: 构建通过，无新增错误
