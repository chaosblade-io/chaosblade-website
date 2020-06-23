---
title: "挂起指定进程场景"
linkTitle: "挂起指定进程场景"
weight: 2
type: docs
description: > 
    Kubernetes Container 挂起指定进程场景
---
此实验会挂起指定容器中的 `redis-server` 进程。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

### 配置文件

实验配置文件：`stop_container_process_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: stop-container-process-by-id
spec:
  experiments:
  - scope: container
    target: process
    action: stop
    desc: "kill container process by id"
    matchers:
    - name: container-ids
      value:
      - "bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb"
    - name: process
      value: ["redis-server"]
    - name: names
      value: ["redis-slave-55d8c8ffbd-4pz8m"]
    - name: namespace
      value: ["chaosblade"]
```

### 开始实验

选择一个节点，修改 `stop_container_process_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f stop_container_process_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade stop-container-process-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"kill-container-process-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"stop\",\"desc\":\"kill container process by id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb\"]},{\"name\":\"process\",\"value\":[\"redis-server\"]},{\"name\":\"names\",\"value\":[\"redis-slave-55d8c8ffbd-4pz8m\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]}],\"scope\":\"container\",\"target\":\"process\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T08:42:21Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "kill-container-process-by-id",
        "resourceVersion": "1031383",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/kill-container-process-by-id",
        "uid": "39c45a2f-d0d1-4d01-affe-078ca08e9f82"
    },
    "spec": {
        "experiments": [
            {
                "action": "stop",
                "desc": "kill container process by id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb"
                        ]
                    },
                    {
                        "name": "process",
                        "value": [
                            "redis-server"
                        ]
                    },
                    {
                        "name": "names",
                        "value": [
                            "redis-slave-55d8c8ffbd-4pz8m"
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
                "target": "process"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "stop",
                "resStatuses": [
                    {
                        "id": "19f8d915dce8c254",
                        "kind": "container",
                        "name": "redis-slave",
                        "nodeName": "docker20",
                        "state": "Success",
                        "success": true,
                        "uid": "bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "process"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

```bash
# 进入实验 pod
$ kubectl exec -it redis-slave-55d8c8ffbd-4pz8m bash
# 查看 redis-server 进程号
$ ps aux| grep redis-server
root      5632  0.0  0.0  41520  4168 ?        Tl   06:28   0:06 redis-server *:6379
```

可以看到 `redis-server` 此刻进程处于暂停状态了（T）。

![kill-container-process](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/stop-container-process.gif)

### 停止实验

执行命令：`kubectl delete -f stop_container_process_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade stop-container-process-by-names`
