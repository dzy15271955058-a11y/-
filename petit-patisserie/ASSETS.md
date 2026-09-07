# 素材与许可

## 原创模型与统一图标

`dist/assets/icons/` 中的 11 个透明底 PNG，均从本项目 `dist/models.js` 的甜品几何渲染得到。它们使用统一画幅、视角和显示风格，分别对应橱窗中的甜品。渲染过程不读取任何用户参考图片，也没有从参考照片中裁剪或描摹图标。

渲染脚本为 `scripts/render-icons.mjs`，使用现有模型与轻量渲染器，在本地通过可选的 `@napi-rs/canvas` 输出图标。该生成依赖不随网站运行。

页面代码、参数化模型、图标与交互动作由本项目创作，采用根目录 MIT 许可。模型为风格化视觉表达，不是食品实物的精确扫描。

## Three.js

`dist/vendor/three.module.min.js`、`three.core.min.js` 和 `OrbitControls.js` 来自 Three.js 0.180.0，采用 MIT 许可。完整许可在 `dist/vendor/THREE-LICENSE.txt`。

## 参考资料原则

用户提供的参考图仅用于理解造型、色彩和氛围。当前网站与源码包不包含这些照片，详情中的参考照片区域也已移除。未经用户明确说明有相应授权，不把参考图直接用作成品图片、缩略图或源码素材。
