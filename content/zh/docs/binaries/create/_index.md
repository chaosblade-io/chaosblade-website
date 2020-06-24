---
title: "create 命令"
linkTitle: "create 命令"
weight: 1
type: docs
description: > 
    子命令 create：创建混沌实验
---
## 介绍

创建混沌实验命令，每个实验对应一个 uid，后续的查询、销毁实验都要用到此 uid，如果遗忘了 uid，可以通过 `blade status --type create` 命令进行查询。
create 可以简写为 c，即 `blade create` 可以简写为 `blade c`。

## 参数

```text
  -h, --help   查看 create 命令帮助
```

## 可使用的父命令参数

```text
  -d, --debug   设置 DEBUG 执行模式
```

## 案例

```text
# 查看 create 命令帮助文档
blade create -h

# 查看如何创建 cpu 混沌实验
blade create cpu -h

# 查看如何创建 cpu 满载实验
blade create cpu fullload -h

# 创建 cpu 满载实验
blade create cpu fullload --cpu-count 1

# 返回结果如下
{"code":200,"success":true,"result":"6fa04946baf42920"}

# code 的值等于 200 说明执行成功，其中 result 的值就是 uid。使用 top 命令验证实验效果
%Cpu0  :100.0 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st

# 销毁上述实验
blade destroy 6fa04946baf42920

# 返回结果如下
{"code":200,"success":true,"result":"command: cpu fullload --cpu-count 2 --debug false --help false"}

# 返回值会打印此次实验的命令。再次使用 top 命令验证实验效果
%Cpu0  :  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```