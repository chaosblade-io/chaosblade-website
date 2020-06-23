---
title: "网络延迟场景"
linkTitle: "网络延迟场景"
weight: 1
type: docs
description: > 
    Kubernetes Container 网络延迟场景
---

对 chaosblade 命名空间中，对 `redis-master-68857cd57c-hknb6` Pod 中 container id 是 `02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e` 的容器的 6379 端口添加 3000 毫秒访问延迟，延迟时间上下浮动 1000 毫秒。

### 实验参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `destination-ip` | string | 目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `exclude-port` | string | 排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用。 |
| `exclude-ip` | string | 排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `interface` | string | 网卡设备，例如 eth0 (必要参数)。 |
| `local-port` | string | 本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `offset` | string | 延迟时间上下浮动的值, 单位是毫秒。 |
| `remote-port` | string | 远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `time` | string | 延迟时间，单位是毫秒 (必要参数)。 |
| `force` |  | 强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用。 |
| `ignore-peer-port` |  | 针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口。 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`delay_container_network_by_id.yaml`：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delay-container-network-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: delay
    desc: "delay container network by container id"
    matchers:
    - name: container-ids
      value:
      - "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
    - name: names
      value:
      - "redis-master-68857cd57c-hknb6"
    - name: namespace
      value:
      - "chaosblade"
    - name: local-port
      value: ["6379"]
    - name: interface
      value: ["eth0"]
    - name: time
      value: ["3000"]
    - name: offset
      value: ["1000"]
```

### 开始实验

获取 Pod 名称和 container id：

```bash
$ kubectl get pod redis-master-68857cd57c-hknb6 -o custom-columns=POD_NAME:.metadata.name,CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `delay_container_network_by_id.yaml` 中的 `container-ids` 和 `names`。

执行命令，开始实验：

```bash
$ kubectl apply -f delay_container_network_by_id.yaml
```

### 查看实验状态

执行 `kubectl get blade delay-container-network-by-id -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"delay-container-network-by-id\"},\"spec\":{\"experiments\":[{\"action\":\"delay\",\"desc\":\"delay container network by container id\",\"matchers\":[{\"name\":\"container-ids\",\"value\":[\"02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e\"]},{\"name\":\"names\",\"value\":[\"redis-master-68857cd57c-hknb6\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"local-port\",\"value\":[\"6379\"]},{\"name\":\"interface\",\"value\":[\"eth0\"]},{\"name\":\"time\",\"value\":[\"3000\"]},{\"name\":\"offset\",\"value\":[\"1000\"]}],\"scope\":\"container\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-04T07:23:55Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "delay-container-network-by-id",
        "resourceVersion": "178235",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delay-container-network-by-id",
        "uid": "d63730e6-4039-49f3-93fb-ba0936bc50ac"
    },
    "spec": {
        "experiments": [
            {
                "action": "delay",
                "desc": "delay container network by container id",
                "matchers": [
                    {
                        "name": "container-ids",
                        "value": [
                            "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
                        ]
                    },
                    {
                        "name": "names",
                        "value": [
                            "redis-master-68857cd57c-hknb6"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "chaosblade"
                        ]
                    },
                    {
                        "name": "local-port",
                        "value": [
                            "6379"
                        ]
                    },
                    {
                        "name": "interface",
                        "value": [
                            "eth0"
                        ]
                    },
                    {
                        "name": "time",
                        "value": [
                            "3000"
                        ]
                    },
                    {
                        "name": "offset",
                        "value": [
                            "1000"
                        ]
                    }
                ],
                "scope": "container",
                "target": "network"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "delay",
                "resStatuses": [
                    {
                        "id": "91c03ddd172ce1a5",
                        "kind": "container",
                        "name": "redis-master",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
                    }
                ],
                "scope": "container",
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
# 获取实验 pod ip
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..status.podIP}
10.42.0.19
# 进入观测 pod
$ kubectl exec -it redis-slave-55d8c8ffbd-jd8sm bash
# 在 pod 中安装 telnet
$ apt-get update && apt-get install -y telnet
# 测试时间
$ time echo "" | telnet 10.42.0.19 6379
Trying 10.42.0.19...
Connected to 10.42.0.19.
Escape character is '^]'.
Connection closed by foreign host.

real    0m3.790s
user    0m0.007s
sys     0m0.001s
```

![delay-container-network](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/delay-container-network.gif)

可以看到结果符合预期。

### 停止实验

执行命令：`kubectl delete -f delay_container_network_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade delay-container-network-by-id`