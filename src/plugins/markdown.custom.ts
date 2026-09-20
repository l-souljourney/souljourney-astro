// 正文的渲染合同：Markdown 里的链接与图片需要带上页面既有的行为属性。
import type { HastPluginDefinition } from "satteri";

export const addClassNames: HastPluginDefinition = {
	name: "souljourney-article-media",
	element: [
		{
			// 正文中的链接：站内与站外一视同仁（沿用旧管线行为），
			// 新窗口打开、加 rel，文字外面再套一层 span。
			// 属性随替换一次性写入 —— 先 setProperty 再 replaceNode 会让补丁落空。
			filter: ["a"],
			visit(node, ctx) {
				ctx.replaceNode(node, {
					...node,
					properties: {
						...node.properties,
						target: "_blank",
						// hast 把 rel 当列表属性：数组形式序列化后就是 "noopener nofollow"。
						rel: ["noopener", "nofollow"],
					},
					children: [
						{
							type: "element",
							tagName: "span",
							properties: {},
							children: node.children,
						},
					],
				});
			},
		},
		{
			// 正文中的图片：交给 scripts/vhLazyImg.ts 做懒加载 ——
			// 原图地址挪到 data-vh-lz-src，src 先指向占位图。
			filter: ["img"],
			visit(node, ctx) {
				const originalSrc = node.properties?.src;
				ctx.setProperty(node, "class", "vh-article-img");
				if (typeof originalSrc === "string" && originalSrc.length > 0) {
					ctx.setProperty(node, "data-vh-lz-src", originalSrc);
					ctx.setProperty(node, "src", "/assets/images/lazy-loading.webp");
				}
			},
		},
	],
};
