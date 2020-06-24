---
title: "指定 java 进程 CPU 满载"
linkTitle: "指定 java 进程 CPU 满载"
weight: 4
type: docs
description: > 
    指定 java 进程 CPU 满载
---
{{% pageinfo color="primary" %}}
命令可以简写为 `blade c jvm cfl`
{{% /pageinfo %}}

## 参数

以下是此场景特有参数，通用参数详见：[blade create jvm](../)

```text
--cpu-count string   绑定的 CPU 核数，即指定几个核满载
```

## 案例

指定全部核满载

```shell
blade c jvm cfl --process tomcat 
                                                                                      
{"code":200,"success":true,"result":"48d70f01e65f68f7"}
```

查看该进程 CPU 使用率：

![-w454](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758727994349/15758809321295.jpg?raw=true)

停止实验：

```shell
blade d 48d70f01e65f68f7
```

指定两个核满载（测试机器是 8 个核）

```shell
blade c jvm cfl --cpu-count 2 --process tomcat
                                                                         
{"code":200,"success":true,"result":"a929157644688b15"}
```

查看进程 CPU 使用率是满核的四分之一：

![-w454](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758727994349/15758810411559.jpg?raw=true)
