---
title: 混沌工程之ChaosBlade利刃出鞘
authors: binbin
tags: [ chaosblade ]
description: 本文重点介绍混沌工程开源工具ChaosBlade.
hide_table_of_contents: false
---

> 转自：https://mp.weixin.qq.com/s?__biz=Mzg3MzgxMjc3NA==&amp;mid=2247484031&amp;idx=1&amp;sn=4bfc81c1ee268dc0c8d529a4b5fc9949&amp;chksm=cedb0436f9ac8d202f021e6b3e635e08573ce29d14591c9376f7594a623983ebd87103d915f6&token=1141223089&lang=zh_CN#rd
> 来源：微信公众号(柠檬汁Code)

# 1\. 什么是混沌工程

> _Chaos Engineering is the discipline of experimenting on a system in order to build confidence in the system’s capability to withstand turbulent conditions in production._
>
> _-《混沌工程原理》_[http://principlesofchaos.org/](http://principlesofchaos.org/)

混沌工程是一门在系统上进行实验的学科，目的是建立对系统抵御生产环境中失控条件的能力以及信心。

在2010 年 Netflix 从物理机基础设施迁移到 AWS 过程中，为保证 EC2 实例故障不会对业务造成影响，其团队开发出了杀 EC2 实例的工具，这也是混沌工程的雏形。

**混沌工程的行为**：通常是通过主动制造故障的方式来观察目标服务的稳定性，从而不断的发现服务的潜在性风险

**混沌工程的目标**：根据已发现的稳定性风险，建设优化策略，不断的提高服务的稳定性。

![](/img/2023-08-17-chaosblade-first/first-1.png)

# 2\. 为什么需要混沌工程

随着业务的发展，系统的架构也会随之更新迭代，特别是在分布式系统架构下服务数量变多，调用链路变长，服务间的依赖关系日渐复杂。对于单个服务的故障很难评估出对整个系统的影响，在系统高速迭代的过程中，如何持续性的保证系统的稳定性一直受到很大的挑战。

混沌工程的思想是通过主动的注入故障，提前发现系统中的异常点，当发现异常点后即可对其进行改进，从而不断的增强系统的稳定性。

这里从四个角色来说明混沌工程的重要性：

![](/img/2023-08-17-chaosblade-first/first-2.png)

实施混沌工程可以提早发现生产环境上的问题，提升故障应急处理效率、梳理服务间的强弱依赖关系、验证预案有效性等等，逐渐建设具有韧性的高可用系统。

# 3\. 混沌工程产品

目前收集在CNCF全景视图混沌工程分类下的开源产品:

![](/img/2023-08-17-chaosblade-first/first-3.png)

-   其中[Chaos Mesh](https://chaos-mesh.org/zh/)是由PingCAP团队开源的一款云原生混沌工程平台，Chaos Mesh 起源于 [TiDB](https://github.com/pingcap/tidb) 的核心测试平台

-   另一款[ChaosBlade](https://github.com/chaosblade-io/chaosblade)混沌工程平台本文将重点介绍


# 4\. ChaosBlade-混沌之刃

## 4.1 介绍

![](/img/2023-08-17-chaosblade-first/first-4.png)

[ChaosBlade](https://github.com/chaosblade-io/chaosblade) 中文名混沌之刃，起初是由阿里巴巴开源的一款遵循混沌工程原理和混沌实验模型的实验注入工具，提供了丰富的故障注入场景。

后来在2021年重磅开源混沌工程平台[ChaosBlade Box](https://github.com/chaosblade-io/chaosblade-box)，ChaosBlade-Box是一款面向多集群、多语言、多环境，阿里开源的云原生混沌工程控制台。主要功能有：提供混沌实验用户界面、混沌工程工具部署（ChaosBlade、LitmusChaos...）、支持实验场景管理和多维度实验等

[ChaosBlade](https://github.com/chaosblade-io/chaosblade)是故障注入工具集，基于统一的故障模型，对目标发起攻击，目前支持的实验场景如下：

![](/img/2023-08-17-chaosblade-first/first-5.png)

ChaosBlade按照不同的故障场景按照领域封装成不同的项目，目前包含的项目：

-   [chaosblade](https://github.com/chaosblade-io/chaosblade)：混沌实验管理工具，包含创建实验、销毁实验、查询实验、实验环境准备、实验环境撤销等命令，是混沌实验的执行工具，执行方式包含 CLI 和 HTTP 两种。提供完善的命令、实验场景、场景参数说明，操作简洁清晰。

-   [chaosblade-spec-go](https://github.com/chaosblade-io/chaosblade-spec-go): 混沌实验模型 Golang 语言定义，便于使用 Golang 语言实现的场景都基于此规范便捷实现。

-   [chaosblade-exec-os](https://github.com/chaosblade-io/chaosblade-exec-os): 基础资源实验场景实现。

-   [chaosblade-exec-docker](https://github.com/chaosblade-io/chaosblade-exec-docker): Docker 容器实验场景实现，通过调用 Docker API 标准化实现。

-   [chaosblade-exec-cri](https://github.com/chaosblade-io/chaosblade-exec-cri): 容器实验场景实现，通过调用 CRI 标准化实现。

-   [chaosblade-operator](https://github.com/chaosblade-io/chaosblade-operator): Kubernetes 平台实验场景实现，将混沌实验通过 Kubernetes 标准的 CRD 方式定义，很方便的使用 Kubernetes 资源操作的方式来创建、更新、删除实验场景，包括使用 kubectl、client-go 等方式执行，而且还可以使用上述的 chaosblade cli 工具执行。

-   [chaosblade-exec-jvm](https://github.com/chaosblade-io/chaosblade-exec-jvm): Java 应用实验场景实现，使用 Java Agent 技术动态挂载，无需任何接入，零成本使用，而且支持卸载，完全回收 Agent 创建的各种资源。

-   [chaosblade-exec-cplus](https://github.com/chaosblade-io/chaosblade-exec-cplus): C++ 应用实验场景实现，使用 GDB 技术实现方法、代码行级别的实验场景注入。


## 4.2 使用方式

Chaosblade 是一个二进制的工具包，可以在命令行中直接执行blade命令来创建故障，以CPU故障举例：

``` shell
# 已创建 CPU 满载实验举例
blade create cpu load
​
# 返回结果如下
{"code":200,"success":true,"result":"beeaaf3a7007031d"}
​
# code 的值等于 200 说明执行成功，其中 result 的值就是 uid。使用 top 命令验证实验效果
Tasks: 100 total,   2 running,  98 sleeping,   0 stopped,   0 zombie
%Cpu0  : 21.3 us, 78.7 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu1  : 20.9 us, 79.1 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu2  : 20.5 us, 79.5 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu3  : 20.9 us, 79.1 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```

> 其他故障场景在这里就不一一列举了，想了解更多故障场景使用方法可参考：[https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/](https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/)

## 4.3 小结

ChaosBlade 本质上是一个故障注入的工具集，它提供了故障注入，故障销毁，状态查询等多种能力，也支持多种故障场景例如:基础资源、java、docker、k8s等。

但是缺点也比较明显，它没有可视化的界面，也不能对故障场景进行管理，多个故障注入也没有编排能力，每一次故障注入都需要先到目标机器上安装ChaosBlade等等，这对于真正的落地使用混沌工程来说还是有很多挑战的。

# 5\. ChaosBlade Box

## 5.1 介绍

为了解决上面提到的问题，在2021年重磅开源混沌工程平台[ChaosBlade-Box](https://github.com/chaosblade-io/chaosblade-box)，提供统一的可视化界面，并提供演练场景，经验库，应用管理，探针管理，演练编排等功能。

## 5.2 UI

![](/img/2023-08-17-chaosblade-first/first-6.png)

![](/img/2023-08-17-chaosblade-first/first-7.png)

以下是在ChaosBlade-Box平台上进行一次演练的全过程，支持串行、并行两种流程编排，通过多种安全策略保证演练得到恢复，如手动触发和自动停止，自动停止通过在演练配置的时候设置超时参数来进行配置，这样即便平台和探针（Agent）失联，无法进行手动停止时，也能在超时时间到达的时候，自动恢复故障。

![](/img/2023-08-17-chaosblade-first/first-8.png)

![](/img/2023-08-17-chaosblade-first/first-9.png)

## 5.3 小结

ChaosBlade Box是混沌工程演练平台，主要解决了ChoasBlade工具集的痛点，提供可视化管理故障、编排执行故障的能力，并支持探针管理从此不再需要到每一个节点上安装ChoasBlade，大大提升故障注入的效率以及易用性。

# 6\. ChaosBlade-架构

![](/img/2023-08-17-chaosblade-first/first-10.png)

在ChasoBlade Box开源后，ChaosBlade的整体架构中主要包括以下几个组件：

-   **ChaosBlade-Box Console**：ChaosBlade可视化组件，主要提供一套用户友好的Web界面，用户可以通过该界面进行混沌工程实验的编排与操作管理。

-   **ChaosBlade-Box Server**：核心逻辑组件，主要负责混沌工程实验的管理与编排，探针与应用管理。包括组件，Chaos Engine：演练引擎，包括流程编排、安全管控、演练报告等功能；Chaos Runner：演练执行器，兼容多种执行工具；Chaos Experinece：演练经验库等。

-   **Agent**：核心逻辑组件，部署在用户终端的主机或Kubernetes集群内，主要负责和ChaosBlade-Box Server建联上报心跳并作为命令下发通道。

-   **ChaosBlade**：主要执行工具，能在主机和Kubernetes等不同环境上执行故障注入，能对系统网络设备、文件系统、内核及系统上运行的应用等进行故障干扰。


# 7\. 总结

通过混沌工程可以主动发现系统的中的潜在问题，从而对其进行优化，不断的提升系统的稳定性。ChaosBlade是一款遵循混沌工程理念的开源产品，其中主要包含[ChaosBlade](https://github.com/chaosblade-io/chaosblade) Tool（提供丰富的故障场景注入能力）以及[ChaosBlade Box](https://github.com/chaosblade-io/chaosblade-box)提供可视化的混沌工程实施平台。

# 8\. 作者介绍

张斌斌（Github 账号：[binbin0325](https://github.com/binbin0325)，公众号:[柠檬汁Code](https://binbin0325.github.io/)）Sentinel-Golang Committer 、ChaosBlade Committer 、 Nacos PMC 、Apache Dubbo-Go Committer。目前主要关注于混沌工程、中间件以及云原生方向。