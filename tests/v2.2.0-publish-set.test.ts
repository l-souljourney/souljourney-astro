import test from 'node:test';
import assert from 'node:assert/strict';

import { buildPublishSet, type PublishSetInputEntry } from '../src/utils/publishSet.js';

const createEntry = (
  id: string,
  overrides: Partial<PublishSetInputEntry['data']>
): PublishSetInputEntry => ({
  id,
  data: {
    title: `${id} title`,
    date: new Date('2026-03-25T00:00:00.000Z'),
    categories: 'investment',
    slug: 'shared-slug',
    source_id: 'shared-source',
    lang: 'zh',
    ...overrides,
  },
});

test('buildPublishSet should include only complete zh/en mirror pairs in published', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-entry', { lang: 'zh', slug: 'mirror-article', source_id: 'mirror-source' }),
    createEntry('en-entry', { lang: 'en', slug: 'mirror-article', source_id: 'mirror-source' }),
  ]);

  assert.equal(publishSet.published.length, 2);
  assert.deepEqual(
    publishSet.publishedByLang.zh.map((entry) => entry.id),
    ['zh-entry']
  );
  assert.deepEqual(
    publishSet.publishedByLang.en.map((entry) => entry.id),
    ['en-entry']
  );
  assert.equal(publishSet.pendingTranslation.length, 0);
  assert.equal(publishSet.sourceIdConflicts.length, 0);
  assert.equal(publishSet.slugConflicts.length, 0);
});

test('buildPublishSet should keep single-language entries out of public publish set', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-only-entry', { lang: 'zh', slug: 'zh-only', source_id: 'zh-only-source' }),
  ]);

  assert.equal(publishSet.published.length, 0);
  assert.deepEqual(
    publishSet.pendingTranslation.map((entry) => entry.id),
    ['zh-only-entry']
  );
});

test('buildPublishSet should exclude groups when one source_id maps to multiple slugs', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-conflict', { lang: 'zh', slug: 'alpha', source_id: 'same-source' }),
    createEntry('en-conflict', { lang: 'en', slug: 'beta', source_id: 'same-source' }),
  ]);

  assert.equal(publishSet.published.length, 0);
  assert.deepEqual(
    publishSet.sourceIdConflicts.map((entry) => entry.id).sort(),
    ['en-conflict', 'zh-conflict']
  );
});

test('buildPublishSet should exclude groups when one slug maps to multiple source_ids', () => {
  const publishSet = buildPublishSet([
    createEntry('zh-conflict', { lang: 'zh', slug: 'same-slug', source_id: 'source-a' }),
    createEntry('en-conflict', { lang: 'en', slug: 'same-slug', source_id: 'source-b' }),
  ]);

  assert.equal(publishSet.published.length, 0);
  assert.deepEqual(
    publishSet.slugConflicts.map((entry) => entry.id).sort(),
    ['en-conflict', 'zh-conflict']
  );
});
