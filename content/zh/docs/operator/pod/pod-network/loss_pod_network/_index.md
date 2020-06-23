---
title: "网络丢包场景"
linkTitle: "网络丢包场景"
weight: 2
type: docs
description: > 
    Kubernetes Pod 网络丢包场景
---
在 chaosblade 命名空间中，对 `redis-master-68857cd57c-dzbs9` Pod 注入丢包率 100% 的故障，只针对 IP 为 10.42.69.42 的 pod 生效，也就是除 10.42.69.42 以外的 pod 都能正常访问 `redis-master-68857cd57c-dzbs9`。

### 参数

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

实验配置文件：`loss_pod_network_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: loss
    desc: "loss pod network by names"
    matchers:
    - name: names
      value:
      - "redis-master-68857cd57c-dzbs9"
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
      value: ["10.42.69.42"]
```

### 开始实验

获取 pod 名称内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f loss_pod_network_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade loss-pod-network-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"loss-pod-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"loss\",\"desc\":\"loss pod network by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"redis-master-68857cd57c-dzbs9\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"interface\",\"value\":[\"eth0\"]},{\"name\":\"percent\",\"value\":[\"100\"]},{\"name\":\"timeout\",\"value\":[\"60\"]},{\"name\":\"destination-ip\",\"value\":[\"10.42.69.42\"]}],\"scope\":\"pod\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-02T06:32:25Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "loss-pod-network-by-names",
        "resourceVersion": "7715130",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/loss-pod-network-by-names",
        "uid": "3a75bc03-ca88-4ad2-bc06-d0b8998b92f2"
    },
    "spec": {
        "experiments": [
            {
                "action": "loss",
                "desc": "loss pod network by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "redis-master-68857cd57c-dzbs9"
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
                            "10.42.69.42"
                        ]
                    }
                ],
                "scope": "pod",
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
                        "id": "c1a540c8b29022fd",
                        "kind": "pod",
                        "name": "redis-master",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "619a19ceb213f9b6152159bd868e88de2ddbf9a8aac606dc274b34bec6510c60"
                    }
                ],
                "scope": "pod",
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
10.42.69.44
# 进入观测 pod，IP为：10.42.69.42（被设置丢包率 100%）
$ kubectl exec -it redis-slave-6dd975d4c8-lm8jz bash
# Ping 实验Pod ip
$ ping 10.42.69.44
PING 10.42.69.44 (10.42.69.44) 56(84) bytes of data.
# 无响应

# 进入观测 pod，该 pod 未被指定丢包
$ kubectl exec -it redis-slave-6dd975d4c8-2zrkb bash
# Ping 实验Pod ip
$ ping 10.42.69.44
PING 10.42.69.44 (10.42.69.44) 56(84) bytes of data.
64 bytes from 10.42.69.44: icmp_seq=1 ttl=63 time=0.128 ms
64 bytes from 10.42.69.44: icmp_seq=2 ttl=63 time=0.128 ms
64 bytes from 10.42.69.44: icmp_seq=3 ttl=63 time=0.092 ms
...
# 响应正常
```

![loss-pod-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/loss-pod-network.gif)

这里在配置中将 `timeout` 设置为 60 秒，60 秒后 100% 丢包的情况将会消失，这个配置是为了防止因丢包率设置太高，造成机器无法连接的情况。与其有相似功能的还有 `exclude-port`，该配置指定一些端口不会丢包，以免该 pod 失联。

### 停止实验

执行命令：`kubectl delete -f loss_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade loss-pod-network-by-names`
