# Obsidian博客文章模板

## 使用方法
1. 在Obsidian中创建新文件
2. 复制以下模板内容
3. 修改Front Matter信息
4. 编写文章内容
5. 保存到 `src/content/blog/` 目录
6. 使用Obsidian Git插件推送

## 模板内容

```markdown
---
title: "文章标题"
categories: Code  # Code, Daily, Share
tags: ["标签1", "标签2", "标签3"]
id: "文章唯一ID"  # 英文，用于URL
date: 2025-06-13 14:00:00
cover: "封面图片URL（可选）"
recommend: false  # 是否推荐文章
top: false        # 是否置顶文章
hide: false       # 是否隐藏文章
---

## 文章简介
简要描述文章内容...

## 正文开始

在这里开始编写您的文章内容。

### 支持的功能

1. **代码块**
```javascript
console.log("Hello World!");
```

2. **图片**
![图片描述](图片URL)

3. **链接**
[链接文字](链接URL)

4. **自定义组件**
:::note{type="success"}
这是一个成功提示框
:::

::btn[按钮文字]{link="链接地址"}

## 发布流程

1. 编辑完成后检查格式
2. 确认Front Matter信息正确
3. 使用Obsidian Git插件提交并推送到main分支
4. 自动触发双线部署
```

## Front Matter字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 文章标题 |
| categories | string | ✅ | 分类：Code/Daily/Share |
| tags | array | ✅ | 标签数组 |
| id | string | ✅ | 文章唯一标识，用于URL |
| date | datetime | ✅ | 发布日期时间 |
| cover | string | ❌ | 封面图片URL |
| recommend | boolean | ❌ | 是否推荐，默认false |
| top | boolean | ❌ | 是否置顶，默认false |
| hide | boolean | ❌ | 是否隐藏，默认false |

## 注意事项

1. **文件名**：建议使用中文标题作为文件名
2. **ID字段**：必须唯一，建议使用英文短横线格式
3. **日期格式**：YYYY-MM-DD HH:mm:ss
4. **标签**：使用数组格式，用英文引号包围
5. **分类**：只能选择 Code、Daily、Share 之一 