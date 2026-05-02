---
title: v2.3.2 Astro Bilingual Publishing Integration Demo
date: "2026-05-01 21:34:32"
updated: "2026-05-02 11:46:12"
categories: ai-era
slug: v2-3-2-astro-demo
source_id: obs_4817801d
tags:
    - AI
    - Large Language Model
    - GPT
description: v2.3.2 Astro Bilingual Publishing Integration Demo This is a temporary article for verifying the local end-to-end link of the Obsidian Engine Publish plugin. It will test the complete path from proofreading metadata on the Obsidian side, creating an English mirror draft, publishing via wxengine, pushing to GitHub, triggering Astro build and deployment, to the CDN page being visible.
recommend: false
top: false
hide: false
lang: en
author: 执笔丨忠程
target: mp2
render_profile: default
---

# v2.3.2 Astro Bilingual Publishing Integration Demo

This is a temporary article for verifying the local end-to-end link of the Obsidian Engine Publish plugin. It will test the complete path from proofreading metadata on the Obsidian side, creating an English mirror draft, publishing via wxengine, pushing to GitHub, triggering Astro build and deployment, to the CDN page being visible.

This paragraph contains some explicit classification keywords: AI, Large Language Model, LLM, ChatGPT. The plugin's auto-classification and tagging logic should be able to assign it to `ai-era` or generate relevant tags. If the classification does not hit, the current plugin falls back to `life`, which also needs to be documented in the integration notes.

The goal of this article is not long-term retention, but to confirm that the bilingual publishing pipeline works in a real environment. After the Chinese draft is published successfully, the English mirror draft should reuse the same `source_id`, `slug`, and `categories`, changing only the language, title, description, tags, and body content.

Integration checkpoints include:

- Whether metadata proofreading fills in the necessary frontmatter
- Whether the English mirror draft is generated in the same directory
- Whether the translation task goes through the `queued -> running -> ok/failed` status flow
- Whether Astro bilingual sync publishing returns `zh/en` two routes
- Whether the online site displays both Chinese and English articles after the propagation window
