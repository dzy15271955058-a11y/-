# 把小甜屿放到自己的 GitHub

## 1. 解压下载包

解压 `petit-patisserie-github.zip`，打开里面的 `petit-patisserie` 文件夹。你会看到 `dist`、`README.md` 和 `.github` 等内容。上传这些文件，不要只上传 ZIP。

## 2. 创建公开仓库

在自己的 GitHub 账户中点击右上角 **+ → New repository**：

- Repository name：可用 `petit-patisserie`。
- Visibility：选 **Public**，用于公开源码。
- 不要勾选自动添加 README、.gitignore、License，包里已经有了。
- 点击 **Create repository**。

## 3. 上传项目

推荐 GitHub Desktop：

1. 安装并登录 GitHub Desktop。
2. 在仓库网页 **Code → Open with GitHub Desktop** 克隆空仓库。
3. 把下载包中 `petit-patisserie` 文件夹里的所有内容复制进仓库目录，包括隐藏的 `.github` 文件夹。不要再套一层同名目录。
4. 在 Desktop 中填写说明，例如 `First release of Petit Patisserie`。
5. 点击 **Commit to main**，再点击 **Push origin**。
6. 仓库根目录应有 `dist/index.html` 和 `.github/workflows/pages.yml`。

也可以在网页的 **Add file → Upload files** 上传。网页上传容易漏掉隐藏文件夹：必要时选择 **Add file → Create new file**，文件名填写 `.github/workflows/pages.yml`，再粘贴下载包里同名文件的完整内容。

## 4. 打开你的网站

1. 打开仓库的 **Settings → Pages → Build and deployment**。
2. **Source** 选择 **GitHub Actions**。
3. 进入 **Actions → Publish Petit Patisserie → Run workflow**，选择 `main` 运行。
4. 等待发布任务变绿。点任务中的网站链接，或在 Settings → Pages 查看地址。

这个网站是纯静态的，无需安装依赖或申请密钥。发布流程只会把 `dist` 上传为网站。普通项目仓库地址通常类似 `https://你的用户名.github.io/petit-patisserie/`，以 GitHub 实际显示的地址为准。

首次上传时如果 Actions 因尚未启用 Pages 而失败，完成上面的设置后重新运行即可。

## 5. 更新内容

- 改名称、文案、小动作：编辑 `dist/models.js`。
- 改色彩和排版：编辑 `dist/style.css`。
- 改操作行为：编辑 `dist/app.js`。
- 更新甜品小图标：重新渲染模型，或替换 `dist/assets/icons/` 内同名 PNG。

修改后 Commit、Push，GitHub Actions 会自动更新网站。

## 6. 素材说明

网站与源码包中的 11 款缩略图，均由本项目自建甜品模型统一渲染，不包含用户上传的参考照片。原创代码与这些模型图标采用包内 MIT 许可；Three.js 保留其自带许可。以后增加素材时，请继续使用原创或已明确获准使用的素材，不要直接打包灵感参考图。

## 官方参考

- [创建仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub Pages 自定义发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [配置 Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

当前交付没有访问你的 GitHub 账户，也没有代你建立公开仓库。
