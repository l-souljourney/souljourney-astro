import test from 'node:test';
import assert from 'node:assert/strict';

import {
	buildCreatePurgeTaskBody,
	createPurgeTask,
	createSignedTencentRequest,
	resolveEdgeOneEnv,
} from '../script/edgeone-purge.js';

test('resolveEdgeOneEnv should default to purge_host and primary domain', () => {
	const resolved = resolveEdgeOneEnv({
		PRIMARY_DOMAIN: 'www.l-souljourney.cn',
		TENCENT_CLOUD_SECRET_ID: 'sid',
		TENCENT_CLOUD_SECRET_KEY: 'skey',
		TEO_ZONE_ID_SECRET: 'zone-123',
	});

	assert.deepEqual(resolved, {
		secretId: 'sid',
		secretKey: 'skey',
		zoneId: 'zone-123',
		type: 'purge_host',
		method: '',
		targets: ['www.l-souljourney.cn'],
		region: '',
		endpoint: 'https://teo.tencentcloudapi.com/',
	});
});

test('buildCreatePurgeTaskBody should omit Targets for purge_all', () => {
	const body = buildCreatePurgeTaskBody({
		zoneId: 'zone-123',
		type: 'purge_all',
		method: 'invalidate',
		targets: [],
	});

	assert.deepEqual(body, {
		ZoneId: 'zone-123',
		Type: 'purge_all',
		Method: 'invalidate',
	});
});

test('createSignedTencentRequest should include TC3 headers', () => {
	const request = createSignedTencentRequest({
		secretId: 'AKIDTEST',
		secretKey: 'SECRETTEST',
		body: {
			ZoneId: 'zone-123',
			Type: 'purge_host',
			Targets: ['www.l-souljourney.cn'],
		},
		timestamp: 1777699200,
	});

	assert.equal(request.url, 'https://teo.tencentcloudapi.com/');
	assert.equal(request.headers['X-TC-Action'], 'CreatePurgeTask');
	assert.equal(request.headers['X-TC-Version'], '2022-09-01');
	assert.match(
		request.headers.Authorization,
		/^TC3-HMAC-SHA256 Credential=AKIDTEST\/2026-05-02\/teo\/tc3_request, SignedHeaders=content-type;host, Signature=[a-f0-9]{64}$/
	);
});

test('createPurgeTask should submit the signed request and return response payload', async () => {
	let captured = null;

	const result = await createPurgeTask({
		secretId: 'AKIDTEST',
		secretKey: 'SECRETTEST',
		zoneId: 'zone-123',
		type: 'purge_host',
		targets: ['www.l-souljourney.cn'],
		timestamp: 1777699200,
		fetchImpl: async (url, init) => {
			captured = { url, init };
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				text: async () =>
					JSON.stringify({
						Response: {
							JobId: 'job-123',
							RequestId: 'req-123',
							FailedList: [],
						},
					}),
			};
		},
	});

	assert.equal(captured?.url, 'https://teo.tencentcloudapi.com/');
	assert.equal(captured?.init?.method, 'POST');
	assert.equal(captured?.init?.headers['X-TC-Action'], 'CreatePurgeTask');
	assert.equal(
		captured?.init?.body,
		JSON.stringify({
			ZoneId: 'zone-123',
			Type: 'purge_host',
			Targets: ['www.l-souljourney.cn'],
		})
	);
	assert.deepEqual(result, {
		JobId: 'job-123',
		RequestId: 'req-123',
		FailedList: [],
	});
});
