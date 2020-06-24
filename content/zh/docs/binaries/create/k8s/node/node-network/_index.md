---
title: "节点网络相关场景"
linkTitle: "网络相关场景"
weight: 2
type: docs
description: >
  kubernetes 节点网络相关场景，同基础资源的网络场景
---
## 命令

支持的网络场景命令如下：

* `blade create k8s node-network delay` 节点网络延迟场景，同 [blade create network delay](../../../network/network-delay)
* `blade create k8s node-network loss` 节点网络丢包场景，同 [blade create network loss](../../../network/network-loss)
* `blade create k8s node-network dns` 节点域名访问异常场景，同 [blade create network dns](../../../network/network-dns)

## 参数

除了上述场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```text
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          节点资源标签
--names string           节点资源名，多个资源名之间使用逗号分隔
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例

对 cn-hangzhou.192.168.0.205 节点本地端口 40690 访问丢包率 60%

### blade 执行方式

```shell
blade create k8s node-network loss --percent 60 --interface eth0 --local-port 40690 --kubeconfig config --names cn-hangzhou.192.168.0.205
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"e647064f5f20953c"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create e647064f5f20953c --kubeconfig config

{"code":200,"success":true,"result":{"uid":"e647064f5f20953c","success":true,"error":"","statuses":[{"id":"fa471a6285ec45f5","uid":"e179b30d-df77-11e9-b3be-00163e136d88","name":"cn-hangzhou.192.168.0.205","state":"Success","kind":"node","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```

#### 销毁实验

```
blade destroy e647064f5f20953c
```

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes Node 网络丢包场景](../../../../../operator/node/node-network/loss_node_network/)