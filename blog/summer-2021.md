---
title: 暑期2021
author: 叶飞
author_title: Co-creator of ChaosBlade
author_url: https://github.com/tiny-x
author_image_url: https://avatars.githubusercontent.com/u/29175949?v=4
tags: [ chaosblade ]
description: Alibaba Summer of Code 2021-ChaosBlade
hide_table_of_contents: false
---

欢迎来到开源世界！如果你还没有计划如何度过这个夏天，那就和我们一起来阿里巴巴的代码之夏吧！💻
“阿里巴巴代码之夏”是一个全球项目，专注于让学生直接参与开源软件开发。学生可以利用暑期时间参与开源项目，并与项目的核心成员一起工作。

## 目录

- [ChaosBlade 简介](#ChaosBlade)
- [任务背景](#任务背景)
- [任务清单](#任务清单)
- [相关文章&交流群](#相关文章交流群)
- [加入我们](#加入我们)

## ChaosBlade

ChaosBlade 中文名混沌之刃，是一款混沌实验实施工具，支持丰富的实验场景，比如应用、容器、基础资源等。工具使用简单，扩展方便，其遵循社区提出的混沌实验模型。Github 地址：https://github.com/chaosblade-io/chaosblade

## 功能和特点
**场景丰富度高**
ChaosBlade 支持的混沌实验场景不仅覆盖基础资源，如 CPU 满载、磁盘 IO 高、网络延迟等，还包括运行在 JVM 上的应用实验场景，如 Dubbo 调用超时和调用异常、指定方法延迟或抛异常以及返回特定值等，同时涉及容器相关的实验，如杀容器、杀 Pod。后续会持续的增加实验场景。

**使用简洁，易于理解**
ChaosBlade 通过 CLI 方式执行，具有友好的命令提示功能，可以简单快速的上手使用。命令的书写遵循阿里巴巴集团内多年故障测试和演练实践抽象出的故障注入模型，层次清晰，易于阅读和理解，降低了混沌工程实施的门槛。

**动态加载，无侵入**
ChaosBlade 采用动态故障注入的方式，执行混沌实验时用户系统不需要做任何系统改造或发布，开箱即用。

**场景扩展方便**
所有的 ChaosBlade 实验执行器同样遵循上述提到的故障注入模型，使实验场景模型统一，便于开发和维护。模型本身通俗易懂，学习成本低，可以依据模型方便快捷的扩展更多的混沌实验场景。

## 任务背景
**将 ChaosBlade 事件导出到 SkyWalking & Prometheus**

通常，系统在运行过程中会发生很多事件，如进程异常、重启、混沌实验等。事件的发生可能会影响系统的稳定性。因此，我们需要输出混沌实验的事件，然后我们可以将事件导入到 SkyWalking 和 Prometheus ，用于后续系统分析统计等场景的使用。

**chasoblade-box 支持演练工具 chaos-mesh**

chasoblade-box 是一个场景丰富的混沌工程平台，chasoblade-box 的出生就包含了工具市场和拓展演练工具的能力，目前包含演练工具 chaosblade 和 litmuschaos，本次任务我们需要拓展对 chaos-mesh 演练工具的支持。

## 任务清单

本次“暑期2021”总共有两个任务，分别是：
- 任务一：将 ChaosBlade 事件导出到 SkyWalking & Prometheus
- 任务二：chasoblade-box 支持演练工具 chaos-mesh

在上一节已经介绍了任务的背景，下面小节中我们将以“任务一”和“任务二”来区分任务。

### 任务一
本次任务主要在 chaosblade 和  chaosblade-operator 项目编码即可，Github 地址:

- chaosblade: https://github.com/chaosblade-io/chaosblade
- chaosblade-operator: https://github.com/chaosblade-io/chaosblade-operator

#### 要求的技能

- golang

#### 参考资料
- [chaosblade 新手指南](https://github.com/chaosblade-io/chaosblade/wiki/%E6%96%B0%E6%89%8B%E6%8C%87%E5%8D%97 )
- [chaosblade-operator 实现方案](https://github.com/chaosblade-io/chaosblade/blob/master/CLOUDNATIVE.md)
- [skywalking 事件相关](https://github.com/chaosblade-io/chaosblade/issues/495)
- [prometheus 自定义exporter](https://prometheus.io/docs/instrumenting/writing_exporters/)

#### 任务内容
- 在 chaosblade cli 执行器上下文埋点，将演练创建、演练恢复、Java Agent 挂载等事件导出到 SkyWalking
- 在 chaosblade cli 执行器上下文埋点，将演练创建、演练恢复、Java Agent 挂载等事件导出到 Prometheus
- 在 chaosblade-operator 对 crd 监听器埋点，将 crd 状态的变更事件导出到 SkyWalking 和 Prometheus

#### 实现步骤
- 在 chaosblade exec 包下面分别包含很多执行器有 os、jvm、docker 等，需要对执行器的添加事件监听，来演练执行、演练恢复等事件
- 在 chaosblade-operato 项目下监听了 blade 自定义资源状态的变更，需要将 blade 状态的变更事件导出。

#### 工作量

|  任务   | 工作量  |
|  ----  | ----  |
| 了解混沌工程和 ChaosBlade，能够使用 ChaosBlade 对主机和 K8S 注入故障 | 5 |
| 可以尝试搭建 minikube ，安装 chaosblade-operator，了解 Operator 实现 | 3 |
| 了解 SkyWalking 和 Prometheus | 5 |
| 熟悉 Prometheus 的 exporter  | 5 |
| 了解 SkyWalking 的事件导入方式，可自行选择一种方案，参考 [ISSUE](https://github.com/chaosblade-io/chaosblade/issues/495)  | 5 |
| 熟悉 chaosblade 执行器的模型定义 | 3 |
| 在 chaosblade cli 执行器上下文埋点，将演练创建、演练恢复、Java Agent 挂载等事件导出到 SkyWalking | 5 |
| 在 chaosblade cli 执行器上下文埋点，将演练创建、演练恢复、Java Agent 挂载等事件导出到 Prometheus | 5 |
| 在 chaosblade operator 对 crd 监听器埋点，将 crd 状态的变更事件导出到 SkyWalking 和 Prometheus  | 5 |
| 单元测试 | 3 |
| 集成测试 | 5 |
| PR 交付 | 2 |

#### 参考资料
- [SkyWalking 事件](https://github.com/chaosblade-io/chaosblade/issues/495)
- [Prometheus 自定义 exporter ](https://prometheus.io/docs/instrumenting/writing_exporters/)

### 任务二
本次任务主要在 chaosblade-box 编码即可，Github 地址：https://github.com/chaosblade-io/chaosblade-box ，可以 litmuschaos 是如何接入到 chaosblade-box 的。

#### 要求的技能

- java

#### 参考资料
- [chaosblade-box 用户手册](https://www.yuque.com/docs/share/bc9ad412-6f96-463b-b72d-6773b5fb5ea3?# )
- [chaosblade-box 开发手册](https://www.yuque.com/docs/share/fa43fd1e-9de0-4f55-900b-08ab4e8cf06a?# )
- [chaos-mesh 文档](https://chaos-mesh.org/docs)

#### 任务内容
- 添加 chaos-mesh 场景解析
- 添加 chaos-mesh 演练执行器

#### 实现步骤
- 在模块 chaosblade-box-scenario下添加一个 chaosblade-box-scenario-chaosmesh 的实现。
- 在模块 chaosblade-box-invoker 下添加一个 chaosblade-box-invoker-chaosmesh-kubeapi 实现。

#### 工作量

|  任务   | 工作量  |
|  ----  | ----  |
| 了解 chaosblade-box，并且能部署和使用 | 5 |
| 了解 chaos-mesh，能使用 chaos-mesh 注入故障 | 5 |
| 了解 chaosblade-box 的工具市场设计，考虑如何接入 chaos-mesh | 3 |
| 熟悉 chaos-mesh 的混沌实验模型和 CRD 定义 | 5 |
| 在 chaosblade-box 解析 chaos-mesh 的混沌实验模型和 CRD  | 5 |
| 熟悉 chaos-mesh 的演练创建的流程 | 5 |
| 在 chaosblade-box 创建 chaos-mesh 的演练  | 5 |
| 单元测试 | 3 |
| 集成测试 | 5 |
| PR 交付 | 2 |

## 相关文章交流群
- ChaosBlade 钉钉讨论群号：23177705
- 相关资料：[awesome-chaosblade 项目](https://github.com/chaosblade-io/awesome-chaosblade)
后续的分享和讨论都会在上述钉钉群中进行，欢迎加入。我们还会不定期的给 ChaosBlade 社区贡献者发放纪念品，欢迎加入到 ChaosBlade 社区中，加入方式：star、issue、pr 等均可。

## 加入我们

【稳定大于一切】打造国内稳定性领域知识库，**让无法解决的问题少一点点，让世界的确定性多一点点**。

* [GitHub 地址](https://github.com/StabilityMan/StabilityGuide)
* 钉钉群号：23179349
* 如果阅读本文有所收获，欢迎分享给身边的朋友，期待更多同学的加入！
