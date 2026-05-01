# v2.3.1 Astro / Obsidian 双语发布工作流收敛

**日期：** 2026-05-01  
**版本：** `v2.3.1`  
**状态：** active  
**目标：** 为 “Obsidian 点击触发 -> wxengine -> git push -> Astro 构建部署 -> 双语公开发布” 建立唯一、稳定、可执行的 Astro 侧口径。

---

## 1. 为什么要有 `v2.3.1`

`v2.3.0` 完成了 Astro 仓库内部的文档收敛、公开集合治理和技术收敛，但还没有完成一件关键工作：

> 把 **Astro 仓库当前真实约束** 收敛成一个足够清晰的外部对接版本，让 Obsidian 插件可以按它继续开发“一键双语同步发布”。

目前存在两个现实问题：

1. `docs/README.md` 里同时存在两份“活跃”对接文档，但它们彼此冲突。
2. Obsidian 插件已经实现了“单稿 Astro 发布”和“英文镜像稿创建”，但还没有实现“单击完成 zh/en 双语同步发布”。

因此 `v2.3.1` 不追求大规模重构，而是作为一个小版本补丁，先把 **跨仓库工作流的契约与分工** 定清楚。

---

## 2. 当前真实状态

### 2.1 Astro 仓库已经具备

- 严格的 content schema：
  - 必填 `title/date/categories/slug/source_id/lang`
  - `categories` 必须是 canonical key
  - `slug` 必须匹配严格 kebab-case
- 双语公开集合治理：
  - 只有完整 `zh/en` 镜像对进入 article route / RSS / sitemap / search
  - 单语稿件允许留在仓库，但不会公开
- GitHub Actions 构建部署：
  - GitHub `main` 分支 push 后，Cloudflare 会自动拉取部署一版
  - GitHub Actions 同时执行 build，并以 `publish-health` 作为发布门禁
  - 构建产物同步到腾讯云 COS，并支持 CDN 刷新

### 2.2 Obsidian 插件已经具备

- 元数据校对
- 本地图片上传 / 发布前转换
- `mp2` 预览
- 英文镜像稿创建（异步翻译任务）
- 单稿 Astro 发布
- Astro 下架

### 2.3 当前还缺什么

- Obsidian 插件侧“一键双语同步发布”
- Astro / Obsidian / wxengine 三方工作流的唯一活跃对接文档
- 对“中文单稿发布成功但不会公开”的体验与约束澄清
- 一次真实的端到端联调与验收记录

---

## 3. 当前唯一有效契约

`v2.3.1` 起，Astro 侧对外实现必须只认：

- [Astro 发布契约 v2.2](../astro-wxengine-publish-contract-v2.2.md)

该文档定义了当前真实口径：

- `source_id` 与 `slug` 是跨语言镜像主键
- `lang` 为显式必填
- `categories` 必须使用 canonical key
- 成功响应必须返回 `data.route`
- 只有完整 `zh/en` 镜像对进入公开集合

任何与该文档冲突的旧规格，均不得作为当前版本开发依据。

---

## 4. `v2.3.1` Astro 仓库范围

本仓库在 `v2.3.1` 只负责以下事项：

### A. 文档治理

- 清理活跃文档索引，移除失效规格
- 明确 Astro 当前唯一对接契约
- 在路线图中新增 `v2.3.1` 阶段
- 形成供 Obsidian 仓库继续开发的任务输入

### B. Astro 侧最小行为收敛

本版本允许继续补充以下最小程序调整：

- 明确“单语稿件不会公开”的系统行为口径
- 若需要，在 Astro 侧补最小防呆或验证脚本，避免外部把“API 成功”误认为“公开发布成功”

### C. 验证要求

- `pnpm build`
- `pnpm check:publish-health`
- 若修改 `publishSet` / schema / script，再补最小相关测试

---

## 5. Obsidian 插件仓库范围

Obsidian 仓库后续版本应负责以下事项：

### A. UI / 命令入口

- 新增 “Astro 双语同步发布” 入口
- 新增对应命令入口
- 让侧边栏和命令行为一致

### B. 双语发布编排

- 从当前中文稿定位英文镜像稿
- 顺序执行 `zh -> en` 双稿发布
- 按语言维度输出日志与错误
- 明确 `partial_failed` / `failed` / `ok` 聚合状态

### C. 发布前约束

- 若目标是公开双语部署，则不允许只发布中文单稿后结束
- 对 `source_id / slug / categories / lang` 的镜像一致性继续严格校验

### D. 联调与验收

- 用真实文章验证：
  - Obsidian 点击
  - wxengine 接收
  - git push 到 Astro 仓库
  - GitHub Actions build / deploy
  - zh/en 公开路由同时可见

---

## 6. 失效文档处理原则

以下文档仍可保留作历史背景，但不得再作为当前实现依据：

- `docs/2026-03-09-v3-8-frontend-integration-spec.md`

它的主要失效点包括：

- 使用过期字段 `id`
- `categories` 示例不符合当前 canonical enum
- `lang` 口径与当前 schema 不一致
- 默认流程仍按“仅中文写入内容目录”的思路描述

---

## 7. 版本验收标准

`v2.3.1` 完成时，至少应满足：

- [ ] Astro 仓库活跃文档不再自相矛盾
- [ ] Obsidian 仓库可以只依赖当前活跃契约继续开发
- [ ] 路线图明确存在 `v2.3.1` 这个跨仓库工作流收敛补丁
- [ ] Astro 当前双语公开规则有清晰、统一、可引用的版本文档

---

## 8. 下一步协同方式

推荐使用 **两个终端 / 两个 Trellis 会话**：

- 终端 A：`souljourney-blog`
  - 负责 Astro 侧文档治理、契约收敛、必要程序调整
- 终端 B：`obsidian-lengine-plugin`
  - 负责插件侧双语同步发布编排、UI、命令、联调

原因：

- 两个仓库各自维护独立 `current task`
- 各自验证命令、版本记录和 spec 更新边界更清楚
- 避免跨仓库混写 PRD / research / 验证结果
