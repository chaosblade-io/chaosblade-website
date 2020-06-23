---
title: "磁盘填充场景"
linkTitle: "磁盘填充场景"
weight: 1
type: docs
description: > 
    Kubernetes Node 磁盘填充场景
---
指定节点磁盘占用 80%

### 参数

节点磁盘填充均支持以下参数。

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `path` | string | 需要填充的目录 | `/` |
| `size` | string | 需要填充的文件大小，单位是 M，取值是整数，例如 --size 1024 | |
| `reserve` | string | 保留磁盘大小，单位是MB。取值是不包含单位的正整数，例如 --reserve 1024。如果 size、percent、reserve 参数都存在，优先级是 percent > reserve > size | |
| `percent` | string | 指定磁盘使用率，取值是不带%号的正整数，例如 --percent 80 | |
| `retain-handle` |  | 是否保留填充|  |
| `timeout` | string | 设定运行时长，单位是秒，通用参数 | |

### 配置文件

实验配置文件：`fill_node_disk_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: fill-node-disk-by-names
spec:
  experiments:
  - scope: node
    target: disk
    action: fill
    desc: "node disk fill"
    matchers:
    - name: names
      value: ["docker20"]
    - name: percent
      value: ["80"]
```

### 开始实验

选择一个节点，修改 `fill_node_disk_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f fill_node_disk_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade fill-node-disk-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"fill-node-disk-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"fill\",\"desc\":\"node disk fill\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"percent\",\"value\":[\"80\"]}],\"scope\":\"node\",\"target\":\"disk\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T03:57:46Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "fill-node-disk-by-names",
        "resourceVersion": "989523",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/fill-node-disk-by-names",
        "uid": "7afd5214-47ee-4048-a6ff-34ac6fd45ff3"
    },
    "spec": {
        "experiments": [
            {
                "action": "fill",
                "desc": "node disk fill",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "docker20"
                        ]
                    },
                    {
                        "name": "percent",
                        "value": [
                            "80"
                        ]
                    }
                ],
                "scope": "node",
                "target": "disk"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "fill",
                "resStatuses": [
                    {
                        "id": "6c155cf5627c699a",
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
                "target": "disk"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

可以看到磁盘占用 80%。

```bash
# 进入实验 node
$ ssh kk@192.168.1.129
# 查看磁盘使用率
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            7.9G     0  7.9G   0% /dev
tmpfs           1.6G  2.2M  1.6G   1% /run
/dev/sda2        98G   73G   20G  79% /
tmpfs           7.9G     0  7.9G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           7.9G     0  7.9G   0% /sys/fs/cgroup
/dev/loop1       90M   90M     0 100% /snap/core/8268
tmpfs           1.6G     0  1.6G   0% /run/user/1000
/dev/loop0       98M   98M     0 100% /snap/core/9289
```

![fill-node-disk](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/fill-node-disk.gif)

### 停止实验

执行命令：`kubectl delete -f fill_node_disk_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade fill-node-disk-by-names`
