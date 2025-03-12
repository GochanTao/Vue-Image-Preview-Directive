export default {
  install(Vue) {
    Vue.directive('preview', {
      bind(el, binding) {
        // 处理配置项
        const defaultConfig = {
          isPinned: false,
          position: 'left', // 可选值：'left'、'center'、'right'
          src: '' // 图片源
        };
        
        // 合并用户配置和默认配置
        const config = {
          ...defaultConfig,
          ...(typeof binding.value === 'object' ? binding.value : { src: binding.value })
        };

        // 添加预览状态变量
        let isPreviewActive = false;
        // 创建预览容器
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container';
        previewContainer.style.cssText = `
          position: fixed;
          z-index: 9999;
          display: none;
          background-color: #fff;
          border: 1px solid #eee;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          padding: 5px;
          transition: opacity 0.3s;
          cursor: move;
        `;

        // 创建预览图片元素
        const previewImage = document.createElement('img');
        previewImage.className = 'image-preview';
        previewImage.style.cssText = `
          max-width: 800px;
          max-height: 600px;
          transform-origin: center center;
          transition: transform 0.1s ease;
        `;

        // 创建固定按钮
        const pinButton = document.createElement('button');
        pinButton.className = 'pin-button';
        pinButton.innerHTML = '📌';
        pinButton.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          z-index: 10000;
        `;

        // 将预览图片和固定按钮添加到预览容器中
        previewContainer.appendChild(previewImage);
        previewContainer.appendChild(pinButton);
        document.body.appendChild(previewContainer);

        // 设置拖动相关变量
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;
        // 添加固定状态变量，使用配置的初始值
        let isPinned = config.isPinned;
        // 如果初始状态是固定的，更新按钮样式
        if (isPinned) {
          pinButton.style.background = 'rgba(0, 123, 255, 0.2)';
          pinButton.style.borderColor = '#0056b3';
        }
        // 添加缩放相关变量
        let scale = 1;
        const minScale = 0.1;
        const maxScale = 5;
        const scaleStep = 0.1;

        // 计算初始位置的函数
        const calculateInitialPosition = (container) => {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;
          const padding = 0;
          
          let left;
          switch (config.position) {
            case 'center':
              left = (viewportWidth - containerWidth) / 2;
              break;
            case 'right':
              left = viewportWidth - containerWidth - padding;
              break;
            case 'left':
            default:
              left = padding;
              break;
          }
          
          const top = (viewportHeight - containerHeight) / 2;
          return { left, top };
        };

        // 添加滚轮缩放事件
        previewContainer.addEventListener('wheel', (e) => {
          e.preventDefault(); // 阻止页面滚动

          // 确定缩放方向
          const delta = e.deltaY || e.detail || e.wheelDelta;

          // 计算新的缩放值
          let newScale = scale;
          if (delta > 0) {
            // 向下滚动，缩小
            newScale = Math.max(minScale, scale - scaleStep);
          } else {
            // 向上滚动，放大
            newScale = Math.min(maxScale, scale + scaleStep);
          }

          // 如果缩放值发生变化
          if (newScale !== scale) {
            scale = newScale;

            // 更新图片缩放
            updateTransform();

            // 添加缩放百分比显示
            const scalePercentage = Math.round(scale * 100);
            const scaleText = document.createElement('div');
            scaleText.style.cssText = `
              position: absolute;
              bottom: 10px;
              right: 10px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              pointer-events: none;
              opacity: 0.8;
            `;
            scaleText.textContent = `${scalePercentage}%`;

            // 移除之前的缩放显示（如果存在）
            const oldScaleText = previewContainer.querySelector('.scale-text');
            if (oldScaleText) {
              previewContainer.removeChild(oldScaleText);
            }

            // 添加新的缩放显示
            scaleText.className = 'scale-text';
            previewContainer.appendChild(scaleText);

            // 2秒后自动移除缩放显示
            setTimeout(() => {
              if (scaleText.parentNode === previewContainer) {
                previewContainer.removeChild(scaleText);
              }
            }, 2000);
          }
        });

        // 更新transform的辅助函数
        const updateTransform = () => {
          previewContainer.style.transform = `scale(${scale})`;
        };

        // 固定按钮点击事件
        pinButton.addEventListener('click', (e) => {
          e.stopPropagation();
          isPinned = !isPinned;
          isPreviewActive = isPinned; // 如果取消固定，也重置预览状态
          pinButton.style.background = isPinned ? 'rgba(0, 123, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)';
          pinButton.style.borderColor = isPinned ? '#0056b3' : '#ddd';
        });

        // 鼠标进入原图时显示预览图
        el.addEventListener('mouseenter', () => {
          // 如果已经有预览图显示，则不触发新的预览
          if (isPreviewActive) return;

          const imgSrc = config.src || el.src;
          if (!imgSrc) return;
        
          previewImage.src = imgSrc;
          previewContainer.style.display = 'block';
          isPreviewActive = true; // 设置预览状态为活动
          
          // 重置缩放
          scale = 1.1;
          updateTransform();
          
          previewImage.onload = () => {
            const position = calculateInitialPosition(previewContainer);
            previewContainer.style.left = `${position.left}px`;
            previewContainer.style.top = `${position.top}px`;
          };
        });

        // 修改后的hidePreview函数，考虑固定状态
        const hidePreview = (e) => {
          if (isPinned) return;
          if (e.relatedTarget === previewContainer ||
            previewContainer.contains(e.relatedTarget)) {
            return;
          }
          previewContainer.style.display = 'none';
          isPreviewActive = false; // 重置预览状态
        };

        el.addEventListener('mouseleave', hidePreview);

        // 修改后的预览容器的鼠标离开事件
        previewContainer.addEventListener('mouseleave', (e) => {
          if (isPinned) return;
          if (e.relatedTarget === el || el.contains(e.relatedTarget)) {
            return;
          }
          previewContainer.style.display = 'none';
          isPreviewActive = false; // 重置预览状态
        });

        // 拖动功能实现
        previewContainer.addEventListener('mousedown', (e) => {
          if (e.target === pinButton) {
            return;
          }

          isDragging = true;

          startX = e.clientX;
          startY = e.clientY;
          initialLeft = parseInt(previewContainer.style.left) || previewContainer.offsetLeft;
          initialTop = parseInt(previewContainer.style.top) || previewContainer.offsetTop;

          e.preventDefault();
        });

        const onMouseMove = (e) => {
          if (!isDragging) return;

          const moveX = e.clientX - startX;
          const moveY = e.clientY - startY;

          previewContainer.style.left = `${initialLeft + moveX}px`;
          previewContainer.style.top = `${initialTop + moveY}px`;
        };

        const onMouseUp = () => {
          isDragging = false;
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // 存储清理函数
        const cleanupEvents = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        // 存储元素和事件清理函数
        el._preview_container = previewContainer;
        el._cleanup_events = cleanupEvents;
      },

      unbind(el) {
        if (el._cleanup_events) {
          el._cleanup_events();
        }

        if (el._preview_container) {
          document.body.removeChild(el._preview_container);
          delete el._preview_container;
        }
      }
    });
  }
};
