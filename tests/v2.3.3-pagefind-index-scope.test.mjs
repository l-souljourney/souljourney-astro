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

test("search component should use the official Pagefind components instead of a wrapper", () => {
  assert.match(searchComponent, /@pagefind\/component-ui/, "search component should use Pagefind Component UI directly");
  assert.match(searchComponent, /pagefind-modal/, "the modal should be the official component");
  assert.doesNotMatch(searchComponent, /astro-pagefind\/components\/Search/, "search component should not depend on astro-pagefind wrapper");
  // 旧的 Default UI 已整体换掉：既不自研弹窗逻辑，也不留两套 UI 依赖。
  assert.doesNotMatch(searchComponent, /@pagefind\/default-ui/, "the old default UI should be gone");
});

// 实测（pagefind 1.4.0 与 1.5.2 行为一致）：addDirectory() 返回的 page_count 是 glob
// 命中的文件数（35），不等于索引进去的页数（6，见 pagefind-entry.json 的 languages）。
// 所以集成只能从 entry 文件读真实索引页数。升级 Pagefind 时若这里变了，测试会先失败，
// 提醒重新核对，而不是把扫描数当索引数报出去。
test("indexed page count comes from the pagefind entry file, not from addDirectory", () => {
  const integration = read("src/integrations/pagefindArticlesOnly.mjs");
  assert.match(integration, /pagefind-entry\.json/, "indexed count is read from the entry file");
  assert.match(integration, /languages/, "the entry file groups counts by language");
  assert.match(integration, /Pagefind scanned/, "the scanned count is reported separately");
  assert.match(integration, /Pagefind indexed/, "the indexed count is reported separately");
});
