---
title: 【E2E测试】图片资产链：本地图 → COS/CDN
date: "2026-09-28 12:30:00"
categories: life
slug: e2e-image-asset-chain
source_id: obs_e2e1c0de
description: '图片资产链 E2E 测试（Issue #6）：正文图片与封面在发布时转为内容寻址 COS/CDN URL。'
cover: https://cloudcos.l-souljourney.cn/blog/images/35bbd679c88eff2ffcead2173d16d053d56c0c3ecf2b680a924fcf2109b4bed3.png
recommend: false
top: false
hide: false
lang: zh
author: 执笔丨忠程
target: mp2
render_profile: default
---

这是图片资产链的 E2E 测试稿。发布到 Astra 时，正文里的本地图片应当替换为内容寻址的 COS/CDN URL，且不再包含 base64。

第一张测试图（正文独有）：

![](https://cloudcos.l-souljourney.cn/blog/images/a43a45e5de8975e7a2f100c6b49bb10643c4c610ce0c830e530453ea3fb01d63.png)

第二张测试图（与封面同图，用于验证去重：正文与封面共享同一对象）：

![](https://cloudcos.l-souljourney.cn/blog/images/35bbd679c88eff2ffcead2173d16d053d56c0c3ecf2b680a924fcf2109b4bed3.png)

如果流程正确，GitHub 内容文件里应当是 `https://cloudcos.l-souljourney.cn/blog/images/<sha256>.png` 形式的 URL。
