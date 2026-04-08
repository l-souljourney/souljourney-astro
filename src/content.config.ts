import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const canonicalCategories = [
	'investment',
	'ai-era',
	'zhejiang-business',
	'philosophy',
	'life',
] as const;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
		// Use language + source_id + slug as a stable unique ID for bilingual entries.
		generateId: ({ entry, data }) => {
			const lang = String(data.lang ?? 'unknown');
			const sourceId = String(data.source_id ?? entry);
			const slug = String(data.slug ?? entry);
			return `${lang}::${sourceId}::${slug}`;
		},
	}),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		categories: z.enum(canonicalCategories),
		slug: z.string().regex(slugPattern),
		source_id: z.string().min(1),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
		cover: z.string().optional(),
		recommend: z.boolean().optional(),
		hide: z.boolean().optional(),
		top: z.boolean().optional(),
		lang: z.enum(['zh', 'en']),
		author: z.string().optional(),
		word_count: z.number().int().nonnegative().optional(),
		reading_time: z.number().nonnegative().optional(),
		target: z.string().optional(),
		article_type: z.string().optional(),
		render_profile: z.string().optional(),
		cover_image_url: z.string().optional(),
	}),
});

export const collections = { blog };
