import type { PublishMirrorPair, SiteLang } from './publishSet.js';

export type ArticleRoute = {
  lang: SiteLang;
  slug: string;
};

const ARTICLE_PATH_RE = /^\/(?:(en)\/)?article\/([^/]+)\/?$/;

export const getArticlePath = (lang: SiteLang, slug: string) =>
  lang === 'en' ? `/en/article/${slug}` : `/article/${slug}`;

export const parseArticleRoute = (pathname: string): ArticleRoute | null => {
  const match = pathname.match(ARTICLE_PATH_RE);
  if (!match) {
    return null;
  }

  const [, enPrefix, slug] = match;
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
