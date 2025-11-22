// 扩展 Window 接口以包含 swup 属性
declare global {
  interface Window {
    swup: { hooks: { on: (event: string, handler: EventHandler) => void } };
  }
}
type EventHandler = (event: Event) => void;

//  进入页面时触发 (适配 Astro View Transitions)
// astro:page-load 在首次加载和后续导航都会触发
const inRouter = (handler: EventHandler) => {
  document.addEventListener("astro:page-load", handler);
};

// 离开当前页面时触发
const outRouter = (handler: EventHandler) => {
  document.addEventListener("astro:before-swap", handler);
};

export { inRouter, outRouter };