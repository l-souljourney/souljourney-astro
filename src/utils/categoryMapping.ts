export function getCategoryDisplayName(categoryPath: string, lang: 'zh' | 'en' = 'zh'): string {
  const mapping: Record<string, { zh: string; en: string }> = {
    'investment': { zh: '投资路', en: 'Investment' },
    'ai-era': { zh: 'AI时代', en: 'AI Era' },
    'zhejiang-business': { zh: '浙商', en: 'Zhejiang Business' },
    'philosophy': { zh: '天问', en: 'Philosophy' },
    'life': { zh: '活着', en: 'Life' }
  };
  return mapping[categoryPath]?.[lang] || categoryPath;
}

export function getAllCategoryPaths(): string[] {
  const mapping = {
    'investment': { zh: '投资路', en: 'Investment' },
    'ai-era': { zh: 'AI时代', en: 'AI Era' },
    'zhejiang-business': { zh: '浙商', en: 'Zhejiang Business' },
    'philosophy': { zh: '天问', en: 'Philosophy' },
    'life': { zh: '活着', en: 'Life' }
  };
  return Object.keys(mapping);
}