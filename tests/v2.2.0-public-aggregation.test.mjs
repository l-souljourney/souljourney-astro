import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const read = (p) => readFileSync(path.resolve(process.cwd(), p), 'utf8');

const zhHomePage = read('src/pages/[...page].astro');
const enHomePage = read('src/pages/en/[...page].astro');
const zhCategoryPage = read('src/pages/categories/[...categories].astro');
const enCategoryPage = read('src/pages/en/categories/[...categories].astro');
const zhTagPage = read('src/pages/tag/[...tags].astro');
const enTagPage = read('src/pages/en/tag/[...tags].astro');
const archiveUtils = read('src/utils/getArchive.ts');
const postInfoUtils = read('src/utils/getPostInfo.ts');
const zhRssPage = read('src/pages/rss.xml.ts');
const enRssPage = read('src/pages/en/rss.xml.ts');

test('home pages should paginate only the published locale set', () => {
  assert.match(zhHomePage, /getPublishedEntriesByLang\(posts,\s*"zh"\)/, 'zh home page should use published zh entries');
  assert.match(enHomePage, /getPublishedEntriesByLang\(posts,\s*"en"\)/, 'en home page should use published en entries');
});

test('archive and post info utilities should derive data from publish-set helper', () => {
  assert.match(archiveUtils, /getPublishedEntriesByLang/, 'getArchive should derive locale data from publish set');
  assert.match(postInfoUtils, /getPublishedEntriesByLang/, 'getPostInfo should derive locale data from publish set');
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
  assert.match(zhRssPage, /publishedByLang\.zh/, 'zh rss feed should use published zh entries');
  assert.match(enRssPage, /publishedByLang\.en/, 'en rss feed should use published en entries');
});
