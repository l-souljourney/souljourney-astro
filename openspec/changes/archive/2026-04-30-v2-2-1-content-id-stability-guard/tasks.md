## 1. Content Entry ID Stability [H]

- [x] 1.1 [H] 在 `src/content.config.ts` 为 blog loader 固化 `generateId`（`lang::source_id::slug`）；验收：同 slug 的 zh/en 文章在 content store 中并存，不再互相覆盖
- [x] 1.2 [H] 补充 entry-id 生成策略回归测试（含同 slug 双语样例）；验收：测试可直接证明加载层唯一性

## 2. Publish Health Guard [H]

- [x] 2.1 [H] 新增发布健康检查脚本（统计 `blogSize/mirrorPairs/articleRoutes/rssItems` 并带阈值门禁）；验收：指标异常时脚本非零退出并输出可读诊断
- [x] 2.2 [H] 将健康检查接入 `.github/workflows/deploy.yml` 的 build 阶段；验收：异常集合不会进入 deploy-cos job
- [x] 2.3 [M] 为健康检查补充最小测试样例（正常/失败各一类）；验收：可在本地复现门禁行为

## 3. Content And Docs Cleanup [M]

- [x] 3.1 [H] 删除误推稿件 `src/content/blog/zh/1723-4k.md`；验收：该文件不再存在于分支并进入最终提交
- [x] 3.2 [M] 新增/更新故障分析文档，记录根因、修复、发布约束与回滚口径；验收：文档可独立指导排查与发布

## 4. Verification And Release Closure [H]

- [x] 4.1 [H] 执行最小完整验证（build + tests + health-check + publish-set 指标）；验收：命令与关键输出可在 PR 描述中回读
- [x] 4.2 [H] 完成 `v2.2.1` 分支提交、PR 合并到 `main` 并回读 GitHub Actions 构建结果；验收：`main` 上 deploy workflow 成功触发
