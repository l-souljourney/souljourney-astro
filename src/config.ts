export default {
  // 网站标题 - 符合ICP备案要求
  Title: 'L-忠程丨生死看淡不服就淦',
  // 网站地址
  Site: 'https://blog.l-souljourney.cn',
  // 网站副标题
  Subtitle: '生死看淡 不服就淦',
  // 网站描述
  Description: '执笔忠程的个人博客，记录投资感悟、AI探索、商业思考与人生哲学。从浙商精神到人生感悟，从技术梦想到中年思考，分享阅读心得与音乐情怀，探讨如何在变化的世界中活下来、活下去。',
  // 网站作者
  Author: '执笔忠程',
  // 作者头像
  Avatar: '/assets/images/logo.png',
  // 网站座右铭
  Motto: '生死看淡 不服就淦',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 - 已改为微信公众号二维码块
  Tips: '',
  // 首页打字机文案列表 - 已禁用动态滚动更新
  TypeWriteList: [],
  // 网站创建时间
  CreateTime: '2025-01-01',
  // ICP备案信息
  ICP: {
    enable: true,
    number: '浙ICP备2025152080号-1',
    link: 'https://beian.miit.gov.cn/',
    siteName: 'L-忠程丨生死看淡不服就淦'
  },
  // 顶部 Banner 配置
  HomeBanner: {
    enable: false,
    // 首页高度
    HomeHeight: '38.88rem',
    // 其他页面高度
    PageHeight: '28.88rem',
    // 背景
    background: "url('/assets/images/home-banner.webp') no-repeat center 60%/cover",
  },
  // 博客主题配置
  // Theme config moved to globals.css and tailwind.config.mjs
  // Theme: { ... } removed
  // 导航栏 - 5个分类 + 昔日 + 关于
  Navs: [
    { text: '投资路', link: '/categories/investment', icon: 'Nav_investment' },
    { text: 'AI时代', link: '/categories/ai-era', icon: 'Nav_ai' },
    { text: '浙商', link: '/categories/zhejiang-business', icon: 'Nav_business' },
    { text: '天问', link: '/categories/philosophy', icon: 'Nav_philosophy' },
    { text: '活着', link: '/categories/life', icon: 'Nav_life' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  // 侧边栏个人网站
  WebSites: [
    { text: 'GitHub', link: 'https://github.com/l-souljourney/souljourney-astro', icon: 'WebSite_github' },
    { text: '投资笔记', link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzk1NzY4ODU4NA==&action=getalbum&album_id=3776069041266311168#wechat_redirect', icon: 'WebSite_investment' },
    { text: '关于我', link: '/about', icon: 'WebSite_hot' },
  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://registry.npmmirror.com'
  ],
  // 博客音乐组件解析接口 - 保留音乐功能，符合80后情怀
  vhMusicApi: '',
  // 评论组件 - 引导到公众号交流
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: false,
      envId: ''
    },
    // Waline 评论
    Waline: {
      enable: false,
      serverURL: ''
    }
  },
  // 统计分析
  HanAnalytics: { enable: false, server: '', siteId: '' },
  // Google 广告
  GoogleAds: {
    ad_Client: '',
    asideAD_Slot: '',
    articleAD_Slot: ''
  },
  // 微信公众号引流配置
  WeChat: {
    // 微信公众号二维码
    QRCode: '/assets/images/wechat-qr.webp',
    // 公众号名称
    Name: 'L-忠程丨生死看淡不服就淦',
    // 引流文案
    Description: '文章交流与作者互动，都在公众号留言区。'
  },
  // SEO推送
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666,
  // 页脚配置
  Footer: {
    // 版权信息
    copyright: {
      // 所有者名称
      owner: 'L-忠程',
      // 品牌 slogan
      slogan: '生死看淡不服就淦',
      // 是否显示当前年份（自动计算）
      showCurrentYear: true
    },
    // 社交媒体链接（仅保留 RSS）
    socialLinks: [
      {
        name: 'RSS',
        label: 'RSS',
        url: '/rss.xml',
        icon: 'rss', // 本地 SVG: src/icons/rss.svg
        title: 'RSS 订阅'
      }
    ],
    // 底部徽章链接（统一徽章风格）
    badgeLinks: [
      {
        name: 'ICP备案',
        label: '浙ICP备2025152080号-1', // 完整备案号，符合国家要求
        url: 'https://beian.miit.gov.cn/',
        icon: 'shield-check', // 盾牌检查图标
        title: 'ICP备案信息'
      },
      {
        name: 'Astro',
        label: 'Astro',
        url: 'https://astro.build/',
        icon: 'rocket', // 火箭图标
        title: '基于 Astro 构建'
      },
      {
        name: 'Sitemap',
        label: 'Sitemap',
        url: '/sitemap-index.xml',
        icon: 'globe', // 地球图标
        title: '网站地图'
      }
    ]
  }
}