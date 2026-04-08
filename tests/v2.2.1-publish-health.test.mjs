import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { collectPublishHealth, validatePublishHealth } from '../script/publish-health.js';

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
