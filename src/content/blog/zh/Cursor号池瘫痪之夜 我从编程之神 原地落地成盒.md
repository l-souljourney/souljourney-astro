---
title: Cursor号池瘫痪之夜 我从编程之神 原地落地成盒
date: 2025-11-14 11:10:56
categories: ai-era
tags:
  - Cursor
  - Claude
  - 编程工具
  - AI编程
id: cursor-pool-failure-night-programming-god-fall
description: 分享使用Cursor搭配Claude4.5及MCP工具的编程体验，对比Cursor官方购买与试用号池的使用方式，以及失去Cursor访问后的影响。
cover: https://cloudcos.l-souljourney.cn/blog/images/2025/20251114110224578.png
recommend: true
top: false
hide: false
created: 2025-11-13
---
过去几个月，特别是Claude 4.5出来之后，搭配Cursor的Agent能力，各路MCP助阵下，我也是体验了一把编程之神的心流过程，对各种toB和toC的项目，别管是新项目还是老项目的重构。

不能说是挥斥方遒，那也可以说是一路坦途。

当然，也荣获了**大模型善后工程师**的荣誉称号。

![image.png](https://cloudcos.l-souljourney.cn/blog/images/2025/20251113181629914.png)
### Cursor在手 我就是编程之神
#### Claude Code 和其他工具的使用体验感受
试用过 Claude Code 和Qwen Code，Qwen Code 就不说了，基本上和Trae是一个水平。

最近Trae 国际版出了 Solo模式，也就是强制开启Max，但是不能选大模型。

另外就是最近下架了Claude 4.5，所以这个Max 使用的大概率是Codex 或者其他。

实际感受就是，慢，卡，以及工作效率质量一般般吧。

另外就是使用Claude Code 的两种使用方式，一个是用中转站购买API额度Claude 4.5，消耗非常快。

**大概一次对话RMB 2-4毛钱不等，一上午十几 几十就可以花光。**

另一种就是接入国产的大模型，主流的是GLM 4.6、Minimax M2，也可以接豆包最新的 Doubao Seed Code。

可以说能解决一些基础问题，但是复杂一点，调用各种MCP、Agent，和长上下文处理问题的时候。

就有点一言难尽了，实话说，就是你用我推荐，我用，我不用。
#### Cursor的使用方式和MCP的使用分享
Agent+MCP+Claude 4.5，基本上这三个在手，可以解决90%的日常开发问题。

首先Cursor 2.0版本的效率和质量提升是巨大的。

其次就是对MCP的管理，是非常方便的，你可以通过自然语言进行配置和调试。

**MCP 其实就是让Cursor和大模型，可以用自然语言组成的工作规划。**

**通过MCP这个工具，可以调用Code层面的各种API接口。**

说通俗一点，比如阿里云的云效API接口，大概有150+个，涵盖了Git仓库、Flow流水线、构建部署等等。

如果你让Cursor 对你的项目通过云效上的API访问和查询，那么他需要查询每一个接口，每个字段进行确认，然后访问，然后获取资料，上下文太长还会丢失记忆。

然后如果你安装一个云效的MCP，配置好权限之后。

Cursor就可以通过这个MCP，通过自然语言，自动进行项目的Git排查，配置修改，流水线构建的日志分析，错误反馈，修复建议，和构建推送的状态确认。

这是一条非常自然语言的沟通过程，你可以忽略和不用管有多少API，API都是干嘛的。

**基于Cursor+Agent+MCP的工作方式，是一个自然语言 Vibe Coding的高效使用方式。**

很多文章都会对MCP工具做各种介绍，我只说基于阿里云的MCP 我的使用方式。
#### 阿里云的MCP使用方式参考
阿里云的OpenAPI 可以配置几乎所有阿里云服务的API接口，汇入MCP服务。

![mac_1763088654429.png](https://cloudcos.l-souljourney.cn/blog/images/2025/20251114105057336.png)

我把CDN+OSS进行搭配，Cursor通过这个MCP 可以处理所有前端和静态资源的访问排查配置功能。

然后函数计算FC的MCP，可以让Cursor对后端Docker和函数部署进行排查和配置工作。

阿里云的RDS 数据库的DMS 服务，可以直接创建DMS的MCP服务，可以让Cursor直接操作，增删改查RDS类似MySQL的工作。

加上云效MCP的 Git 仓库配置，Flow 流水线构建，和部署。

当然有条件可以继续加上日志服务的MCP，云监控的MCP等。

**可以实现在Cursor中，整个开发过程，从开发，测试，推送，构建，部署，运维，访问，日志全流程。**

**自然语言就可以全部实现的过程。**

![mac_1763089302691.png](https://cloudcos.l-souljourney.cn/blog/images/2025/20251114110146043.png)


并不是其他平台不行，而是Cursor + Agent + MCP 的效率，质量和速度，非常好，用了自然就知道了。

当然，Claude 4.0 或者4.5 是必备。
### Cursor 号池的使用方式 vs 官方直购
过去几个月使用Cursor进行程序研发和Agent工作的常规套路有两种。

一种就是官方充值购买Pro 或者Ultra的账户，每个月20刀是Pro的账户。

可以使用Claude 4.5的大模型，这个是目前首屈一指的Code 模型，一骑绝尘。

但是这个Pro账户的额度，大概能用40-60刀不等的Tokens。

按照各路Cursor超神的中位数来看，差不多也就3-5天就消耗殆尽。

**也就是说，如果你要购买Pro账户，一个月至少3-4个差不多够用，也就是80刀上下。**

那么你可以买高级的账户，60刀或者200刀的额度。

总的来说，正常使用Cursor提供的Pro服务，大约一个月在50-100刀不等。

也就是RMB 400-800元不等，根据个人使用的强度。

这是常规使用，如果敲代码只会Tab的那种Vibe Coding。

那估计1000往上是必然的。
#### Cursor号池的使用方式
而Cursor号池的使用方式，也就是。

**Cursor提供了Pro Trail 也就是Pro账户的试用权限，可以使用10刀左右的额度。**

那么也就产生了这个产业链。号池销售。

简单说，就是去海鲜市场，购买Pro试用账号，大概1.5-3元一个的样子。

你可以使用大概10刀的额度，平均一天大概会消耗2个账户的额度。

所以，日均使用大概就是3-5元的样子。

算下来，月均大概在80-120元之间，是可以比较放松的进行Claude 4.5的使用。

**以上就是在Cursor+号池+Claude 4.5配合下，我们都是编程之神的由来。**
### 没有了Cursor 直接落地成盒
最近几天其实是没有Cursor + Claude 4.5 使用的，但是使用Auto 应该也是Claude 4.0，用的还是不错的。
![image.png](https://cloudcos.l-souljourney.cn/blog/images/2025/20251114110014849.png)

所以这几天的白嫖过程还是很舒服的。

这里主要是想说，在没有Cursor的时候，尝试了Claude Code，阿里的灵码IDE，Qwen Code，Trae的国内和国际，腾讯的CodeBuddy等各种工具。

Windsurf，和CodexCode 我没用，感觉天天纠结在用什么工具上实在太蛋疼了。

关键还是一个稳定，高效，有质量的工作平台，去解决问题，而不是天天怼天怼地的搞工作平台。

所以，折腾了一个星期的头破血流，最终依然还是老老实实回到Cursor的怀抱。

这样折腾下去，如果号池平台无法恢复，那基本上就要进入20刀一个月的官方订阅服务方式了。

以上就是最近一个星期的Cursor使用感受，和落地成盒的情绪状态。

**最后，由衷的希望，国产的IDE，国产的大模型，能够加油吧。**

![image.png](https://cloudcos.l-souljourney.cn/blog/images/2025/20251114110224578.png)


















<center> L-SoulJourney</center>
<center> 粉黛江山留得平湖烟雨</center>
<center> 王侯霸业都如一局棋枰</center>


