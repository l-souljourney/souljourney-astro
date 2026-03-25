import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

const zhArticlePage = read('src/pages/article/[...article].astro');
const enArticlePage = read('src/pages/en/article/[...article].astro');
const enCategoryPage = read('src/pages/en/categories/[...categories].astro');
const headComponent = read('src/components/Head/Head.astro');
const tocComponent = read('src/components/TOC/TOC.astro');
const mobileSidebar = read('src/components/MobileSidebar/MobileSidebar.astro');
const searchComponent = read('src/components/Search/Search.astro');

test('article templates should not use nested main containers', () => {
  assert.equal(/<main\b/.test(zhArticlePage), false, 'zh article template still contains <main>');
  assert.equal(/<main\b/.test(enArticlePage), false, 'en article template still contains <main>');
});

test('english category page should define empty-state and robots strategy', () => {
  assert.match(enCategoryPage, /isEmptyCategory/, 'missing empty category flag');
  assert.match(enCategoryPage, /pageRobots/, 'missing robots strategy variable');
  assert.match(enCategoryPage, /pageRobots=\{pageRobots\}/, 'Layout is not passed pageRobots');
});

test('english category page should only set noindex for empty categories', () => {
  assert.equal(/"index,\s*follow"/.test(enCategoryPage), false, 'non-empty categories should not override default robots');
  assert.match(
    enCategoryPage,
    /isEmptyCategory\s*\?\s*"noindex,\s*follow"\s*:\s*undefined/,
    'expected conditional robots override for empty categories only'
  );
});

test('Head component should allow page-level robots override', () => {
  assert.match(headComponent, /PageRobots/, 'Head props missing PageRobots');
  assert.match(headComponent, /content=\{resolvedRobots\}/, 'robots meta does not use resolvedRobots');
});

test('TOC should expose toc class hooks for highlight selector', () => {
  assert.match(tocComponent, /class=\"toc/, 'TOC root class hook is missing');
});

test('mobile sidebar should resolve locale-aware labels and links', () => {
  assert.match(mobileSidebar, /useTranslations/, 'mobile sidebar missing translation helper');
  assert.match(mobileSidebar, /withLangPrefix/, 'mobile sidebar missing locale prefix helper');
});

test('mobile sidebar should avoid double /en prefix', () => {
  assert.match(mobileSidebar, /path\.startsWith\(["']\/en["']\)/, 'mobile sidebar missing /en prefix guard');
});

test('search modal binding should be keyed by current trigger element', () => {
  assert.match(searchComponent, /boundButton/, 'search modal does not track bound button identity');
});
