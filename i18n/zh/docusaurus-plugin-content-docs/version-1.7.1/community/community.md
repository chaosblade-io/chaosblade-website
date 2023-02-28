---
title: 贡献文档
sidebar_label: Community
sidebar_position: 3
---

## 准备工作

- 账号：您需要先准备一个 GitHub 账号
- 仓库和分支管理
  - fork [chaosblade-website](https://github.com/chaosblade-io/chaosblade-website.git) 的仓库，并作为自己仓库的上游： `git remote add upstream https://github.com/chaosblade-io/chaosblade-website.git`

## 拉取项目

使用 `git` 拉取项目：

```shell
git clone https://github.com/chaosblade-io/chaosblade-website.git
```

## 本地构建

:::info

- Node.js 版本 >= 12.13.0 （可以使用 `node -v` 命令查看）
- Yarn 版本 >= 1.5（可以使用 `yarn --version` 命令查看）
  :::

安装依赖

```shell
cd chaosblade-website
# 命令安装依赖
yarn install
yarn install v1.22.10
warning ../../package.json: No license field
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "@docusaurus/preset-classic > @docusaurus/theme-search-algolia > @docsearch/react@3.0.0-alpha.36" has unmet peer dependency "@types/react@>= 16.8.0 < 18.0.0".
warning "@docusaurus/preset-classic > @docusaurus/theme-search-algolia > @docsearch/react > @algolia/autocomplete-preset-algolia@1.0.0-alpha.44" has unmet peer dependency "@algolia/client-search@^4.5.1".
[4/4] 🔨  Building fresh packages...
✨  Done in 11.02s.
```

## 修改文档

文档文件位于 `\docs` 目录中，并以 Markdown 格式编写。如果目录有修改，还需要在完成文档编写后，修改 `sidebars.js` 文件来更新文档目录路径。

## 本地预览

```shell
yarn start
yarn run v1.22.10
warning ../../package.json: No license field
$ docusaurus start
Starting the development server...
Docusaurus website is running at: http://localhost:3000/

✔ Client
  Compiled successfully in 7.54s

ℹ ｢wds｣: Project is running at http://localhost:3000/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /Users/saybot/own/chaosblade-website
ℹ ｢wds｣: 404s will fallback to /index.html
```

在 [http://localhost:3000/](http://localhost:3000/) 上就可以看到预览效果

## 提交 PR

文档更新完成后，就可以提交 PR 了。
