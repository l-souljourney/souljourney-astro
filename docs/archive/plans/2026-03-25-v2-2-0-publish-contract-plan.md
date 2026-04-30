# v2.2.0 Publish Contract Implementation Plan

**Goal:** 为 `v2-2-0-bilingual-publishing-governance` 落地首个实现切片，先收紧发布字段契约，再建立双语镜像 `publish-set` 规则与最小验证样例。

**Architecture:** 本轮先把跨语言治理抽成纯函数 helper，避免一开始就把 `astro:content` 读取、路由层和聚合层耦合在一起。验证分两层：`node --test` 覆盖配对规则，`pnpm build` 覆盖 Astro schema 的构建期失败行为。

**Tech Stack:** Astro 5.x, TypeScript, Node `node:test`, OpenSpec

---

### Task 1: 建立 publish-set 规则测试

**Files:**
- Create: `tests/v2.2.0-publish-set.test.ts`
- Test: `tests/v2.2.0-publish-set.test.ts`

**Step 1: Write the failing test**

为以下行为写失败用例：
- 完整 zh/en 镜像对进入 `published`
- 单边稿件进入 `pendingTranslation`
- 同一 `source_id` 对应多个 `slug` 时进入 `sourceIdConflicts`
- 同一 `slug` 对应多个 `source_id` 时进入 `slugConflicts`

**Step 2: Run test to verify it fails**

Run: `rm -rf .tmp/test-dist && pnpm exec tsc --outDir .tmp/test-dist --module NodeNext --moduleResolution NodeNext --target ES2022 tests/v2.2.0-publish-set.test.ts src/utils/publishSet.ts && node --test .tmp/test-dist/tests/v2.2.0-publish-set.test.js`

Expected: FAIL，提示缺少 `src/utils/publishSet.ts` 或导出函数不存在

### Task 2: 实现最小 publish-set helper

**Files:**
- Create: `src/utils/publishSet.ts`
- Modify: `src/content.config.ts`
- Test: `tests/v2.2.0-publish-set.test.ts`

**Step 1: Write minimal implementation**

在 `src/utils/publishSet.ts` 中实现纯函数 helper，最少包含：
- 用 `source_id + slug` 作为镜像组键
- 识别完整镜像对
- 标记 `pendingTranslation`
- 标记 `sourceIdConflicts` / `slugConflicts`

同时在 `src/content.config.ts` 中将 `lang` 调整为必填。

**Step 2: Run test to verify it passes**

Run: `rm -rf .tmp/test-dist && pnpm exec tsc --outDir .tmp/test-dist --module NodeNext --moduleResolution NodeNext --target ES2022 tests/v2.2.0-publish-set.test.ts src/utils/publishSet.ts && node --test .tmp/test-dist/tests/v2.2.0-publish-set.test.js`

Expected: PASS

**Step 3: Run build to verify schema contract**

Run: `pnpm build`

Expected: PASS；若失败，错误必须直接指向不满足 `lang`/schema 的内容文件

### Task 3: 回写 OpenSpec 任务状态

**Files:**
- Modify: `openspec/changes/v2-2-0-bilingual-publishing-governance/tasks.md`

**Step 1: Mark completed tasks**

将已完成的 `1.1`、`1.2`、`1.3` 勾选为完成。

**Step 2: Re-run targeted verification**

Run:
- `git diff -- src/content.config.ts src/utils/publishSet.ts tests/v2.2.0-publish-set.test.ts openspec/changes/v2-2-0-bilingual-publishing-governance/tasks.md`
- `git status --short`

Expected: 仅出现本轮预期变更
