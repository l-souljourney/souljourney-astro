import { getRssString } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getDescription } from '@/utils/index'
import SITE_CONFIG from '@/config';
import { getPublishedEntriesByLang } from '@/utils/publishSet';
const { Title, Description } = SITE_CONFIG;

export async function GET(context: any) {
	const posts = await getCollection('blog');
	const publishedByLang = {
		zh: getPublishedEntriesByLang(posts, 'zh'),
		en: getPublishedEntriesByLang(posts, 'en'),
	};
	const res = await getRssString({
		title: Title,
		description: Description,
		site: context.site,
		items: publishedByLang.zh.map((post) => ({
			title: post.data.title,
			pubDate: post.data.updated || post.data.date,
			description: getDescription(post),
			link: `/article/${post.data.slug}`
		})).sort((a: any, b: any) => (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())),
	});
	// 添加 XML 样式表指令
	const xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
	const xmlMain = res.replace(xmlHead, `${xmlHead}<?xml-stylesheet type="text/xsl" href="/rss.xsl" ?>`).replace(/\/<\/link>/g, '</link>');
	return new Response(xmlMain, { headers: { 'Content-Type': 'application/xml' } });
}
