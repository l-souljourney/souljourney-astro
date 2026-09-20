import mediumZoom from 'medium-zoom';

// 图片灯箱选择器
const ViewImgList: string[] = [
  // 文章内图片 - 使用简单选择器，因为 article 中的所有 img 都需要支持放大
  "article img",
];

// 初始化
export default () => {
  const images = document.querySelectorAll(ViewImgList.join(","));

  if (images.length > 0) {
    const zoom = mediumZoom(images, {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.85)',
      scrollOffset: 0,
    });

    // 手动设置 z-index 通过修改容器样式
    // medium-zoom 会创建一个 overlay 和 container，我们需要确保它们在最上层
    const style = document.createElement('style');
    style.textContent = `
      .medium-zoom-overlay,
      .medium-zoom-image--opened {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
  }
}
