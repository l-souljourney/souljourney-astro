
import { getCollection } from "astro:content";

// 格式化文章列表
const fmtArticleList = (articleList: any) => {
  // 按年份分类
  const groupedByYear = articleList.reduce((acc: any, item: any) => {
    const year = item.data.date.getFullYear();
    // 初始化
    !acc[year] && (acc[year] = []);
    acc[year].push({ ...item.data, id: item.data.id || item.id });
    return acc;
  }, {});
  // 转换为目标格式
  return Object.keys(groupedByYear).map(year => ({ name: parseInt(year), data: groupedByYear[year] })).reverse();
}

// 获取分类下的文章列表
const getCategoriesList = async (categories: string, lang?: string) => {
  const posts = await getCollection("blog");
  const filteredPosts = lang === 'en'
    ? posts.filter((p: any) => p.id.startsWith('en/'))
    : posts.filter((p: any) => !p.id.startsWith('en/'));

  const articleList = filteredPosts.filter((i: any) => i.data.categories == categories).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());;
  return fmtArticleList(articleList);
}

// 获取标签下的文章列表
const getTagsList = async (tags: string, lang?: string) => {
  const posts = await getCollection("blog");
  const filteredPosts = lang === 'en'
    ? posts.filter((p: any) => p.id.startsWith('en/'))
    : posts.filter((p: any) => !p.id.startsWith('en/'));

  const articleList = filteredPosts.filter((i: any) => (i.data.tags || []).map((_i: any) => (String(_i))).includes(tags)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return fmtArticleList(articleList);
}

// 获取归档列表
const getArchiveList = async () => {
  const posts = await getCollection("blog");
  const articleList = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());;
  return fmtArticleList(articleList);
}

export { getCategoriesList, getTagsList, getArchiveList };