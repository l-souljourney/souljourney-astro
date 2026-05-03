import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { PAGEFIND_ARTICLE_GLOBS } from "../src/integrations/pagefindArticlesOnly.mjs";

const searchComponent = readFileSync(new URL("../src/components/Search/Search.astro", import.meta.url), "utf8");

test("pagefind article-only integration should only index article output globs", () => {
  assert.deepEqual([...PAGEFIND_ARTICLE_GLOBS], [
    "article/**/index.html",
    "en/article/**/index.html",
  ]);
});

test("search component should use direct pagefind UI instead of astro-pagefind wrapper", () => {
  assert.match(searchComponent, /@pagefind\/default-ui/, "search component should import Pagefind default UI directly");
  assert.doesNotMatch(searchComponent, /astro-pagefind\/components\/Search/, "search component should not depend on astro-pagefind wrapper");
});
