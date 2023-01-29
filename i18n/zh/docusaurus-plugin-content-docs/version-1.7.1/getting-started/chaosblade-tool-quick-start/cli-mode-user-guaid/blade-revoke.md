---
title: blade revoke
---

本文档主要介绍`blade revoke`命令使用
## Usage
卸载 java agent，可以直接通过`prepare uid`对实验进行卸载。`revoke` 可以简写为 `r`，即 `blade revoke` 可以简写为 `blade r`。
```
Undo chaos engineering experiment preparation

Usage:
  blade revoke [PREPARE UID]

Aliases:
  revoke, r

Examples:
blade revoke cc015e9bd9c68406
```
## Exec
进入解压包本地所放置的路径，可通过`blade revoke -h`查看如何销毁演练
```
blade revoke [PREPARE UID]
```
## Examples
```
# 通过 prepare UID 卸载 Java agent
blade revoke 2552c05c6066dde5

# 命令也可简写为
blade r 2552c05c6066dde5
```
如果 UID 忘记，可通过以下命令查询
```
blade status --type prepare --target jvm
# 命令也可简写为：
blade s --type p --target jvm
```

