import path from "node:path";
import { fileURLToPath } from "node:url";

import { createIndex } from "pagefind";
import sirv from "sirv";

export const PAGEFIND_ARTICLE_GLOBS = [
  "article/**/index.html",
  "en/article/**/index.html",
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

        let totalPages = 0;
        for (const glob of PAGEFIND_ARTICLE_GLOBS) {
          const { page_count, errors } = await index.addDirectory({ path: outDir, glob });
          if (errors.length) {
            logger.error(`Pagefind failed to index files for glob ${glob}`);
            errors.forEach((error) => logger.error(error));
            return;
          }
          totalPages += page_count;
        }

        logger.info(`Pagefind indexed ${totalPages} article pages`);

        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((error) => logger.error(error));
          return;
        }

        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
    },
  };
}
