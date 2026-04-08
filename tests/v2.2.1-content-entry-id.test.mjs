import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const config = fs.readFileSync(
	path.resolve(process.cwd(), 'src/content.config.ts'),
	'utf8'
);

test('content config should define loader generateId for lang/source_id/slug', () => {
	assert.match(config, /generateId:\s*\(\{\s*entry,\s*data\s*\}\)\s*=>\s*\{/);
	assert.match(config, /const lang = String\(data\.lang \?\? 'unknown'\)/);
	assert.match(config, /const sourceId = String\(data\.source_id \?\? entry\)/);
	assert.match(config, /const slug = String\(data\.slug \?\? entry\)/);
	assert.match(config, /return `\$\{lang\}::\$\{sourceId\}::\$\{slug\}`/);
});

test('content config should keep route slug contract unchanged', () => {
	assert.match(config, /slug: z\.string\(\)\.regex\(slugPattern\)/);
});
