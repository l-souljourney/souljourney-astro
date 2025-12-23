# AI 导航站项目方案 (AI Navigation Directory Project Proposal)
## 1. 项目概述 (Project Overview)
**目标**: 构建一个高性能、现代化的 AI 工具/网站导航平台（类似 ai-bot.cn）。  
**核心特点**:

+ **极速体验**: 前端采用 Astro 构建纯静态页面 (SSG)，SEO 友好，加载速度极快。
+ **单人全栈**: 适合个人开发者/管理员维护，后台高效易用。
+ **AI 赋能**: 利用大模型自动分析收录的网址，生成简介、标签和分类，大幅降低维护成本。
+ **现代化 UI**: 全站使用 Shadcn UI + Tailwind CSS，保持设计风格统一且高端。

---

## 2. 关键技术决策与分析 (Key Decisions & Analysis)
### 2.1 UI 设计策略：Figma vs. Vibe Coding
+ **问题**: 是否需要先做 Figma 设计稿？
+ **结论**: **不需要 Figma，直接采用 Vibe Coding (AI 辅助编程)**。
+ **理由**:
    1. **效率至上**: 对于单人开发，维护 Figma 和代码的一致性是巨大的负担。
    2. **组件标准化**: 我们使用 **Shadcn UI**，它本身就是一套高质量的设计系统。我们不需要"设计"按钮或卡片的样式，只需要"组装"它们。
    3. **AI 能力**: 现在的 LLM (Gemini/Claude) 非常擅长理解 "使用 Shadcn 创建一个带有搜索栏和卡片网格的深色模式布局" 这样的指令，并直接生成高质量的 Tailwind 代码。
    4. **迭代方式**: 直接在代码中微调 Padding 和 Color 比在 Figma 改完再写代码要快得多。

### 2.2 前端选型：Astro vs. Vue SPA
+ **场景**: 收录 300-500+ 网址，未来可能更多。
+ **结论**: **坚定选择 Astro**。
+ **理由**:
    1. **SEO (搜索引擎优化)**: 导航站的流量命脉。Astro 默认输出纯 HTML，对爬虫最友好。Vue SPA 需要额外配置 SSR 才能达到同等效果，复杂度高。
    2. **性能**: Astro 的 "Zero JS by default" 意味着首屏加载几乎没有 JS 执行，速度极快。
    3. **交互**: 通过 **Vue Islands** 架构，我们依然可以在 Astro 中嵌入 Vue 组件（如搜索框），兼顾了静态站的速度和动态站的交互。

### 2.3 爬虫与 AI 架构
+ **架构**: Go 后端内置爬虫库 -> 提取文本 -> 调用 LLM API -> 结构化数据。
+ **说明**: 不需要单独部署爬虫服务。Go 的 `colly` 或 `chromedp` 库可以直接编译在后端二进制文件中，轻量且高效。

---

## 3. 详细技术栈架构 (Detailed Tech Stack)
### 3.1 前台 (Public Frontend) - `apps/web`
+ **核心框架**: **Astro 5.0** (SSG 模式)
+ **UI 库**: **Tailwind CSS** + **Shadcn UI** (基于 HTML/Vue 的组件)
+ **交互逻辑**: **Vue 3** (通过 Astro Islands 挂载)
+ **图标库**: **Lucide Vue**
+ **搜索**: **Fuse.js** (前端模糊搜索) 或 **Orama** (新一代边缘搜索)
+ **部署**: Vercel / Netlify / 任何静态服务器 (Nginx)

### 3.2 管理后台 (Admin Panel) - `apps/admin`
+ **核心框架**: **Vue 3** + **Vite** (SPA 模式)
+ **状态管理**: **Pinia**
+ **路由**: **Vue Router**
+ **UI 库**: **Shadcn Vue** + **Tailwind CSS**
+ **数据请求**: **TanStack Query (Vue Query)** (处理缓存和加载状态)
+ **表单**: **VeeValidate** + **Zod**
+ **富文本**: **Tiptap** (用于编辑 AI 生成的简介)

### 3.3 后端 API (Backend) - `apps/server`
+ **语言**: **Go (Golang) 1.23+**
+ **Web 框架**: **Gin** (轻量、高性能)
+ **数据库**: **SQLite** (使用 `mattn/go-sqlite3` 或纯 Go 的 `modernc.org/sqlite`)
+ **ORM**: **Gorm** 或 **Sqlc** (推荐 Gorm 开发快)
+ **爬虫**: **Chromedp** (Headless Chrome，抗反爬) 或 **Colly** (纯 HTTP，速度快)
+ **AI SDK**: **OpenAI Go SDK** (兼容 DeepSeek/Claude 等)
+ **工具**: **Air** (热重载)

### 3.4 浏览器插件 (Browser Extension) - `apps/extension`
+ **框架**: **Vue 3** + **Vite**
+ **构建工具**: **CRXJS Vite Plugin**
+ **通信**: `chrome.runtime` API

---

## 4. 功能清单 (Feature List)
### 4.1 前台 (Astro)
- [ ] **首页**: 
    - 英雄区 (Hero Section)：Slogan + 搜索框。
    - 热门/推荐卡片网格。
    - 分类侧边栏或顶部导航。
- [ ] **分类页**: 展示特定分类下的所有工具，支持按"最新"、"最热"、"评分"排序。
- [ ] **详情页**: 
    - 工具截图 (Lightbox 预览)。
    - AI 生成的简介与功能点。
    - 标签 (Tags) 链接。
    - "访问官网"直达按钮 (带 `rel="nofollow"` 控制)。
- [ ] **搜索**: 实时搜索，支持按名称、描述、标签匹配。
- [ ] **提交收录**: 简单的表单，游客提交 URL。

### 4.2 后台 (Vue Admin)
- [ ] **登录/鉴权**: JWT 登录。
- [ ] **仪表盘**: 
    - 待审列表 (Queue)。
    - 总收录数、今日新增。
- [ ] **URL 录入与 AI 分析**:
    - 输入框: 支持单行或多行 URL。
    - 按钮: "开始分析"。
    - 结果预览: AI 填好的表单 (标题、描述、分类、标签)，支持人工修正。
    - 截图: 自动抓取或手动上传。
- [ ] **内容管理**: 编辑已发布的站点信息。
- [ ] **发布管理**: 
    - 按钮: "构建并发布" (Trigger Build)。
    - 查看构建日志 (可选)。
- [ ] **Prompt 设置**: 修改发给 AI 的系统提示词。

### 4.3 后端 (Go)
- [ ] **API**:
    - `POST /auth/login`
    - `GET /sites` (Public/Admin)
    - `POST /sites/analyze` (核心: 爬虫+AI)
    - `POST /sites/publish` (触发 Webhook 或 Shell 脚本)
- [ ] **Worker**:
    - 异步处理批量分析任务。

---

## 5. Vibe Coding & PM 深度实施路线图 (Detailed Roadmap)
本路线图结合了 **产品经理 (PM)** 的 MVP 思维与 **Vibe Coding (AI 编程)** 的实操策略。

### Phase 1: 基础设施与核心验证 (Infrastructure & Core Validation)
**PM 视角**:

+ **目标**: 验证 "URL -> AI -> 结构化数据" 这条核心链路是否跑得通。如果 AI 分析效果不好，后面的 UI 做得再漂亮也没用。
+ **策略**: 不写 UI，只写脚本。快速试错。

**Vibe Coding 步骤**:

1. **环境搭建**:
    - _Prompt_: "帮我生成一个 Go + Gin 的基础项目结构，包含 `main.go` 和 `go.mod`。配置好 Air 热重载。"
2. **爬虫验证**:
    - _Prompt_: "写一个 Go 函数 `FetchURL(url string)`，使用 `chromedp` 库。目标是获取网页的 Title, Meta Description, H1 和 body 中的主要文本内容。注意处理 10秒超时。"
3. **AI 联调**:
    - _Prompt_: "写一个 Go 函数 `AnalyzeContent(text string)`，调用 OpenAI API。System Prompt 是：'你是一个专业的软件分析师，请分析以下网页内容，返回 JSON 格式：{summary, category, tags[], score}'。请定义对应的 Go Struct。"
4. **集成测试**:
    - 手动运行 `go run main.go`，在终端输入几个复杂的 AI 网站 URL，观察控制台输出的 JSON 是否准确。调整 Prompt 直到满意。

**关键里程碑**: 能够成功分析 10 个不同类型的 AI 网站，准确率达到 80%+。

---

### Phase 2: 管理后台 MVP (Admin Dashboard MVP)
**PM 视角**:

+ **目标**: 让管理员（你自己）能舒服地录入数据。
+ **策略**: 借力 Shadcn UI，不要自己写 CSS。功能优先：录入 -> 改 -> 存。

**Vibe Coding 步骤**:

1. **脚手架**:
    - _Prompt_: "使用 Vue 3 + Vite + Tailwind 初始化项目。安装 Shadcn Vue。配置好 Alias `@` 指向 `src`。"
2. **布局生成**:
    - _Prompt_: "生成一个经典的后台管理布局组件：左侧是固定宽度的 Sidebar（包含 Dashboard, Sites, Settings 链接），顶部是 Header（包含面包屑和用户头像），中间是 `router-view` 内容区。使用 Shadcn 的组件。"
3. **列表页开发**:
    - _Prompt_: "创建一个 `SitesList.vue`。使用 Shadcn Table 组件展示数据。列包含：ID, Logo(图片), 标题, 分类, 状态(Badge)。添加一个分页器在底部。"
4. **录入交互**:
    - _Prompt_: "创建一个 `SiteImport` Dialog 组件。里面有一个 Textarea 用于批量输入 URL。点击确定后，模拟调用 API，并在界面上显示一个进度条 (Progress)。"
5. **数据持久化**:
    - 完善 Go 后端的数据库操作，实现 CRUD。
    - _Prompt_: "使用 Gorm 定义 Site 模型，包含 ID, Title, URL, Description, Category, Tags (JSON), CreatedAt。实现增删改查的 Gin Handler。"

**关键里程碑**: 能在后台录入 50 个网站，并且可以编辑、删除。

---

### Phase 3: 前台构建与 SEO (Public Frontend)
**PM 视角**:

+ **目标**: 极速加载，SEO 满分。
+ **策略**: Astro 负责静态骨架，Vue 负责搜索交互。

**Vibe Coding 步骤**:

1. **Astro 初始化**:
    - _Prompt_: "初始化 Astro 项目，集成 Vue 和 Tailwind。创建一个基础 Layout，包含 SEO Meta 标签（Open Graph, Twitter Card）。"
2. **首页开发**:
    - _Prompt_: "设计一个 Hero Section 组件。背景是深色渐变，中间是大标题 'AI 工具导航' 和一个居中的搜索框。使用 Tailwind 类。"
3. **数据对接**:
    - _Prompt_: "在 Astro 的 `index.astro` 头部写一段 TypeScript 代码，通过 `fetch` 请求 Go 后端的 `/api/sites` 接口获取数据。然后遍历数据渲染 `SiteCard` 组件。"
4. **详情页生成**:
    - _Prompt_: "创建 `pages/site/[id].astro`。使用 `getStaticPaths` 函数，根据 API 返回的所有站点 ID 生成静态页面。页面布局包含左侧截图，右侧详细信息和 '访问官网' 按钮。"
5. **搜索功能**:
    - _Prompt_: "创建一个 Vue 组件 `SearchBox.vue`，使用 Fuse.js。将所有站点数据作为 Props 传入，实现实时模糊搜索。"

**关键里程碑**: 使用 Lighthouse 测试，Performance 和 SEO 分数都在 90+ 以上。

---

### Phase 4: 自动化与发布 (Automation)
**PM 视角**:

+ **目标**: "一键上线"。减少运维负担。
+ **策略**: 后台点一下，自动触发构建。

**Vibe Coding 步骤**:

1. **构建脚本**:
    - _Prompt_: "写一个 Shell 脚本 `deploy.sh`。步骤：1. 进入 `apps/web` 目录 2. 运行 `npm run build` 3. 将 `dist` 目录同步到 Nginx 的 web 根目录。"
2. **Webhook**:
    - _Prompt_: "在 Go 后端增加一个 `POST /publish` 接口。当被调用时，使用 `os/exec` 执行本地的 `deploy.sh` 脚本，并将输出日志返回给前端。"
3. **状态监控**:
    - 在管理后台的 Dashboard 增加一个"最后发布时间"和"构建状态"显示。

**关键里程碑**: 从后台点击"发布"到网站更新完成，全程不超过 2 分钟。

---

### Phase 5 (可选): 高级特性 (Advanced Features)
**浏览器插件**:

+ _Prompt_: "使用 CRXJS 创建一个 Chrome 插件。Popup 页面使用 Shadcn Vue。Content Script 读取当前页面的 Title 和 URL，点击 '提交' 按钮后发送到后端 `/api/submit`。"

**向量搜索**:

+ 集成 PGVector 或 Qdrant，实现语义搜索。

---

## 6. 潜在风险与应对 (Risk Management)
1. **AI 成本失控**:
    - _对策_: 在 Prompt 中限制 Token 输出长度。使用 gpt-4o-mini 或 gemini-flash 等高性价比模型。
2. **反爬虫升级**:
    - _对策_: 如果 Chromedp 失效，考虑接入第三方代理服务（如 ScraperAPI），或者在浏览器插件端进行抓取（利用用户的浏览器环境）。
3. **数据一致性**:
    - _对策_: Astro 是静态的，如果后台改了数据但没发布，前台不会变。需要在后台显眼位置提示"有未发布的更改"。
4. **Vibe Coding 代码质量**:
    - _对策_: AI 生成的代码需要人工 Review。特别是涉及安全的部分（如 JWT 验证）要仔细检查。建议每一个 Phase 结束后做一次代码审查。

