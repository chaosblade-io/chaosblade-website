---
title: ChaosBlade Overview
slug: / 
---
This document describes the concepts, use cases, core strengths, and the architecture of ChaosBlade.

## ChaosBlade Overview

ChaosBlade is an open source chaos engineering project of Alibaba in 2019. It includes chaos engineering experimental tool chaosblade and chaos engineering platform chaosblade-box. It aims to help enterprises solve high-availability problems in the cloud-native process through chaos engineering. The experimental tool chaosblade supports 3 large system platforms, 4 programming language applications, involving more than 200 experimental scenarios and more than 3000 experimental parameters, which can finely control the scope of the experiment. The chaos engineering platform chaosblade-box supports the hosting of experimental tools. In addition to the hosted chaosblade, it also supports the Litmuschaos experimental tools. There are more than [40](https://github.com/chaosblade-io/chaosblade/issues/32) registered companies, of which the ICBC, China Mobile, Xiaomi, JD.com and other companies have landed and used it.

## Core strengths

ChaosBlade has the following core strengths:：

* Rich experimental scenarios: including basic resources (CPU, memory, network, disk, process, kernel, files, etc.), multilingual application services (Java, C++, NodeJS, Golang, etc.), Kubernetes platform (covering Container, Pod, Node resources) Scenes, including the above experimental scenes).
* Diversified execution methods: In addition to using the platform white screen operation, it can also be executed through the blade tool or kubectl or coding that comes with the tool.
* Convenient scenario expansion capability: All experimental scenarios follow the chaos experimental model implementation, and different levels of scenarios correspond to different actuators, which are simple to implement and easy to expand.
* Automated deployment of experimental tools: There is no need to manually deploy experimental tools, and the automatic deployment of experimental tools on the host or cluster is realized.
* Support for hosting of open source experimental tools: The platform can host mainstream experimental tools in the industry, such as its own chaosblade and external litmuschaos.
* Unified Chaos Experiment User Interface: Users do not need to care about the way of using different tools, and perform chaos experiments in the unified user interface.
* Multi-dimensional experiment method: Support experiment orchestration from the host to Kubernetes resources, and then to the application dimension.
* Integrated cloud native ecology: Helm deployment management, integrated Prometheus monitoring, support for cloud native experiment tool hosting, etc.

## Architecture overview

![](/img/zh/overall-architecture.png)

ChaosBlade supports deployment and training in a variety of environments, including linux, docker, kubernetes clusters and various cloud vendor environments. ChaosBlade mainly includes the following components:

- ChaosBlade-Box Console：The ChaosBlade visualization component mainly provides a set of user-friendly Web interface, through which users can arrange and manage chaos engineering experiments.
- ChaosBlade-Box Server：The core logic component is mainly responsible for the management and arrangement of chaos engineering experiments, probe and application management. Including components, Chaos Engine: exercise engine, including process orchestration, security control, exercise report and other functions; Chaos Runner: exercise executor, compatible with a variety of execution tools; Chaos Experience: exercise experience library, etc.
- Agent：The core logic component is deployed on the host of the user terminal or in the Kubernetes cluster. It is mainly responsible for establishing a connection with ChaosBlade-Box Server, reporting the heartbeat and serving as a command delivery channel.
- ChaosBlade：The main execution tool can perform fault injection on different environments such as the host and Kubernetes, and can perform fault interference on system network devices, file systems, kernels, and applications running on the system.

## Future

ChaosBlade will be based on cloud native in the future, providing chaos engineering platform and chaos engineering experiment tools for multi-cluster, multi-environment, and multi-language. Experimental tools will continue to focus on the richness and stability of experimental scenes, support more Kubernetes resource scenes and standardized application service experiment scene standards, and provide multilingual experiment scene standard implementations. The chaos engineering platform focuses on simplifying the deployment and implementation of chaos engineering. In the future, it will host more chaos experiment tools and mainstream compatible platforms to implement scene recommendations, provide business and system monitoring integration, output experiment reports, and complete chaos on the basis of ease of use Engineering operation closed loop.

Everyone is welcome to join the community to jointly promote the development of the chaotic engineering field, effectively land in the enterprise, and build a highly available distributed system.
