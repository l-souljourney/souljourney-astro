import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildReleaseManifest,
  computeContentDigest,
  resolveCommit,
} from '../src/utils/releaseIdentity.js';

const entries = [
  { id: 'zh::obs_a::post-a', digest: 'aaaa' },
  { id: 'en::obs_a::post-a', digest: 'bbbb' },
  { id: 'zh::obs_b::post-b', digest: 'cccc' },
];

test('content digest is deterministic for the same content set', () => {
  assert.equal(computeContentDigest(entries), computeContentDigest(entries));
});

test('content digest ignores entry order', () => {
  const shuffled = [entries[2], entries[0], entries[1]];
  assert.equal(computeContentDigest(entries), computeContentDigest(shuffled));
});

test('content digest changes when the published id set changes', () => {
  const extended = [...entries, { id: 'en::obs_b::post-b', digest: 'dddd' }];
  assert.notEqual(computeContentDigest(entries), computeContentDigest(extended));
});

test('content digest changes when an entry content digest changes', () => {
  const edited = entries.map((entry) =>
    entry.id === 'zh::obs_a::post-a' ? { ...entry, digest: 'zzzz' } : entry
  );
  assert.notEqual(computeContentDigest(entries), computeContentDigest(edited));
});

test('content digest tolerates entries without a content digest', () => {
  const withoutDigest = entries.map(({ id }) => ({ id }));
  assert.match(computeContentDigest(withoutDigest), /^sha256:[0-9a-f]{64}$/);
});

test('resolveCommit prefers the CI environment variable', () => {
  const resolved = resolveCommit({ GITHUB_SHA: 'abc123' });
  assert.deepEqual(resolved, { commit: 'abc123', commitSource: 'env' });
});

test('resolveCommit trims an over-long environment value to a commit-length id', () => {
  const long = 'a'.repeat(64);
  assert.equal(resolveCommit({ GITHUB_SHA: long }).commit.length, 40);
});

test('resolveCommit reports degradation instead of inventing a commit', () => {
  const resolved = resolveCommit({}, '/nonexistent-path-for-release-identity-test');
  assert.deepEqual(resolved, { commit: 'unknown', commitSource: 'unknown' });
});

test('buildReleaseManifest carries the published entry count and a stable digest', () => {
  const manifest = buildReleaseManifest({
    source: 'github:example/repo',
    entries,
    builtAt: '2026-01-01T00:00:00.000Z',
    env: { GITHUB_SHA: 'deadbeef' },
  });

  assert.equal(manifest.schema, 1);
  assert.equal(manifest.source, 'github:example/repo');
  assert.equal(manifest.commit, 'deadbeef');
  assert.equal(manifest.commit_source, 'env');
  assert.equal(manifest.built_at, '2026-01-01T00:00:00.000Z');
  assert.equal(manifest.content_entries, entries.length);
  assert.equal(manifest.content_digest, computeContentDigest(entries));
});
