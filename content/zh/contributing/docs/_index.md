---
title: "撰写文档"
linkTitle: "撰写文档"
weight: 1
type: docs
description: > 
    帮助撰写文档
---
ChaosBlade 使用 [Hugo](https://gohugo.io) 的 [Docsy](https://www.docsy.dev) 主题，并在其基础上进行了定制。

## 前提条件

- [安装 hugo](https://gohugo.io/getting-started/installing/#fetch-from-github)
- Clone chaosblade docs
  - `git clone https://github.com/chaosblade-io/chaosblade-website.git && cd chaosblade-website/`

## 运行

在本地运行站点：

```bash
hugo serve
```

运行状态：

```shell script
Building sites … WARN 2020/06/22 16:51:44 Page.URL is deprecated and will be removed in a future release. Use .Permalink or .RelPermalink. If what you want is the front matter URL value, use .Params.url

                   | ZH  
-------------------+-----
  Pages            | 63  
  Paginator pages  |  0  
  Non-page files   |  2  
  Static files     | 68  
  Processed images |  6  
  Aliases          |  3  
  Sitemaps         |  1  
  Cleaned          |  0  

Built in 401 ms
Watching for changes in /Users/guoxudong/github/chaosblade-web/chaos-website/{archetypes,assets,content,layouts,static,themes}
Watching for config changes in /Users/guoxudong/github/chaosblade-web/chaos-website/config.toml, /Users/guoxudong/github/chaosblade-web/chaos-website/themes/docsy/config.toml
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at //localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

## 发布

在完成文档更新后，运行 `hugo` 命令即可完成前端页面文件的渲染，渲染后的文件存放在 `docs` 目录中。

```shell script
hugo
```

渲染完成：

```shell script
                   | EN  
-------------------+-----
  Pages            | 99  
  Paginator pages  |  0  
  Non-page files   |  0  
  Static files     | 47  
  Processed images |  0  
  Aliases          |  2  
  Sitemaps         |  1  
  Cleaned          |  0  
```

之后将修改内容放入一个 commit 中，提交 PR 即可（建议一个功能一个 PR），

## 在你的 fork 仓库中发布

为了方便 review，请将修改后的内容在你的 fork 仓库中以 GitHub Pages 的形式发布，以提供预览。

### 为 fork 仓库设置 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 跳转到 **GitHub Pages** 部分
3. 设置源为 master 分支的 **/docs 目录**

### 发布到 GitHub Pages

{{% pageinfo color="info" %}}
为了使 GitHub Page 设置生效，请将更改推送到 fork 仓库的 **master 分支**。
{{% /pageinfo %}}

1. 更改 `/content/zh` 中的内容
2. 在根目录运行 `hugo` 命令
3. 提交更改并将其推送到 fork 仓库的 **master 分支**
4. 几分钟后，应该就可以在 fork 仓库的 GitHub Pages 页面看到文档
    - 例如：[https://sunny0826.github.io/chaosblade/](https://sunny0826.github.io/chaosblade/)
5. 之后请将预览页面地址贴在 PR 的 commented 中
