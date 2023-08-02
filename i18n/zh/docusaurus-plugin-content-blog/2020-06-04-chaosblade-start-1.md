---
authors: guoxudong
title: ChaosBlade：从零开始的混沌工程（一）
tags: [ chaosblade ]
hide_table_of_contents: false
---

## 前言

随着微服务的盛行以及容器技术的普及，借助 Kubernetes 的容器编排能力，部署一套分布式系统的难度也越来越低。但随之而来的是越来越复杂的系统，以及越来越难的系统可靠性测试，有时仅仅是一个接口的故障，就可能导致整个系统的雪崩。在雪崩中，找到那个最初故障的接口也十分困难，因为到处都在报错。

为了解决这些问题，除了不断减少服务的耦合，建立强大的监控系统以及设置熔断、限流等策略等方式，这时**混沌工程**就出现了。
<!--truncate-->

## 什么是混沌工程

根据[混沌工程原则（PRINCIPLES OF CHAOS ENGINEERING）](https://principlesofchaos.org)：**混沌工程是在分布式系统上进行实验的学科, 目的是建立对系统抵御生产环境中失控条件的能力以及信心。**

大规模分布式软件系统的发展正在改变软件工程。作为一个行业，我们很快就采用了提高开发灵活性和部署速度的实践。但伴随着这些优点，一个迫切问题出现了，那就是：我们对投入生产的复杂系统有多少信心？

即使分布式系统中的所有单个服务都正常运行, 但这些服务之间的交互也会导致不可预知的结果。这些不可预知的结果, 由影响生产环境的罕见且具有破坏性的事件复合而成，令这些分布式系统存在内在的混沌。

需要在异常行为出现之前，在整个系统内找出这些弱点。这些弱点包括以下形式:

- 当服务不可用时的不正确回滚设置
- 不当的超时设置导致的重试风暴
- 由于下游依赖的流量过载导致的服务中断
- 单点故障时的级联失败等

在这些弱点通过生产环境暴露给用户之前，必须主动的发现这些重要的弱点。并需要一种方法来管理这些系统固有的混沌, 通过增加的灵活性和速率以提升我们对生产环境部署的信心, 尽管系统的复杂性是由这些部署所导致的。

采用基于经验和系统的方法解决了分布式系统在规模增长时引发的问题, 并以此建立对系统抵御这些事件的能力和信心。通过在受控实验中观察分布式系统的行为来了解它的特性，我们称之为**混沌工程**。

## ChaosBlade

![](https://tvax3.sinaimg.cn/large/ad5fbf65gy1gfh7pe8dxnj21d407mgly.jpg)

[ChaosBlade](https://github.com/chaosblade-io/chaosblade) 中文名混沌之刃，是阿里巴巴开源的一款遵循混沌工程原理和混沌实验模型的实验注入工具，是内部项目 MonkeyKing 对外开源的项目，其建立在阿里巴巴近十年故障测试和演练实践基础上，结合了集团各业务的最佳创意和实践。旨在帮助企业提升分布式系统的容错能力，并且在企业上云或往云原生系统迁移过程中业务连续性提供保障。

目前支持的场景有：`基础资源`、`Java 应用`、`C++ 应用`、`Docker 容器`以及 `Kubernetes 平台`。该项目将场景按领域实现封装成单独的项目，不仅可以使领域内场景标准化实现，而且非常方便场景水平和垂直扩展，通过遵循混沌实验模型，实现 chaosblade cli 统一调用。

该项目体验极好，仅需一个可执行文件 `blade`，就可完成多种场景的实验（一些复杂场景如 Java 应用实验，则需要相关工具包），同时如果不想下载 chaosblade 工具包，快速体验 chaosblade，可以拉取 docker 镜像并运行，在容器内体验。

![](https://tva4.sinaimg.cn/large/ad5fbf65gy1gfh7yajpkkg212i0mqu0y.gif)

<center>快速体验</center>

该项目于 2020 年 5 月 27 日发布了最新了 [v0.6.0](https://github.com/chaosblade-io/chaosblade/releases/tag/v0.6.0) 版本，本系列文章的全部实践也将基于这个版本以及该版本的修复版本 v0.6.x 进行。

## ChaosBlade-Operator

ChaosBlade-Operator 是 ChaosBlade 的 Kubernetes 平台实验场景实现，也是本系列文章主要使用的工具。其将混沌实验通过 Kubernetes 标准的 CRD 方式定义，很方便的使用 Kubernetes 资源操作的方式来创建、更新、删除实验场景，包括使用 kubectl、client-go 等方式执行，而且还可以使用上述的 chaosblade cli 工具执行。

![](https://tvax4.sinaimg.cn/large/ad5fbf65gy1gfh84jo6dgg20p606c1kx.gif)

<center>Pod 网络延迟场景</center>

## 结语

本篇为系列文章开篇，主要介绍混动工程以及混沌工程实验工具 ChaosBlade，后续会从实践的角度带领读者上手实践混沌工程，了解混沌工程的方法及原理。实践出真知，在后续的文章后，我们将从 ChaosBlade-Operator 的安装部署、实验配置、实验观测及实验销毁等方面，详细介绍 ChaosBlade 的功能。同时也会介绍在不同场景下混沌工程是如何帮助开发者发现系统中的问题，并达到逐渐建设高可用的韧性系统的目的。

## 参考

- [混沌工程原则](https://github.com/wizardbyron/principlesofchaos_zh-cn) - Principlesofchaos.org
- [ChaosBlade](https://github.com/chaosblade-io/chaosblade) - Github.com
