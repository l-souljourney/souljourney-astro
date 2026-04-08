## Why

`v2.2.0` 已将公开面收敛到“完整 zh/en 镜像对”，但本次线上故障暴露出一个规则层缺口：Astro `glob` loader 默认以 `slug` 作为 content entry id，同 slug 的 zh/en 稿件会发生覆盖，叠加强镜像规则后可直接导致公开集合归零。  
为确保 `v2.2.x` 路线可持续推进，需要在 `v2.2.1` 引入 entry id 稳定性约束与构建前置健康门禁，避免再次出现“构建成功但公开内容为空”的静默故障。

## What Changes

- 在 `src/content.config.ts` 为 blog collection 显式定义 `generateId`，使用 `lang + source_id + slug` 生成稳定唯一 entry id，避免 zh/en 同 slug 覆盖
- 新增发布健康检查脚本与 CI 门禁：当 publish set 异常塌缩（如镜像对为 0）时阻断构建发布
- 补充回归测试，覆盖“同 slug 跨语言不覆盖”与“发布健康检查”两类防回归场景
- 回写文档（RCA + 运维说明），明确故障原因、修复口径与 Obsidian 发布注意事项
- 删除误推的最新文章 `src/content/blog/zh/1723-4k.md`，保持 `main` 发布内容符合当前治理口径

## Non-goals

- 不调整 `v2.2.0` 已定义的“完整镜像对才公开”业务规则
- 不在本次变更中推进模板去重与查询层重构（仍留给 `v2.2.1` 后续收敛任务）
- 不升级 Astro 主版本（`v2.3.0` 升级窗口保持不变）
- 不改动 Engine 外部发布链路（Obsidian -> HTTP -> GitHub）

## Capabilities

### New Capabilities
- `astro-content-entry-id-stability`: 规范 Astro 内容 entry id 生成策略，确保双语稿件在 content store 中可并存且可追踪
- `astro-publish-health-guard`: 定义发布健康检查与 CI 门禁规则，阻断“公开集合归零”类静默故障

### Modified Capabilities
- `astro-bilingual-pair-governance`: 新增“公开集合健康门禁”要求，保证强镜像发布规则不会因 loader 覆盖导致全量空集
- `astro-publish-schema-alignment`: 在发布契约中补充 entry id 生成约束，确保 `lang/source_id/slug` 在加载层可唯一标识

## Impact

- **受影响代码**: `src/content.config.ts`, `.github/workflows/deploy.yml`, `tests/*`, `scripts/*`
- **受影响内容**: 删除误推稿件 `src/content/blog/zh/1723-4k.md`
- **受影响文档**: `docs/` 下新增/更新故障分析与发布操作约束
- **Engine 依赖**: 无新增依赖；仅补充发布约束说明，保持现有 Engine 接口不变
