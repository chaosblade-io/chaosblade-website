---
title: blade destroy
---

本文档主要介绍`blade destroy`命令使用

## Usage

销毁混沌工程演练实验。可以直接通过`uid`对实验进行销毁，也可以通过命令方式对实验进行销毁。结果通过 `blade status --type create` 命令进行查询。 `destroy` 可以简写为 `d`，即 `blade destroy` 可以简写为 `blade d`。

```
Destroy a chaos experiment by experiment uid which you can run status command to query

Usage:
  blade destroy UID
  blade destroy [command]

Aliases:
  destroy, d

Examples:
blade destroy 47cc0744f1bb

blade destroy [command]
```

## Exec

进入解压包本地所放置的路径，可通过`blade destroy -h`查看如何销毁演练

```
blade destroy UID
blade destroy [command]
```

## Examples

```
# 通过 UID 销毁 create 的实验
blade destroy 6fa04946baf42920

# 通过 command 销毁 create 的实验
blade destroy cpu fullload --cpu-count 1

# 返回结果如下
{"code":200,"success":true,"result":"command: cpu fullload --cpu-count 2 --debug false --help false"}
```
