/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Map existing Less variables to Tailwind colors
				primary: 'var(--vh-main-color)',
				'primary-light': 'var(--vh-main-color-light)',
				'primary-dark': 'var(--vh-main-color-dark)',
				// Add other mappings as needed
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};
