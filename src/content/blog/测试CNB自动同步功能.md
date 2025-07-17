---
title: "测试CNB自动同步功能"
categories: "天问"
tags: ["测试", "自动化", "CNB"]
id: "test-cnb-sync"
date: 2025-07-17 16:00:00
recommend: false
top: false
---

# 测试CNB自动同步功能

这是一篇测试文章，用于验证从Obsidian文档仓库自动同步到博客仓库的功能是否正常工作。

## 测试目标

1. ✅ 验证 `published/` 目录变化能够触发CNB构建
2. ✅ 验证文档仓库到博客仓库的自动同步
3. ✅ 验证博客仓库的自动构建部署

## 技术实现

- **触发条件**：`ifModify: ["published/**"]`
- **同步路径**：`published/* → src/content/blog/`
- **目标仓库**：`cnb.cool/l-souljourney/souljourney-astro`

## 预期结果

如果一切正常，这篇文章应该会：
1. 触发CNB文档仓库的构建
2. 自动同步到博客仓库的 `src/content/blog/` 目录
3. 触发博客仓库的构建部署
4. 最终在博客网站上可见

---

**测试时间**：2025-07-17 16:00:00  
**测试状态**：等待验证... 