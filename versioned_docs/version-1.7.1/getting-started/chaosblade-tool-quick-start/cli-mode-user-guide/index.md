---
title: CLI Mode User Guide
---

本文档主要介绍blade支持的基础命令
## 支持命令
进入chaosblade文件夹内，执行`blade -h`或 `blade --help`可例举出所有可执行命令
```shell
PS /opt/chaosblade> ./blade -h
An easy to use and powerful chaos engineering experiment toolkit

Usage:
  blade [command]

Available Commands:
  check       Check the environment for chaosblade
  create      Create a chaos engineering experiment
  destroy     Destroy a chaos experiment
  help        Help about any command
  prepare     Prepare to experiment
  query       Query the parameter values required for chaos experiments
  revoke      Undo chaos engineering experiment preparation
  server      Server mode starts, exposes web services
  status      Query preparation stage or experiment status
  version     Print version info

Flags:
  -d, --debug   Set client to DEBUG mode
  -h, --help    help for blade

Use "blade [command] --help" for more information about a command.
```
| **Command** | **Description**                                                                                                       |
| --- |-----------------------------------------------------------------------------------------------------------------------|
| blade server | 将chaosblade作为[server启动](https://chaosblade.io/docs/getting-started/chaosblade-tool-quick-start/server-mode-user-guaid) |
| blade check | 校验该机器是否满足chaosblade工具运行环境                                                                                             |
| blade prepare | 挂载jvm探针至目标Java进程                                                                                                      |
| blade revoke | 撤回jvm探针挂载                                                                                                             |
| blade create | 创建混沌工程实验                                                                                                              |
| blade destroy | 恢复混沌工程实验                                                                                                              |
| blade query | 查询和实验相关指标如磁盘占用、java进程故障命中次数等                                                                                          |
| blade status | 查询实验执行结果                                                                                                              |
| blade version | chaosblade工具版本                                                                                                        |


