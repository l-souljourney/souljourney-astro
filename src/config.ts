export default {
  // 网站标题 - 符合ICP备案要求
  Title: 'L-忠程丨生死看淡不服就淦 - 天问星曦',
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
  // 网站侧边栏公告
  Tips: '<p>欢迎来到L-忠程的思想花园 🌸</p><p>这里记录投资路上的思考、AI时代的探索、商业哲学的感悟以及人生路上的点点滴滴。所有文章同步发布于微信公众号，欢迎关注交流 💖</p>',
  // 首页打字机文案列表 - 已禁用动态滚动更新
  TypeWriteList: [],
  // 网站创建时间
  CreateTime: '2025-01-01',
  // ICP备案信息
  ICP: {
    enable: true,
    number: '浙ICP备2025152080号-1',
    link: 'https://beian.miit.gov.cn/',
    siteName: 'L-忠程丨生死看淡不服就淦 - 天问星曦'
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
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色 - 选择更沉稳的颜色搭配您的内容风格
    "--vh-main-color": "#2c5aa0",
    // 字体颜色
    "--vh-font-color": "#34495e", 
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏
  Navs: [
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  // 侧边栏个人网站
  WebSites: [
    { text: '微信公众号', link: '#wechat-qr', icon: 'WebSite_github' },
    { text: '投资笔记', link: '#', icon: 'WebSite_api' },
    { text: 'AI工具箱', link: '#', icon: 'WebSite_hot' },
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
    Description: '扫码关注公众号「L-忠程丨生死看淡不服就淦」，获取更多投资思考、AI探索、商业哲学与人生感悟。所有文章同步更新，深度交流欢迎私信。'
  },
  // SEO推送
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}