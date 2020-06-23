---
title: "删除 Container 场景"
linkTitle: "删除 Container 场景"
weight: 1
type: docs
description: > 
    Kubernetes 删除 Container 场景
---

删除 chaosblade 命名空间下，Pod 名为 `guestbook-7b87b7459f-cqkq2` 中 container id 是 `c6cdcf60b82b854bc4bab64308b466102245259d23e14e449590a8ed816403ed` 的容器。

### 配置文件

实验配置文件：`remove_container_by_id.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: remove-container-by-id
spec:
  experiments:
  - scope: container
    target: container
    action: remove
    desc: "remove container by id"
    matchers:
    - name: container-ids
      value: ["c6cdcf60b82b854bc4bab64308b466102245259d23e14e449590a8ed816403ed"]
      # pod name
    - name: names
      value: ["guestbook-7b87b7459f-cqkq2"]
    - name: namespace
      value: ["chaosblade"]
```

### 开始实验

获取 container 名称：

```bash
$ kubectl get pod guestbook-7b87b7459f-cqkq2 -o custom-columns=CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `remove_container_by_id.yaml` 中的 `container-ids` 和 `names`。

执行命令，开始实验：

```bash
$ kubectl apply -f remove_container_by_id.yaml
```

### 查看实验状态

执行 `kubectl get blade remove-container-by-id -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"remove-container-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"remove\",\"desc\":\"remove container by id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"5600afacf083f9ddb43fa43c186de235c18313ab1194844ad03b241ba8158166\"]},{\"name\":\"names\",\"value\":[\"guestbook-7b87b7459f-cqkq2\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]}],\"scope\":\"container\",\"target\":\"container\"}]}}\n"
        },
        "creationTimestamp": "2020-06-04T03:31:18Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "remove-container-by-id",
        "resourceVersion": "145441",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/remove-container-by-id",
        "uid": "8bc90e2e-9456-455f-81de-c6522e75a653"
    },
    "spec": {
        "experiments": [
            {
                "action": "remove",
                "desc": "remove container by id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "5600afacf083f9ddb43fa43c186de235c18313ab1194844ad03b241ba8158166"
                        ]
                    },
                    {
                        "name": "names",
                        "value": [
                            "guestbook-7b87b7459f-cqkq2"
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
                "target": "container"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "remove",
                "resStatuses": [
                    {
                        "id": "641cf55a4372a157",
                        "kind": "container",
                        "name": "guestbook",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "5600afacf083f9ddb43fa43c186de235c18313ab1194844ad03b241ba8158166"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "container"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

![](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/remove-container-by-id.gif)

### 停止实验

执行命令：`kubectl delete -f remove_container_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade remove-container-by-id`