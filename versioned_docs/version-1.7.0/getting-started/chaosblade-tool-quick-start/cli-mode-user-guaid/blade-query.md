---
title: blade query
---

本文档主要介绍`blade query`命令使用
## Usage
查询和实验相关指标如磁盘占用、java进程故障命中次数等。 `query` 可以简写为 `q`，即 `blade query` 可以简写为 `blade q`。
```
Query the parameter values required for chaos experiments

Usage:
  blade query TARGET TYPE
  blade query [command]

Aliases:
  query, q

Examples:
query network interface
```
## Exec
进入解压包本地所放置的路径，可通过`blade query -h`查看支持哪些查询
```
Available Commands:
  disk        Query disk information
  jvm         Query hit counts of the specify experiment
  k8s         Query status of the specify experiment by uid
  network     Query network information
```
## Examples
```
# 查看当前机器网络接口
blade query network interface

# 返回结果如下
{"code":200,"success":true,"result":["lo","eth0","cni-podman0","veth00000de"]}
```
