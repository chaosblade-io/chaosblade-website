---
title: "域名访问异常场景"
linkTitle: "域名访问异常场景"
weight: 3
type: docs
description: > 
    Kubernetes Node 域名访问异常场景
---
本实验通过修改 Node 的 hosts，篡改域名地址映射，模拟 Pod 内域名访问异常场景。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 域名 (必要参数) |
| `ip` | string | 映射的 ip (必要参数) |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`dns_node_network_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: dns-node-network-by-names
spec:
  experiments:
  - scope: node
    target: network
    action: dns
    desc: "dns node network by names"
    matchers:
    - name: names
      value:
      - "docker20"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
```

### 开始实验

选择一个节点，修改 `dns_node_network_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f dns_node_network_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade dns-node-network-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"dns-node-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"dns\",\"desc\":\"dns node network by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"domain\",\"value\":[\"www.baidu.com\"]},{\"name\":\"ip\",\"value\":[\"10.0.0.1\"]}],\"scope\":\"node\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T03:39:54Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "dns-node-network-by-names",
        "resourceVersion": "986912",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/dns-node-network-by-names",
        "uid": "dd6fa6bc-e04a-4566-b949-4630ed94b1c2"
    },
    "spec": {
        "experiments": [
            {
                "action": "dns",
                "desc": "dns node network by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "docker20"
                        ]
                    },
                    {
                        "name": "domain",
                        "value": [
                            "www.baidu.com"
                        ]
                    },
                    {
                        "name": "ip",
                        "value": [
                            "10.0.0.1"
                        ]
                    }
                ],
                "scope": "node",
                "target": "network"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "dns",
                "resStatuses": [
                    {
                        "id": "626da6fac3f157a5",
                        "kind": "node",
                        "name": "docker20",
                        "nodeName": "docker20",
                        "state": "Success",
                        "success": true,
                        "uid": "51d4553b-8da2-46ab-9b3d-51a11ae6d06f"
                    }
                ],
                "scope": "node",
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
# 进入实验 node
$ ssh kk@192.168.1.129
# Ping www.baidu.com
$ ping www.baidu.com
# 无响应
```

![dns-node-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/dns-node-network.gif)

可以看到 Node 的 `/etc/hosts` 文件被修改，模拟了 dns 解析异常的场景。

### 停止实验

执行命令：`kubectl delete -f dns_node_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade dns-node-network-by-names`