export const languages = {
    zh: '中文',
    en: 'English',
};

export const defaultLang = 'zh';

export const ui = {
    zh: {
        'nav.home': '首页',
        'nav.posts': '文章',
        'nav.archives': '归档',
        'nav.about': '关于',
        'nav.friends': '友链',
        'nav.twitter': '推特',
        'footer.copyright': 'L-忠程丨生死看淡不服就淦',
        'footer.rights': 'All Rights Reserved.',
        'footer.built': 'Built with Astro',
        'post.published': '发布于',
        'post.updated': '更新于',
        'post.words': '字',
        'post.readTime': '分钟阅读',
        'post.category': '分类于',
        '404.title': '页面未找到',
        '404.desc': '抱歉，您访问的页面不存在。',
        '404.back': '返回首页',
        'card.pinned': '置顶',
        'card.uncategorized': '未分类',
        'pagination.prev': '上一页',
        'pagination.next': '下一页',
        'pagination.first': '第一页',
        'pagination.page': '页',

        // Site Config
        'site.title': 'L-忠程丨生死看淡不服就淦',
        'site.subtitle': '生死看淡 不服就淦',
        'site.description': '执笔忠程的个人博客，记录投资感悟、AI探索、商业思考与人生哲学。从浙商精神到人生感悟，从技术梦想到中年思考，分享阅读心得与音乐情怀，探讨如何在变化的世界中活下来、活下去。',
        'site.author': '执笔忠程',

        // Header
        'header.search': '搜索',

        // Aside
        'aside.articles': '文章数',
        'aside.categories': '分类数',
        'aside.tags': '标签数',
        'aside.category.title': '分类',
        'aside.tag.title': '热门标签',
        'aside.recommend': '推荐文章',
        'aside.ad': '广而告之',
        'aside.ad.loading': '广告加载中...',
        'aside.wechat.desc': '文章交流与作者互动，都在公众号留言区',

        // Nav Not-Found Fallback (Keys for Navs)
        'nav.investment': '投资路',
        'nav.ai_era': 'AI时代',
        'nav.business': '浙商',
        'nav.philosophy': '天问',
        'nav.life': '活着',

        // Footer
        'footer.icp': 'ICP备案',
        'footer.sitemap': '网站地图',
        'footer.rss': 'RSS 订阅',
        'footer.running': '网站运行',
        'footer.badge.astro': 'Astro',
    },
    en: {
        'nav.home': 'Home',
        'nav.posts': 'Posts',
        'nav.archives': 'Archives',
        'nav.about': 'About',
        'nav.friends': 'Friends',
        'nav.twitter': 'Twitter',
        'footer.copyright': 'L-SoulJourney',
        'footer.rights': 'All Rights Reserved.',
        'footer.built': 'Built with Astro',
        'post.published': 'Published',
        'post.updated': 'Updated',
        'post.words': 'words',
        'post.readTime': 'min read',
        'post.category': 'Category',
        '404.title': 'Page Not Found',
        '404.desc': 'Sorry, the page you are looking for does not exist.',
        '404.back': 'Go Home',
        'card.pinned': 'Pinned',
        'card.uncategorized': 'Uncategorized',
        'pagination.prev': 'Previous',
        'pagination.next': 'Next',
        'pagination.first': 'First Page',
        'pagination.page': 'Page',

        // Site Config
        'site.title': 'L-SoulJourney', // English Title
        'site.subtitle': 'Life and Death are trivial, Just do it.',
        'site.description': 'Personal blog of L-SoulJourney, recording investment insights, AI exploration, business thinking and life philosophy.',
        'site.author': 'L-SoulJourney',

        // Header
        'header.search': 'Search',

        // Aside
        'aside.articles': 'Articles',
        'aside.categories': 'Categories',
        'aside.tags': 'Tags',
        'aside.category.title': 'Categories',
        'aside.tag.title': 'Tags',
        'aside.recommend': 'Recommended',
        'aside.ad': 'Sponsor',
        'aside.ad.loading': 'Ad Loading...',
        'aside.wechat.desc': 'Interact with author in WeChat discussion area',

        // Nav
        'nav.investment': 'Investment',
        'nav.ai_era': 'AI Era',
        'nav.business': 'Business',
        'nav.philosophy': 'Philosophy',
        'nav.life': 'Life',

        // Footer
        'footer.icp': 'ICP',
        'footer.sitemap': 'Sitemap',
        'footer.rss': 'RSS Feed',
        'footer.running': 'Running Time',
        'footer.badge.astro': 'Astro',
    },
} as const;

export type UIKeys = keyof typeof ui.zh;
