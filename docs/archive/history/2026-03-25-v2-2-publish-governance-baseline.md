# v2.2 双语发布治理基线

更新时间：2026-03-25

## 1. 扫描结论

- 扫描范围：`src/content/blog/zh/` 与 `src/content/blog/en/`
- 扫描文件数：`3`
- 完整镜像对数量：`0`
- 未配对分组数量：`3`

结论：当前仓库中没有任何满足“共享 `source_id` + 共享 `slug`”的完整 zh/en 镜像对。因此启用 `v2.2.0` 强镜像规则后，公开 article route、tag route、RSS 条目和搜索文章索引均会归零，直到内容补齐镜像对。

## 2. 未配对稿件清单

| 状态 | lang | source_id | slug | 文件 |
| --- | --- | --- | --- | --- |
| `pending_translation` | `en` | `obs_cursor_trial_pool_crash_20251203_en` | `the-night-cursors-trial-account-pool-crashed-from-coding-god-to-instantly-kod` | `src/content/blog/en/the-night-cursors-trial-account-pool-crashed-from-coding-god-to-instantly-kod.md` |
| `pending_translation` | `zh` | `obs_cursor_pool_failure_night_20251114` | `cursor-pool-failure-night-programming-god-fall` | `src/content/blog/zh/Cursor号池瘫痪之夜 我从编程之神 原地落地成盒.md` |
| `pending_translation` | `zh` | `obs_astro_bilingual_site_solution_20251203` | `astro-bilingual-site-solution` | `src/content/blog/zh/astro 中英文站点生成的参考方案.md` |

## 3. 治理建议

- 为成对翻译稿复用同一个 `source_id`
- 为成对翻译稿复用同一个 `slug`
- 保持 zh/en 的 `categories` 一致
- 补齐镜像前，不要期待这些稿件进入 article、RSS、sitemap、Pagefind 公开索引
