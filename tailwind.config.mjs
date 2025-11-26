/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				// Starlight Design System fonts
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
			},
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
			typography: {
				DEFAULT: {
					css: {
						// Paragraph spacing aligned with Starlight
						'p': {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						// List styles optimization
						'ul, ol': {
							paddingLeft: '1.625em',
						},
						'li': {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						// Blockquote Starlight style
						'blockquote': {
							borderLeftWidth: '4px',
							borderLeftColor: 'hsl(var(--primary))',
							backgroundColor: 'hsl(var(--muted) / 0.3)',
							paddingTop: '1em',
							paddingBottom: '1em',
							paddingLeft: '1.5em',
							paddingRight: '1.5em',
							borderRadius: '0.5rem',
						},
					},
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'class',
};
