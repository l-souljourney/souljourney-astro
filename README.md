# L-忠程丨生死看淡不服就淦

> 一个基于 Astro 5.0 构建的现代化个人博客，记录投资感悟、AI探索、商业思考与人生哲学

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.16.0-orange.svg)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

## 🌟 项目简介

这是执笔忠程的个人博客网站，采用 **Astro 5.16 + View Transitions** 的现代化架构构建。博客秉承"生死看淡，不服就淦"的人生态度，记录一个80后在投资路上、商业思考中的点点滴滴。

### 🎯 内容定位

- **投资路** - 投资心得、市场分析、实盘笔记
- **AI时代** - 人工智能探索、技术思考、未来展望  
- **浙商** - 商业思维、创业感悟、浙商精神
- **天问** - 人生哲学、深度思考、价值观探讨
- **活着** - 生活感悟、中年思考、人生体验

### 🌍 国际化支持 (v1.9.0)

本博客支持**中英双语**，实现了完整的国际化架构：
- **中文版**: `https://blog.l-souljourney.cn/`
- **英文版**: `https://blog.l-souljourney.cn/en/`
- **智能切换**: Header右上角一键切换语言
- **SEO优化**: 完整的hreflang标签支持，告诉搜索引擎语言版本关系

## 🚀 技术特性

- **核心框架**: [Astro 5.16](https://astro.build/) - 极致性能的静态站点生成器
- **页面转场**: **View Transitions** - 浏览器原生级无刷新页面切换
- **搜索系统**: **Pagefind** - 静态索引搜索，支持中文分词
- **图标系统**: **astro-icon** - 基于 SVG 的高性能图标解决方案
- **样式系统**: 
    - **Tailwind CSS 3.4.18** - 现代化 Utility-first CSS 框架
    - **@tailwindcss/typography (prose-zinc)** - 零配置极简排版方案
    - **Shadcn UI (Zinc)** - 统一的设计系统与 CSS Variables
    - **Starlight 设计语言** - 提取 Starlight 核心设计规范（v1.8.5 集成）
- **字体系统** (v1.8.5):
    - **Inter** - 正文字体，支持 OpenType 特性（cv02/cv03/cv04/cv11）
    - **JetBrains Mono** - 代码字体，支持编程连字（liga + calt）
    - **本地托管** - 通过 Fontsource 自托管，离线可用
- **排版系统** (v1.8.6):
    - **Starlight Typography** - 100% 对齐 Starlight 文档级排版规范
    - **精细化调优** - 优化段落间距 (1.25em)、列表缩进与引用块样式
- **组件系统**:
    - **代码高亮** - Shiki GitHub Light/Dark Dimmed 主题 (v1.8.5)
    - **ArticleCard** - 统一 Starlight 设计风格 (v1.8.6)
- **动画规范** (v1.8.5):
    - **统一时长** - 所有动画 200ms（Starlight 标准）
    - **统一缓动** - ease-out 自然流畅
    - **性能优化** - scaleX 替代 width，提升 20-30%
- **性能优化** (v1.8.6):
    - **依赖瘦身** - 移除 @astrojs/starlight 完整依赖 (-10MB)
    - **构建优化** - 零外部依赖，轻量化构建
- **内容管理**: Markdown/MDX + Content Layer - 类型安全的内容集合
- **交互体验**: 
    - 图片懒加载与灯箱效果
    - 智能目录 (TOC) 与平滑滚动
    - 完美适配的暗黑模式(零FOUC)
    - 响应式布局与微交互动效
- **国际化 (i18n)** (v1.9.5):
    - **双语支持**: 中文 + 英文全栈支持
    - **智能路由**: 中文 `/`, 英文 `/en/`
    - **翻译系统**: 强类型检查的 UI 翻译字典 (`UIKeys`)
    - **SEO优化**: hreflang标签 + og:locale动态设置
    - **统一错误页**: 基于组件的自适应 404 页面


## 🛠️ 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📝 内容发布流程 (Obsidian + CNB)

本博客采用 **Obsidian + Git + CNB** 的现代化内容管理流程：

### 工作流程

```
Obsidian (本地写作)
  ↓ Git Push
CNB Docs仓库 (published/zh/ 和 published/en/)
  ↓ .cnb.yml 自动触发
CNB Astro仓库 (自动同步到 src/content/blog/)
  ↓ 自动构建
线上博客 (blog.l-souljourney.cn)
```

### Obsidian 目录结构

```
Blog/
├── drafts/          # 草稿区（仅iCloud同步）
├── ready/           # 待发布（AI处理元数据）
├── published/       # 已发布（Git + iCloud）
│   ├── zh/          # 中文文章
│   └── en/          # 英文文章（AI翻译）
└── assets/          # 资源文件
```

### 发布步骤

1. 在 Obsidian `drafts/` 创建Markdown文章
2. 完成后移至 `ready/`，AI自动填充YAML元数据
3. 移至 `published/zh/`，Git自动提交推送
4. CNB监听到变化，自动同步到Astro仓库并构建
5. (可选) AI翻译为英文，放入 `published/en/`

### CNB自动化

- **监听**: `published/**` 目录变化
- **同步**: 自动复制到 `src/content/blog/`
- **构建**: 触发Astro构建和部署
- **保护**: 空目录检测，防止误删

详见 [Blog仓库README](https://cnb.cool/l-souljourney/souljourneydocs)

## 🚀 部署方案

本项目配置了 **CNB (云原生构建)** 自动化流水线：
1.  **自动构建**: 代码推送到 `main` 分支自动触发构建
2.  **双线部署**: 同时部署至腾讯云 COS 和 GitHub Pages
3.  **分支同步**: 自动同步 `main` 分支代码到 `develop` 分支

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

**生死看淡，不服就淦！** 🚀