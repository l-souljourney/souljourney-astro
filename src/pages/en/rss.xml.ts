import { getRssString } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getDescription } from '@/utils/index'
import SITE_CONFIG from '@/config';
const { Title, Description } = SITE_CONFIG;

export async function GET(context: any) {
    const posts = await getCollection('blog');
    // Filter for English posts
    const enPosts = posts.filter(i => !i.data.hide && i.id.startsWith('en/'));

    const res = await getRssString({
        title: `${Title} (English)`,
        description: Description,
        site: context.site,
        items: enPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.updated || post.data.date,
            description: getDescription(post),
            link: `/en/article/${post.id.replace('en/', '')}`
        })).sort((a: any, b: any) => (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())),
    });
    // Add XML stylesheet
    const xmlHead = '<?xml version="1.0" encoding="UTF-8"?>';
    const xmlMain = res.replace(xmlHead, `${xmlHead}<?xml-stylesheet type="text/xsl" href="/rss.xsl" ?>`).replace(/\/<\/link>/g, '</link>');
    return new Response(xmlMain, { headers: { 'Content-Type': 'application/xml' } });
}
