import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
// 设置中文语言环境
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn');
// 获取文章的描述
const getDescription = (post: any, num: number = 150) => (post.rendered ? post.rendered.html.replace(/<[^>]+>/g, "").replace(/\s+/g, "") : post.body.replace(/\n/g, "").replace(/#/g, "")).slice(0, num) || '暂无简介'
//处理时间
const fmtTime = (time: any, fmt: string = 'MMMM D, YYYY') => dayjs(time).utc().format(fmt)
// 处理日期 - 只显示总天数
const fmtDate = (time: string | Date, hours_status = true) => {
  const now = dayjs();
  const past = dayjs(time);
  // 计算总天数差
  const totalDays = now.diff(past, 'day');
  return `${totalDays}天`;
};

// 处理页码展示
const fmtPage = (page: string | undefined) => page ? page.replace(/\//g, '') : null
// 加载外部脚本
const LoadScript = (
  src: string,
  attrs?: Array<{ k: string; v: string | boolean }>
): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    // 添加自定义属性
    if (attrs?.length) {
      attrs.forEach(({ k, v }) => {
        // 处理不同值类型
        const value = typeof v === "boolean"
          ? (v ? "" : null)  // 布尔值处理为 HTML 标准属性格式
          : String(v);       // 其他类型转为字符串
        if (value !== null) script.setAttribute(k, value);
      });
    }
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};
// 加载外部CSS
const LoadStyle = (href: string): Promise<HTMLLinkElement> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    link.onload = () => resolve(link); // CSS 加载成功
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`)); // CSS 加载失败
    document.head.appendChild(link); // 将 <link> 添加到文档中
  });
}

// 请求封装
const $GET = async (url: string, headers: Record<string, string> = {}): Promise<any> => {
  try {
    const res = await fetch(url, { method: "GET", headers: headers, });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("GET request failed:", error);
  }
};

const $POST = async (url: string, data: Record<string, any>, headers: Record<string, string> = {}): Promise<any> => {
  try {
    const res = await fetch(url, { method: "POST", headers: { ...headers, }, body: JSON.stringify(data), });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json(); // 解析 JSON 数据
  } catch (error) {
    console.error("POST request failed:", error);
  }
};




export { $GET, $POST, getDescription, fmtTime, fmtDate, fmtPage, LoadScript, LoadStyle }