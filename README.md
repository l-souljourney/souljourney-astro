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

## 🚀 技术特性

- **核心框架**: [Astro 5.16](https://astro.build/) - 极致性能的静态站点生成器
- **页面转场**: **View Transitions** - 浏览器原生级无刷新页面切换
- **样式系统**: Less + CSS Variables - 深度定制的响应式主题
- **内容管理**: Markdown/MDX + Content Layer - 类型安全的内容集合
- **交互体验**: 
    - 图片懒加载与灯箱效果
    - 智能目录 (TOC) 与平滑滚动
    - 完美适配的暗黑模式

## 🛠️ 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 🚀 部署方案

本项目配置了 **CNB (云原生构建)** 自动化流水线：
1.  **自动构建**: 代码推送到 `main` 分支自动触发构建。
2.  **双线部署**: 同时部署至腾讯云 COS 和 GitHub Pages。
3.  **分支同步**: 自动同步 `main` 分支代码到 `develop` 分支。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

**生死看淡，不服就淦！** 🚀