# Quality Guidelines

> 这个仓库的前端质量重点不是像业务后台那样的复杂表单，而是双语内容契约、静态路由正确性、客户端交互在 Astro 页面切换下的稳定性。

---

## Required Patterns

- 改公开内容入口时，统一走 `src/utils/publishSet.ts`
- 改文章路由、语言切换、`hreflang` 时，同时检查：
  - `src/pages/article/[...article].astro`
  - `src/pages/en/article/[...article].astro`
  - `src/components/Head/Head.astro`
  - `src/components/Header/Header.astro`
- 改分类、标签、归档、RSS、搜索集合时，确认中英文公开集合口径一致
- 改客户端脚本时，确认 `astro:page-load` / transition 场景下不会重复绑定
- 改常量、配置、分类 key、SEO 口径前，先全文搜索联动点

---

## Forbidden Patterns

- 绕过 `publishSet`，直接把 `getCollection("blog")` 结果用于公开页面输出
- 恢复旧的文章级语言切换 fallback 到首页
- 在组件或页面里复制粘贴 shared util 逻辑
- 在 page transition 场景下直接绑定事件而不做 cleanup / 去重
- 因为“小改动”跳过 `pnpm build`

---

## Testing Requirements

- 纯逻辑变更：补 `tests/*.test.*`，优先 `node:test`
- 路由 / SEO / 双语治理变更：至少补一个能锁住 contract 的回归测试
- 内容 schema / publish health 变更：执行
  - `pnpm build`
  - `node --test tests/*.test.*` 的相关用例
  - `node script/publish-health.js` 或 `pnpm check:publish-health`（当改动涉及发布集合时）

---

## Review Checklist

- 需求是否保持双语公开口径一致
- 新逻辑是否放在了正确层级：page / component / util / script
- 是否复用了现有 i18n、publish、archive、route util
- 是否增加了必要测试或至少更新了现有断言
- 是否引入了新的硬编码、重复 union、无 cleanup 的客户端事件

---

## Known Historical Pitfalls

- 同 slug 双语稿件在内容层互相覆盖，后来通过 `generateId` 修复
- 文章级语言切换曾错误回退到首页
- 构建成功但公开集合归零的问题，后来通过 publish-health 门禁补上

这些都是需要持续防回归的高优先级风险点。
