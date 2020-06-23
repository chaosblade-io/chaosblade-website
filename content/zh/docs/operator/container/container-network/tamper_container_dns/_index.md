---
title: "域名访问异常场景"
linkTitle: "域名访问异常场景"
weight: 3
type: docs
description: > 
    Kubernetes Container 域名访问异常场景
---
本实验通过修改本地的 hosts，篡改域名地址映射，模拟 container 内域名访问异常场景。

### 实验参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 域名 (必要参数) |
| `ip` | string | 映射的 ip (必要参数) |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`tamper_container_dns_by_id.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: tamper-container-dns-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: dns
    desc: "tamper container dns by id"
    matchers:
    - name: container-ids
      value:
      - "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
      # pod names
    - name: names
      value: ["redis-master-68857cd57c-hknb6"]
      # or use pod labels
    - name: namespace
      value: ["chaosblade"]
```

### 开始实验

获取 pod 名称和 container id 内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f tamper_container_dns_by_id.yaml
```

### 查看实验状态

执行 `kubectl get blade tamper-container-dns-by-id -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"tamper-container-dns-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"dns\",\"desc\":\"tamper container dns by id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e\"]},{\"name\":\"domain\",\"value\":[\"www.baidu.com\"]},{\"name\":\"ip\",\"value\":[\"10.0.0.1\"]},{\"name\":\"names\",\"value\":[\"redis-master-68857cd57c-hknb6\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]}],\"scope\":\"container\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-04T08:13:20Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "tamper-container-dns-by-id",
        "resourceVersion": "185452",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/tamper-container-dns-by-id",
        "uid": "72ad4e2a-7c92-436d-b477-61f088191f8b"
    },
    "spec": {
        "experiments": [
            {
                "action": "dns",
                "desc": "tamper container dns by id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
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
                "action": "dns",
                "resStatuses": [
                    {
                        "id": "e352348f9b0477b7",
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
# 进入实验 pod
$ kubectl exec -it redis-master-68857cd57c-hknb6 bash
# Ping www.baidu.com
$ ping www.baidu.com
# 无响应
```

![dns-container-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/dns-container-network.gif)

可以看到 Pod 的 `/etc/hosts` 文件被修改，模拟了 dns 解析异常的场景。
