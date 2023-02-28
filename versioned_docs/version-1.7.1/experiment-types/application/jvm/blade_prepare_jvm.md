---
title: 挂载 Java Agent
sidebar_position: 1
---

## 介绍

挂载 java agent，执行 java 实验场景必要步骤

## 参数

```
-j, --javaHome string   指定 JAVA_HOME 路径，用于指定 java bin 和 tools.jar，如果不添加此参数，默认会优先获取 JAVA_HOME 环境变量，如果获取失败，会解析指定进程参数获取 JAVA_HOME，获取失败，会使用 chaosblade 自带的 tools.jar
--pid string        java 进程ID
-P, --port int          java agent 暴露服务的本地端口，用于下发实验命令
-p, --process string    java 进程关键词，用于定位 java 进程
-d, --debug   开启 debug 模式
```

## 案例

指定 pid 执行 java agent 挂载

```
blade prepare jvm --pid 26652
# 命令也可简写为
blade p jvm --pid 26652
```

执行成功，会返回实验准备的 UID，例如：

```
{"code":200,"success":true,"result":"2552c05c6066dde5"}
```

2552c05c6066dde5 就是实验准备对象的 UID，执行卸载操作需要用到此 UID，例如

```
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

挂载 java agent 操作是个比较耗时的过程，在未返回结果前请耐心等待

## 实现原理

## 常见问题

Q: {"code":500,"success":false,"error":"cannot get port from local, please execute prepare command first"}  
A: 没有挂载所需的 java agent，执行 prepare jvm 命令挂载

Q: {"code":602,"success":false,"error":"less --process or --pid flags"}  
A: 缺少必要参数用于指定 java 应用进程
