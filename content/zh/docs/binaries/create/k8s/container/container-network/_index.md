---
title: "容器内网络实验场景"
linkTitle: "容器内网络实验场景"
weight: 2
type: docs
description: >
  kubernetes 下 容器内网络实验场景，同基础资源网络场景，由于同一个 Pod 内的容器共享 Pod 网络，所以效果与 Pod 网络实验相同
---
## 命令

支持的网络场景命令如下：

* `blade create k8s container-network delay` container 网络延迟场景，同 [blade create network delay](../../../network/network-delay)
* `blade create k8s container-network loss` container 网络丢包场景，同 [blade create network loss](../../../network/network-loss)
* `blade create k8s container-network dns` container 域名访问异常场景，同 [blade create network dns](../../../network/network-dns)

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

指定 `default` 命名空间下 Pod 名为 `frontend-d89756ff7-pbnnc`，容器 id 为 `2ff814b246f86`，做访问 www.baidu.com 域名异常实验举例。

### blade 命令执行方式

```shell
blade create k8s container-network dns --domain www.baidu.com --ip 10.0.0.1 --names frontend-d89756ff7-trsxf --namespace default --container-ids 4b25f66580c4 --kubeconfig config 
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"6e46a5df94e0b065"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create 6e46a5df94e0b065 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"6e46a5df94e0b065","success":true,"error":"","statuses":[{"id":"90304950e52d679e","uid":"4b25f66580c4dbf465a1b167c4c6967e987773442e5d47f0bee5db0a5e27a12d","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.203"}]}}
```

可以登录容器访问 www.baidu.com 域名进行验证。

#### 销毁实验

```shell
blade destroy 6e46a5df94e0b065
```

## 常见问题

Q: `{"code":504,"success":false,"error":"unexpected status, the real value is Error","result":{"uid":"623841684347c05f","success":false,"error":"unexpected status, the real value is Error","statuses":[{"uid":"4b25f66580c4dbf465a1b167c4c6967e987773442e5d47f0bee5db0a5e27a12d","name":"php-redis","state":"Error","kind":"container","error":"10.0.0.1 www.baidu.com #chaosblade has been exist exit status 1","success":false,"nodeName":"cn-hangzhou.192.168.0.203"}]}}`

A: 所以实验已经存在

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes Container 域名访问异常场景](../../../../../operator/container/container-network/tamper_container_dns/)
