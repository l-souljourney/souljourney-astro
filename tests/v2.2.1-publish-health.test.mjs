import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
	collectPublishHealth,
	resolveThresholdsFromEnv,
	validatePublishHealth,
} from '../script/publish-health.js';

const createTempDist = () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-health-'));
	const dist = path.join(root, 'dist');
	fs.mkdirSync(path.join(dist, 'article', 'souljourney'), { recursive: true });
	fs.mkdirSync(path.join(dist, 'en', 'article', 'souljourney'), { recursive: true });
	fs.writeFileSync(path.join(dist, 'article', 'souljourney', 'index.html'), '<html></html>');
	fs.writeFileSync(path.join(dist, 'en', 'article', 'souljourney', 'index.html'), '<html></html>');
	fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
	fs.writeFileSync(path.join(dist, 'rss.xml'), '<rss><channel><item></item></channel></rss>');
	fs.writeFileSync(path.join(dist, 'en', 'rss.xml'), '<rss><channel><item></item></channel></rss>');
	return root;
};

test('publish health should pass for one complete mirror pair', () => {
	const root = createTempDist();
	const entries = [
		{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } },
		{ id: 'en::obs_a::souljourney', data: { lang: 'en', source_id: 'obs_a', slug: 'souljourney' } },
	];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const failures = validatePublishHealth(metrics, {
		minMirrorPairs: 1,
		minArticleRoutes: 1,
		minRssItems: 1,
		maxDuplicateIds: 0,
	});

	assert.deepEqual(metrics, {
		blogSize: 2,
		mirrorPairs: 1,
		pendingTranslations: 0,
		sourceIdConflicts: 0,
		slugConflicts: 0,
		duplicateLocaleConflicts: 0,
		categoryConflicts: 0,
		duplicateIds: 0,
		articleRoutes: 2,
		rssItems: 2,
	});
	assert.deepEqual(failures, []);
});

test('publish health should fail when mirror pairs collapse to zero', () => {
	const root = createTempDist();
	const entries = [{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } }];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const failures = validatePublishHealth(metrics, {
		minMirrorPairs: 1,
		minArticleRoutes: 1,
		minRssItems: 1,
		maxDuplicateIds: 0,
	});

	assert.equal(metrics.mirrorPairs, 0);
	assert.ok(failures.some((item) => item.includes('mirrorPairs=')));
});

test('publish health should fail when duplicate entry ids appear', () => {
	const root = createTempDist();
	const entries = [
		{ id: 'shared-id', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } },
		{ id: 'shared-id', data: { lang: 'en', source_id: 'obs_a', slug: 'souljourney' } },
	];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const failures = validatePublishHealth(metrics, {
		minMirrorPairs: 1,
		minArticleRoutes: 1,
		minRssItems: 1,
		maxDuplicateIds: 0,
	});

	assert.equal(metrics.duplicateIds, 1);
	assert.ok(failures.some((item) => item.includes('duplicateIds=')));
});

test('publish health should report pending translation groups and optional strict threshold', () => {
	const root = createTempDist();
	const entries = [{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } }];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const failures = validatePublishHealth(metrics, {
		minMirrorPairs: 0,
		minArticleRoutes: 1,
		minRssItems: 1,
		maxDuplicateIds: 0,
		maxPendingTranslations: 0,
		maxSourceIdConflicts: 0,
		maxSlugConflicts: 0,
		maxDuplicateLocaleConflicts: 0,
		maxCategoryConflicts: 0,
	});

	assert.equal(metrics.pendingTranslations, 1);
	assert.ok(failures.some((item) => item.includes('pendingTranslations=')));
});

test('publish health should report source and category conflicts', () => {
	const root = createTempDist();
	const entries = [
		{ id: 'zh::obs_a::slug-a', data: { lang: 'zh', source_id: 'obs_a', slug: 'slug-a', categories: 'investment' } },
		{ id: 'en::obs_a::slug-b', data: { lang: 'en', source_id: 'obs_a', slug: 'slug-b', categories: 'investment' } },
		{ id: 'zh::obs_b::slug-c', data: { lang: 'zh', source_id: 'obs_b', slug: 'slug-c', categories: 'investment' } },
		{ id: 'en::obs_b::slug-c', data: { lang: 'en', source_id: 'obs_b', slug: 'slug-c', categories: 'life' } },
	];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const failures = validatePublishHealth(metrics, {
		minMirrorPairs: 0,
		minArticleRoutes: 1,
		minRssItems: 1,
		maxDuplicateIds: 0,
		maxPendingTranslations: null,
		maxSourceIdConflicts: 0,
		maxSlugConflicts: 0,
		maxDuplicateLocaleConflicts: 0,
		maxCategoryConflicts: 0,
	});

	assert.equal(metrics.sourceIdConflicts, 2);
	assert.equal(metrics.categoryConflicts, 1);
	assert.ok(failures.some((item) => item.includes('sourceIdConflicts=')));
	assert.ok(failures.some((item) => item.includes('categoryConflicts=')));
});

test('publish health should use the v2.3.0 default thresholds', () => {
	const thresholds = resolveThresholdsFromEnv({});

	assert.deepEqual(thresholds, {
		minMirrorPairs: 2,
		minArticleRoutes: 4,
		minRssItems: 4,
		maxDuplicateIds: 0,
		maxPendingTranslations: null,
		maxSourceIdConflicts: 0,
		maxSlugConflicts: 0,
		maxDuplicateLocaleConflicts: 0,
		maxCategoryConflicts: 0,
	});
});
