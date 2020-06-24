---
title: "Pod 资源自身场景"
linkTitle: "资源自身场景"
weight: 1
type: docs
description: >
  kubernetes Pod 资源自身场景，比如删除 Pod
---
## 命令

支持的场景命令如下：

* `blade create k8s pod-pod delete` 删除 POD

## 参数

除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```text
--namespace string       Pod 所属的命名空间，只能填写一个值，必填项
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          Pod 资源标签，多个标签之前是或的关系
--names string           Pod 资源名
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例

删除指定 `default` 命名空间下标签是 `app=guestbook` 的 pod，删除

### blade 执行方式

```shell
blade create k8s pod-pod delete --labels app=guestbook --namespace default --evict-count 2 --kubeconfig config
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"4d3caa0a99c3b2dd"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create 4d3caa0a99c3b2dd --kubeconfig config

{"code":200,"success":true,"result":{"uid":"4d3caa0a99c3b2dd","success":true,"error":"","statuses":[{"uid":"f325d43c-ff71-11e9-8883-00163e0ad0b3","name":"frontend-d89756ff7-5wgg5","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.203"},{"uid":"28af19dd-f987-11e9-bd30-00163e08a39b","name":"frontend-d89756ff7-dpv7h","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```

#### 销毁实验

```shell
blade destroy 4d3caa0a99c3b2dd
```
删除 Pod 的停止实验操作，chaosblade 本身不会重新拉起被删除的 Pod，只是去更改实验状态！！

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes 删除 Pod](../../../../../operator/pod/pod-resource/remove/)
