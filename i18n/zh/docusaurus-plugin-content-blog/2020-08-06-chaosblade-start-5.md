---
authors: guoxudong
title: ChaosBlade：从零开始的混沌工程（五）
tags: [ chaosblade ]
hide_table_of_contents: false
---

## 前言

在上篇文章中，我们介绍了如何使用 **ChaosBlade Operator** 对 node 资源进行混沌实验。从本章将继续对 Kubernetes Container 资源的混沌实验进行讲解，同时也配套了 [katacode](https://katacoda.com/) 交互式教程，读者可用通过 katacode，在浏览器上操作真实的 Kubernetes 和 ChaosBlade，同时本篇也是系列文章的倒数第二篇，实践内容的最后一篇。
<!--truncate-->
> katacode 现已关闭

## 实验对象：Container

Pod 由一个或多个容器（Container）组成。容器（Container）是一种用来打包已经编译好的代码以及运行时需要的各个依赖项的技术。您运行的每个容器都是可以重复运行的；包含依赖项的标准化意味着您在任何地点运行它都会得到相同的结果。

## Container 实验场景

同之前的文章，本篇默认已安装 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 应用和 ChaosBlade Operator。

### container 资源自身的场景

#### 删除 container

**实验目标**：删除 chaosblade 命名空间下，Pod 名为 `guestbook-7b87b7459f-cqkq2` 中 container id 是 `c6cdcf60b82b854bc4bab64308b466102245259d23e14e449590a8ed816403ed` 的容器。

**开始实验**

`remove_container_by_id.yaml` 内容：

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

获取 container 名称：

```bash
$ kubectl get pod guestbook-7b87b7459f-cqkq2 -o custom-columns=CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `remove_container_by_id.yaml` 中的 `container-ids` 和 `names`。

执行命令，开始实验：

```bash
$ kubectl apply -f remove_container_by_id.yaml
```

**查看实验状态**

执行 `kubectl get blade remove-container-by-id -o json` 命令，查看实验状态。

**观测结果**

查看容易 ID，可以看到容器ID发生了变化，旧容器被删除了，拉起了新容器。

![删除 container](https://tvax4.sinaimg.cn/large/ad5fbf65gy1ghh7lolrl9g20xq0g67wh.gif)

**停止实验**

执行命令：`kubectl delete -f remove_container_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade remove-container-by-id`

### container 内CPU负载场景

**实验目标**：指定 chaosblade 命名空间下 Pod 名为 `guestbook-7b87b7459f-cqkq2`，container id 为 2ff814b246f86，使其 CPU 负载为 100%。

**实验准备**

由于使用 helm 安装的 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 没有对资源进行限制，进行负载实验的话，会导致整个节点的故障，所以在实验之前需要**对资源进行限制**。

```bash
$ kubectl patch deployment redis-slave --patch '{"spec": {"template": {"spec": {"containers": [{"name": "redis-slave","resources": {"limits":{"cpu":"300m","memory":"512Mi"} }}]}}}}'
```

**开始实验**

`increase_container_cpu_load_by_id.yaml` 内容：

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

获取 container 名称：

```bash
$ kubectl get pod redis-slave-55d8c8ffbd-jd8sm -o custom-columns=CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `increase_container_cpu_load_by_id.yaml` 中的 `container-ids` 和 `names`。

**查看实验状态**

执行命令：`kubectl get blade increase-container-cpu-load-by-id -o json`，查看实验状态。

**观测结果**

可从监控系统观测到结果

![container 内CPU负载场景](https://tvax1.sinaimg.cn/large/ad5fbf65gy1ghh7p4zsblj20ct07eaac.jpg)

**停止实验**

执行命令：`kubectl delete -f increase_container_cpu_load_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade increase-container-cpu-load-by-id`

### container 内网络实验场景

该场景与 Pod 实验场景类似。

#### container 网络延迟场景

**实验目标**：对 chaosblade 命名空间中，对 `redis-master-68857cd57c-hknb6` Pod 中 container id 是 `02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e` 的容器的 6379 端口添加 3000 毫秒访问延迟，延迟时间上下浮动 1000 毫秒。

**实验参数**

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

**开始实验**

`delay_container_network_by_id.yaml` 内容：

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

获取 Pod 名称和 container id：

```bash
$ kubectl get pod redis-master-68857cd57c-hknb6 -o custom-columns=POD_NAME:.metadata.name,CONTAINER:.status.containerStatuses[0].name,ID:.status.containerStatuses[0].containerID
```

修改 `delay_container_network_by_id.yaml` 中的 `container-ids` 和 `names`。

执行命令，开始实验：

```bash
$ kubectl apply -f delay_container_network_by_id.yaml
```

**查看实验状态**

执行 `kubectl get blade delay-container-network-by-id -o json` 命令，查看实验状态.

**观测结果**

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

![container 网络延迟场景](https://tva4.sinaimg.cn/large/ad5fbf65gy1ghh7s2brmxg20si05w16r.gif)

可以看到结果符合预期。

**停止实验**

执行命令：`kubectl delete -f delay_container_network_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade delay-container-network-by-id`

#### container 网络丢包场景

**实验目标**：对 chaosblade 命名空间中，对 `redis-master-68857cd57c-hknb6` Pod 中 container id 是 `02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e` 的容器注入丢包率 100% 的故障，只针对 IP 为 `10.42.0.26` 的 pod 生效，也就是除 `10.42.0.26` 以外的 pod 都能正常访问 `redis-master-68857cd57c-hknb6`。

**实验参数**

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

**开始实验**

`loss_container_network_by_id.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-container-network-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: loss
    desc: "loss container network by container id"
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
    - name: interface
      value: ["eth0"]
    - name: percent
      value: ["100"]
    - name: timeout
      value: ["60"]
    - name: destination-ip
      value: ["10.42.0.26"]
```

获取 pod 名称和 container id 内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f loss_container_network_by_id.yaml
```

**查看实验状态**

执行 `kubectl get blade loss-container-network-by-id -o json` 命令，查看实验状态。

**观测结果**

```bash
# 获取实验 pod ip
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..status.podIP}
10.42.0.19
# 进入观测 pod，IP为：10.42.0.26（被设置丢包率 100%）
$ kubectl exec -it redis-slave-55d8c8ffbd-jd8sm bash
# Ping 实验Pod ip
$ ping 10.42.0.19
PING 10.42.0.19 (10.42.0.19) 56(84) bytes of data.
# 无响应

# 进入观测 pod，该 pod 未被指定丢包
$ kubectl exec -it redis-slave-55d8c8ffbd-22tsc bash
# Ping 实验Pod ip
$ ping 10.42.0.19
PING 10.42.0.19 (10.42.0.19) 56(84) bytes of data.
64 bytes from 10.42.0.19: icmp_seq=1 ttl=64 time=0.065 ms
64 bytes from 10.42.0.19: icmp_seq=2 ttl=64 time=0.051 ms
64 bytes from 10.42.0.19: icmp_seq=3 ttl=64 time=0.078 ms
...
# 响应正常
```

![container 网络丢包场景](https://tva3.sinaimg.cn/large/ad5fbf65gy1ghh7th88pmg20si06au0x.gif)

这里在配置中还将 `timeout` 设置为 60 秒，60 秒后 100% 丢包的情况将会消失，这个配置是为了防止因丢包率设置太高，造成机器无法连接的情况。与其有相似功能的还有 `exclude-port`，该配置用来指定排除掉的丢包端口。

**停止实验**

执行命令：`kubectl delete -f loss_container_network_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade loss-container-network-by-id`

#### container 域名访问异常场景

**实验目标**：本实验通过修改本地的 hosts，篡改域名地址映射，模拟 container 内域名访问异常场景。

**实验参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 域名 (必要参数) |
| `ip` | string | 映射的 ip (必要参数) |
| `timeout` | string | 设定运行时长，单位是秒，通用参数。 |

**开始实验**

`tamper_container_dns_by_id.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: tamper-container-dns-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: dns
    desc: "tamper container dns by id"
    matchers:
    - name: container-ids
      value:
      - "02655dfdd9f0f712a10d63fdc6721f4dcee0a390e37717fff068bf3f85abf85e"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
      # pod names
    - name: names
      value: ["redis-master-68857cd57c-hknb6"]
      # or use pod labels
    - name: namespace
      value: ["chaosblade"]
```

获取 pod 名称和 container id 内容同上。

执行命令，开始实验：

```bash
$ kubectl apply -f tamper_container_dns_by_id.yaml
```

**查看实验状态**

执行 `kubectl get blade tamper-container-dns-by-id -o json` 命令，查看实验状态.

**观测结果**

```bash
# 进入实验 pod
$ kubectl exec -it redis-master-68857cd57c-hknb6 bash
# Ping www.baidu.com
$ ping www.baidu.com
# 无响应
```

![container 域名访问异常场景](https://tva2.sinaimg.cn/large/ad5fbf65gy1ghh7wcg01ng20si06ah3v.gif)

可以看到 Pod 的 `/etc/hosts` 文件被修改，模拟了 dns 解析异常的场景。

### container 内进程场景

#### 杀 container 内指定进程

此实验会删除指定容器中的 `redis-server` 进程。

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `count` | string | 限制杀掉进程的数量，0 表示无限制 |
| `signal` | string | 指定杀进程的信号量，默认是 9，例如 --signal 15 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

**开始实验**

`kill_container_process_by_id.yaml` 内容：

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

选择一个 pod，获取容器 ID ，修改 `kill_container_process_by_id.yaml` 中的 `container-ids` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f kill_container_process_by_id.yaml
```

**查看实验状态**

执行 `kubectl get blade kill-container-process-by-id -o json` 命令，查看实验状态。

**观测结果**

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

![杀 container 内指定进程](https://tva4.sinaimg.cn/large/ad5fbf65gy1ghh7y7r2nmg20r0068wxo.gif)

容器 id 变化，主进程被杀掉后容器进行了重启，符合实验逾期。

`redis-server` 的进程号发生改变，说明被杀掉后，又被重新拉起。

**停止实验**

执行命令：`kubectl delete -f kill_container_process_by_id.yaml`

或者直接删除 blade 资源：`kubectl delete blade kill-container-process-by-id`

#### 挂起 container 内指定进程

此实验会挂起指定容器中的 `redis-server` 进程。

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `process` | string | 进程关键词，会在整个命令行中查找 |
| `process-cmd` | string | 进程命令，只会在命令中查找 |
| `timeout` | string | 设定运行时长，单位是秒，通用参数|

**开始实验**

`stop_container_process_by_names.yaml` 内容：

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

选择一个节点，修改 `stop_container_process_by_names.yaml` 中的 `names` 值。

执行命令，开始实验：

```bash
$ kubectl apply -f stop_container_process_by_names.yaml
```

**查看实验状态**

执行 `kubectl get blade stop-container-process-by-names -o json` 命令，查看实验状态。

**观测结果**

```bash
# 进入实验 pod
$ kubectl exec -it redis-slave-55d8c8ffbd-4pz8m bash
# 查看 redis-server 进程号
$ ps aux| grep redis-server
root      5632  0.0  0.0  41520  4168 ?        Tl   06:28   0:06 redis-server *:6379
```

可以看到 `redis-server` 此刻进程处于暂停状态了（T）。

![挂起 container 内指定进程](https://tva3.sinaimg.cn/large/ad5fbf65gy1ghh8090cr1g20t406y1kx.gif)

**停止实验**

执行命令：`kubectl delete -f stop_container_process_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade stop-container-process-by-names`

## 结语

仔细看过前面几篇文章的同学获取会发现，不同场景的混沌实验中的参数与操作方式有些类似。其实对于这些在不同场景，比如 Pod、Node 和 Container 中进行混沌实验的实现是一致的，都是基于 `blade` 这个 CLI 工具，只对对其在不同场景进行了不同的封装，这就涉及到了混沌工程实验规范，下篇文章我们就来谈谈**混沌工程模型**和**混沌工程实验规范**，看看混沌工程的实现应该遵循怎么样的模型和规范。
