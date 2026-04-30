import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'devalue';

const countArticleRoutes = (distDir) => {
	const roots = [path.join(distDir, 'article'), path.join(distDir, 'en', 'article')];
	let count = 0;

	for (const root of roots) {
		if (!fs.existsSync(root)) {
			continue;
		}
		const stack = [root];
		while (stack.length > 0) {
			const current = stack.pop();
			if (!current) {
				continue;
			}
			for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
				const full = path.join(current, entry.name);
				if (entry.isDirectory()) {
					stack.push(full);
					continue;
				}
				if (entry.isFile() && entry.name === 'index.html') {
					count += 1;
				}
			}
		}
	}

	return count;
};

const countRssItems = (distDir) => {
	const rssFiles = [path.join(distDir, 'rss.xml'), path.join(distDir, 'en', 'rss.xml')];
	let count = 0;
	for (const file of rssFiles) {
		if (!fs.existsSync(file)) {
			continue;
		}
		const content = fs.readFileSync(file, 'utf8');
		const matches = content.match(/<item>/g);
		count += matches?.length ?? 0;
	}
	return count;
};

export const getBlogEntriesFromStore = (storePath) => {
	if (!fs.existsSync(storePath)) {
		throw new Error(`data store not found: ${storePath}`);
	}
	const raw = fs.readFileSync(storePath, 'utf8');
	const store = parse(raw);
	if (!(store instanceof Map)) {
		throw new Error('invalid data-store structure: root is not Map');
	}
	const blog = store.get('blog');
	if (!(blog instanceof Map)) {
		throw new Error('invalid data-store structure: missing blog collection');
	}
	return [...blog.values()];
};

export const collectPublishHealth = ({ entries, distDir }) => {
	const pairMap = new Map();
	const idSet = new Set();
	for (const entry of entries) {
		idSet.add(String(entry?.id ?? ''));
		const key = `${entry?.data?.source_id ?? ''}::${entry?.data?.slug ?? ''}`;
		const lang = String(entry?.data?.lang ?? '');
		if (!key || !lang) {
			continue;
		}
		const langs = pairMap.get(key) ?? new Set();
		langs.add(lang);
		pairMap.set(key, langs);
	}

	const mirrorPairs = [...pairMap.values()].filter((langs) => langs.has('zh') && langs.has('en')).length;
	const articleRoutes = countArticleRoutes(distDir);
	const rssItems = countRssItems(distDir);

	return {
		blogSize: entries.length,
		mirrorPairs,
		duplicateIds: entries.length - idSet.size,
		articleRoutes,
		rssItems,
	};
};

export const validatePublishHealth = (metrics, thresholds) => {
	const failures = [];
	if (metrics.mirrorPairs < thresholds.minMirrorPairs) {
		failures.push(
			`mirrorPairs=${metrics.mirrorPairs} is below minMirrorPairs=${thresholds.minMirrorPairs}`
		);
	}
	if (metrics.articleRoutes < thresholds.minArticleRoutes) {
		failures.push(
			`articleRoutes=${metrics.articleRoutes} is below minArticleRoutes=${thresholds.minArticleRoutes}`
		);
	}
	if (metrics.rssItems < thresholds.minRssItems) {
		failures.push(`rssItems=${metrics.rssItems} is below minRssItems=${thresholds.minRssItems}`);
	}
	if (metrics.duplicateIds > thresholds.maxDuplicateIds) {
		failures.push(
			`duplicateIds=${metrics.duplicateIds} is above maxDuplicateIds=${thresholds.maxDuplicateIds}`
		);
	}
	return failures;
};

export const resolveThresholdsFromEnv = (env = process.env) => {
	const readInt = (name, fallback) => {
		const raw = env[name];
		if (!raw) {
			return fallback;
		}
		const value = Number.parseInt(raw, 10);
		return Number.isFinite(value) ? value : fallback;
	};

	return {
		minMirrorPairs: readInt('MIN_MIRROR_PAIRS', 2),
		minArticleRoutes: readInt('MIN_ARTICLE_ROUTES', 4),
		minRssItems: readInt('MIN_RSS_ITEMS', 4),
		maxDuplicateIds: readInt('MAX_DUPLICATE_IDS', 0),
	};
};

export const runPublishHealthCheck = ({ cwd = process.cwd(), env = process.env } = {}) => {
	const storePath = path.join(cwd, 'node_modules', '.astro', 'data-store.json');
	const distDir = path.join(cwd, 'dist');
	const entries = getBlogEntriesFromStore(storePath);
	const metrics = collectPublishHealth({ entries, distDir });
	const thresholds = resolveThresholdsFromEnv(env);
	const failures = validatePublishHealth(metrics, thresholds);
	return { metrics, thresholds, failures };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		const { metrics, thresholds, failures } = runPublishHealthCheck();
		console.log('[publish-health] metrics', JSON.stringify(metrics));
		console.log('[publish-health] thresholds', JSON.stringify(thresholds));

		if (failures.length > 0) {
			for (const failure of failures) {
				console.error(`[publish-health] FAIL: ${failure}`);
			}
			process.exit(1);
		}

		console.log('[publish-health] PASS');
	} catch (error) {
		console.error('[publish-health] ERROR:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
