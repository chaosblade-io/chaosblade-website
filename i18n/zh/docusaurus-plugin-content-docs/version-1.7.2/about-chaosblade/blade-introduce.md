---
title: ChaosBlade工具介绍
---

本文档主要介绍 ChaosBlade 混沌工程演练执行工具的架构特性、模块分层及执行方式。

## 工具架构

![](/img/zh/zh-architecture.jpg)

设计 chaosblade 初期就考虑了易用性和场景扩展的便捷性，方便大家上手使用以及根据各自需要扩展更多的实验场景，遵循混沌实验模型提供了统一的操作简洁的执行工具，并且根据领域划分将场景实现封装成一个一个单独的项目，方便实现领域内场景扩展。

## 模块分层

![](/img/zh/zh-blade-models.png)

chaosblade 依据领域实现封装成各自独立的项目，每个项目根据各领域的最佳实践来实现，不仅能满足各领域使用习惯，而且还可以通过混沌实验模型来建立与 chaosblade cli 项目的关系，方便使用 chaosblade 来统一调用，各领域下的实验场景依据混沌实验模型生成 yaml 文件描述，暴露给上层混沌实验平台，混沌实验平台根据实验场景描述文件的变更，自动感知实验场景的变化，无需新增场景时再做平台开发，使混沌平台更加专注于混沌工程其他部分。

## 执行方式

演练执行支持以下几种方式，不同执行方式具体的使用手册可参考 [k8s 容器内 cpu 满载](../experiment-types/k8s/container/blade_create_k8s_container-cpu.md)：

- Cli 命令行模式：直接通过 cli 命令方式执行演练，可直接执行主机环境和 Kubernetes 环境上的演练
- Yaml 文件模式：该方式只对 Kubernetes 集群进行演练时使用，使用 yaml 配置文件创建演练 通过定义 chaosblade crd 资源的方式
- Server 模式：即利用`./blade server start` 将 ChaosBlade 工具作为一个 server 启动，然后再通过 http 远程调用的方式下发命令
- 平台模式：直接在 ChaosBlade-Box 可视化平台上，直接通过交互界面创建演练
