---
title: ChaosBlade Execution Tools Introduction
---
This document mainly introduces the architectural features, module layering and execution methods of the ChaosBlade chaos engineering exercise execution tool.

## Architecture Introduction

![](/img/zh/zh-architecture.jpg)

At the beginning of chaosblade design, we considered the ease of use and the convenience of scene expansion, which makes it convenient for everyone to use and expand more experimental scenes according to their own needs. Following the chaos experimental model, it provides unified operations and concise execution tools, and is divided according to domains. The scene realization is encapsulated into a single project to facilitate scene expansion in the field. 

## Module Layering

![](/img/en/en-blade-models.png)

Based on the domain implementation, chaosblade is packaged into a separate project. Each project is implemented according to best practices in each field. It can not only meet the usage habits of various fields, but also can establish a connection with the chaosblade cli project through the chaos experimental model, which is convenient to use, and uses chaosblade in a unified call. The yaml file based on the chaos experiment model describes the experimental scenes in various fields and is exposed to the upper chaos experiment platform. The Chaos Experiment Platform automatically perceives the changes in the experiment scene according to the changes in the experiment scene description file, without adding new scenes. Perform platform development again to make Chaos Platform more focused on other parts of Chaos Engineering.

## Drill Execution

The drill execution supports the following methods, and the specific user manuals for different execution methods can be referred to [k8s-contianer-cpu-fullload](../experiment-types/k8s/blade_create_k8s_container-cpu.md)：
 
- Cli command line mode: Execute the drill directly through the cli command, which can directly execute the drill on the host environment and Kubernetes environment.
- Yaml file mode: This mode is only used for the Kubernetes cluster exercise, using the yaml configuration file to create the exercise by defining the chaosblade crd resource
- Server mode: use `./blade server start` to start the ChaosBlade tool as a server, and then issue commands through http remote calls
- Platform Mode: Create drills directly through the interactive interface directly on the ChaosBlade-Box visualization platform