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

## Scenario: Article cover frontmatter normalization

### 1. Scope / Trigger
- Trigger: 任何公开文章卡片、文章页头图、SEO 图片逻辑直接读取 `post.data.cover`

### 2. Signatures
- `src/utils/getCover.ts`
- `getCover(filename: string | null | undefined): Promise<string>`

### 3. Contracts
- 明确可公开访问的 cover 值：
  - 绝对 URL
  - 站内公开资源路径
- 以下值不得直接拼成公开 URL：
  - `null`
  - 空字符串 / 纯空白
  - Obsidian wikilink 形式，例如 `[[Pasted image 20260324113724.png]]`
- 无效 cover 必须回退到 `public/assets/images/banner` 下的站点 banner 图

### 4. Validation & Error Matrix
- `cover` 为显式公开 URL / path -> 原样返回
- `cover` 为空或缺失 -> fallback banner
- `cover` 为 `[[...]]` -> fallback banner
- 未做 normalize，直接把 `[[...]]` 输出到页面 -> 首页 / 列表页产生资源 `404`

### 5. Good / Base / Bad Cases
- Good: frontmatter 提供可公开 URL，页面直接稳定渲染
- Base: frontmatter 未提供 cover，页面使用默认 banner
- Bad: Obsidian 导出的 `[[...]]` 被当作最终图片地址输出

### 6. Tests Required
- `tests/v2.3.5-get-cover.test.ts`
  - 显式 cover 原样保留
  - `null` cover 回退 banner
  - `[[Pasted image ...]]` cover 回退 banner

### 7. Wrong vs Correct
#### Wrong
- 假设内容 frontmatter 只要通过 schema 就一定是页面可公开使用的图片 URL

#### Correct
- 把 schema 校验和运行时公开资源校验分开处理
- 在 `getCover()` 里对 Obsidian 残留值做 normalize / fallback

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
