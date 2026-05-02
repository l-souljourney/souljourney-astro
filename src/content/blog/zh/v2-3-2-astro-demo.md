---
title: v2.3.2 Astro 双语发布联调 Demo
date: "2026-05-01 21:34:32"
updated: "2026-05-02 11:46:12"
categories: ai-era
slug: v2-3-2-astro-demo
source_id: obs_4817801d
tags:
    - AI
    - 大模型
    - GPT
description: v2.3.2 Astro 双语发布联调 Demo 这是一篇用于验证 Obsidian Engine Publish 插件本地端到端链路的临时文章。它会测试从 Obsidian 侧校对元数据、创建英文镜像稿、调用 wxengine 发布、推送 GitHub、触发 Astro 构建部署，再到 CDN 页...
recommend: false
top: false
hide: false
lang: zh
author: 执笔丨忠程
word_count: 303
reading_time: 2
target: mp2
render_profile: default
---

# v2.3.2 Astro 双语发布联调 Demo

这是一篇用于验证 Obsidian Engine Publish 插件本地端到端链路的临时文章。它会测试从 Obsidian 侧校对元数据、创建英文镜像稿、调用 wxengine 发布、推送 GitHub、触发 Astro 构建部署，再到 CDN 页面可见的完整路径。

本段包含一些明确的分类关键词：AI、大模型、LLM、ChatGPT。插件的自动分类和标签逻辑应该能把它归入 `ai-era` 或生成相关标签。如果分类没有命中，当前插件会兜底为 `life`，这也需要在联调记录里说明。

这篇文章的目标不是长期保留，而是确认双语发布链路在真实环境里可用。中文稿发布成功后，英文镜像稿应该复用同一个 `source_id`、`slug` 和 `categories`，只改变语言、标题、摘要、标签和正文内容。

联调检查点包括：

- 元数据校对是否补齐必要 frontmatter
- 英文镜像稿是否生成在同目录
- 翻译任务是否进入 `queued -> running -> ok/failed` 状态流
- Astro 双语同步发布是否返回 `zh/en` 两个 route
- 线上站点是否在发布传播窗口后显示中英文文章
