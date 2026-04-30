# Type Safety

> 这个仓库启用了 Astro strict tsconfig。新的前端改动应优先沿着已有的 typed content + typed util 路线收紧，而不是继续扩大历史 `any`。

---

## Type Sources

- TypeScript 配置：`tsconfig.json` 继承 `astro/tsconfigs/strict`
- 路径别名：`@/* -> ./src/*`
- 内容 schema：`src/content.config.ts`
- i18n key 类型：`src/i18n/ui.ts`
- 共享 domain types：`src/utils/publishSet.ts`
- ambient types：`src/type/*.d.ts`

---

## Organization Rules

- 小型组件 props 就地声明 `Props` 接口
- 与业务规则强相关的类型跟 util 放一起，例如 `PublishSetInputEntry`、`PublishMirrorPair`
- 跨文件共享文案 key，优先复用 `UIKeys`
- 运行时外部库缺少声明时，放到 `src/type/`，例如 `src/type/aplayer.d.ts`

---

## Validation Rules

- 内容 frontmatter 的运行时校验必须经过 `zod` schema，单一入口在 `src/content.config.ts`
- 需要额外内容完整性保护时，用显式 assertion / guard，例如 `assertNoEmbeddedFrontmatterAtBodyStart`
- 不要把“构建一定正确”当成事实；内容边界需要运行时防守

---

## Preferred Patterns

- 对内容集合优先用 `CollectionEntry<"blog">`
- 对固定取值优先使用字面量 union / `as const`
- 泛型 util 可以保留输入输出类型关系，参考 `buildPublishSet<TEntry>()`
- i18n 翻译 key 优先从 `keyof` 类型推导，而不是散落字符串

---

## Forbidden Patterns

- 新增裸 `any`，除非受 Astro/DOM 边界限制且成本过高
- 用 `as any` 掩盖真实类型问题
- 在多个文件重复写 `zh | en`、category union、route contract 常量
- 只改调用方，不改 schema / shared type 源头

---

## Legacy Reality

- 当前仓库里存在少量历史 `any`，例如部分页面 props 和 DOM 脚本
- 处理旧文件时，不要求为“类型纯洁”做无关重构
- 但如果你已经在改那块逻辑，优先顺手把新增或邻近的 `any` 收窄
