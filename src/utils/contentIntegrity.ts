const PRIMARY_FRONTMATTER_RE = /^---\s*\n[\s\S]*?\n---\s*\n?/;
const LEADING_FRONTMATTER_RE = /^---\s*\n[\s\S]{0,2000}\n---\s*(?:\n|$)/;
const LEADING_KEY_CLUSTER_RE = /^title:\s.+\n[\s\S]{0,400}?date:\s.+\n[\s\S]{0,400}?categories:\s.+/i;

const HEAD_SLICE_LIMIT = 2200;

export const assertNoEmbeddedFrontmatterAtBodyStart = (raw: string, fileRef: string): void => {
	const source = String(raw || "");
	if (!source.trim()) {
		return;
	}
	const withoutPrimaryFrontmatter = source.replace(PRIMARY_FRONTMATTER_RE, "");
	const bodyHead = withoutPrimaryFrontmatter.trimStart().slice(0, HEAD_SLICE_LIMIT);
	if (!bodyHead) {
		return;
	}
	if (LEADING_FRONTMATTER_RE.test(bodyHead) || LEADING_KEY_CLUSTER_RE.test(bodyHead)) {
		throw new Error(`[content-integrity] duplicated frontmatter detected near body start: ${fileRef}`);
	}
};

export const hasDuplicateFrontmatterAtBodyStart = (raw: string): boolean => {
	const source = String(raw || "");
	if (!source.trim()) {
		return false;
	}
	const withoutPrimaryFrontmatter = source.replace(PRIMARY_FRONTMATTER_RE, "");
	const bodyHead = withoutPrimaryFrontmatter.trimStart().slice(0, HEAD_SLICE_LIMIT);
	if (!bodyHead) {
		return false;
	}
	return LEADING_FRONTMATTER_RE.test(bodyHead) || LEADING_KEY_CLUSTER_RE.test(bodyHead);
};
