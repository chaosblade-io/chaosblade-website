---
title: blade
---

chaosblade 工具执行命令

## 介绍

chaosblade 是一款简单易用、功能强大的混沌实验实施工具，欢迎使用与共建

## 案例

```text
# 查看 blade 命令帮助文档
blade -h

# 所有的命令都可以添加 -h 来查看此命令如何使用，如创建混沌实验
blade create -h

# 所有的命令都可以添加 -d 来查看更细的执行信息
blade create cpu fullload -d
```

## 参数

```text
-d, --debug 设置工具为 DEBUG 模式，主要用于调试使用
-h, --help  查看 blade 命令帮助文档
```

## 相关命令

* [blade create](blade create.md)     - 创建一个混沌实验
* blade_destroy.md  - 销毁一个混沌实验
* blade_prepare.md  - 准备混沌实验环境，部分实验执行前必须执行
* blade_revoke.md   - 撤销混沌实验环境，与 prepare 操作对应
* [blade status](blade status.md)   - 查询混沌实验和混沌实验环境状态
* blade_query.md    - 查询部分实验所需的系统参数
* [blade version](blade version.md)  - 打印 blade 工具版本信息
* [blade server](blade server.md)     - server 模式
