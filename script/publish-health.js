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

const buildPairKey = (entry) => `${entry?.data?.source_id ?? ''}::${entry?.data?.slug ?? ''}`;

const getConflictKeys = (groups) =>
	new Set(
		[...groups.entries()]
			.filter(([, keys]) => keys.size > 1)
			.map(([value]) => value)
	);

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
	const pairGroups = new Map();
	const idSet = new Set();
	const sourceIdToPairKeys = new Map();
	const slugToPairKeys = new Map();
	for (const entry of entries) {
		idSet.add(String(entry?.id ?? ''));
		const key = buildPairKey(entry);
		if (!key) {
			continue;
		}
		const groupEntries = pairGroups.get(key) ?? [];
		groupEntries.push(entry);
		pairGroups.set(key, groupEntries);

		const sourceId = String(entry?.data?.source_id ?? '');
		const slug = String(entry?.data?.slug ?? '');

		const sourceKeys = sourceIdToPairKeys.get(sourceId) ?? new Set();
		sourceKeys.add(key);
		sourceIdToPairKeys.set(sourceId, sourceKeys);

		const slugKeys = slugToPairKeys.get(slug) ?? new Set();
		slugKeys.add(key);
		slugToPairKeys.set(slug, slugKeys);
	}

	const conflictingSourceIds = getConflictKeys(sourceIdToPairKeys);
	const conflictingSlugs = getConflictKeys(slugToPairKeys);

	let pendingTranslations = 0;
	let sourceIdConflicts = 0;
	let slugConflicts = 0;
	let duplicateLocaleConflicts = 0;
	let categoryConflicts = 0;
	let mirrorPairs = 0;

	for (const [pairKey, groupEntries] of pairGroups.entries()) {
		const [sourceId, slug] = pairKey.split('::');
		if (conflictingSourceIds.has(sourceId)) {
			sourceIdConflicts += 1;
			continue;
		}
		if (conflictingSlugs.has(slug)) {
			slugConflicts += 1;
			continue;
		}

		const langs = new Map();
		for (const entry of groupEntries) {
			const lang = String(entry?.data?.lang ?? '');
			langs.set(lang, (langs.get(lang) ?? 0) + 1);
		}
		const zhCount = langs.get('zh') ?? 0;
		const enCount = langs.get('en') ?? 0;

		if (zhCount > 1 || enCount > 1) {
			duplicateLocaleConflicts += 1;
			continue;
		}
		if (zhCount === 1 && enCount === 1) {
			mirrorPairs += 1;
			continue;
		}

		if (zhCount === 1 || enCount === 1) {
			pendingTranslations += 1;
		}
	}

	const categoriesByPairKey = new Map();
	for (const entry of entries) {
		const key = buildPairKey(entry);
		const category = String(entry?.data?.categories ?? '');
		const categories = categoriesByPairKey.get(key) ?? new Set();
		categories.add(category);
		categoriesByPairKey.set(key, categories);
	}

	for (const [pairKey, categories] of categoriesByPairKey.entries()) {
		const [sourceId, slug] = pairKey.split('::');
		if (conflictingSourceIds.has(sourceId) || conflictingSlugs.has(slug)) {
			continue;
		}
		if (categories.size > 1) {
			categoryConflicts += 1;
		}
	}

	const articleRoutes = countArticleRoutes(distDir);
	const rssItems = countRssItems(distDir);

	return {
		blogSize: entries.length,
		mirrorPairs,
		pendingTranslations,
		sourceIdConflicts,
		slugConflicts,
		duplicateLocaleConflicts,
		categoryConflicts,
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
	if (
		thresholds.maxPendingTranslations !== null
		&& metrics.pendingTranslations > thresholds.maxPendingTranslations
	) {
		failures.push(
			`pendingTranslations=${metrics.pendingTranslations} is above maxPendingTranslations=${thresholds.maxPendingTranslations}`
		);
	}
	if (metrics.sourceIdConflicts > thresholds.maxSourceIdConflicts) {
		failures.push(
			`sourceIdConflicts=${metrics.sourceIdConflicts} is above maxSourceIdConflicts=${thresholds.maxSourceIdConflicts}`
		);
	}
	if (metrics.slugConflicts > thresholds.maxSlugConflicts) {
		failures.push(
			`slugConflicts=${metrics.slugConflicts} is above maxSlugConflicts=${thresholds.maxSlugConflicts}`
		);
	}
	if (metrics.duplicateLocaleConflicts > thresholds.maxDuplicateLocaleConflicts) {
		failures.push(
			`duplicateLocaleConflicts=${metrics.duplicateLocaleConflicts} is above maxDuplicateLocaleConflicts=${thresholds.maxDuplicateLocaleConflicts}`
		);
	}
	if (metrics.categoryConflicts > thresholds.maxCategoryConflicts) {
		failures.push(
			`categoryConflicts=${metrics.categoryConflicts} is above maxCategoryConflicts=${thresholds.maxCategoryConflicts}`
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

	const readOptionalInt = (name) => {
		const raw = env[name];
		if (raw === undefined || raw === '') {
			return null;
		}
		const value = Number.parseInt(raw, 10);
		return Number.isFinite(value) ? value : null;
	};

	return {
		minMirrorPairs: readInt('MIN_MIRROR_PAIRS', 2),
		minArticleRoutes: readInt('MIN_ARTICLE_ROUTES', 4),
		minRssItems: readInt('MIN_RSS_ITEMS', 4),
		maxDuplicateIds: readInt('MAX_DUPLICATE_IDS', 0),
		maxPendingTranslations: readOptionalInt('MAX_PENDING_TRANSLATIONS'),
		maxSourceIdConflicts: readInt('MAX_SOURCE_ID_CONFLICTS', 0),
		maxSlugConflicts: readInt('MAX_SLUG_CONFLICTS', 0),
		maxDuplicateLocaleConflicts: readInt('MAX_DUPLICATE_LOCALE_CONFLICTS', 0),
		maxCategoryConflicts: readInt('MAX_CATEGORY_CONFLICTS', 0),
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
