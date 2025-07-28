/**
 * 分类中英文映射配置
 * 用于将英文分类路径转换为中文显示名称
 */

// 分类映射对象
export const categoryMapping: Record<string, string> = {
  'investment': '投资路',
  'ai-era': 'AI时代', 
  'zhejiang-business': '浙商',
  'philosophy': '天问',
  'life': '活着'
};

// 反向映射：中文到英文
export const categoryMappingReverse: Record<string, string> = {
  '投资路': 'investment',
  'AI时代': 'ai-era',
  '浙商': 'zhejiang-business', 
  '天问': 'philosophy',
  '活着': 'life'
};

/**
 * 将英文分类转换为中文显示名称
 * @param englishCategory 英文分类名
 * @returns 中文分类名，如果找不到则返回原值
 */
export function getCategoryDisplayName(englishCategory: string): string {
  return categoryMapping[englishCategory] || englishCategory;
}

/**
 * 将中文分类转换为英文路径
 * @param chineseCategory 中文分类名
 * @returns 英文分类路径，如果找不到则返回原值
 */
export function getCategoryPath(chineseCategory: string): string {
  return categoryMappingReverse[chineseCategory] || chineseCategory;
}

/**
 * 获取所有分类的英文路径列表
 * @returns 英文分类路径数组
 */
export function getAllCategoryPaths(): string[] {
  return Object.keys(categoryMapping);
}

/**
 * 获取所有分类的中文显示名称列表
 * @returns 中文分类名称数组
 */
export function getAllCategoryNames(): string[] {
  return Object.values(categoryMapping);
}