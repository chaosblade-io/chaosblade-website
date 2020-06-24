---
title: "Pod 网络相关场景"
linkTitle: "网络相关场景"
weight: 2
type: docs
description: >
  kubernetes Pod 网络相关场景，同基础资源的网络场景
---
## 命令

支持的网络场景命令如下：

* `blade create k8s pod-network delay` Pod 网络延迟场景，同 [blade create network delay](../../../network/network-delay)
* `blade create k8s pod-network loss` Pod 网络丢包场景，同 [blade create network loss](../../../network/network-loss)
* `blade create k8s pod-network dns` Pod 域名访问异常场景，同 [blade create network dns](../../../network/network-dns)

## 参数

除了上述场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

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

对 `default` 命名空间下，指定名为 `redis-slave-674d68586-jnf7f` Pod 本地端口 6379 访问延迟 3000 毫秒，延迟时间上下浮动 1000 毫秒

### blade 执行方式

```shell
blade create k8s pod-network delay --time 3000 --offset 1000 --interface eth0 --local-port 6379 --names redis-slave-674d68586-jnf7f --namespace default --kubeconfig config
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"127f1ee0afcd4798"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create 127f1ee0afcd4798 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"127f1ee0afcd4798","success":true,"error":"","statuses":[{"id":"b5a216dddeb3389f","uid":"4f1a28a1-fee6-11e9-8883-00163e0ad0b3","name":"chaosblade-tool-vv49t","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.204"}]}}
```

可通过访问服务，或者 telnet 命令验证实验效果

#### 销毁实验

```shell
blade destroy 127f1ee0afcd4798
```

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes Pod 网络延迟场景](../../../../../operator/pod/pod-network/delay_pod_network/)
