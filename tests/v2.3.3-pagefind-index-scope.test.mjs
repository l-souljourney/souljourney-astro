import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { PAGEFIND_ARTICLE_GLOBS } from "../src/integrations/pagefindArticlesOnly.mjs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const searchComponent = read("src/components/Search/Search.astro");
const zhArticlePage = read("src/pages/blog/[...slug].astro");
const enArticlePage = read("src/pages/en/blog/[...slug].astro");
const zhBlogIndex = read("src/pages/blog/index.astro");
const enBlogIndex = read("src/pages/en/blog/index.astro");
const zhCategoryPage = read("src/pages/blog/categories/[...categories].astro");
const zhTagPage = read("src/pages/blog/tag/[...tags].astro");
const zhArchivePage = read("src/pages/blog/archives/index.astro");
const zhHomePage = read("src/pages/index.astro");

test("pagefind article-only integration should only index blog output globs", () => {
  assert.deepEqual([...PAGEFIND_ARTICLE_GLOBS], [
    "blog/**/index.html",
    "en/blog/**/index.html",
  ]);
});

// glob 撒在 blog/ 下会同时覆盖正文页与聚合页，实际范围由 data-pagefind-body 决定。
// 这里固定「只有正文模板带该标记」这个前提，否则搜索会混入列表与聚合页。
test("only article templates should carry data-pagefind-body", () => {
  assert.match(zhArticlePage, /data-pagefind-body/, "zh article template should mark the indexed body");
  assert.match(enArticlePage, /data-pagefind-body/, "en article template should mark the indexed body");

  for (const [name, source] of [
    ["blog index (zh)", zhBlogIndex],
    ["blog index (en)", enBlogIndex],
    ["category page (zh)", zhCategoryPage],
    ["tag page (zh)", zhTagPage],
    ["archive page (zh)", zhArchivePage],
    ["home page (zh)", zhHomePage],
  ]) {
    assert.doesNotMatch(source, /data-pagefind-body/, `${name} must not mark an indexed body`);
  }
});

test("search component should use direct pagefind UI instead of astro-pagefind wrapper", () => {
  assert.match(searchComponent, /@pagefind\/default-ui/, "search component should import Pagefind default UI directly");
  assert.doesNotMatch(searchComponent, /astro-pagefind\/components\/Search/, "search component should not depend on astro-pagefind wrapper");
});
