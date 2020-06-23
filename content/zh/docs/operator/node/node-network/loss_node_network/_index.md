---
title: "网络丢包场景"
linkTitle: "网络丢包场景"
weight: 2
type: docs
description: > 
    Kubernetes Node 网络丢包场景
---
{{% pageinfo color="primary" %}}
实验前，请先登录 node 节点，使用 `ifconfig` 命令查看网卡信息，不是所有系统默认的网卡名称都是 `eth0`。
{{% /pageinfo %}}

`docker20` 节点的 `32436` 端口注入丢包率 100% 的故障。

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `destination-ip` | string | 目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `exclude-port` | string | 排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用。 |
| `exclude-ip` | string | 排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 |
| `interface` | string | 网卡设备，例如 eth0 (必要参数)。 |
| `local-port` | string | 本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `percent` | string | 丢包百分比，取值在[0, 100]的正整数 (必要参数)。 |
| `remote-port` | string | 远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080。 |
| `force` |  | 强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用。 |
| `ignore-peer-port` |  | 针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口。 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

### 配置文件

实验配置文件：`loss_node_network_by_names.yaml`

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-node-network-by-names
spec:
  experiments:
  - scope: node
    target: network
    action: loss
    desc: "node network loss"
    matchers:
    - name: names
      value: ["docker20"]
    - name: percent
      value: ["100"]
    - name: interface
      value: ["ens33"]
    - name: local-port
      value: ["32436"]
```

### 开始实验

选择一个节点，修改 `loss_node_network_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f loss_node_network_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade loss-node-network-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"loss-node-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"loss\",\"desc\":\"node network loss\",\"matchers\":[{\"name\":\"names\",\"value\":[\"docker20\"]},{\"name\":\"percent\",\"value\":[\"100\"]},{\"name\":\"interface\",\"value\":[\"ens33\"]},{\"name\":\"local-port\",\"value\":[\"32436\"]}],\"scope\":\"node\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-08T02:41:56Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "loss-node-network-by-names",
        "resourceVersion": "978403",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/loss-node-network-by-names",
        "uid": "5322e39a-a0ab-4521-a931-e57040344076"
    },
    "spec": {
        "experiments": [
            {
                "action": "loss",
                "desc": "node network loss",
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
                            "100"
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
                "action": "loss",
                "resStatuses": [
                    {
                        "id": "b93929d018091e18",
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

该端口为 `Guestbook` nodeport 的端口，访问实验端口无响应，但是访问未开启实验的端口可以正常使用

![](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/loss-node-network.gif)

```bash
# 获取节点 IP
$ kubectl get node -o wide
NAME       STATUS   ROLES                      AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION       CONTAINER-RUNTIME
docker20   Ready    worker                     3d16h   v1.17.6   192.168.1.129   <none>        Ubuntu 18.04.4 LTS   4.15.0-101-generic   docker://19.3.11
kk         Ready    controlplane,etcd,worker   4d16h   v1.17.6   192.168.4.210   <none>        Ubuntu 18.04.4 LTS   4.15.0-101-generic   docker://19.3.11
# 从实验节点访问 Guestbook - 无法访问
$ telnet 192.168.1.129 32436
Trying 192.168.1.129...
telnet: connect to address 192.168.1.129: Operation timed out
telnet: Unable to connect to remote host
# 从非实验节点访问 Guestbook - 正常访问
$ telnet 192.168.4.210 32436
Trying 192.168.4.210...
Connected to 192.168.4.210.
Escape character is '^]'.
```

同样也可以直接从浏览器访问地址，验证实验。

### 停止实验

执行命令：`kubectl delete -f loss_node_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade loss-node-network-by-names`