---
title: "Node CPU 负载场景"
linkTitle: "Node 内 CPU 负载场景"
weight: 1
type: docs
description: > 
    Kubernetes Node CPU 负载场景
---
指定一个节点，做 CPU 负载 80% 实验。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `timeout` | string | 设定运行时长，单位是秒，通用参数 |
| `cpu-count` | string | 指定 CPU 满载的个数 |
| `cpu-list` | string | 指定 CPU 满载的具体核，核索引从 0 开始 (0-3 or 1,3) |
| `cpu-percent` | string | 指定 CPU 负载百分比，取值在 0-100 |

### 配置文件

实验配置文件：`node_cpu_load.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: cpu-load
spec:
  experiments:
  - scope: node
    target: cpu
    action: fullload
    desc: "increase node cpu load by names"
    matchers:
    - name: names
      value:
      - "docker20"
    - name: cpu-percent
      value:
      - "80"
```

### 开始实验

选择一个节点，修改 `node_cpu_load.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f node_cpu_load.yaml
```

### 查看实验状态

执行 `kubectl get blade cpu-load -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"cpu-load\"},\"spec\":{\"experiments\":[{\"action\":\"fullload\",\"desc\":\"increase node cpu load by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"cpu-percent\",\"value\":[\"80\"]}],\"scope\":\"node\",\"target\":\"cpu\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T02:14:04Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "cpu-load",
        "resourceVersion": "974292",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/cpu-load",
        "uid": "21a10bcb-a5ab-4c9e-834a-95599768490a"
    },
    "spec": {
        "experiments": [
            {
                "action": "fullload",
                "desc": "increase node cpu load by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "docker20"
                        ]
                    },
                    {
                        "name": "cpu-percent",
                        "value": [
                            "80"
                        ]
                    }
                ],
                "scope": "node",
                "target": "cpu"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "fullload",
                "resStatuses": [
                    {
                        "id": "f5854d2a9b79cd79",
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
                "target": "cpu"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

![](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/node-load-cpu.gif)

### 停止实验

执行命令：`kubectl delete -f node_cpu_load.yaml`

或者直接删除 blade 资源：`kubectl delete blade cpu-load`
