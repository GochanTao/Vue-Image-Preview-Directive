# Vue Image Preview Directive

一个简单但功能强大的 Vue 图片预览指令，提供图片悬浮预览、拖拽、缩放和固定等功能。

## 特性

- 🖼️ 图片悬浮预览
- 🖱️ 拖拽支持
- 🔍 滚轮缩放（0.1x - 5x）
- 📌 预览窗口固定
- 📐 可配置预览窗口位置
- 🎯 支持自定义图片源
- 💫 平滑过渡动画

## 安装

```bash
npm install vue-image-preview-directive
# 或
yarn add vue-image-preview-directive
```

## 注册

```javascript
import Vue from 'vue'
import ImagePreview from 'vue-image-preview-directive'

Vue.use(ImagePreview)
```

## 基础用法

最简单的使用方式是直接在 img 标签上添加 v-preview 指令：

```html
<img v-preview src="path/to/your/image.jpg" />
```

## 高级配置

你可以通过传入配置对象来自定义预览行为：

```html
<img 
  v-preview="{
    isPinned: false,
    position: 'left',
    src: 'path/to/custom/preview/image.jpg'
  }" 
  src="path/to/your/image.jpg" 
/>
```

### 配置选项

| 参数 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| isPinned | Boolean | false | true/false | 是否默认固定预览窗口 |
| position | String | 'left' | 'left'/'center'/'right' | 预览窗口的显示位置 |
| src | String | - | - | 自定义预览图片地址。若不设置则使用原图片的 src |

## 功能说明

### 1. 预览窗口

- 当鼠标悬浮在图片上时，会显示预览窗口
- 预览窗口默认大小最大为 800px × 600px
- 预览窗口会自动根据配置的 position 进行定位

### 2. 拖拽功能

- 点击预览窗口任意位置（除固定按钮外）并拖动可移动预览窗口
- 拖拽时窗口位置会实时更新

### 3. 缩放功能

- 使用鼠标滚轮可以对预览图片进行缩放
- 缩放范围：0.1x - 5x
- 缩放时会临时显示当前缩放比例

### 4. 固定功能

- 点击预览窗口右上角的 📌 按钮可以固定预览窗口
- 固定后，移开鼠标预览窗口不会消失
- 再次点击 📌 按钮可以取消固定

## 示例

### 基础预览

```html
<img v-preview src="/path/to/image.jpg" />
```

### 自定义预览图片

```html
<img 
  v-preview="{ src: '/path/to/high-resolution-image.jpg' }" 
  src="/path/to/thumbnail.jpg" 
/>
```

### 默认固定在中间位置

```html
<img 
  v-preview="{ 
    isPinned: true,
    position: 'center'
  }" 
  src="/path/to/image.jpg" 
/>
```

## 注意事项

1. 确保图片资源可以正常访问
2. 预览窗口使用 fixed 定位，z-index 为 9999
3. 如果页面有其他固定定位元素，注意 z-index 的层级关系

## 浏览器兼容性

- 支持所有现代浏览器
- 需要 CSS transform 和 transition 支持

## License

MIT
