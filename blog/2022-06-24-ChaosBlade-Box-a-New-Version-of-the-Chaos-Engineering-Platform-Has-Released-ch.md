---
title: ChaosBlade-Box全新混沌工程平台 -- 助力企业混沌工程落地
author: camix
tags: [ chaosblade ]
description: 本文会着重介绍什么是混沌工程平台新版本功能特性。
hide_table_of_contents: false
---

# 混沌工程是什么？
在2020.11.25 AWS发生了服务大面积故障，造成了多个云产品服务受影响，不到一个月的时间内谷歌发生了那年的第三次大规模宕机，造成了波及20亿用户，损失170万美元的巨大损失。
系统架构经历了单机 到 分布式，再到现在的云原生架构，其复杂度不断上涨，问题定位的难度也随之上涨。面对随时都可能发生的故障，有没有什么的办法能很好解决这个困境。
混沌工程（Chaos Engineering）在分布式系统上进行实验的学科，通过主动注入故障的方式，提前发现系统的薄弱点，推进架构的改进，最终实现业务韧性。从而避免故障在线上运行环境上发生。
![image.png](/img/blog/fault-always.png)
<!--truncate-->
这里拿云原生架构来举例说明，为什么混沌工程能解决系统架构中存在的问题。云原生架构原则和混沌工程原则是可以找到对应关系，以服务化原则说明，服务化原则其根本就是服务如何治理的问题，也就是判断上下游服务之间强弱依赖关系的问题。通过混沌工程，可以通过将请求定位到具体机器，再缩小到具体机器上的应用，不断最小化爆炸半径，通过在应用之间注入故障，判断上下游服务是否正常，来判断其强弱依赖关系。

![image.png](/img/blog/why-chaos-engineering.png)
混沌工程的目标是实现韧性架构，这里包含两个部分：韧性系统和韧性组织。韧性系统具有冗余性、扩展性、不可变基础设施、无状态应用、避免级联故障等。韧性组织包含高效交付、故障预案、应急响应机制等。高度韧性的系统也会出现预期之外的故障，所以韧性的组织能弥补韧性系统缺失的部分，通过混沌工程构建极致的韧性架构。
![image.png](/img/blog/chaos-engineering-target.png)
混沌工程就是通过主动注入故障的方式，提前发现系统的薄弱点，推进架构改进，最终实现业务韧性。引入混沌工程对于不同职能的人而言，其业务价值有所不同：

- 架构师：能帮助其验证架构的容错能力
- 开发/运维：能提高其故障的应急效率
- 测试：帮助其提早暴露线上问题，降低故障复发率
- 产品/设计：提示客户使用体验

![image.png](/img/blog/value-of-chaos-engineering-for-position.png)

# 如何落地混沌工程？
对于企业或业务如何对混沌工程进行落地？有无工具或平台能帮助其快速落地？
ChaosBlade 是一款遵循混沌实验模型的混沌实验执行工具，具有场景丰富度高，简单易用等特点，支持多平台、多语言环境，包括Linux、Kubernetes和Docker平台，支持Java、NodeJS、C++、Golang 语言应用。支持200多个场景，3000多个参数。是一款用于端侧的故障注入工具，但在业务进行落地时，会存在以下几个问题：

- 故障注入过程如何可视化？
- 如何同时对多个集群或主机进行故障注入？
- 如何拿到整体演练的统计信息
- ......

所以在ChaosBlade之上还需要平台层，对混沌工程执行工具进行管理与演练编排。
![image.png](/img/blog/chaosblae-tool.png)
ChaosBlade-Box是面向多集群、多语言、多环境，开源的云原生混沌工程控制台。
开源平台和注入工具的整体架构如下，主要包括几个组成模块：

- ChaosBlade-Box Console ：混沌实验用户界面
- ChaosBlade-Box：Server后端服务，主要包括演练场景的编排和安全管控、混沌工程工具部署（ChaosBlade、LitmusChaos...）、支持探针管理和多维度实验
- Agent：探针，主要有（ChaosBlade-Box）Server端进行建联并保持心跳、上报k8s相关数据、演练命令下发通道等功能
- ChaosBlade：部署在业务的主机或k8s集群内，在端侧进行演练的工具

![image.png](/img/blog/chaosblade-architecture.png)

新版ChaosBlade-Box平台是一个面向多集群、多环境、多语言的云原生混沌工程平台。支持国际化中英文切换，支持全局命名空间，使得同一用户可根据自己需求，设置不同的全局命名空间，如：测试空间、沙盒空间和线上空间等。提供自动化的工具部署，简化工具安装步骤，提高执行效率。平台支持不同环境的探针安装和演练，如主机和Kubernetes，其中Kubernetes环境下支持 Node、Pod、Container维度下的演练。在Kubernetes环境下会自动收集集群内的Pod相关数据，并在应用管理中进行统一管理，这样简化用户演练查询步骤，无需去集群内查看要演练应用的Pod名或Container名。并支持一键迁移到企业版，按需将社区版的演练数据同步到企业版。

![image.png](/img/blog/chaosblade-box-overview.png)
![image.png](/img/blog/chaosblade-box-application-manage.png)

![image.png](/img/blog/chaosblade-box-experiment.png)
![image.png](/img/blog/chaosblade-box-migrate.png)
以下是在新版ChaosBlade-Box平台上进行一次演练的全过程，支持顺序执行、阶段执行两种流程编排，顺序执行指的是多个演练场景依次生效，阶段执行值得是多个演练场景同时生效。通过多种安全策略保证演练得到恢复，如手动处罚和自动停止，自动停止通过在演练配置的时候设置超时参数来进行配置，这样即便平台和探针（Agent）失联，无法进行手动停止时，也能在超时时间到达的时候，自动恢复故障。
![image.png](/img/blog/chaosblade-box-workflow.png)
![image.png](/img/blog/chaosblade-box-result.png)
# 新版优势是什么？
此次发布的新版相较于老版，前端界面和企业版进行统一，简化使用习惯的切换成本，更为完善的国际化中英文切换，并支持全局命名空间的切换；后端提供了更为流畅的演练编排，完善的应用管理，并加强了对探针的管控，并支持一键迁移到企业版；加强了探针的功能，提供了更加完善的API，支持多环境部署且支持在不同环境作为演练通道，支持自动安装卸载，并收集并上报数据简化演练流畅。
![image.png](/img/blog/chaoblade-box-advantage.png)
