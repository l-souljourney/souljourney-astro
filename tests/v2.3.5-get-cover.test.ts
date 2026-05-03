import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import getCover, { resolveBannerDir } from '../src/utils/getCover.js';

test('resolveBannerDir should stay anchored to the repo public banner directory', () => {
  const expectedDir = path.resolve(process.cwd(), 'public/assets/images/banner');
  const actualDir = resolveBannerDir();
  const imageFiles = fs
    .readdirSync(actualDir)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file));

  assert.equal(actualDir, expectedDir);
  assert.ok(fs.existsSync(actualDir));
  assert.ok(imageFiles.length > 0);
});

test('getCover should preserve an explicit cover path', async () => {
  const cover = '/assets/images/custom-cover.webp';

  assert.equal(await getCover(cover), cover);
});

test('getCover should fallback when frontmatter still contains an Obsidian wikilink cover', async () => {
  const cover = await getCover('[[Pasted image 20260324113724.png]]');

  assert.match(cover, /\/assets\/images\/banner\/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i);
});

test('getCover should fallback to a banner image under the site root', async () => {
  const cover = await getCover(null);

  assert.match(cover, /\/assets\/images\/banner\/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i);
});
