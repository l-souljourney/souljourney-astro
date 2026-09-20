import test from "node:test";
import assert from "node:assert/strict";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";

import { addClassNames } from "../src/plugins/markdown.custom";

// 正文渲染合同：不跑整站构建，直接用 Astro 的 Sätteri 封装渲染一段 Markdown。
// 这里固定的是「Markdown 编译出来的正文长什么样」，覆盖两件容易静默坏掉的事：
// 一是 src/plugins/markdown.custom.ts 里自研的链接/图片 transform，
// 二是 processor 自身的 heading id 与标点行为。
const render = async (markdown: string): Promise<string> => {
	const processor = await createSatteriMarkdownProcessor({ hastPlugins: [addClassNames] });
	const { code } = await processor.render(markdown);
	return code;
};

const firstTag = (html: string, tagName: string) => html.match(new RegExp(`<${tagName}\\s[^>]*>`))?.[0] ?? "";

test("article links open in a new tab, carry rel, and wrap their text in a span", async () => {
	const html = await render("[外链](https://example.com/a?b=1)");
	const anchor = firstTag(html, "a");
	assert.match(anchor, /href="?https:\/\/example\.com\/a\?b=1"?/, "href 必须保持原样");
	assert.match(anchor, /target="?_blank"?/, "正文链接需要新窗口打开");
	assert.match(anchor, /rel="noopener nofollow"/, "新窗口链接需要 rel 保护");
	// 旧管线把 span 放在 a 内部包住文字，这里固定同一结构，避免升级时悄悄改变 DOM 形状。
	assert.match(html, /<a\s[^>]*><span>外链<\/span><\/a>/);
});

test("internal links get the same treatment as external ones", async () => {
	const html = await render("[关于](/about)");
	const anchor = firstTag(html, "a");
	assert.match(anchor, /href="?\/about"?/);
	assert.match(anchor, /target="?_blank"?/);
	assert.match(anchor, /rel="noopener nofollow"/);
	assert.match(html, /<span>关于<\/span>/);
});

test("article images are rewritten for lazy loading", async () => {
	const html = await render('![配图](/assets/images/example.png "标题")');
	const img = firstTag(html, "img");
	assert.match(img, /class="?vh-article-img"?/, "懒加载脚本按这个 class 找图");
	assert.match(img, /src="?\/assets\/images\/lazy-loading\.webp"?/, "src 先指向占位图");
	assert.match(img, /data-vh-lz-src="?\/assets\/images\/example\.png"?/, "原图地址挪到 data 属性");
	assert.match(img, /alt="?配图"?/, "alt 不能被改写");
});

test("heading ids stay stable for Chinese, duplicate and punctuated headings", async () => {
	const html = await render(
		[
			"## 一、 核心产品力定义：从“数据库”到“真理炼油厂”",
			"## 二、 当前实施路径（Now）：构建“可信 RAG”数据管道",
			"## 重复标题",
			"## 重复标题",
			"## 📱 我的公众号",
			"## Core: Product! Capability?",
		].join("\n\n"),
	);
	assert.match(html, /<h2 id="一-核心产品力定义从数据库到真理炼油厂">/, "中文标题与全角标点");
	assert.match(html, /<h2 id="二-当前实施路径now构建可信-rag数据管道">/, "括号内英文小写化");
	assert.match(html, /<h2 id="重复标题">/, "重复标题的第一个保持原名");
	assert.match(html, /<h2 id="重复标题-1">/, "重复标题追加序号");
	assert.match(html, /<h2 id="-我的公众号">/, "emoji 被去掉，前导分隔符保留");
	assert.match(html, /<h2 id="core-product-capability">/, "英文标点被去掉");
});

test("smart punctuation keeps its documented behaviour", async () => {
	const html = await render('直引号 "内容" 与 \'单引号\'，三个点 ... 结束。');
	assert.match(html, /“内容”/);
	assert.match(html, /‘单引号’/);
	assert.match(html, /…/);
});

// Sätteri 把 -- 转成 en dash（–），旧的 unified 管线转 em dash（—）。
// 这是两代 processor 的默认差异，不是回归：现有正文里没有 -- 所以线上没有变化，
// 固定在这里是为了将来真的写了 -- 时能立刻看出行为来自哪一代。
test("dash conversion pins Satteri's en dash default", async () => {
	const html = await render("连续连字符 -- 的转换");
	assert.match(html, /–/, "Sätteri 默认把 -- 转成 en dash");
	assert.doesNotMatch(html, /—/, "不应再出现旧管线的 em dash");
});
