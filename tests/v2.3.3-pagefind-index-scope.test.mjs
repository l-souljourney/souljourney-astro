import test from "node:test";
import assert from "node:assert/strict";

import { PAGEFIND_ARTICLE_GLOBS } from "../src/integrations/pagefindArticlesOnly.mjs";

test("pagefind article-only integration should only index article output globs", () => {
  assert.deepEqual([...PAGEFIND_ARTICLE_GLOBS], [
    "article/**/index.html",
    "en/article/**/index.html",
  ]);
});
