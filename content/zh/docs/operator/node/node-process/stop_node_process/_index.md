---
title: "挂起点上指定进程"
linkTitle: "挂起节点上指定进程"
weight: 2
type: docs
description: > 
    Kubernetes Node 挂起指定进程
---
此实验会挂起指定节点上的 `redis-server` 进程。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

### 配置文件

实验配置文件：`stop_node_process_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: stop-node-process-by-names
spec:
  experiments:
  - scope: node
    target: process
    action: stop
    desc: "kill node process by names"
    matchers:
    - name: names
      value: ["docker20"]
    - name: process
      value: ["redis-server"]
```

### 开始实验

选择一个节点，修改 `stop_node_process_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f stop_node_process_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade stop-node-process-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"stop-node-process-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"stop\",\"desc\":\"kill node process by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"process\",\"value\":[\"redis-server\"]}],\"scope\":\"node\",\"target\":\"process\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T08:20:36Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "stop-node-process-by-names",
        "resourceVersion": "1028075",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/stop-node-process-by-names",
        "uid": "40ebc6e6-4e2f-45dc-9a62-dc60527a1f4f"
    },
    "spec": {
        "experiments": [
            {
                "action": "stop",
                "desc": "kill node process by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "docker20"
                        ]
                    },
                    {
                        "name": "process",
                        "value": [
                            "redis-server"
                        ]
                    }
                ],
                "scope": "node",
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
                        "id": "e71f0902c13f2de1",
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
                "target": "process"
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
# 查看 redis-server 进程号
$ ps aux| grep redis-server
root      5632  0.0  0.0  41520  4168 ?        Tl   06:28   0:06 redis-server *:6379
```

可以看到 `redis-server` 此刻进程处于暂停状态了（T）。

![kill-node-process](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/stop-node-process.gif)

### 停止实验

执行命令：`kubectl delete -f stop_node_process_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade stop-node-process-by-names`
