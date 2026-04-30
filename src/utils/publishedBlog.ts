import type { CollectionEntry } from 'astro:content';

import {
  getPublishedEntries,
  getPublishedEntriesByLang,
  type SiteLang,
} from '@/utils/publishSet';

type BlogEntry = CollectionEntry<'blog'>;

export const sortBlogEntriesByDateDesc = <TEntry extends BlogEntry>(entries: TEntry[]) =>
  [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const getSortedPublishedBlogEntries = <TEntry extends BlogEntry>(entries: TEntry[]) =>
  sortBlogEntriesByDateDesc(getPublishedEntries(entries) as TEntry[]);

export const getSortedPublishedBlogEntriesByLang = <TEntry extends BlogEntry>(
  entries: TEntry[],
  lang: SiteLang
) => sortBlogEntriesByDateDesc(getPublishedEntriesByLang(entries, lang) as TEntry[]);
