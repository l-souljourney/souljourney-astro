import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createIndex } from "pagefind";
import sirv from "sirv";

// blog/ 之下同时存在正文页与分类/标签/归档等聚合页，glob 本身不区分它们。
// 真正的范围由 `data-pagefind-body` 决定：站点上任一页面带有该标记后，
// Pagefind 只索引带标记的页面。只有正文模板带它，聚合页与列表页都不带。
// 见 tests/v2.3.3-pagefind-index-scope.test.mjs 对这两个前提的固定。
export const PAGEFIND_ARTICLE_GLOBS = [
  "blog/**/index.html",
  "en/blog/**/index.html",
];

export default function pagefindArticlesOnly({ indexConfig } = {}) {
  let clientDir;

  return {
    name: "pagefind-articles-only",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Output type `server` does not produce static *.html pages in its output and thus will not work with article-only Pagefind integration.",
          );
        }
        if (config.adapter) {
          clientDir = fileURLToPath(config.build.client);
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        const outDir = clientDir ?? path.join(server.config.root, server.config.build.outDir);
        logger.debug(`Serving pagefind from ${outDir}`);
        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { index, errors: createErrors } = await createIndex(indexConfig);
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((error) => logger.error(error));
          return;
        }

        let scannedFiles = 0;
        for (const glob of PAGEFIND_ARTICLE_GLOBS) {
          const { page_count, errors } = await index.addDirectory({ path: outDir, glob });
          if (errors.length) {
            logger.error(`Pagefind failed to index files for glob ${glob}`);
            errors.forEach((error) => logger.error(error));
            return;
          }
          scannedFiles += page_count;
        }

        // page_count 只是 glob 命中的文件数，不等于索引进去的页面数：
        // 没有 data-pagefind-body 的页面会被跳过。分开报告，避免把扫描数当索引数。
        logger.info(`Pagefind scanned ${scannedFiles} files across article globs`);

        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((error) => logger.error(error));
          return;
        }

        const entryPath = path.join(outputPath, "pagefind-entry.json");
        const entry = JSON.parse(await readFile(entryPath, "utf8"));
        const indexedPages = Object.values(entry.languages ?? {}).reduce(
          (sum, language) => sum + (language?.page_count ?? 0),
          0,
        );
        logger.info(`Pagefind indexed ${indexedPages} pages (pages without data-pagefind-body are skipped)`);
        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
    },
  };
}
