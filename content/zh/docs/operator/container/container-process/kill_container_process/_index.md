---
title: "杀指定进程场景"
linkTitle: "杀指定进程场景"
weight: 1
type: docs
description: > 
    Kubernetes Container 杀指定进程场景
---
此实验会删除指定容器中的 `redis-server` 进程。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `count` | string | 限制杀掉进程的数量，0 表示无限制 |
| `signal` | string | 指定杀进程的信号量，默认是 9，例如 --signal 15 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

### 配置文件

实验配置文件：`kill_container_process_by_id.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: kill-container-process-by-id
spec:
  experiments:
  - scope: container
    target: process
    action: kill
    desc: "kill container process by id"
    matchers:
    - name: container-ids
      value:
      - "94bc61ac84fb505f3f89b3ce5e4cc804ea8501ed091940b17b0f492835dc57d1"
    - name: process
      value: ["redis-server"]
    - name: names
      value: ["redis-slave-55d8c8ffbd-4pz8m"]
    - name: namespace
      value: ["chaosblade"]
```

### 开始实验

选择一个 pod，获取容器 ID ，修改 `kill_container_process_by_id.yaml` 中的 `container-ids` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f kill_container_process_by_id.yaml
```

### 查看实验状态

执行 `kubectl get blade kill-container-process-by-id -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "chaosblade.io/v1alpha1",
            "kind": "ChaosBlade",
            "metadata": {
                "annotations": {
                    "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"kill-container-process-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"kill\",\"desc\":\"kill container process by id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb\"]},{\"name\":\"process\",\"value\":[\"redis-server\"]},{\"name\":\"names\",\"value\":[\"redis-slave-55d8c8ffbd-4pz8m\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]}],\"scope\":\"container\",\"target\":\"process\"}]}}\n"
                },
                "creationTimestamp": "2020-06-11T01:34:44Z",
                "finalizers": [
                    "finalizer.chaosblade.io"
                ],
                "generation": 1,
                "name": "kill-container-process-by-id",
                "resourceVersion": "1600447",
                "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/kill-container-process-by-id",
                "uid": "fd4ea009-b974-49b0-a744-dc0004bef79a"
            },
            "spec": {
                "experiments": [
                    {
                        "action": "kill",
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
                        "action": "kill",
                        "resStatuses": [
                            {
                                "id": "4431cdce8d038643",
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
    ],
    "kind": "List",
    "metadata": {
        "resourceVersion": "",
        "selfLink": ""
    }
}
```

### 观测结果

```bash
# 开始实验前查看容器 id
$ kubectl get pod redis-slave-55d8c8ffbd-4pz8m -o custom-columns=POD_NAME:.metadata.name,CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
POD_NAME                        CONTAINER      ID
redis-slave-55d8c8ffbd-4pz8m   redis-master   docker://bfc9ca01fac33f60d300485f96549644b634f274351df1d4897526451f49e3fb
# 实验后查看容器 id
$ kubectl get pod redis-slave-55d8c8ffbd-4pz8m -o custom-columns=POD_NAME:.metadata.name,CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
POD_NAME                       CONTAINER     ID
redis-slave-55d8c8ffbd-4pz8m   redis-slave   docker://94bc61ac84fb505f3f89b3ce5e4cc804ea8501ed091940b17b0f492835dc57d1
```

![kill-container-process](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/kill-container-process.gif)

容器 id 变化，主进程被杀掉后容器进行了重启，符合实验逾期。

`redis-server` 的进程号发生改变，说明被杀掉后，又被重新拉起。

### 停止实验

执行命令：`kubectl delete -f kill_container_process_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade kill-container-process-by-id`