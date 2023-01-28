---
title: blade version
---

本文档主要介绍`blade version`命令使用
## Usage
打印 blade 工具版本信息。 version 可以简写为 v，即 `blade version` 可以简写为 `blade v`。
```
Usage:
  blade version

Aliases:
  version, v
  
blade version
```
## Exec
进入解压包本地所放置的路径，可通过`blade status -h`查看支持命令和参数。
```
  -h, --help        查看 create 命令帮助

# 可使用的父命令参数
  -d, --debug   设置 DEBUG 执行模式
```
## Examples
```
# 查看 blade 工具版本信息
[root@test chaosblade]# blade version

version: 1.7.0 # 版本
env: #1 SMP Tue May 26 11:42:35 UTC 2020 x86_64  # 环境信息
build-time: Thu Oct 20 02:18:52 UTC 2022 # 构建时间
```
