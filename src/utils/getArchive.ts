
import { getCollection } from "astro:content";
import { getSortedPublishedBlogEntriesByLang } from "@/utils/publishedBlog";

// 格式化文章列表
const fmtArticleList = (articleList: any) => {
  // 按年份分类
  const groupedByYear = articleList.reduce((acc: any, item: any) => {
    const year = item.data.date.getFullYear();
    // 初始化
    !acc[year] && (acc[year] = []);
    acc[year].push({ ...item.data });
    return acc;
  }, {});
  // 转换为目标格式
  return Object.keys(groupedByYear).map(year => ({ name: parseInt(year), data: groupedByYear[year] })).reverse();
}

const getLocalePosts = async (lang: 'zh' | 'en' = 'zh') => {
  const posts = await getCollection("blog");
  return getSortedPublishedBlogEntriesByLang(posts, lang);
};

// 获取分类下的文章列表
const getCategoriesList = async (categories: string, lang?: string) => {
  const filteredPosts = await getLocalePosts(lang === 'en' ? 'en' : 'zh');
  const articleList = filteredPosts.filter((i: any) => i.data.categories == categories);
  return fmtArticleList(articleList);
}

// 获取标签下的文章列表
const getTagsList = async (tags: string, lang?: string) => {
  const filteredPosts = await getLocalePosts(lang === 'en' ? 'en' : 'zh');
  const articleList = filteredPosts.filter((i: any) => (i.data.tags || []).map((_i: any) => (String(_i))).includes(tags));
  return fmtArticleList(articleList);
}

// 获取归档列表
const getArchiveList = async (lang?: string) => {
  const articleList = await getLocalePosts(lang === 'en' ? 'en' : 'zh');
  return fmtArticleList(articleList);
}

export { getCategoriesList, getTagsList, getArchiveList };
