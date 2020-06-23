---
title: "Container 场景"
linkTitle: "Container 场景"
weight: 1
type: docs
description: > 
    Kubernetes Container 实验场景
---

**参数**

Container 资源均支持以下参数。

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `container-ids` | string | 容器ID，支持配置多个 | |
| `container-names` | string | 容器名称，支持配置多个 | |
| `docker-endpoint` | string | Docker server 地址 | 默认为本地的 `/var/run/docker.sock` |
| `namespace` | string | Pod 所属的命名空间 | default |
| `evict-count` | string | 限制实验生效的数量 | |
| `evict-percent` | string | 限制实验生效数量的百分比，不包含 % | |
| `labels` | string | Pod 资源标签，多个标签之间是或的关系 | |
| `names` | string | Pod 资源名 | |
| `waiting-time` | string | 实验结果等待时间，参数值要包含单位，例如 10s，1m | 20s |
| `force` |  | 是否强制删除 | |

