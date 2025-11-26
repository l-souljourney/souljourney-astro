/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// shadcn/ui design tokens
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// Status Colors (Mapped to Shadcn variables)
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				import: 'hsl(var(--info))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						maxWidth: 'none',
						'--tw-prose-body': theme('colors.foreground'),
						'--tw-prose-headings': theme('colors.foreground'),
						'--tw-prose-lead': theme('colors.muted.foreground'),
						'--tw-prose-links': theme('colors.muted.foreground'),
						'--tw-prose-bold': theme('colors.foreground'),
						'--tw-prose-counters': theme('colors.muted.foreground'),
						'--tw-prose-bullets': theme('colors.muted.foreground'),
						'--tw-prose-hr': theme('colors.border'),
						'--tw-prose-quotes': theme('colors.foreground'),
						'--tw-prose-quote-borders': theme('colors.border'),
						'--tw-prose-captions': theme('colors.muted.foreground'),
						'--tw-prose-code': theme('colors.foreground'),
						'--tw-prose-pre-code': theme('colors.foreground'),
						'--tw-prose-pre-bg': theme('colors.muted.DEFAULT'),
						'--tw-prose-th-borders': theme('colors.border'),
						'--tw-prose-td-borders': theme('colors.border'),
						// Table styling
						'thead': {
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						'thead th': {
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
					}
				},
				invert: {
					css: {
						'--tw-prose-body': theme('colors.foreground'),
						'--tw-prose-headings': theme('colors.foreground'),
						'--tw-prose-lead': theme('colors.muted.foreground'),
						'--tw-prose-links': theme('colors.muted.foreground'),
						'--tw-prose-bold': theme('colors.foreground'),
						'--tw-prose-counters': theme('colors.muted.foreground'),
						'--tw-prose-bullets': theme('colors.muted.foreground'),
						'--tw-prose-hr': theme('colors.border'),
						'--tw-prose-quotes': theme('colors.foreground'),
						'--tw-prose-quote-borders': theme('colors.border'),
						'--tw-prose-captions': theme('colors.muted.foreground'),
						'--tw-prose-code': theme('colors.foreground'),
						'--tw-prose-pre-code': theme('colors.foreground'),
						'--tw-prose-pre-bg': theme('colors.muted.DEFAULT'),
						'--tw-prose-th-borders': theme('colors.border'),
						'--tw-prose-td-borders': theme('colors.border'),
					}
				}
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'class',
};
