import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const read = (p) => readFileSync(path.resolve(process.cwd(), p), 'utf8');

const zhBlogIndex = read('src/pages/blog/index.astro');
const enBlogIndex = read('src/pages/en/blog/index.astro');
const zhCategoryPage = read('src/pages/blog/categories/[...categories].astro');
const enCategoryPage = read('src/pages/en/blog/categories/[...categories].astro');
const zhTagPage = read('src/pages/blog/tag/[...tags].astro');
const enTagPage = read('src/pages/en/blog/tag/[...tags].astro');
const archiveUtils = read('src/utils/getArchive.ts');
const postInfoUtils = read('src/utils/getPostInfo.ts');
const zhRssPage = read('src/pages/rss.xml.ts');
const enRssPage = read('src/pages/en/rss.xml.ts');

test('blog index pages should list only the published locale set', () => {
  assert.match(zhBlogIndex, /getSortedPublishedBlogEntriesByLang\(posts,\s*"zh"\)/, 'zh blog index should use sorted published zh entries');
  assert.match(enBlogIndex, /getSortedPublishedBlogEntriesByLang\(posts,\s*"en"\)/, 'en blog index should use sorted published en entries');
});

// 品牌首页不再承担内容列表职责，内容浏览改为 /blog/。
test('brand home should not render the article list itself', () => {
  const zhHomePage = read('src/pages/index.astro');
  const enHomePage = read('src/pages/en/index.astro');

  for (const [name, source] of [['zh home', zhHomePage], ['en home', enHomePage]]) {
    assert.doesNotMatch(source, /ArticleCard/, `${name} must not render article cards`);
    assert.doesNotMatch(source, /getCollection/, `${name} must not query the blog collection`);
  }
});

test('archive and post info utilities should derive data from publish-set helper', () => {
  assert.match(archiveUtils, /getSortedPublishedBlogEntriesByLang/, 'getArchive should derive locale data from shared published blog helper');
  assert.match(postInfoUtils, /getSortedPublishedBlogEntriesByLang/, 'getPostInfo should derive locale data from shared published blog helper');
  assert.doesNotMatch(archiveUtils, /filterPosts\s*=\s*/, 'legacy raw post filter should be removed from getArchive');
  assert.doesNotMatch(postInfoUtils, /filterPostsByLang\s*=\s*/, 'legacy raw post filter should be removed from getPostInfo');
});

test('category and tag pages should stop sourcing paths from raw locale filters', () => {
  assert.match(zhCategoryPage, /getPublishedEntriesByLang/, 'zh category page should use publish set');
  assert.match(enCategoryPage, /getPublishedEntriesByLang/, 'en category page should use publish set');
  assert.match(zhTagPage, /getPublishedEntriesByLang/, 'zh tag page should use publish set');
  assert.match(enTagPage, /getPublishedEntriesByLang/, 'en tag page should use publish set');
});

test('rss feeds should emit items only from the published locale set', () => {
  assert.match(zhRssPage, /getSortedPublishedBlogEntriesByLang/, 'zh rss feed should use shared sorted published entries');
  assert.match(enRssPage, /getSortedPublishedBlogEntriesByLang/, 'en rss feed should use shared sorted published entries');
});
