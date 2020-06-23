---
title: "域名访问异常场景"
linkTitle: "域名访问异常场景"
weight: 3
type: docs
description: > 
    Kubernetes Pod 域名访问异常场景
---
本实验通过修改本地的 hosts，篡改域名地址映射，模拟 Pod 内域名访问异常场景。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 域名 (必要参数) |
| `ip` | string | 映射的 ip (必要参数) |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`dns_pod_network_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: dns-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: dns
    desc: "dns pod network by names"
    matchers:
    - name: names
      value:
      - "redis-slave-6dd975d4c8-lm8jz"
    - name: namespace
      value:
      - "chaosblade"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
```

### 开始实验

获取 pod 名称内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f dns_pod_network_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade dns-pod-network-by-names -o json ` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"dns-pod-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"dns\",\"desc\":\"dns pod network by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"redis-slave-6dd975d4c8-lm8jz\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"domain\",\"value\":[\"www.baidu.com\"]},{\"name\":\"ip\",\"value\":[\"10.0.0.1\"]}],\"scope\":\"pod\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-02T07:03:32Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "dns-pod-network-by-names",
        "resourceVersion": "7719397",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/dns-pod-network-by-names",
        "uid": "08f25964-a73a-4b2c-9cea-0ad491c68345"
    },
    "spec": {
        "experiments": [
            {
                "action": "dns",
                "desc": "dns pod network by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "redis-slave-6dd975d4c8-lm8jz"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "chaosblade"
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
                "scope": "pod",
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
                        "id": "470d7c22418e87c1",
                        "kind": "pod",
                        "name": "redis-slave",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "a5996d866566fa7788d69b6f611769e3da3c81401cd20ecb0b53aebdb508e14c"
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
# 进入实验 pod
$ kubectl exec -it redis-slave-6dd975d4c8-lm8jz bash
# Ping www.baidu.com
$ ping www.baidu.com
# 无响应
```

![dns-pod-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/dns-pod-network.gif)

可以看到 Pod 的 `/etc/hosts` 文件被修改，模拟了 dns 解析异常的场景。

### 停止实验

执行命令：`kubectl delete -f dns_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade dns-pod-network-by-names`