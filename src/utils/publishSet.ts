export type SiteLang = 'zh' | 'en';

export type PublishSetInputEntry = {
  id: string;
  data: {
    categories: string;
    hide?: boolean;
    lang: SiteLang;
    slug: string;
    source_id: string;
    [key: string]: unknown;
  };
};

export type PublishMirrorPair<TEntry extends PublishSetInputEntry = PublishSetInputEntry> = {
  key: string;
  slug: string;
  sourceId: string;
  zh: TEntry;
  en: TEntry;
};

export type PublishSetResult<TEntry extends PublishSetInputEntry = PublishSetInputEntry> = {
  published: TEntry[];
  publishedByLang: {
    zh: TEntry[];
    en: TEntry[];
  };
  mirrorPairs: PublishMirrorPair<TEntry>[];
  pendingTranslation: TEntry[];
  sourceIdConflicts: TEntry[];
  slugConflicts: TEntry[];
  duplicateLocaleConflicts: TEntry[];
  categoryConflicts: TEntry[];
};

type GroupedEntries<TEntry extends PublishSetInputEntry> = Map<string, TEntry[]>;

const buildPairKey = (entry: PublishSetInputEntry) => `${entry.data.source_id}::${entry.data.slug}`;

const sortEntries = <TEntry extends PublishSetInputEntry>(entries: TEntry[]) =>
  [...entries].sort((left, right) => left.id.localeCompare(right.id));

const getConflictKeys = (groups: Map<string, Set<string>>) =>
  new Set(
    [...groups.entries()]
      .filter(([, keys]) => keys.size > 1)
      .map(([value]) => value)
  );

const getOrCreateGroup = <TValue>(map: Map<string, TValue[]>, key: string) => {
  const current = map.get(key);
  if (current) {
    return current;
  }
  const next: TValue[] = [];
  map.set(key, next);
  return next;
};

export const buildPublishSet = <TEntry extends PublishSetInputEntry>(
  entries: TEntry[]
): PublishSetResult<TEntry> => {
  const pairGroups: GroupedEntries<TEntry> = new Map();
  const sourceIdToPairKeys = new Map<string, Set<string>>();
  const slugToPairKeys = new Map<string, Set<string>>();

  for (const entry of entries) {
    const pairKey = buildPairKey(entry);
    getOrCreateGroup(pairGroups, pairKey).push(entry);

    const sourceKeys = sourceIdToPairKeys.get(entry.data.source_id) ?? new Set<string>();
    sourceKeys.add(pairKey);
    sourceIdToPairKeys.set(entry.data.source_id, sourceKeys);

    const slugKeys = slugToPairKeys.get(entry.data.slug) ?? new Set<string>();
    slugKeys.add(pairKey);
    slugToPairKeys.set(entry.data.slug, slugKeys);
  }

  const conflictingSourceIds = getConflictKeys(sourceIdToPairKeys);
  const conflictingSlugs = getConflictKeys(slugToPairKeys);

  const published: TEntry[] = [];
  const publishedByLang = { zh: [] as TEntry[], en: [] as TEntry[] };
  const mirrorPairs: PublishMirrorPair<TEntry>[] = [];
  const pendingTranslation: TEntry[] = [];
  const sourceIdConflicts: TEntry[] = [];
  const slugConflicts: TEntry[] = [];
  const duplicateLocaleConflicts: TEntry[] = [];
  const categoryConflicts: TEntry[] = [];

  for (const [pairKey, groupEntries] of pairGroups.entries()) {
    const hasSourceIdConflict = conflictingSourceIds.has(groupEntries[0].data.source_id);
    const hasSlugConflict = conflictingSlugs.has(groupEntries[0].data.slug);

    if (hasSourceIdConflict) {
      sourceIdConflicts.push(...groupEntries);
    }
    if (hasSlugConflict) {
      slugConflicts.push(...groupEntries);
    }
    if (hasSourceIdConflict || hasSlugConflict) {
      continue;
    }

    const entriesByLang = new Map<SiteLang, TEntry[]>();
    for (const entry of groupEntries) {
      const current = entriesByLang.get(entry.data.lang) ?? [];
      current.push(entry);
      entriesByLang.set(entry.data.lang, current);
    }

    const zhEntries = entriesByLang.get('zh') ?? [];
    const enEntries = entriesByLang.get('en') ?? [];

    if (zhEntries.length > 1 || enEntries.length > 1) {
      duplicateLocaleConflicts.push(...groupEntries);
      continue;
    }

    const categories = new Set(groupEntries.map((entry) => entry.data.categories));
    if (categories.size > 1) {
      categoryConflicts.push(...groupEntries);
      continue;
    }

    if (zhEntries.length === 1 && enEntries.length === 1) {
      const [zhEntry] = zhEntries;
      const [enEntry] = enEntries;
      published.push(zhEntry, enEntry);
      publishedByLang.zh.push(zhEntry);
      publishedByLang.en.push(enEntry);
      mirrorPairs.push({
        key: pairKey,
        slug: zhEntry.data.slug,
        sourceId: zhEntry.data.source_id,
        zh: zhEntry,
        en: enEntry,
      });
      continue;
    }

    pendingTranslation.push(...groupEntries);
  }

  return {
    published: sortEntries(published),
    publishedByLang: {
      zh: sortEntries(publishedByLang.zh),
      en: sortEntries(publishedByLang.en),
    },
    mirrorPairs: [...mirrorPairs].sort((left, right) => left.key.localeCompare(right.key)),
    pendingTranslation: sortEntries(pendingTranslation),
    sourceIdConflicts: sortEntries(sourceIdConflicts),
    slugConflicts: sortEntries(slugConflicts),
    duplicateLocaleConflicts: sortEntries(duplicateLocaleConflicts),
    categoryConflicts: sortEntries(categoryConflicts),
  };
};

const filterVisibleEntries = <TEntry extends PublishSetInputEntry>(entries: TEntry[]) =>
  entries.filter((entry) => !entry.data.hide);

export const getPublishedEntriesByLang = <TEntry extends PublishSetInputEntry>(
  entries: TEntry[],
  lang: SiteLang,
  options?: { includeHidden?: boolean }
) => {
  const localeEntries = buildPublishSet(entries).publishedByLang[lang];
  return options?.includeHidden ? localeEntries : filterVisibleEntries(localeEntries);
};

export const getPublishedEntries = <TEntry extends PublishSetInputEntry>(
  entries: TEntry[],
  options?: { includeHidden?: boolean }
) => {
  const publishedEntries = buildPublishSet(entries).published;
  return options?.includeHidden ? publishedEntries : filterVisibleEntries(publishedEntries);
};
