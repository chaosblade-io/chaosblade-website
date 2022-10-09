---
title: ChaosBlade-Box, a New Version of the Chaos Engineering Platform Has Released
author: camix
tags: [ chaosblade ]
description: 本文会着重介绍什么是混沌工程平台新版本功能特性。
hide_table_of_contents: false
---

 ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1652433147520-9ebb5fc2-c89c-4df4-9cdc-dc63a3509e43.png#clientId=ubf723c2f-56b5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=137&id=u5077952f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=274&originWidth=1768&originalType=binary&ratio=1&rotation=0&showTitle=false&size=42357&status=done&style=none&taskId=ud1ca0bb9-9170-4114-af0d-55336b172cc&title=&width=884)
# 1. Preface
* What Is ChaosBlade-Box?
ChaosBlade-Box is an open-source cloud-native Chaos Engineering console of Alibaba Cloud for multiple clusters, languages, and environments. The main features include a unified chaos experiment user interface, Chaos Engineering tool deployment (such as ChaosBlade and LitmusChaos), and the support for experimental scenario management and multi-dimensional experiments.

* What Is ChaosBlade?
ChaosBlade is an easy-to-use, efficient, and open-source Chaos Engineering experimental tool of Alibaba Cloud, which conforms with the experimental model. It supports multi-platform, multi-language environment, and more than 200 drill scenarios, such as host system -> container -> Kubernetes cluster -> common components (Elasticsearch, Redis, and MySQL) -> application (Java, Golang, C++, and NodeJS), and over 3,000 parameters.

* What Is Chaos Engineering?
Chaos Engineering is a discipline that conducts experiments on distributed systems. Chaos Engineering helps detect weak points of systems in advance, promotes the improvement of the architecture, and finally realizes business resilience by actively injecting faults.

Since 2021, major enterprises have paid attention to and invested in the research and development of Chaos Engineering. ChaosBlade (an open-source Chaos Engineering tool from Alibaba) has officially become a CNCF Sandbox project. A new version of the ChaosBlade-Box was released to help users of open-source projects implement Chaos Engineering better. The following sections describe the features of the new version.
<!--truncate-->

# 2. An Introduction to the New ChaosBlade-Box
ChaosBlade-Box aims to build a unified Chaos Engineering operation platform. Since its release, it has received extensive attention from the open-source community. There are also the following problems.

- The Community Edition has insufficient support for drills on Kubernetes clusters, which is mainly due to the inability to obtain cluster-related data for drill application selection automatically and cumbersome drill steps that need to fill in cluster configuration manually information to locate a cluster. As a result, it is inconvenient to use.
The Community Edition cannot meet the needs of developers in the international open-source community. Also, it has insufficient control capabilities for probes.
- The Community Edition and the Enterprise Edition are separate from each other, which impacts the user experience and causes heavy migration costs when users of open-source projects turn to the Enterprise Edition later. The costs are related to data migration and operating habits.

In view of the problems above, the ChaosBlade-Box and Agent were revised significantly to integrate the Community Edition with the kernel of the Enterprise Edition, unify user operation habits, upgrade the system architecture of the Community Edition, and enhance its component features.

## 2.1 An Overall Introduction to ChaosBlade-Box
The new ChaosBlade-Box console is a multi-cluster, multi-environment, and multi-language cloud-native Chaos Engineering platform. It provides Chinese and English versions and supports global namespaces. Therefore, the same user can set different global namespaces according to their needs, such as test space, sandbox space, and online space. It offers automated tool deployment to simplify tool installation steps and improve execution efficiency. ChaosBlade-Box supports probe installation and drills in different environments, such as hosts and Kubernetes. It supports drills in nodes, pods, and containers in the Kubernetes environment. Data related to pods in a cluster is automatically collected and managed in a unified manner in application management. Thus, it simplifies the steps of the user drill query. Users do not need to go to the cluster to view the names of the pods or containers of the applications needed to be drilled. It also supports one-click migration to the Enterprise Edition and synchronizes drill data from the Community Edition to the Enterprise Edition as needed.

![](https://yqintl.alicdn.com/195e46237592afcf57adf52d50d8ea136d2de43d.png)

## 2.2 The New Drill Process
The following is the whole process of a drill on the new ChaosBlade-Box platform. Sequential execution and stage execution are supported. Sequential execution refers to multiple drill scenarios taking effect in sequence, while stage execution is multiple drill scenarios taking effect at the same time. A variety of security policies are used to ensure the drill is resumed, such as manual penalty and automatic stop. Automatic stop is configured by setting the timeout parameter during the drill configuration. This way, even if the platform and the probe (agent) are disconnected and cannot perform manual stop, the fault can be automatically recovered when the system reaches the timeout period.

![](https://yqintl.alicdn.com/9701a60906c4e4d2f79bdb9347567f12937a58ae.png)
![](https://yqintl.alicdn.com/85d11b85170e8c18ac8e377c1770ca5295214dce.png)

# 3. An Introduction to the Architecture
The following figure illustrates the system architecture of the new ChaosBlade and its component features:

![](https://yqintl.alicdn.com/c0fb4cedc18aaf4f663b529865591598cd693204.png)

**Components** 
- ChaosBlade-Box Console: The Chaos Engineering console frontend is responsible for frontend interface interaction.
- ChaosBlade-Box Server: It mainly provides capabilities for drill orchestration, scenario management, drill tool hosting, and one-click migration.
- Agent: As the probe of Chaos Engineering, it is mainly used for issuing and executing commands for data collection and drill.
- ChaosBlade: As a chaotic engineering experiment tool, it supports different environments such as hosts, Docker, and Kubernetes.
# 4. Advantages of the New ChaosBlade-Box
## 4.1 An Upgrade to ChaosBlade-Box Features
The console of the new Community Edition has the following features:

**1) Internationalization** 

It supports languages switching between Chinese and English.

**2) Namespace Switch**

It supports global space switching, allowing the same user to set different global namespaces according to their needs, such as test space, sandbox space, and online space.

**3) More Smooth Drill Arrangement**

The smooth orchestration is consistent with the drill process orchestration of the Enterprise Edition. Also, it supports parallel or serial drill processes for multiple fault drills at the same time.

**4) Improved Application Management**

It provides more comprehensive application management features and supports applications deployed in the host and Kubernetes environments, including application overview, machine list, drill records, and application configuration.

**5) Seamless Migration**

It is consistent with the operation interface of the Enterprise Edition and provides the one-click migration feature. It can automatically replace the probe with the public cloud one, register the drill machine to the Enterprise Edition, and synchronize the drill data to the Enterprise Edition. As a result, it can easily and simply switch to the Enterprise Edition.

**6) Safety**

It offers multiple fault recovery strategies to ensure that the issued drills can be recovered.

**7) Multi-Environment Deployment**

It supports deployment methods in different environments, including hosts, Docker, and Kubernetes.

**8) Hierarchical Drill Scenarios**

The drill scenarios are displayed in different categories. When you create a drill, the drill scenarios can be displayed in different categories in real-time according to the selected drill target.

## 4.2 An Upgrade to Probe (Agent) Features
The new probe (agent) has more features:

**1) Support for Drill Channels for Different Environments**

It can be used as a channel of drill command delivery in different environments. Thus, it simplifies the steps of the old version required to specify the kubeconfig of the cluster to perform the drill in the Kubernetes environment.

**2) A More Complete API**

It unifies the agent external API interface to facilitate expansion and docking.

**3) Automatic Data Collection and Reporting**

A new server that reports data related to Kubernetes to the console in the Kubernetes environment is added. This allows users to select drill targets in the Kubernetes environment.

**4) Automatic Uninstallation of the Probe**

The automatic probe uninstallation interface is added to directly control the probe installation and uninstallation in the console.

**5) Keep Alive**

Add a probe script to guarantee the liveness of the probe process

**6) Multi-Environment Deployment**

It supports deployment in different environments, including hosts, Docker, and Kubernetes.

# 5. Summary
Chaos Engineering is an approach to ensure the high availability of the system. Alibaba made ChaosBlade-Box (Chaos Engineering Console) open-source in 2021. ChaosBlade has been widely used as China's first open-source Chaos Engineering tool. It aims to help implement the Community Edition of Chaos Engineering, manage different open-source fault injection tools, and build a unified Chaos Engineering operation platform. This new version has a lot of improvements in the use of the user interface and the realization of functions, making it easier and more convenient to use and implement Chaos Engineering.

# 6. Recommended Links
[1] chaosblade-box: https://github.com/chaosblade-io/chaosblade-box

[2] chaosblade-box-agent: https://github.com/chaosblade-io/chaosblade-box-agent

[3] chaosblade: https://github.com/chaosblade-io/chaosblade

