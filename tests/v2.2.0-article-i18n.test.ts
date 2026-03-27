import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildPublishSet, type PublishSetInputEntry } from '../src/utils/publishSet.js';
import { getAlternateArticlePathFromMirrorPairs, parseArticleRoute } from '../src/utils/articleI18nCore.js';

const read = (p: string) => readFileSync(path.resolve(process.cwd(), p), 'utf8');

const zhArticlePage = read('src/pages/article/[...article].astro');
const enArticlePage = read('src/pages/en/article/[...article].astro');
const headComponent = read('src/components/Head/Head.astro');
const headerComponent = read('src/components/Header/Header.astro');

const createEntry = (
  id: string,
  overrides: Partial<PublishSetInputEntry['data']>
): PublishSetInputEntry => ({
  id,
  data: {
    title: `${id} title`,
    date: new Date('2026-03-25T00:00:00.000Z'),
    categories: 'investment',
    slug: 'shared-slug',
    source_id: 'shared-source',
    lang: 'zh',
    ...overrides,
  },
});

test('parseArticleRoute should preserve the current zh/en article path contract', () => {
  assert.deepEqual(parseArticleRoute('/article/shared-slug'), {
    lang: 'zh',
    slug: 'shared-slug',
  });
  assert.deepEqual(parseArticleRoute('/en/article/shared-slug'), {
    lang: 'en',
    slug: 'shared-slug',
  });
  assert.equal(parseArticleRoute('/archives'), null);
});

test('published article language switch should resolve to the mirrored article route', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-entry', { lang: 'zh', slug: 'mirror-article', source_id: 'mirror-source' }),
    createEntry('en-entry', { lang: 'en', slug: 'mirror-article', source_id: 'mirror-source' }),
  ]);

  assert.equal(
    getAlternateArticlePathFromMirrorPairs('/article/mirror-article', publishSet.mirrorPairs),
    '/en/article/mirror-article'
  );
  assert.equal(
    getAlternateArticlePathFromMirrorPairs('/en/article/mirror-article', publishSet.mirrorPairs),
    '/article/mirror-article'
  );
});

test('incomplete mirror pairs should not resolve article alternates', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-only-entry', { lang: 'zh', slug: 'zh-only', source_id: 'zh-only-source' }),
  ]);

  assert.equal(
    getAlternateArticlePathFromMirrorPairs('/article/zh-only', publishSet.mirrorPairs),
    null
  );
});

test('article pages should generate static paths only from the published locale set', () => {
  assert.match(zhArticlePage, /publishedByLang\.zh/, 'zh article page should use published zh entries');
  assert.match(enArticlePage, /publishedByLang\.en/, 'en article page should use published en entries');
});

test('article-level i18n components should stop falling back to homepage routes', () => {
  assert.match(headComponent, /zhAltURL/, 'Head should compute explicit zh article alternate URL');
  assert.match(headComponent, /enAltURL/, 'Head should compute explicit en article alternate URL');
  assert.doesNotMatch(
    headerComponent,
    /articleAltPath\s*\|\|\s*\(lang === 'zh' \? '\/en' : '\/'\)/,
    'Header should not fallback article language switch to homepage'
  );
});
