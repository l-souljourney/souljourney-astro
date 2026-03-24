## Overview

v2.1.1 聚焦三个点：

1. **语言 alternate 安全化**：文章页只有在“对侧语言同 slug 稿件存在”时才输出 alternate 与切换目标。
2. **正文污染前置拦截**：构建期检测正文起始的重复 frontmatter 模式，检测到即失败。
3. **摘要来源修正**：摘要优先使用 frontmatter `description`，避免正文污染影响 meta/OG/Twitter。

## Detailed Design

### 1) Article alternate existence check

- 新增工具函数（Astro 侧）：
  - 识别当前是否是文章路由（`/article/{slug}` 或 `/en/article/{slug}`）
  - 基于 `astro:content` 查询是否存在同 slug 的对侧语言文章
- `Head.astro`：
  - 文章页有对侧稿件：输出 `zh/en/x-default`
  - 文章页无对侧稿件：仅输出当前语言与 `x-default`（指向当前语言 URL）
- `Header.astro`：
  - 文章页有对侧稿件：语言切换按钮跳转对侧文章
  - 文章页无对侧稿件：语言切换按钮回退对应语言首页（避免 404）

### 2) Content contamination guard

- 在 markdown 处理链增加校验：
  - 对正文起始片段（trim 后前 N 字符）检查是否包含 `--- ... ---` 块
  - 命中则抛错并终止构建，错误信息包含文件标识
- 守卫目标：拦截“frontmatter + frontmatter + body”这类重复注入。
- 为降低误伤，仅检测正文起始位置，不扫描全文任意位置。

### 3) Description fallback strategy

- `getDescription(post)` 改为：
  1. frontmatter `description` 非空则直接返回；
  2. 否则先执行正文污染校验；
  3. 校验通过后再基于正文提取摘要。

## Risks and Mitigations

- **风险：误判 markdown 教学文中的 YAML 示例**
  - 缓解：只检测正文“起始片段”的 frontmatter 块，不匹配中段示例。
- **风险：`getCollection` 在头部组件增加构建耗时**
  - 缓解：仅文章路由触发存在性查询；非文章页不做查询。

## Verification Plan

- 正向：
  - `pnpm build` 通过；
  - 中文单语文章不再输出无效英文 `hreflang`；
  - 语言切换按钮不再指向不存在的 `/en/article/{slug}`。
- 负向：
  - 构造正文起始重复 frontmatter 样例，构建应失败并给出可读错误。
