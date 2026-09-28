---
title: 'E2E Test: Image Asset Chain (Local Images to COS/CDN)'
date: "2026-09-28 12:30:00"
categories: life
slug: e2e-image-asset-chain
source_id: obs_e2e1c0de
description: 'Image asset chain E2E test (Issue #6): body images and cover become content-addressed COS/CDN URLs at publish time.'
cover: https://cloudcos.l-souljourney.cn/blog/images/35bbd679c88eff2ffcead2173d16d053d56c0c3ecf2b680a924fcf2109b4bed3.png
recommend: false
top: false
hide: false
lang: en
author: 执笔丨忠程
target: mp2
render_profile: default
---

This is the E2E fixture for the image asset chain. When published to Astra, local images in the body must become content-addressed COS/CDN URLs, with no base64 in the payload.

First test image (shared with the Chinese edition):

![](https://cloudcos.l-souljourney.cn/blog/images/a43a45e5de8975e7a2f100c6b49bb10643c4c610ce0c830e530453ea3fb01d63.png)

The cover image is shared with the Chinese edition as well, so it must resolve to a single content-addressed object.
