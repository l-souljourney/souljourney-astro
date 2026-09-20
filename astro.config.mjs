import path from "path";
import sitemap from '@astrojs/sitemap';
import Compress from "@playform/compress";
import { defineConfig, svgoOptimizer } from 'astro/config';
import { fileURLToPath } from 'url';
import icon from 'astro-icon';
import pagefindArticlesOnly from "./src/integrations/pagefindArticlesOnly.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Markdown 配置================
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import { remarkNote, addClassNames } from './src/plugins/markdown.custom'
import { validateMarkdownIntegrityInDir } from './src/utils/contentIntegrityFs'
// Markdown 配置================
import SITE_INFO from './src/config';

validateMarkdownIntegrityInDir(path.resolve(__dirname, "./src/content/blog"));

// https://astro.build/config
export default defineConfig({
	site: SITE_INFO.Site,
	build: { assets: 'vh_static' },
	// Astro 7 默认改为 'jsx'（按 JSX 规则剥离内联元素间空白）。升级提交先显式固定
	// Astro 6 的 true 行为，避免把渲染差异混进框架升级；是否采用新默认另行评估。
	compressHTML: true,
	experimental: {
		svgOptimizer: svgoOptimizer(),
	},
	i18n: {
		defaultLocale: "zh",
		locales: ["zh", "en"],
		routing: {
			prefixDefaultLocale: false
		}
	},
	integrations: [
		icon(),
		pagefindArticlesOnly(),
		Compress({ CSS: false, Image: false, Action: { Passed: async () => true } }),
		sitemap({
			changefreq: 'weekly', priority: 0.7, lastmod: new Date(),
			// 处理末尾带 / 的 url
			serialize: (item) => ({ ...item, url: item.url.endsWith('/') ? item.url.slice(0, -1) : item.url })
		}),
	],
	markdown: {
		remarkPlugins: [remarkMath, remarkDirective, remarkNote,],
		rehypePlugins: [rehypeKatex, rehypeSlug, addClassNames],
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: {
				light: 'github-light',
				dark: 'github-dark-dimmed',
			},
			wrap: false,
		},
	},
	vite: { resolve: { alias: { "@": path.resolve(__dirname, "./src") } } },
	server: { host: '0.0.0.0' }
});
