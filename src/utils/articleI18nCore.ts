import type { PublishMirrorPair, SiteLang } from './publishSet.js';

export type ArticleRoute = {
  lang: SiteLang;
  slug: string;
};

/**
 * /blog 之下与正文同级的聚合页段名。`/blog/archives` 只有一段，
 * 会被文章路径正则误判为 slug 为 "archives" 的正文页，必须显式排除。
 * 分类与标签是两段（`/blog/categories/<x>`），正则本身不会命中。
 */
const RESERVED_BLOG_SEGMENTS = new Set(['categories', 'tag', 'archives']);

const ARTICLE_PATH_RE = /^\/(?:(en)\/)?blog\/([^/]+)\/?$/;

export const getArticlePath = (lang: SiteLang, slug: string) =>
  lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;

export const parseArticleRoute = (pathname: string): ArticleRoute | null => {
  const match = pathname.match(ARTICLE_PATH_RE);
  if (!match) {
    return null;
  }

  const [, enPrefix, slug] = match;
  if (RESERVED_BLOG_SEGMENTS.has(slug)) {
    return null;
  }

  return {
    lang: enPrefix ? 'en' : 'zh',
    slug,
  };
};

export const getAlternateArticlePathFromMirrorPairs = (
  pathname: string,
  mirrorPairs: PublishMirrorPair[]
): string | null => {
  const parsed = parseArticleRoute(pathname);
  if (!parsed) {
    return null;
  }

  const pair = mirrorPairs.find((entry) => entry.slug === parsed.slug);
  if (!pair) {
    return null;
  }

  const targetLang: SiteLang = parsed.lang === 'zh' ? 'en' : 'zh';
  return getArticlePath(targetLang, pair.slug);
};
