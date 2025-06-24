export default {
  // 网站标题
  Title: 'L-Souljourney',
  // 网站地址
  Site: 'https://blog.l-souljourney.cn',
  // 网站副标题
  Subtitle: '生死看淡 不服就淦',
  // 网站描述
  Description: 'L-Souljourney个人博客，专注于技术分享、生活感悟和个人成长。记录学习过程中的点点滴滴，分享编程技术、工具使用心得以及人生感悟。',
  // 网站作者
  Author: 'L-Souljourney',
  // 作者头像 - 建议替换为你自己的头像
  Avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1655466387&s=640',
  // 网站座右铭
  Motto: '生死看淡 不服就淦',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '<p>欢迎来到我的个人博客 🎉</p><p>这里记录我的技术学习历程和生活感悟，希望能与你产生共鸣 💖</p>',
  // 首页打字机文案列表
  TypeWriteList: [
    '生死看淡 不服就淦',
    "Life and death are indifferent, fight if you don't accept it.",
    '技术改变生活，学习成就未来',
    '记录成长，分享所得'
  ],
  // 网站创建时间 - 建议修改为你博客的实际创建时间
  CreateTime: '2025-01-01',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
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
    // 主题颜色
    "--vh-main-color": "#01C4B6",
    // 字体颜色
    "--vh-font-color": "#34495e",
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '圈子', link: '/friends', icon: 'Nav_rss' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
    // 建议修改为你自己的API或其他链接
    { text: 'GitHub', link: 'https://github.com/your-username', target: true, icon: 'Nav_link' },
  ],
  // 侧边栏个人网站 - 建议修改为你自己的网站和项目
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: 'GitHub', link: 'https://github.com/your-username', icon: 'WebSite_github' },
    { text: '个人项目', link: 'https://your-project.com', icon: 'WebSite_api' },
    // 如果没有这些服务，可以注释掉或删除
    // { text: '每日热榜', link: 'https://hot.vvhan.com', icon: 'WebSite_hot' },
    // { text: '骤雨重山图床', link: 'https://wp-cdn.4ce.cn', icon: 'WebSite_img' },
    // { text: 'HanAnalytics', link: 'https://analytics.vvhan.com', icon: 'WebSite_analytics' },
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
  // DNS预解析地址 - 清理无用域名，仅保留必要服务
  DNSOptimization: [
    'https://registry.npmmirror.com', // npm镜像（必要）
    'https://cn.cravatar.com' // 头像服务（如果使用）
  ],
  // 博客音乐组件解析接口 - 完全禁用音乐功能
  vhMusicApi: '',
  // 评论组件 - 完全禁用，使用公众号引流
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
  // Han Analytics 统计 - 建议禁用或替换为你自己的统计服务
  HanAnalytics: { enable: false, server: '', siteId: '' },
  // Google Analytics 配置（推荐）
  // GoogleAnalytics: { enable: false, measurementId: '' }, // 可以后续添加
  // Google 广告 - 暂不启用
  GoogleAds: {
    ad_Client: '', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    // 文章页广告(不填不开启)
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  // 文章内公众号引流 - 替换原有打赏功能
  WeChat: {
    // 微信公众号二维码
    QRCode: '/assets/images/wechat-qrcode.webp',
    // 公众号名称
    Name: 'L-Souljourney',
    // 引流文案
    Description: '扫码关注公众号，获取更多技术分享和深度思考'
  },
  // 访问网页 自动推送到搜索引擎 - 后续可配置
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}