import { inRouter, outRouter } from "@/utils/updateRouter";
// Banner 打字效果
import TypeWriteInit from "@/scripts/TypeWrite";
// 泡泡🫧效果
import PaoPaoInit from "@/scripts/PaoPao";
// 初始化文章代码块
import codeInit from "@/scripts/Code";
// 初始化视频播放器
import videoInit from "@/scripts/Video";
// 初始化 LivePhoto
import livePhotoInit from '@/scripts/LivePhoto'
// 初始化BackTop组件
import BackTopInitFn from "@/scripts/BackTop";
// 搜索
import { searchFn, vhSearchInit } from "@/scripts/Search";
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";
// 图片灯箱
import ViewImage from "@/scripts/ViewImage";
// 底部网站运行时间
import initWebSiteTime from "@/scripts/Footer";
// 友情链接初始化
import initLinks from "@/scripts/Links";
// 朋友圈 RSS 初始化
import initFriends from "@/scripts/Friends";
// 动态说说初始化
import initTalking from "@/scripts/Talking";
// 移动端侧边栏初始化
import initMobileSidebar from "@/scripts/MobileSidebar";
// Google 广告
import GoogleAdInit from "@/scripts/GoogleAd";
// Han Analytics 统计
import HanAnalyticsInit from "@/scripts/HanAnalytics";
//  谷歌 SEO 推送
import SeoPushInit from "@/scripts/SeoPush";
// SmoothScroll 滚动优化
import SmoothScroll from "@/scripts/Smoothscroll";

// ============================================================

// 页面初始化 Only
const videoList: any[] = [];

const indexInit = async (isReady: boolean = true) => {
  // 如果不需要初始化则直接返回
  if (!isReady) return;
  try {
    // 泡泡效果 - 保留
    PaoPaoInit();
    // 代码块处理
    codeInit();
    // 初始化视频播放器
    videoInit(videoList);
    // 初始化 LivePhoto
    livePhotoInit();
    // 初始化搜索
    vhSearchInit();
    // 图片懒加载
    vhLzImgInit();
    // 图片灯箱
    ViewImage();
    // BackTop
    BackTopInitFn();
    // 网站时间
    initWebSiteTime();
    // 搜索快捷键
    searchFn("");
    // 友情链接页初始化
    initLinks();
    // 朋友圈 RSS 页初始化
    initFriends();
    // 动态说说页初始化
    initTalking();
    // 移动端侧边栏
    initMobileSidebar();
    // Google 广告
    GoogleAdInit();
    // Han Analytics 统计
    HanAnalyticsInit();
    // SEO 推送
    SeoPushInit();
    // SmoothScroll
    SmoothScroll();
    // Banner 打字效果
    TypeWriteInit();
  } catch (error) {
    console.error("初始化过程中发生错误:", error);
  }
}

export default () => {
  // 首次初始化
  indexInit();
  // 进入页面时触发
  inRouter(() => indexInit(false));
  // 离开当前页面时触发
  outRouter(() => {
    // 销毁播放器
    videoList.forEach((i: any) => i.destroy());
    videoList.length = 0;
  });
  console.log("%c🌻 程序：Astro | 主题：vhAstro-Theme | 作者：Han | Github：https://github.com/uxiaohan/vhAstro-Theme 🌻", "color:#fff; background: linear-gradient(270deg, #18d7d3, #68b7dd, #8695e6, #986fee); padding: 8px 15px; border-radius: 8px");
  console.log("%c\u521D\u59CB\u5316\u5B8C\u6BD5.", "color: #ffffff; background: #000; padding:5px");
}