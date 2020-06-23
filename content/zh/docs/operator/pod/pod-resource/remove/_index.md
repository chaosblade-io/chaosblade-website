---
title: "删除 Pod"
linkTitle: "删除 Pod"
weight: 1
type: docs
description: > 
    Kubernetes 删除 Pod
---
删除 chaosblade 命名空间下标签是 `role=master` 的 pod。

### 执行观测

开始观察需要删除的 pod：

```bash
kubectl get pod -l "role=master" -n chaosblade -w
```

### 配置文件

实验配置文件：`delete_pod_by_labels.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delete-two-pod-by-labels
spec:
  experiments:
  - scope: pod
    target: pod
    action: delete
    desc: "delete pod by labels"
    matchers:
    - name: labels
      value:
      - "role=master"
    - name: namespace
      value:
      - "chaosblade"
    - name: evict-count
      value:
      - "2"
```

### 开始实验

新建终端，并开始实验：

```bash
kubectl apply -f delete_pod_by_labels.yaml
```

### 查看实验状态

执行命令：`kubectl get blade delete-two-pod-by-labels -o json`，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"delete-two-pod-by-labels\"},\"spec\":{\"experiments\":[{\"action\":\"delete\",\"desc\":\"delete pod by labels\",\"matchers\":[{\"name\":\"labels\",\"value\":[\"role=maste\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"evict-count\",\"value\":[\"2\"]}],\"scope\":\"pod\",\"target\":\"pod\"}]}}\n"
        },
        "creationTimestamp": "2020-06-01T02:11:36Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "delete-two-pod-by-labels",
        "resourceVersion": "10139772",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delete-two-pod-by-labels",
        "uid": "5eec72c7-b52b-4c35-a3b4-e6f6772f496b"
    },
    "spec": {
        "experiments": [
            {
                "action": "delete",
                "desc": "delete pod by labels",
                "matchers": [
                    {
                        "name": "labels",
                        "value": [
                            "role=maste"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "chaosblade"
                        ]
                    },
                    {
                        "name": "evict-count",
                        "value": [
                            "2"
                        ]
                    }
                ],
                "scope": "pod",
                "target": "pod"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "delete",
                "resStatuses": [
                    {
                        "kind": "pod",
                        "name": "redis-8488c84bb7-w5gzl",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "b61981d7-f1f8-43a7-885f-d2db012f7647"
                    }
                ],
                "scope": "pod",
                "state": "Success",
                "success": true,
                "target": "pod"
            }
        ],
        "phase": "Running"
    }
}
```

等待 **phase** 状态变为 **Running**

### 查看实验结果

可以看到 pod 名称发生变化，表示原 pod 已被删除。

### 停止实验

执行命令：`kubectl delete -f delete_pod_by_labels.yaml`

或者直接删除 blade 资源：`kubectl delete blade delete-two-pod-by-labels`
