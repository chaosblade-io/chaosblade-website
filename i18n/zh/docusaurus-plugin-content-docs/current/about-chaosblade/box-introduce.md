---
title: ChaosBlade-Box平台介绍
slug: / 
---
本文档主要介绍ChaosBlade-Box混沌工程平台的模块、功能及演练编排等。

## 架构介绍

![](/img/zh/zh-chaosblade-box.jpg)

通过控制台页面可实现 chaosblade、litmuschaos 等已托管工具自动化部署，按照社区的建立的混沌实验模型统一实验场景，根据主机、Kubernetes、应用来划分目标资源，通过目标管理器来控制，在实验创建页面，可以实现白屏化的目标资源选择。平台通过调用混沌实验执行来执行不同工具的实验场景，配合接入 prometheus 监控，可以观察实验 metric 指标，后续会提供丰富的实验报告。Chaosblade-box 的部署也非常简单，具体可以查看 https://github.com/chaosblade-io/chaosblade-box/releases 。

## 演练概览

ChaosBlade-Box混沌工程平台，支持中英文切换，提供了全局的命名空间切换，帮助企业落地时的一平台多用，如测试环境、灰度环境、线上环境等。

![](/img/zh/zh-box-overview.png)

## 应用管理

展示部署了Agent（探针）的主机或Kubernetes集群上的所有应用，Agent（探针）支持Kubernetes和主机环境安装，当安装在Kubernetes集群时，会主动收集集群中的pod相关数据，并根据label来判定其应用名和应用分组，从而直观且方便的对某个应用进行演练

![](/img/zh/zh-box-application.png)

## 演练场景和经验库
演练场景会展示混沌工程执行工具支持的所有场景，并按不同环境进行区分展示。平台支持将编排后的演练沉淀为经验，并提供演练经验库进行管理，方便其他用户直接进行演练。

![](/img/zh/zh-box-experiment.png)

## 演练编排
平台支持两种流程编排类型，分别是：“顺序执行”和“阶段执行”，其中“顺序执行”就是多种故障依次生效，“阶段执行”就是多种故障同时生效后再同时恢复。

![](/img/zh/zh-box-workflow.png)

## 演练结果&&安全防控
在演练结果页面中能查看到演练的整体进度，并能进行单个机器的结果、错误信息、执行日志和参数配置等查询。为保障演练一定能得到恢复，提供了自动停止和手动触发两种方式来终止演练的保护策略，下发超时参数，即便平台侧和Agent失联，无法下发恢复命令，也能超时恢复，避免系统问题导致演练之外的意外故障

![](/img/zh/zh-box-result.png)
