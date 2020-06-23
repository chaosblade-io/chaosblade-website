---
title: "Container 内 CPU 负载场景"
linkTitle: "Container 内 CPU 负载场景"
weight: 2
type: docs
description: > 
    Kubernetes Container 内CPU 负载场景
---
指定 chaosblade 命名空间下 Pod 名为 `guestbook-7b87b7459f-cqkq2`，container id 为 2ff814b246f86，使其 CPU 负载为 100%。

### 实验准备

由于使用 helm 安装的 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 没有对资源进行限制，进行负载实验的话，会导致整个节点的故障，所以在实验之前需要**对资源进行限制**。

```bash
$ kubectl patch deployment redis-slave --patch '{"spec": {"template": {"spec": {"containers": [{"name": "redis-slave","resources": {"limits":{"cpu":"300m","memory":"512Mi"} }}]}}}}'
```

### 配置文件

实验配置文件：`increase_container_cpu_load_by_id.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: increase-container-cpu-load-by-id
spec:
  experiments:
  - scope: container
    target: cpu
    action: fullload
    desc: "increase container cpu load by id"
    matchers:
    - name: container-ids
      value:
      - "5ad91eb49c1c6f8357e8d455fd27dad5d0c01c5cc3df36a3acdb1abc75f68a11"
    - name: cpu-percent
      value: ["100"]
      # pod names
    - name: names
      value: ["redis-slave-55d8c8ffbd-jd8sm"]
    - name: namespace
      value: ["chaosblade"]
```

### 开始实验

获取 container 名称：

```bash
$ kubectl get pod redis-slave-55d8c8ffbd-jd8sm -o custom-columns=CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `increase_container_cpu_load_by_id.yaml` 中的 `container-ids` 和 `names`。

### 查看实验状态

执行命令：`kubectl get blade increase-container-cpu-load-by-id -o json`，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"increase-container-cpu-load-by-id-new\"},\"spec\":{\"experiments\":[{\"action\":\"fullload\",\"desc\":\"increase container cpu load by id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"5ad91eb49c1c6f8357e8d455fd27dad5d0c01c5cc3df36a3acdb1abc75f68a11\"]},{\"name\":\"cpu-percent\",\"value\":[\"100\"]},{\"name\":\"names\",\"value\":[\"redis-slave-55d8c8ffbd-jd8sm\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]}],\"scope\":\"container\",\"target\":\"cpu\"}]}}\n"
        },
        "creationTimestamp": "2020-06-04T06:26:44Z",
        "deletionGracePeriodSeconds": 0,
        "deletionTimestamp": "2020-06-04T06:28:48Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 2,
        "name": "increase-container-cpu-load-by-id-new",
        "resourceVersion": "170473",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/increase-container-cpu-load-by-id-new",
        "uid": "51955fd7-a6af-403a-915d-dd25bea73699"
    },
    "spec": {
        "experiments": [
            {
                "action": "fullload",
                "desc": "increase container cpu load by id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "5ad91eb49c1c6f8357e8d455fd27dad5d0c01c5cc3df36a3acdb1abc75f68a11"
                        ]
                    },
                    {
                        "name": "cpu-percent",
                        "value": [
                            "100"
                        ]
                    },
                    {
                        "name": "names",
                        "value": [
                            "redis-slave-55d8c8ffbd-jd8sm"
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
                        "id": "28a075b31562ba6f",
                        "kind": "container",
                        "name": "redis-slave",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "5ad91eb49c1c6f8357e8d455fd27dad5d0c01c5cc3df36a3acdb1abc75f68a11"
                    }
                ],
                "scope": "container",
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

可从监控系统观测到结果

![](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/container-fullload-cpu.png)

### 停止实验

执行命令：`kubectl delete -f increase_container_cpu_load_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade increase-container-cpu-load-by-id`
