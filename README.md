# L-忠程丨生死看淡不服就淦

> 一个基于 Astro 构建的现代化个人博客，记录投资感悟、AI探索、商业思考与人生哲学

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.7.12-orange.svg)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-latest-green.svg)](https://pnpm.io/)

## 🌟 项目简介

这是执笔忠程的个人博客网站，采用现代化的技术栈构建，专注于分享投资感悟、AI时代思考、商业哲学和人生感悟。博客秉承"生死看淡，不服就淦"的人生态度，记录一个80后在投资路上、商业思考中的点点滴滴。

### 🎯 内容定位

- **投资路** - 投资心得、市场分析、实盘笔记
- **AI时代** - 人工智能探索、技术思考、未来展望  
- **浙商** - 商业思维、创业感悟、浙商精神
- **天问** - 人生哲学、深度思考、价值观探讨
- **活着** - 生活感悟、中年思考、人生体验

## 🚀 技术特性

### 核心技术栈

- **框架**: [Astro 5.7.12](https://astro.build/) - 现代化静态站点生成器
- **语言**: TypeScript 5.8.3 - 类型安全的JavaScript
- **样式**: Less - CSS预处理器
- **包管理**: pnpm - 高效的包管理工具
- **构建**: Vite - 快速的构建工具

### 功能特性

#### 📝 内容管理
- **Markdown/MDX支持** - 支持扩展的Markdown语法
- **分类系统** - 5大核心分类，中英文映射
- **标签系统** - 灵活的文章标签管理
- **文章统计** - 字数统计、阅读时间估算
- **SEO优化** - 自动生成sitemap、RSS订阅

#### 🎨 用户体验
- **响应式设计** - 完美适配桌面端和移动端
- **懒加载** - 图片懒加载，提升页面性能
- **平滑滚动** - 优雅的页面滚动体验
- **页面转场** - 基于Swup的流畅页面切换
- **代码高亮** - Shiki语法高亮支持
- **数学公式** - KaTeX数学公式渲染

#### 🔧 开发体验
- **热重载** - 开发时实时预览
- **TypeScript** - 完整的类型支持
- **组件化** - 模块化的Astro组件
- **自定义指令** - 扩展的Markdown指令
- **路径别名** - 简化的导入路径

## 📁 项目结构

```
souljourneyblog/
├── .cnb.yml                 # CNB构建配置
├── astro.config.mjs          # Astro配置文件
├── package.json              # 项目依赖配置
├── tsconfig.json             # TypeScript配置
├── public/                   # 静态资源
│   ├── assets/              # 图片、字体等资源
│   └── favicon.ico          # 网站图标
├── src/
│   ├── components/          # Astro组件
│   │   ├── ArticleCard/     # 文章卡片组件
│   │   ├── Header/          # 头部导航组件
│   │   ├── Aside/           # 侧边栏组件
│   │   └── ...
│   ├── content/             # 内容集合
│   │   └── blog/            # 博客文章
│   ├── layouts/             # 页面布局
│   ├── pages/               # 页面路由
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   ├── plugins/             # 自定义插件
│   └── config.ts            # 站点配置
└── scripts/                 # 构建脚本
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 快速开始

```bash
# 克隆项目
git clone https://github.com/l-souljourney/souljourney-astro.git
cd souljourney-astro

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 开发命令

```bash
# 创建新文章
pnpm newpost

# 禁用开发工具栏
pnpm offdev

# 启用开发工具栏
pnpm ondev
```

### 文章创建

使用内置脚本创建新文章：

```bash
pnpm newpost
```

文章格式示例：

```markdown
---
title: "文章标题"
date: 2025-01-01
categories: "investment"  # 分类：investment/ai-era/zhejiang-business/philosophy/life
tags: ["投资", "思考"]
cover: "/assets/images/cover.jpg"
top: false
---

文章内容...
```

## 🚀 部署方案

### CNB自动化部署

项目配置了完整的CNB自动化部署流程：

#### 主分支 (main)
1. **构建项目** - 安装依赖并构建静态文件
2. **GitHub推送** - 推送到GitHub仓库
3. **COS部署** - 部署到腾讯云COS
4. **同步develop** - 自动同步到develop分支

#### 开发分支 (develop)
- **构建测试** - 验证代码构建正常

#### Pull Request
- **构建检查** - PR时自动构建验证

### 手动部署

```bash
# 构建项目
pnpm build

# 部署到静态托管服务
# 将 dist/ 目录上传到你的托管服务
```

## 📊 内容管理

### 分类系统

| 英文路径 | 中文名称 | 内容定位 |
|---------|---------|----------|
| investment | 投资路 | 投资心得、市场分析 |
| ai-era | AI时代 | AI探索、技术思考 |
| zhejiang-business | 浙商 | 商业思维、创业感悟 |
| philosophy | 天问 | 人生哲学、深度思考 |
| life | 活着 | 生活感悟、人生体验 |

### Git工作流

#### 内容管理分支策略
- **main分支** - 生产环境，自动部署
- **develop分支** - 开发环境，内容预览
- **feature分支** - 功能开发分支

#### 程序开发分支策略
- **main分支** - 稳定版本发布
- **develop分支** - 开发集成分支
- **feature/*分支** - 功能开发分支
- **hotfix/*分支** - 紧急修复分支

## 🔧 配置说明

### 站点配置

主要配置文件：`src/config.ts`

```typescript
export default {
  Title: 'L-忠程丨生死看淡不服就淦',
  Site: 'https://blog.l-souljourney.cn',
  Author: '执笔忠程',
  Description: '记录投资感悟、AI探索、商业思考与人生哲学',
  // ... 更多配置
}
```

### 主题定制

支持自定义主题色彩：

```typescript
Theme: {
  "--vh-main-color": "#2c5aa0",     // 主题色
  "--vh-font-color": "#34495e",     // 字体色
  "--vh-aside-width": "318px",      // 侧边栏宽度
  "--vh-main-radius": "0.88rem",    // 圆角大小
}
```

## 📱 社交媒体

### 微信公众号

- **主号**: L-忠程丨生死看淡不服就淦 - 博客文章同步更新
- **投资号**: L-忠程 - 投资笔记，2020年10月开始日更

### 联系方式

- **博客**: https://blog.l-souljourney.cn
- **GitHub**: https://github.com/l-souljourney/souljourney-astro
- **私信**: 通过公众号私信联系

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

感谢以下开源项目：

- [Astro](https://astro.build/) - 现代化的静态站点生成器
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Swup](https://swup.js.org/) - 页面转场动画库

---

**生死看淡，不服就淦！** 🚀