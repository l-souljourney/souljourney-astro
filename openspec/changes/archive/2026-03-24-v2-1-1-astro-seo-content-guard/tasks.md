## 1. Alternate 与语言切换守卫 [H]

- [x] 1.1 [H] 在 `src/components/Head/Head.astro` 增加文章对侧语言存在性判断；AC: 无对侧稿件时不输出无效 `hreflang`
- [x] 1.2 [H] 在 `src/components/Header/Header.astro` 调整文章页语言切换目标；AC: 不再跳转不存在的 `/en/article/{slug}` 或 `/article/{slug}`

## 2. 正文污染构建守卫 [H]

- [x] 2.1 [H] 在 markdown 处理链新增正文起始重复 frontmatter 检测；AC: 命中时构建失败并带文件标识
- [x] 2.2 [H] 调整 `getDescription`：优先 frontmatter `description`，回退正文前执行污染检测；AC: meta 描述不再来自污染 YAML 文本
- [x] 2.3 [M] 清理 `src/content/blog/zh/obs-1e2bf5c7.md` 的重复 frontmatter 块；AC: 文件仅保留一段 frontmatter

## 3. 验证与交付 [H]

- [x] 3.1 [H] 执行 `pnpm build`；AC: 构建通过
- [x] 3.2 [H] 负向验证：临时注入重复 frontmatter 样例触发失败；AC: 构建失败且错误可读
- [x] 3.3 [H] 线上抽查 `obs-1e2bf5c7`：`hreflang=en` 不再指向 404；AC: 页面 SEO link 符合预期
