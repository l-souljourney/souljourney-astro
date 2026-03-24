import { getCollection } from "astro:content";

type SiteLang = "zh" | "en";

type ArticleRoute = {
	lang: SiteLang;
	slug: string;
};

const ARTICLE_PATH_RE = /^\/(?:(en)\/)?article\/([^/]+)\/?$/;

let cachedArticleLangSlugSet: Set<string> | null = null;

const normalizeLang = (value: unknown): SiteLang => (value === "en" ? "en" : "zh");

const buildKey = (lang: SiteLang, slug: string) => `${lang}:${slug}`;

export const parseArticleRoute = (pathname: string): ArticleRoute | null => {
	const match = pathname.match(ARTICLE_PATH_RE);
	if (!match) {
		return null;
	}
	const [, enPrefix, slug] = match;
	return {
		lang: enPrefix ? "en" : "zh",
		slug,
	};
};

const getArticleLangSlugSet = async (): Promise<Set<string>> => {
	if (cachedArticleLangSlugSet) {
		return cachedArticleLangSlugSet;
	}
	const posts = await getCollection("blog");
	const set = new Set<string>();
	for (const post of posts) {
		const lang = normalizeLang(post.data.lang);
		const slug = post.data.slug;
		if (!slug) {
			continue;
		}
		set.add(buildKey(lang, slug));
	}
	cachedArticleLangSlugSet = set;
	return set;
};

export const getAlternateArticlePath = async (url: URL): Promise<string | null> => {
	const parsed = parseArticleRoute(url.pathname);
	if (!parsed) {
		return null;
	}
	const targetLang: SiteLang = parsed.lang === "zh" ? "en" : "zh";
	const set = await getArticleLangSlugSet();
	if (!set.has(buildKey(targetLang, parsed.slug))) {
		return null;
	}
	return targetLang === "en" ? `/en/article/${parsed.slug}` : `/article/${parsed.slug}`;
};
