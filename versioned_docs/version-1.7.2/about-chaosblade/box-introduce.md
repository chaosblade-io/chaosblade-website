---
title: ChaosBlade-Box Platform Introduction
sidebar_position: 2
---
This document mainly introduces the modules, functions and exercise arrangement of ChaosBlade-Box chaos engineering platform.

## Architecture Introduction

![](/img/en/en-chaosblade-box.jpg)

Through the console page, the automated deployment of managed tools such as chaosblade and litmuschaos can be realized. The experimental scene is unified according to the chaos experimental model established by the community. The target resources are divided according to the host, Kubernetes, and application, and controlled through the target manager. , which can realize the target resource selection of white screen. The platform executes the experimental scenarios of different tools by invoking the chaotic experiment execution. With access to prometheus monitoring, you can observe the experimental metric indicators, and provide rich experimental reports later. The deployment of Chaosblade-box is also very simple, you can check the details [chaosblade-box](https://github.com/chaosblade-io/chaosblade-box/releases).


## Overview

ChaosBlade-Box chaos engineering platform supports switching between Chinese and English, provides global namespace switching, and helps enterprises to use one platform for multiple purposes, such as test environment, grayscale environment, online environment, etc.

![](/img/en/en-box-overview.png)

## Application Management

Displays all applications on the host or Kubernetes cluster where the Agent (probe) is deployed. The Agent (probe) supports Kubernetes and host environment installation. When installed in a Kubernetes cluster, it will actively collect pod-related data in the cluster, and label it according to the label. to determine its application name and application group, so as to intuitively and conveniently perform a drill on an application


![](/img/en/en-box-application.png)

## Drill Experience And Experience Management

The walkthrough scenario will show all the scenarios supported by the Chaos Engineering Execution Tool, and display them differently according to different environments. The platform supports precipitation of the choreographed drills into experience, and provides a drill experience database for management, which is convenient for other users to conduct drills directly.

![](/img/en/en-box-experiment.png)

## Workflow

The platform supports two types of process orchestration: "sequential execution" and "staged execution", where "sequential execution" means that multiple failures take effect in sequence, and "staged execution" means that multiple failures take effect at the same time and then recover at the same time.

![](/img/en/en-box-workflow.png)

## Drill Result And Safety Control

On the exercise result page, you can view the overall progress of the exercise, and query the results, error information, execution logs, and parameter configuration of a single machine. In order to ensure that the exercise can be resumed, two methods of automatic stop and manual trigger are provided to terminate the drill. Even if the recovery command cannot be issued, it can be recovered over time to avoid unexpected failures outside the drill caused by system problems.

![](/img/en/en-box-result.png)
