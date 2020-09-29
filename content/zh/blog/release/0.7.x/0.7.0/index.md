---
title: "chaosblade 0.7.0 发布公告"
linkTitle: "0.7.0"
date: 2020-09-28
description: "期待已久的 v0.7.0 版本发布啦~，同时发布了 ARM64 的版本。特别增强了 kubernetes 混沌实验场景"
author: 穹谷([@xcaspar](https://github.com/xcaspar))
---

主要新增特性如下：

* 支持 kubernetes 下 Java 全部的演练场景
* 新增文件混沌实验场景
* 新增 ssh 执行通道，可实现远程对目标主机执行混沌实验
* 优化 kubernetes 场景实现，仅需部署一个 chaosblade-operator pod 可实现通用的混沌实验，安装时添加 `--set damonset.enable=false` 即可；针对网络场景中目标 Pod 或容器缺失网络权限或者命令，可使用 `-set damonset.enable=true` 来解决
* kubernetes 场景执行按需部署插件，执行速度得到很大提升

## 新特性/优化

* 新增 Kubernetes 环境下 Java 实验场景
* 新增 Pod 启动失败实验场景
* 新增 `container-index` 参数指定容器执行实验
* 去除 Kubernetes 容器场景对 Docker 容器的强依赖
* 去掉 Kubernetes 场景对 Daemonset 组件的强依赖
* 优化 Kubernetes 实验场景中组件部署模式，按需部署，提高执行效率
* 优化恢复 Kubernetes 实验场景时 Pod 资源找不到导致无法恢复的问题
* 优化非 root 容器实验执行问题
* 新增文件、文件夹增删改实验场景
* 新增 `include-buffer-cache` 参数指定内存实验范围
* 新增 `climb` 参数指定 CPU 负载触达时间
* 支持 Java 场景中 Dubbo 泛化调用
* 支持 OkHttp3 Java 插件
* 支持 RabbitMQ Java 插件
* 使用 Jackson 替换 Fastjson
* 支持 SSH 远程执行主机混沌实验
* 实验模型中新增 programs 字段，表示依赖的程序
* 实验模型中新增 examples 字段，表示实验案例

## Bug 修复

* 修复 Kubernetes 实验无法强制删除问题
* 修复网络场景 `destination-ip` 和 `exclude-port` 共用不生效问题
* 修复内存场景不添加 `--mode` 参数恢复失败问题
* 修复磁盘 IO 负载场景恢复失败问题
* 修复 Java 场景指定返回值执行失败问题

**更多内容见 [github release](https://github.com/chaosblade-io/chaosblade/releases/tag/v0.7.0)**