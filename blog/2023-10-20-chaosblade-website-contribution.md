---
title: ChaosBlade项目指南：如何为社区贡献官网文档
authors: Yuaninga
tags: [ chaosblade ]
description: 由Redis故障场景官网文档为例，介绍ChaosBlade官网文档贡献。
hide_table_of_contents: false
---

## 概述

本文以新增2个Redis实验中英文文档为例，帮助刚接触ChaosBlade的社区同学快速入门官网文档贡献。

官网文档贡献快速入门前提：了解Markdown基本语法和yarn依赖管理工具。

#### 官网文档贡献流程图如下：

![flow_01.png](/img/2023-10-20-chaosblade-website-contribution/flow_01.png)



<!--truncate-->
## 第一步：Fork项目&本地拉取代码并创建dev分支

chaosblade-website项目地址：https://github.com/chaosblade-io/chaosblade-website

![branch_01.png](/img/2023-10-20-chaosblade-website-contribution/branch_01.png)



## 第二步：编写官网文档

### 2.1 熟悉chaosblade-website项目结构

![website_structure_01.png](/img/2023-10-20-chaosblade-website-contribution/website_structure_01.png)


### 2.2 编写官网中文和英文文档

#### 中文文档-当前版本：

![chinese_current.png](/img/2023-10-20-chaosblade-website-contribution/chinese_current.png)

#### 中文文档-1.7.2版本：

![chinese_172.png](/img/2023-10-20-chaosblade-website-contribution/chinese_172.png)

#### 英文文档-当前版本：

![english_current.png](/img/2023-10-20-chaosblade-website-contribution/english_current.png)

#### 英文文档-1.7.2版本：

![english_172.png](/img/2023-10-20-chaosblade-website-contribution/english_172.png)


## 第三步：本地启动官网并测试通过

### 3.1 进入chaosblade-website项目根目录，安装项目全部依赖
```shell
yarn 或 yarn install
```

### 3.2 启动中文官网并测试
```shell
yarn run start
```
说明：命令执行完成后，会自动打开中文版官网。

### 3.3 启动英文官网并测试
```shell
yarn run  start --locale en
```
说明：命令执行完成后，会自动打开英文版官网。

## 第四步：使用dev分支创建和提交PR

### 4.1 推送本地dev分支GitHub远程
```shell
# commit
git commit -s  -m "add 2 redis experiments documents"
# push
git push origin dev
```

### 4.2 登录GitHub 使用dev分支创建和提交PR

![github_pr_commit.png](/img/2023-10-20-chaosblade-website-contribution/github_pr_commit.png)


## 第五步：PR审查直至审查通过

![pr_review.png](/img/2023-10-20-chaosblade-website-contribution/pr_review.png)


## 第六步：PR合并至master，新增官网文档贡献成功
### 6.1 PR合并完成

![pr_merged.png](/img/2023-10-20-chaosblade-website-contribution/pr_merged.png)


### 6.2 查看中文版官网文档

![chinese_view.png](/img/2023-10-20-chaosblade-website-contribution/chinese_view.png)

### 6.3 查看英文版官网文档

![english_view.png](/img/2023-10-20-chaosblade-website-contribution/english_view.png)



>
> ChaosBlade 官方网址：[https://chaosblade.io/](https://chaosblade.io/)
>
> ChaosBlade Github : [https://github.com/chaosblade-io/chaosblade](https://github.com/chaosblade-io/chaosblade)
>
> ChaosBlade 钉钉社区交流群:23177705

