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
				//  Legacy colors (保留用于向后兼容)
				success: 'var(--vh-success)',
				warning: 'var(--vh-warning)',
				import: 'var(--vh-import)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						// 基础配置
						maxWidth: 'none',
						color: theme('colors.foreground'),

						// 链接样式（保留原有的下划线效果）
						a: {
							color: theme('colors.muted.foreground'),
							textDecoration: 'none',
							boxShadow: `inset 0 -0.12rem ${theme('colors.primary.DEFAULT')}`,
							transition: 'box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
							'&:hover': {
								boxShadow: `inset 0 -1.5rem hsl(var(--primary) / 0.28)`,
							},
						},

						// 标题样式 - h1 特殊处理（不显示 # 符号）
						h1: {
							color: theme('colors.foreground'),
							fontSize: '1.58rem',
							fontWeight: '700',
							marginTop: '0',
							paddingBottom: '1rem',
							marginBottom: '0',
						},

						// h2-h6 显示 # 符号
						'h2, h3, h4, h5, h6': {
							color: theme('colors.foreground'),
							fontWeight: '400',
							marginTop: '1.666rem',
							marginBottom: '0.36rem',
							display: 'inline-block',
							width: '100%',
							wordBreak: 'break-all',
							position: 'relative',
							paddingLeft: '1.5rem',
							'&::before': {
								content: '"#"',
								position: 'absolute',
								left: '0',
								paddingRight: '0.56rem',
								color: theme('colors.muted.foreground'),
								opacity: '0.3',
								transition: 'all 0.18s ease-in-out',
							},
							'&:hover::before': {
								color: theme('colors.primary.DEFAULT'),
								opacity: '0.9',
							},
						},
						h2: {
							fontSize: '1.5rem',
						},
						h3: {
							fontSize: '1.25rem',
						},
						h4: {
							fontSize: '1.125rem',
						},

						// 段落
						p: {
							fontSize: '0.9375rem',
							lineHeight: '1.6',
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},

						// 列表
						'ul, ol': {
							paddingLeft: '1.25rem',
						},
						li: {
							color: theme('colors.muted.foreground'),
							fontSize: '0.875rem',
							lineHeight: '1.6',
							marginTop: '0.5rem',
							marginBottom: '0.5rem',
						},

						// 引用
						blockquote: {
							margin: '1rem 0 1.618rem',
							padding: '0 0.88rem',
							borderLeftWidth: '0.288rem',
							borderLeftColor: '#49b1f5',
							backgroundColor: 'rgba(73, 177, 245, 0.1)',
							borderRadius: '0.618rem',
							fontStyle: 'normal',
							fontWeight: 'normal',
							quotes: 'none',
							p: {
								fontSize: '0.875rem',
								fontWeight: '500',
								lineHeight: '1.58rem',
								'&::before': {
									content: 'none',
								},
								'&::after': {
									content: 'none',
								},
							},
						},

						// 行内代码
						code: {
							color: theme('colors.foreground'),
							backgroundColor: theme('colors.muted.DEFAULT'),
							padding: '0.125rem 0.375rem',
							fontSize: '0.8125rem',
							borderRadius: '0.25rem',
							fontWeight: '400',
							'&::before': {
								content: '""',
							},
							'&::after': {
								content: '""',
							},
						},

						// 代码块（由 pre 包裹的 code）
						pre: {
							backgroundColor: 'transparent',
							padding: '0',
							margin: '0',
						},
						'pre code': {
							backgroundColor: 'transparent',
							padding: '0',
							fontSize: '0.875rem',
							fontWeight: '400',
							lineHeight: '1.66',
						},

						// 表格
						table: {
							fontSize: '0.9rem',
							width: '100%',
							marginTop: '1rem',
							marginBottom: '1rem',
							borderRadius: '0.38rem',
							overflow: 'hidden',
							border: '1px solid ' + theme('colors.border'),
						},
						thead: {
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						'thead th': {
							backgroundColor: theme('colors.muted.DEFAULT'),
							padding: '0.75rem',
							fontWeight: '500',
							borderRight: '1px solid ' + theme('colors.border'),
							borderBottom: '1px solid ' + theme('colors.border'),
							'&:last-child': {
								borderRight: 'none',
							},
						},
						'tbody td': {
							padding: '0.618rem 0.75rem',
							borderRight: '1px solid ' + theme('colors.border'),
							borderBottom: '1px solid ' + theme('colors.border'),
							verticalAlign: 'top',
							'&:last-child': {
								borderRight: 'none',
							},
						},
						'tbody tr': {
							transition: 'background-color 0.18s ease-in-out',
							'&:hover': {
								backgroundColor: '#f2f2f266',
							},
							'&:last-child td': {
								borderBottom: 'none',
							},
						},

						// 图片
						img: {
							borderRadius: '5px',
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},
						figure: {
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},

						// 水平分割线
						hr: {
							borderColor: theme('colors.border'),
							marginTop: '2rem',
							marginBottom: '2rem',
						},

						// Strong 和 em
						strong: {
							color: theme('colors.foreground'),
							fontWeight: '600',
						},
						em: {
							color: theme('colors.foreground'),
						},
					},
				},

				// 大屏幕字体变大
				xl: {
					css: {
						fontSize: '1.125rem',
						p: {
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},
						img: {
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},
						figure: {
							marginTop: '0.8em',
							marginBottom: '0.8em',
						},
					},
				},

				// 暗黑模式配置
				invert: {
					css: {
						color: theme('colors.foreground'),
						a: {
							color: theme('colors.muted.foreground'),
						},
						'h1, h2, h3, h4, h5, h6': {
							color: theme('colors.foreground'),
						},
						strong: {
							color: theme('colors.foreground'),
						},
						code: {
							color: theme('colors.foreground'),
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						blockquote: {
							borderLeftColor: '#49b1f5',
							backgroundColor: 'rgba(73, 177, 245, 0.1)',
						},
					},
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'class',
};
