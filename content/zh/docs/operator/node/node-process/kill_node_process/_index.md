---
title: "杀节点上指定进程"
linkTitle: "杀节点上指定进程"
weight: 1
type: docs
description: > 
    Kubernetes Node 杀指定进程
---
此实验会删除指定节点上的 `redis-server` 进程。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `count` | string | 限制杀掉进程的数量，0 表示无限制 |
| `signal` | string | 指定杀进程的信号量，默认是 9，例如 --signal 15 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

### 配置文件

实验配置文件：`kill_node_process_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: kill-node-process-by-names
spec:
  experiments:
  - scope: node
    target: process
    action: kill
    desc: "kill node process by names"
    matchers:
    - name: names
      value: ["docker20"]
    - name: process
      value: ["redis-server"]
```

### 开始实验

选择一个节点，修改 `kill_node_process_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f kill_node_process_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade kill-node-process-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"kill-node-process-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"kill\",\"desc\":\"kill node process by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"process\",\"value\":[\"redis-server\"]}],\"scope\":\"node\",\"target\":\"process\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T06:23:30Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "kill-node-process-by-names",
        "resourceVersion": "1010910",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/kill-node-process-by-names",
        "uid": "e6120a54-bfc3-44ab-9225-01b77e0b89d0"
    },
    "spec": {
        "experiments": [
            {
                "action": "kill",
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
                "action": "kill",
                "resStatuses": [
                    {
                        "id": "61921300c4eefa75",
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
$ ps -ef | grep redis-server
root     31327 31326  0 06:15 ?        00:00:00 redis-server *:6379
# 可以看到进程号发生了变化
$ ps -ef | grep redis-server
root      2873  2872  0 06:23 ?        00:00:00 redis-server *:6379
```

`redis-server` 的进程号发生改变，说明被杀掉后，又被重新拉起。

![kill-node-process](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/kill-node-process.gif)

### 停止实验

执行命令：`kubectl delete -f kill_node_process_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade kill-node-process-by-names`