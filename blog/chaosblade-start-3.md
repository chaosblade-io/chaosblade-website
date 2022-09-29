---
authors: guoxudong
title: ChaosBlade：从零开始的混沌工程（三）
tags: [ chaosblade ]
hide_table_of_contents: false
---

![chaosblade](https://static001.geekbang.org/infoq/69/69cc78aa343e945eef5e20624f60af4e.png)

## 前言

在上篇文章中，我们介绍了如何安装 **ChaosBlade Operator**，并进行了简单的使用。从本章开始，所有的实践章节，都会有配套的 [katacode](https://katacoda.com/) 交互式教程，读者可用通过 katacode，在浏览器上操作真实的 Kubernetes 和 ChaosBlade。

{{% pageinfo color="primary" %}}
> KataCoda 教程：《ChaosBlade Pod 实验场景》
>
> 地址：[https://katacoda.com/guoxudong/courses/chaosblade/pod-experiment](https://katacoda.com/guoxudong/courses/chaosblade/pod-experiment)
{{% /pageinfo %}}

## 实验对象：Pod

Pod 是 Kubernetes 应用程序的基本执行单元，即它是 Kubernetes 对象模型中创建或部署的最小和最简单的单元。Pod 表示在 集群 上运行的进程。

Pod 封装了应用程序容器（或者在某些情况下封装多个容器）、存储资源、唯一网络 IP 以及控制容器应该如何运行的选项。 Pod 表示部署单元：Kubernetes 中应用程序的单个实例，它可能由单个 容器 或少量紧密耦合并共享资源的容器组成。

## Pod 实验场景

Pod 作为 Kubernetes 最基本的执行单元，对于 Kubernetes 集群来说十分重要。那么对于混沌工程，从 Pod 入手实践就再合适不过了。

>本篇默认已安装 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 应用和 ChaosBlade Operator。

### 删除 Pod 场景

**实验目标**：删除 `chaosblade` 命名空间下标签是 `role=master` 的 pod。

**执行观测**

开始观察需要删除的 pod：

```bash
$ kubectl get pod -l "role=master" -n chaosblade -w
```

**开始实验**

`delete_pod_by_labels.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delete-two-pod-by-labels
spec:
  experiments:
  - scope: pod
    target: pod
    action: delete
    desc: "delete pod by labels"
    matchers:
    - name: labels
      value:
      - "role=master"
    - name: namespace
      value:
      - "chaosblade"
    - name: evict-count
      value:
      - "2"
```

新建终端，并开始实验：

```bash
$ kubectl apply -f delete_pod_by_labels.yaml
```

**查看实验状态**

执行命令：`kubectl get blade delete-two-pod-by-labels -o json`，查看实验状态。

**查看实验结果**

通过上面的观测命令，可以看到 pod 被删除并重启，结果符合预期。

![](https://tva2.sinaimg.cn/large/ad5fbf65ly1gft22n0pnpg20pg06qhdt.gif)

**停止实验**

执行命令：`kubectl delete -f delete_pod_by_labels.yaml`

或者直接删除 blade 资源：`kubectl delete blade delete-two-pod-by-labels`

### Pod 网络延迟场景

**实验目标**：在 chaosblade 命名空间中，对 `redis-master-68857cd57c-dzbs9` Pod 的本地 6379 端口添加 3000 毫秒访问延迟，延迟时间上下浮动 1000 毫秒。

**开始实验**

`delay_pod_network_by_names.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delay-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: delay
    desc: "delay pod network by names"
    matchers:
    - name: names
      value:
      - "redis-master-68857cd57c-dzbs9"
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

获取 Pod 名称：

```bash
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..metadata.name}
```

修改 `delay_pod_network_by_names.yaml` 中的 `name` 字段的值。

执行命令，开始实验：

```bash
$ kubectl apply -f delay_pod_network_by_names.yaml
```

**查看实验状态**

执行 `kubectl get blade delay-pod-network-by-names -o json` 命令，查看实验状态。

**观测结果**

```bash
# 获取实验 pod ip
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..status.podIP}
10.42.69.44
# 进入观测 pod
$ kubectl exec -it redis-slave-6dd975d4c8-2zrkb bash
# 在 pod 中安装 telnet
$ apt-get update && apt-get install -y telnet
# 测试时间
$ time echo "" | telnet 10.42.69.44 6379
Trying 10.42.69.44...
Connected to 10.42.69.44.
Escape character is '^]'.
Connection closed by foreign host.

real    0m3.790s
user    0m0.007s
sys     0m0.001s
```

可以看到访问实验 pod 6379 端口的延迟为 3s 左右，结果符合预期。

![delay-pod-network](https://tva4.sinaimg.cn/large/ad5fbf65ly1gft27x90skg20p606c1kx.gif)

**停止实验**

执行命令：`kubectl delete -f delay_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade delay-pod-network-by-names`

### Pod 网络丢包场景

**实验目标**：在 chaosblade 命名空间中，对 `redis-master-68857cd57c-dzbs9` Pod 注入丢包率 100% 的故障，只针对 IP 为 10.42.69.42 的 pod 生效，也就是除 10.42.69.42 以外的 pod 都能正常访问 `redis-master-68857cd57c-dzbs9`。

**开始实验**

获取 pod 名称内容同上。

`loss_pod_network_by_names.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: loss
    desc: "loss pod network by names"
    matchers:
    - name: names
      value:
      - "redis-master-68857cd57c-dzbs9"
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
      value: ["10.42.69.42"]
```

执行命令，开始实验：

```bash
$ kubectl apply -f loss_pod_network_by_names.yaml
```

**查看实验状态**

执行 `kubectl get blade loss-pod-network-by-names -o json` 命令，查看实验状态。

**观测结果**

```bash
# 获取实验 pod ip
$ kubectl get pod -l app=redis,role=master -o jsonpath={.items..status.podIP}
10.42.69.44
# 进入观测 pod，IP为：10.42.69.42（被设置丢包率 100%）
$ kubectl exec -it redis-slave-6dd975d4c8-lm8jz bash
# Ping 实验Pod ip
$ ping 10.42.69.44
PING 10.42.69.44 (10.42.69.44) 56(84) bytes of data.
# 无响应

# 进入观测 pod，该 pod 未被指定丢包
$ kubectl exec -it redis-slave-6dd975d4c8-2zrkb bash
# Ping 实验Pod ip
$ ping 10.42.69.44
PING 10.42.69.44 (10.42.69.44) 56(84) bytes of data.
64 bytes from 10.42.69.44: icmp_seq=1 ttl=63 time=0.128 ms
64 bytes from 10.42.69.44: icmp_seq=2 ttl=63 time=0.128 ms
64 bytes from 10.42.69.44: icmp_seq=3 ttl=63 time=0.092 ms
...
# 响应正常
```

可以看到观测 pod 访问实验 pod 丢包率 100%（无法访问），而其他 pod 不受影响，结果符合预期。

![loss-pod-network](https://tvax2.sinaimg.cn/large/ad5fbf65ly1gft2c288oqg20p607i7wi.gif)

这里在配置中将 `timeout` 设置为 60 秒，60 秒后 100% 丢包的情况将会消失，这个配置是为了防止因丢包率设置太高，造成机器无法连接的情况。与其有相似功能的还有 `exclude-port`，该配置指定一些端口不会丢包，以免该 pod 失联。

**停止实验**

执行命令：`kubectl delete -f loss_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade loss-pod-network-by-names`)

### Pod 域名访问异常场景

**实验目标**：Pod 内访问指定域名异常。

**开始实验**

获取 pod 名称内容同上。

`dns_pod_network_by_names.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: dns-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: dns
    desc: "dns pod network by names"
    matchers:
    - name: names
      value:
      - "redis-slave-6dd975d4c8-lm8jz"
    - name: namespace
      value:
      - "chaosblade"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
```

执行命令，开始实验：

```bash
$ kubectl apply -f dns_pod_network_by_names.yaml
```

**查看实验状态**

执行 `kubectl get blade dns-pod-network-by-names -o json ` 命令，查看实验状态。

**观测结果**

```bash
# 进入实验 pod
$ kubectl exec -it redis-slave-6dd975d4c8-lm8jz bash
# Ping www.baidu.com
$ ping www.baidu.com
# 无响应
```

可以看到访问指定域名 `www.baidu.com` 异常，结果符合预期。

![dns-pod-network](https://tvax1.sinaimg.cn/large/ad5fbf65ly1gft2hti44bg20p607i4nj.gif)

**停止实验**

执行命令：`kubectl delete -f dns_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade dns-pod-network-by-names`

### Pod 文件系统 I/O 故障场景

**实验目标**：给 kubernetes 的 pod 注入文件系统I/O故障。

>注意：此场景需要激活 `--webhook-enable` 参数，如需使用此功能，请在 chaosblade-operator 参数中添加 `--webhook-enable`，或者在安装时指定：例如 helm 安装时添加 `--set webhook.enable=true` 指定。

**前提条件**

- 集群中部署了 `chaosblade-admission-webhook`
- 需要注入故障的 `volume` 设置 `mountPropagation` 为 `HostToContainer`
- pod上面添加了如下annotations:
    ```yaml
    chaosblade/inject-volume: "data" //需要注入故障的volume name
    chaosblade/inject-volume-subpath: "conf" //volume挂载的子目录
    ```

**部署测试 pod**

chaosblade webhook 会根据 pod 的 annotation，注入 fuse 的 sidecar 容器：

1. `chaosblade/inject-volume` 指明需要注入故障的 volume name，比如例子中的 `data`。
2. `chaosblade/inject-volume-subpath` 指明 volume 挂载路径的子目录。上面的例子中，volume 的挂载路径是 `/data`,子目录是 `conf`，则在 pod 内，注入I/O异常的目录是 `/data/conf`。
3. 指定需要注入故障的 volume 需要指定 `mountPropagation：HostToContainer`，这个字段的含义可以参考官方文档 [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation)。

```bash
# 部署测试 pod
$ kubectl apply -f io-test-pod.yaml
# 查看 sidecar 是否注入成功
$ kubectl get pod test-7c9fc6fd88-7lx6b -n chaosblade
NAME                    READY   STATUS    RESTARTS   AGE
test-7c9fc6fd88-7lx6b   2/2     Running   0          4m8s
```

**开始实验**

`pod_io.yaml` 内容：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: inject-pod-by-labels
spec:
  experiments:
  - scope: pod
    target: pod
    action: IO
    desc: "Pod IO Exception by labels"
    matchers:
    - name: labels
      value:
      - "app=test"
    - name: namespace
      value:
      - "chaosblade"
    - name: method
      value:
      - "read"
    - name: delay
      value:
      - "1000"
    - name: path
      value:
      - ""
    - name: percent
      value:
      - "60"
    - name: errno
      value:
      - "28"
```

执行命令，开始实验：
```bash
$ kubectl apply -f pod_io.yaml
```

**查看实验状态**

执行 `kubectl get blade inject-pod-by-labels -o json ` 命令，查看实验状态。

**观测结果**

```bash
# 进入实验 pod
$ kubectl exec -it test-7c9fc6fd88-7lx6b bash
# 在 pod 内读取指定目录中的文件，如果没有可以新建一个
$ time cat /data/conf/test.yaml
cat: read error: No space left on device

real    0m3.007s
user    0m0.002s
sys     0m0.002s
# 因为有重试，显示有 3s 的延迟
# 因为设置了 60% 的异常，所有还是有成功的情况
$ time cat /data/conf/test.yaml
123

real    0m0.004s
user    0m0.002s
sys     0m0.000s
```

文件读取异常，结果符合预期。

![io-pod-read](https://tvax4.sinaimg.cn/large/ad5fbf65ly1gft2pqli3ug20p607i7nk.gif)

在本例中，我们对 read 操作注入两种异常，异常率为百分之60:

- 对 `read` 操作增加 1s 的延迟。
- 对 `read` 操作返回错误 `28`。

这里只是做了一种类型的实验，更多的实验类型详见[官方文档](https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/blade-create-k8s/blade-create-k8s-pod-io)。

**停止实验**

执行命令：`kubectl delete -f pod_io.yaml`

或者直接删除 blade 资源：`kubectl delete blade inject-pod-by-labels`

删除测试 pod：`kubectl delete -f io-test-pod.yaml`

## 结语

本篇我们使用 ChaosBlade Operator 对 Kubernetes Pod 资源进行混沌工程实验，可以看到 ChaosBlade 的操作简单易懂且功能强大，通过模拟不同的故障，可以检验我们系统监控报警的时效性，也可以检验我们系统在遇到故障时的情况，根据这些情况对系统进行调整，从而完善系统架构，增加可用性。

这里只是对于每种场景进行了简单的实验，而每个场景不止有一种实验方式，用户可以通过调整参数进行不同的实验。
