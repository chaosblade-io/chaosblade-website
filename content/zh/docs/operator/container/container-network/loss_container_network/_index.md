---
title: "网络丢包场景"
linkTitle: "网络丢包场景"
weight: 2
type: docs
description: > 
    Kubernetes Container 网络丢包场景
---

对 chaosblade 命名空间中，对 `redis-master-68857cd57c-hknb6` Pod 中 container id 是 `02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e` 的容器注入丢包率 100% 的故障，只针对 IP 为 `10.42.0.26` 的 pod 生效，也就是除 `10.42.0.26` 以外的 pod 都能正常访问 `redis-master-68857cd57c-hknb6`。

### 实验参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `destination-ip` | string | 目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `exclude-port` | string | 排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用。 |
| `exclude-ip` | string | 排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `interface` | string | 网卡设备，例如 eth0 (必要参数)。 |
| `local-port` | string | 本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `percent` | string | 丢包百分比，取值在[0, 100]的正整数 (必要参数)。 |
| `remote-port` | string | 远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `force` |  | 强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用。 |
| `ignore-peer-port` |  | 针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口。 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`loss_container_network_by_id.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-container-network-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: loss
    desc: "loss container network by container id"
    matchers:
    - name: container-ids
      value:
      - "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
    - name: names
      value:
      - "redis-master-68857cd57c-hknb6"
    - name: namespace
      value:
      - "chaosblade"
    - name: interface
      value: ["eth0"]
    - name: percent
      value: ["100"]
    - name: timeout
      value: ["60"]
    - name: destination-ip
      value: ["10.42.0.26"]
```

### 开始实验

获取 pod 名称和 container id 内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f loss_container_network_by_id.yaml
```

### 查看实验状态

执行 `kubectl get blade loss-container-network-by-id -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"loss-container-network-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"loss\",\"desc\":\"loss container network by container id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e\"]},{\"name\":\"names\",\"value\":[\"redis-master-68857cd57c-hknb6\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"interface\",\"value\":[\"eth0\"]},{\"name\":\"percent\",\"value\":[\"100\"]},{\"name\":\"timeout\",\"value\":[\"60\"]},{\"name\":\"destination-ip\",\"value\":[\"10.42.0.26\"]}],\"scope\":\"container\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-04T07:41:37Z",
        "deletionGracePeriodSeconds": 0,
        "deletionTimestamp": "2020-06-04T07:42:50Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 2,
        "name": "loss-container-network-by-id",
        "resourceVersion": "180856",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/loss-container-network-by-id",
        "uid": "d64873ae-3956-4660-9e35-27241bd48fa4"
    },
    "spec": {
        "experiments": [
            {
                "action": "loss",
                "desc": "loss container network by container id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
                        ]
                    },
                    {
                        "name": "names",
                        "value": [
                            "redis-master-68857cd57c-hknb6"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "chaosblade"
                        ]
                    },
                    {
                        "name": "interface",
                        "value": [
                            "eth0"
                        ]
                    },
                    {
                        "name": "percent",
                        "value": [
                            "100"
                        ]
                    },
                    {
                        "name": "timeout",
                        "value": [
                            "60"
                        ]
                    },
                    {
                        "name": "destination-ip",
                        "value": [
                            "10.42.0.26"
                        ]
                    }
                ],
                "scope": "container",
                "target": "network"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "loss",
                "resStatuses": [
                    {
                        "id": "8ad94f6be81dec80",
                        "kind": "container",
                        "name": "redis-master",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "network"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

```bash
# 获取实验 pod ip
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..status.podIP}
10.42.0.19
# 进入观测 pod，IP为：10.42.0.26（被设置丢包率 100%）
$ kubectl exec -it redis-slave-55d8c8ffbd-jd8sm bash
# Ping 实验Pod ip
$ ping 10.42.0.19
PING 10.42.0.19 (10.42.0.19) 56(84) bytes of data.
# 无响应

# 进入观测 pod，该 pod 未被指定丢包
$ kubectl exec -it redis-slave-55d8c8ffbd-22tsc bash
# Ping 实验Pod ip
$ ping 10.42.0.19
PING 10.42.0.19 (10.42.0.19) 56(84) bytes of data.
64 bytes from 10.42.0.19: icmp_seq=1 ttl=64 time=0.065 ms
64 bytes from 10.42.0.19: icmp_seq=2 ttl=64 time=0.051 ms
64 bytes from 10.42.0.19: icmp_seq=3 ttl=64 time=0.078 ms
...
# 响应正常
```

![loss-container-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/loss-container-network.gif)

{{% pageinfo color="primary" %}}
这里在配置中还将 `timeout` 设置为 60 秒，60 秒后 100% 丢包的情况将会消失，这个配置是为了防止因丢包率设置太高，造成机器无法连接的情况。与其有相似功能的还有 `exclude-port`，该配置用来指定排除掉的丢包端口。
{{% /pageinfo %}}

### 停止实验

执行命令：`kubectl apply -f loss_container_network_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade loss-container-network-by-id`