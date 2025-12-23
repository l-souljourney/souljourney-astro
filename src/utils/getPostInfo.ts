import { getCollection } from "astro:content";
const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

// 辅助函数：根据语言过滤文章
const filterPostsByLang = (lang?: string) => {
  if (!lang) return posts;
  // 如果是 'zh'，匹配没有 'en/' 前缀的 ID (假设中文是默认无前缀或非 en)
  // 或者根据项目约定，中文 ID 可能不带 en/，而英文带 en/
  // 这里采用更通用的判断：如果 lang 是 'en'，只取 id 以 'en/' 开头的
  // 如果 lang 是 'zh'，只取 id 不以 'en/' 开头的
  if (lang === 'en') {
    return posts.filter(p => p.id.startsWith('en/'));
  } else {
    return posts.filter(p => !p.id.startsWith('en/'));
  }
};

// 获取文章分类
const getCategories = (lang?: string) => {
  const targetPosts = filterPostsByLang(lang);
  const categoriesList = targetPosts.reduce((acc: any, i: any) => {
    acc[i.data.categories] = (acc[i.data.categories] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(categoriesList).map(([title, count]) => ({ title, count }));
}

// 获取统计数据
const getCountInfo = (lang?: string) => {
  const targetPosts = filterPostsByLang(lang);
  // 注意：这里复用已过滤的 getCategories/getTags 逻辑会有循环依赖或重复计算问题
  // 简单起见，直接基于 targetPosts 重新计算，或者让这些函数独立
  // 为了性能，这里简单实现：
  const catLength = new Set(targetPosts.map(p => p.data.categories)).size;
  const tagLength = new Set(targetPosts.flatMap(p => p.data.tags || [])).size;

  return { ArticleCount: targetPosts.length, CategoryCount: catLength, TagCount: tagLength }
}

// 获取文章标签
const getTags = (lang?: string) => {
  const targetPosts = filterPostsByLang(lang);
  const tagList = targetPosts.reduce((acc: any, i: any) => {
    (i.data.tags || []).forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.entries(tagList).sort((a: any, b: any) => b[1] - a[1]);
}

// 获取推荐文章 (给文章添加 recommend: true 字段)
const getRecommendArticles = (lang?: string) => {
  const targetPosts = filterPostsByLang(lang);
  const recommendList = targetPosts.filter(i => i.data.recommend);
  return (recommendList.length ? recommendList : targetPosts.slice(0, 6)).map(i => ({ title: i.data.title, date: i.data.date, id: i.data.id }))
};

export { getCategories, getTags, getRecommendArticles, getCountInfo };