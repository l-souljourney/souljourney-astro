import crypto from 'node:crypto';

const EDGEONE_ACTION = 'CreatePurgeTask';
const EDGEONE_VERSION = '2022-09-01';
const EDGEONE_SERVICE = 'teo';
const EDGEONE_ENDPOINT = 'https://teo.tencentcloudapi.com/';
const VALID_TYPES = new Set([
	'purge_url',
	'purge_prefix',
	'purge_host',
	'purge_all',
	'purge_cache_tag',
]);
const TYPES_WITH_OPTIONAL_METHOD = new Set(['purge_prefix', 'purge_host', 'purge_all']);
const TYPES_REQUIRING_TARGETS = new Set([
	'purge_url',
	'purge_prefix',
	'purge_host',
	'purge_cache_tag',
]);

const sha256 = (input, encoding = 'hex') => crypto.createHash('sha256').update(input).digest(encoding);
const hmacSha256 = (key, input, encoding) =>
	crypto.createHmac('sha256', key).update(input).digest(encoding);

const trimToEmpty = (value) => String(value ?? '').trim();

export const parseTargets = (raw) =>
	trimToEmpty(raw)
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);

export const resolveEdgeOneEnv = (env = process.env) => {
	const type = trimToEmpty(env.TEO_PURGE_TYPE) || 'purge_host';
	const primaryDomain = trimToEmpty(env.PRIMARY_DOMAIN) || trimToEmpty(env.CDN_DOMAIN);
	const targets = parseTargets(env.TEO_PURGE_TARGETS);

	return {
		secretId: trimToEmpty(env.TENCENT_CLOUD_SECRET_ID) || trimToEmpty(env.COS_SECRET_ID),
		secretKey: trimToEmpty(env.TENCENT_CLOUD_SECRET_KEY) || trimToEmpty(env.COS_SECRET_KEY),
		zoneId: trimToEmpty(env.TEO_ZONE_ID) || trimToEmpty(env.TEO_ZONE_ID_SECRET),
		type,
		method: trimToEmpty(env.TEO_PURGE_METHOD),
		targets: targets.length > 0 ? [...new Set(targets)] : (primaryDomain ? [primaryDomain] : []),
		region: trimToEmpty(env.TENCENT_CLOUD_REGION) || trimToEmpty(env.TEO_REGION),
		endpoint: trimToEmpty(env.TEO_API_ENDPOINT) || EDGEONE_ENDPOINT,
	};
};

export const buildCreatePurgeTaskBody = ({ zoneId, type, method, targets = [] }) => {
	if (!VALID_TYPES.has(type)) {
		throw new Error(`unsupported TEO_PURGE_TYPE: ${type}`);
	}
	if (!trimToEmpty(zoneId)) {
		throw new Error('missing TEO_ZONE_ID');
	}

	const body = {
		ZoneId: zoneId,
		Type: type,
	};

	if (TYPES_REQUIRING_TARGETS.has(type)) {
		const normalizedTargets = targets.map((item) => trimToEmpty(item)).filter(Boolean);
		if (normalizedTargets.length === 0) {
			throw new Error(`missing purge targets for ${type}`);
		}
		body.Targets = normalizedTargets;
	}

	if (method) {
		if (!TYPES_WITH_OPTIONAL_METHOD.has(type)) {
			throw new Error(`TEO_PURGE_METHOD is not supported for ${type}`);
		}
		if (method !== 'invalidate' && method !== 'delete') {
			throw new Error(`unsupported TEO_PURGE_METHOD: ${method}`);
		}
		body.Method = method;
	}

	return body;
};

export const createSignedTencentRequest = ({
	secretId,
	secretKey,
	body,
	endpoint = EDGEONE_ENDPOINT,
	action = EDGEONE_ACTION,
	version = EDGEONE_VERSION,
	service = EDGEONE_SERVICE,
	region = '',
	timestamp = Math.floor(Date.now() / 1000),
}) => {
	if (!trimToEmpty(secretId) || !trimToEmpty(secretKey)) {
		throw new Error('missing TENCENT_CLOUD_SECRET_ID or TENCENT_CLOUD_SECRET_KEY');
	}

	const url = new URL(endpoint);
	const payload = JSON.stringify(body);
	const contentType = 'application/json; charset=utf-8';
	const host = url.host;
	const signedHeaders = 'content-type;host';
	const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`;
	const hashedPayload = sha256(payload);
	const canonicalRequest = [
		'POST',
		url.pathname || '/',
		'',
		canonicalHeaders,
		signedHeaders,
		hashedPayload,
	].join('\n');

	const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
	const credentialScope = `${date}/${service}/tc3_request`;
	const stringToSign = [
		'TC3-HMAC-SHA256',
		String(timestamp),
		credentialScope,
		sha256(canonicalRequest),
	].join('\n');

	const secretDate = hmacSha256(`TC3${secretKey}`, date);
	const secretService = hmacSha256(secretDate, service);
	const secretSigning = hmacSha256(secretService, 'tc3_request');
	const signature = hmacSha256(secretSigning, stringToSign, 'hex');
	const authorization = [
		'TC3-HMAC-SHA256',
		`Credential=${secretId}/${credentialScope},`,
		`SignedHeaders=${signedHeaders},`,
		`Signature=${signature}`,
	].join(' ');

	const headers = {
		Authorization: authorization,
		'Content-Type': contentType,
		Host: host,
		'X-TC-Action': action,
		'X-TC-Timestamp': String(timestamp),
		'X-TC-Version': version,
	};

	if (region) {
		headers['X-TC-Region'] = region;
	}

	return {
		url: url.toString(),
		body: payload,
		headers,
	};
};

export const createPurgeTask = async ({
	secretId,
	secretKey,
	zoneId,
	type,
	method,
	targets,
	region,
	endpoint,
	timestamp,
	fetchImpl = globalThis.fetch,
}) => {
	if (typeof fetchImpl !== 'function') {
		throw new Error('global fetch is unavailable');
	}

	const body = buildCreatePurgeTaskBody({ zoneId, type, method, targets });
	const request = createSignedTencentRequest({
		secretId,
		secretKey,
		body,
		region,
		endpoint,
		timestamp,
	});

	const response = await fetchImpl(request.url, {
		method: 'POST',
		headers: request.headers,
		body: request.body,
	});
	const raw = await response.text();
	if (!response.ok) {
		throw new Error(`EdgeOne purge request failed: ${response.status} ${response.statusText}\n${raw}`);
	}

	const parsed = JSON.parse(raw);
	if (parsed?.Response?.Error) {
		const { Code, Message } = parsed.Response.Error;
		throw new Error(`EdgeOne purge API error: ${Code} ${Message}`);
	}

	return parsed?.Response ?? parsed;
};

const hasArg = (flag) => process.argv.slice(2).includes(flag);

export const run = async ({ env = process.env, fetchImpl = globalThis.fetch } = {}) => {
	const config = resolveEdgeOneEnv(env);

	if (!config.zoneId) {
		console.warn(
			'⚠️ EdgeOne purge skipped: missing TEO_ZONE_ID. Set repo variable TEO_ZONE_ID or secret TEO_ZONE_ID.'
		);
		return 0;
	}

	const preview = {
		zoneId: config.zoneId,
		type: config.type,
		method: config.method || undefined,
		targets: config.type === 'purge_all' ? [] : config.targets,
		endpoint: config.endpoint,
		region: config.region || undefined,
	};

	if (hasArg('--dry-run')) {
		console.log(JSON.stringify(preview, null, 2));
		return 0;
	}

	if (!config.secretId || !config.secretKey) {
		throw new Error('missing TENCENT_CLOUD_SECRET_ID or TENCENT_CLOUD_SECRET_KEY');
	}

	const result = await createPurgeTask({
		...config,
		fetchImpl,
	});

	console.log(
		JSON.stringify(
			{
				JobId: result.JobId,
				RequestId: result.RequestId,
				FailedList: result.FailedList ?? [],
			},
			null,
			2
		)
	);
	return 0;
};

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
	run().catch((error) => {
		console.error(`❌ ${error.message}`);
		process.exitCode = 1;
	});
}
