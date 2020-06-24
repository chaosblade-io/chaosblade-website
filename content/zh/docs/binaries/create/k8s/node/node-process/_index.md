---
title: "节点进程相关场景"
linkTitle: "进程相关场景"
weight: 3
type: docs
description: >
  kubernetes 节点进程相关场景，同基础资源的进程场景
---
## 命令

支持的进程场景命令如下：

* `blade create k8s node-process kill` 杀节点上指定进程，同 [blade create process kill](../../../process/process-kill/)
* `blade create k8s node-process stop` 挂起节点上指定进程，同 [blade create process stop](../../../process/process-stop/)

## 参数

除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```text
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          节点资源标签
--names string           节点资源名，多个资源名之间使用逗号分隔
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例
杀指定 cn-hangzhou.192.168.0.205 节点上 kubelet 进程

### blade 执行方式

```shell
blade create k8s node-process kill --process redis-server --names cn-hangzhou.192.168.0.205 --kubeconfig config
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"fc93e5bbe4827d4b"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create fc93e5bbe4827d4b --kubeconfig config

{"code":200,"success":true,"result":{"uid":"fc93e5bbe4827d4b","success":true,"error":"","statuses":[{"id":"859c56e6850c1c1b","uid":"e179b30d-df77-11e9-b3be-00163e136d88","name":"cn-hangzhou.192.168.0.205","state":"Success","kind":"node","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```

可以看到执行前后，redis-server 的进程号发生改变，说明被杀掉后，又被重新拉起

```shell
# ps -ef | grep redis-server
19497 root      2:05 redis-server *:6379

# ps -ef | grep redis-server
31855 root      0:00 redis-server *:6379
```

#### 销毁实验

```shell
blade destroy fc93e5bbe4827d4b
```

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes 杀节点上指定进程](../../../../../operator/node/node-process/kill_node_process/)