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
	fs.mkdirSync(path.join(dist, 'blog', 'souljourney'), { recursive: true });
	fs.mkdirSync(path.join(dist, 'en', 'blog', 'souljourney'), { recursive: true });
	fs.writeFileSync(path.join(dist, 'blog', 'souljourney', 'index.html'), '<html></html>');
	fs.writeFileSync(path.join(dist, 'en', 'blog', 'souljourney', 'index.html'), '<html></html>');
	fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
	fs.writeFileSync(path.join(dist, 'rss.xml'), '<rss><channel><item></item></channel></rss>');
	fs.writeFileSync(path.join(dist, 'en', 'rss.xml'), '<rss><channel><item></item></channel></rss>');
	return root;
};

const writeReleaseManifest = (root, manifest) => {
	const dir = path.join(root, 'dist', '.well-known');
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(
		path.join(dir, 'sj-release.json'),
		typeof manifest === 'string' ? manifest : JSON.stringify(manifest)
	);
};

const RELEASE_MANIFEST_FIXTURE = {
	schema: 1,
	source: 'github:example/repo',
	commit: 'deadbeef',
	commit_source: 'env',
	built_at: '2026-01-01T00:00:00.000Z',
	content_digest: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
	content_entries: 2,
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
		// 本用例只验证 mirror pair 行为；发布身份门禁由下方专门用例覆盖。
		minReleaseManifest: 0,
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
		releaseManifest: 0,
	});
	assert.deepEqual(failures, []);
});

test('publish health should require the release manifest in the build output', () => {
	const root = createTempDist();
	const entries = [
		{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } },
		{ id: 'en::obs_a::souljourney', data: { lang: 'en', source_id: 'obs_a', slug: 'souljourney' } },
	];

	const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	const thresholds = resolveThresholdsFromEnv({});

	assert.equal(metrics.releaseManifest, 0);
	assert.ok(
		validatePublishHealth(metrics, thresholds).some((item) => item.includes('releaseManifest='))
	);

	writeReleaseManifest(root, RELEASE_MANIFEST_FIXTURE);
	const repaired = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
	assert.equal(repaired.releaseManifest, 1);
	assert.equal(
		validatePublishHealth(repaired, thresholds).some((item) => item.includes('releaseManifest=')),
		false
	);
});

test('publish health should reject a malformed release manifest', () => {
	const entries = [
		{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } },
	];

	for (const broken of [
		'{not json',
		{ ...RELEASE_MANIFEST_FIXTURE, content_digest: '' },
		{ ...RELEASE_MANIFEST_FIXTURE, commit: '' },
	]) {
		const root = createTempDist();
		writeReleaseManifest(root, broken);
		const metrics = collectPublishHealth({ entries, distDir: path.join(root, 'dist') });
		assert.equal(metrics.releaseManifest, 0, `should reject: ${JSON.stringify(broken)}`);
	}
});

test('publish health should not count blog aggregation pages as article routes', () => {
	const root = createTempDist();
	const dist = path.join(root, 'dist');

	// 聚合页与正文页同处 blog/ 之下，只有正文页才应计入 articleRoutes
	fs.writeFileSync(path.join(dist, 'blog', 'index.html'), '<html></html>');
	for (const segment of ['categories/investment', 'tag/AI', 'archives']) {
		fs.mkdirSync(path.join(dist, 'blog', segment), { recursive: true });
		fs.writeFileSync(path.join(dist, 'blog', segment, 'index.html'), '<html></html>');
	}

	const entries = [
		{ id: 'zh::obs_a::souljourney', data: { lang: 'zh', source_id: 'obs_a', slug: 'souljourney' } },
	];
	const metrics = collectPublishHealth({ entries, distDir: dist });

	assert.equal(metrics.articleRoutes, 2, 'only blog/souljourney and en/blog/souljourney are article routes');
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
		minReleaseManifest: 1,
	});
});
