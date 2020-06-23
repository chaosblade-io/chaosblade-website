---
title: "网络延迟场景"
linkTitle: "网络延迟场景"
weight: 1
type: docs
description: > 
    Kubernetes Node 网络延迟场景
---
{{% pageinfo color="primary" %}}
实验前，请先登录 node 节点，使用 `ifconfig` 命令查看网卡信息，不是所有系统默认的网卡名称都是 `eth0`。
{{% /pageinfo %}}

`docker20` 节点的本地 `32436` 端口添加 `3000` 毫秒访问延迟，延迟时间上下浮动 `1000` 毫秒。

### 参数

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

实验配置文件：`delay_node_network_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delay-node-network-by-names
spec:
  experiments:
  - scope: node
    target: network
    action: delay
    desc: "delay node network loss"
    matchers:
    - name: names
      value: ["docker20"]
    - name: interface
      value: ["ens33"]
    - name: local-port
      value: ["32436"]
    - name: time
      value: ["3000"]
    - name: offset
      value: ["1000"]
```

### 开始实验

选择一个节点，修改 `delay_node_network_by_names.yaml` 中的 `names` 值。

对 `docker20` 节点本地端口 `32436` 访问丢包率 `100%`。

执行命令，开始实验：

```bash
$ kubectl apply -f delay_node_network_by_names.yaml
```

**查看实验状态**

执行 `kubectl get blade delay-node-network-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"delay-node-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"delay\",\"desc\":\"delay node network loss\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"interface\",\"value\":[\"ens33\"]},{\"name\":\"local-port\",\"value\":[\"32436\"]},{\"name\":\"time\",\"value\":[\"3000\"]},{\"name\":\"offset\",\"value\":[\"1000\"]}],\"scope\":\"node\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T03:28:30Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "delay-node-network-by-names",
        "resourceVersion": "985238",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delay-node-network-by-names",
        "uid": "d6cf9ba1-56e3-474c-89f3-1df89696c250"
    },
    "spec": {
        "experiments": [
            {
                "action": "delay",
                "desc": "delay node network loss",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "docker20"
                        ]
                    },
                    {
                        "name": "interface",
                        "value": [
                            "ens33"
                        ]
                    },
                    {
                        "name": "local-port",
                        "value": [
                            "32436"
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
                "scope": "node",
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
                        "id": "33c2ed6fec6fe8cc",
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
                "target": "network"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

```bash
# 从实验节点访问 Guestbook
$ time echo "" | telnet 192.168.1.129 32436
Trying 192.168.1.129...
Connected to 192.168.1.129.
Escape character is '^]'.
Connection closed by foreign host.
echo ""  0.00s user 0.00s system 35% cpu 0.003 total
telnet 192.168.1.129 32436  0.01s user 0.00s system 0% cpu 3.248 total
```

![](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/delay-node-network.gif)

### 停止实验

执行命令：`kubectl delete -f delay_node_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade delay-node-network-by-names`