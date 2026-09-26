# 芭比·星光海屿梦想豪宅 — GitHub Pages 部署包

版本：第12版静态导出。保留原豪宅、星光海屿、七种生活玩法、模型下载和本机存档逻辑。

## 部署（不用安装 Node.js，也不用 npm build）

1. 解压 ZIP。将解压后的全部文件与文件夹上传到 GitHub 仓库根目录：`index.html` 必须在仓库第一层，和 `assets`、`vendor` 同级。不要只上传 ZIP，也不要把外层文件夹再套一层上传。
2. 同时上传 `.nojekyll`；有些系统会隐藏它。包内 `_config.yml` 也提供了 `vendor` 目录的兼容配置。
3. 进入仓库 **Settings → Pages**，在 **Build and deployment** 中选择 **Deploy from a branch**。
4. Branch 选保存这些文件的分支（通常是 `main`），Folder 选 **/(root)**，点击 **Save**。
5. 等部署成功后，打开 Pages 页面显示的网址。普通项目通常是 `https://你的用户名.github.io/仓库名/`；仓库名为 `你的用户名.github.io` 时则使用根网址。

资源采用相对路径，支持任意仓库名和项目子目录，不需要修改域名或路径。

GitHub 官方说明：
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 文件说明

- `index.html`：游戏首页。
- 根目录的 `.js`、`.css`：完整游戏逻辑与样式，需全部保留。
- `vendor/`：本地 Three.js 及控制器，无需外部 CDN。
- `assets/`：参考索引、模型信息和21个模型分片，需全部保留。
- `.nojekyll`：关闭 Jekyll 处理，直接发布静态文件。
- `_config.yml`：遗漏 `.nojekyll` 时保留 vendor 的备用配置。

模型分片仅在点击下载3D模型时读取；场景由网页脚本生成。GLB仍是原静态豪宅，不包含后续游戏进度或动态玩法。

## 本地预览

不要直接双击 `index.html`，浏览器会限制 file:// 下的模块与资源读取。

如果电脑已安装 Python，在本文件所在目录运行：

```sh
python -m http.server 8000
```

然后打开 `http://localhost:8000/`。可按 Ctrl+C 停止服务。

## 存档说明

进度、衣橱、金币、宠物与车辆保存在当前浏览器的 localStorage 中。更换域名后不会自动带过去：原 ChatGPT 网站的旧存档仍留在原网址，GitHub Pages 初次访问会使用该域名自己的存档。本包不包含浏览器中的私人存档，也没有云同步功能。清除站点数据或使用无痕模式可能导致进度丢失。

## 如果出现404或白屏

- 404：确认 Pages 已成功部署、发布目录是 /(root)、index.html 在仓库根目录，使用 Pages 显示的准确网址。
- 依赖文件404：确认 vendor、assets 和所有 JS/CSS 都已上传，且 .nojekyll 或 _config.yml 存在。
- 使用支持 WebGL 2 与 import maps 的现代浏览器；大型3D场景需要足够的设备性能。

## 本次导出验证范围

对静态文件做了完整性、JavaScript语法、模块/资源引用及根目录/项目子目录 HTTP 读取验证；模型21个分片总字节数与模型信息一致。游戏代码与第12版原文件保持一致。本次没有重新逐项试玩或进行浏览器画面验收。
