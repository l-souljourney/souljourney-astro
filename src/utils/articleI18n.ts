import { type CollectionEntry, getCollection } from 'astro:content';

import { getAlternateArticlePathFromMirrorPairs, parseArticleRoute } from '@/utils/articleI18nCore';
import { buildPublishSet, type PublishMirrorPair } from '@/utils/publishSet';

let cachedPublishedMirrorPairs: PublishMirrorPair<CollectionEntry<'blog'>>[] | null = null;

const getPublishedMirrorPairs = async (): Promise<PublishMirrorPair<CollectionEntry<'blog'>>[]> => {
  if (cachedPublishedMirrorPairs) {
    return cachedPublishedMirrorPairs;
  }

  const posts = await getCollection('blog');
  const { mirrorPairs } = buildPublishSet(posts);
  cachedPublishedMirrorPairs = mirrorPairs;
  return mirrorPairs;
};

export const getAlternateArticlePath = async (url: URL): Promise<string | null> => {
  const mirrorPairs = await getPublishedMirrorPairs();
  return getAlternateArticlePathFromMirrorPairs(url.pathname, mirrorPairs);
};

export { parseArticleRoute };
