---
title: "容器内 CPU 负载实验场景"
linkTitle: "CPU 负载实验场景"
weight: 1
type: docs
description: >
  kubernetes 下 容器内 CPU 负载实验场景，同基础资源的 CPU 场景
---
## 命令

支持 CPU 场景命令如下：

* `blade create k8s container-cpu load`，容器内 CPU 负载场景，同 [blade create cpu load](../../../resource/cpu-load)

## 参数

除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```text
--container-ids string     容器ID，支持配置多个
--container-names string   容器名称，支持配置多个
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
--namespace string       Pod 所属的命名空间，只能填写一个值，必填项
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          Pod 资源标签，多个标签之前是或的关系
--names string           Pod 资源名
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例

指定 `default` 命名空间下 Pod 名为 `frontend-d89756ff7-pbnnc`，容器 id 为 `2ff814b246f86`，做 CPU 负载 100% 实验举例。

### blade 命令执行方式

```shell
blade create k8s container-cpu fullload --cpu-percent 100 --container-ids 2ff814b246f86 --names frontend-d89756ff7-pbnnc --namespace default --kubeconfig config 
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"092e8b4d88d4f449"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create 092e8b4d88d4f449 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"092e8b4d88d4f449","success":true,"error":"","statuses":[{"id":"eab5fb70b61c9c45","uid":"2ff814b246f86aba2392379640e4c6b16efbfd61846fc419a24f8d8ccf0f86f0","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.204"}]}}
```

通过资源监控，可以看到此 Pod 下 CPU 使用情况
![monitor](https://user-images.githubusercontent.com/3992234/68177462-5cac1d80-ffc3-11e9-8c8f-4854f3eb4315.png)

#### 销毁实验

```shell
blade destroy 092e8b4d88d4f449
```

### kubectl 执行方式

yaml 的配置方式见：[Container 内 CPU 负载场景](../../../../../operator/container/container-resource/cpu-load/)
