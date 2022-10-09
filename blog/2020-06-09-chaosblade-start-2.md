---
authors: guoxudong
title: ChaosBlade：从零开始的混沌工程（二）
tags: [ chaosblade ]
hide_table_of_contents: false
---

## 前言

在上篇文章中，我们介绍了**混沌工程**以及 **ChaosBlade**。从本篇开始，从 ChaosBlade 的安装部署，到实验的创建销毁，在实践的角度，一步步的完成各种混沌实验，深入认识和使用混沌工程。
<!--truncate-->

## ChaosBlade-Operator

[ChaosBlade-Operator](https://github.com/chaosblade-io/chaosblade-operator) 是 ChaosBlade 的 Kubernetes 平台实验场景实现。将混沌实验通过 Kubernetes 标准的 CRD 方式定义，用户可以像定义 Deployment 或 StatefulSet 那样定义 ChaosBlade 实验，只要对 `kubectl` 和 Kubernetes 对象有所了解，就可以轻松的创建、更新和删除实验场景；同时也可以通过 chaosblade cli 工具来操作实验场景。

### 安装

ChaosBlade-Operator 需要使用 Helm 安装，进入 [release 页面](https://github.com/chaosblade-io/chaosblade-operator/releases) 下载安装包（ChaosBlade 还提供了阿里云 OSS 的下载地址，提升国内下载速度）。

使用 Helm 3 安装：
```bash
# 下载安装包
$ wget -qO chaosblade-operator-0.6.0.tgz https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/github/0.6.0/chaosblade-operator-0.6.0-v3.tgz
# 为 chaosblade 创建一个 namespace
$ kubectl create namespace chaosblade
# 安装 ChaosBlade-Operator
$ helm install chaos chaosblade-operator-0.6.0.tgz --set webhook.enable=true --namespace=chaosblade
# 查看安装结果
$ kubectl get pod -n chaosblade | grep chaosblade
chaosblade-operator-6b6b484599-gdgq8   1/1     Running   0          4d23h
chaosblade-tool-7wtph                  1/1     Running   0          4d20h
chaosblade-tool-r4zdk                  1/1     Running   0          4d23h
```

ChaosBlade-Operator 启动后将会在每个节点部署一个 `chaosblade-tool` Pod 和一个 `chaosblade-operator` Pod，如果都运行正常，则安装成功。上面设置 `--set webhook.enable=true` 是为了 Pod 文件系统 I/O 故障实验，如果不需要进行该实验，则无需添加该设置。

## 快速开始

下面就以 Pod 网络延迟实验为例，展示如何使用 ChaosBlade-Operator。

### 实验准备

实验前需要先准备实验对象，这里使用 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 应用。

**安装**

同样使用 Helm 3

```bash
# add repo
helm repo add apphub-incubator https://apphub.aliyuncs.com/incubator/
# 安装
helm install guestbook apphub-incubator/guestbook --set service.type=NodePort --namespace=chaosblade
```

默认的 Service 类型为 `LoadBalancer`，这里为了方便访问设置为了 `NodePort`。

### 开始实验

**实验目标：**对 chaosblade 命名空间中，对 `redis-master-68857cd57c-dzbs9` Pod 的本地 6379 端口添加 3000 毫秒访问延迟，延迟时间上下浮动 1000 毫秒。

**实验 yaml 配置**

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

将其保存为 `delay_pod_network_by_names.yaml` 并执行命令，开始实验：

```bash
$ kubectl apply -f delay_pod_network_by_names.yaml
```

### 查看实验状态

执行 `kubectl get blade delay-pod-network-by-names -o json` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"delay-pod-network-by-names\"},\"spec\":{\"experiments\":[{\"action\":\"delay\",\"desc\":\"delay pod network by names\",\"matchers\":[{\"name\":\"names\",\"value\":[\"redis-master-68857cd57c-dzbs9\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"local-port\",\"value\":[\"6379\"]},{\"name\":\"interface\",\"value\":[\"eth0\"]},{\"name\":\"time\",\"value\":[\"3000\"]},{\"name\":\"offset\",\"value\":[\"1000\"]}],\"scope\":\"pod\",\"target\":\"network\"}]}}\n"
        },
        "creationTimestamp": "2020-06-02T05:57:50Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "delay-pod-network-by-names",
        "resourceVersion": "7710394",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delay-pod-network-by-names",
        "uid": "1235ff55-8256-4caa-a371-e1abf6c9e7b7"
    },
    "spec": {
        "experiments": [
            {
                "action": "delay",
                "desc": "delay pod network by names",
                "matchers": [
                    {
                        "name": "names",
                        "value": [
                            "redis-master-68857cd57c-dzbs9"
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
                "scope": "pod",
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
                        "id": "a86f8cf8b68ace98",
                        "kind": "pod",
                        "name": "redis-master",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "619a19ceb213f9b6152159bd868e88de2ddbf9a8aac606dc274b34bec6510c60"
                    }
                ],
                "scope": "pod",
                "state": "Success",
                "success": true,
                "target": "network"
            }
        ],
        "phase": "Running"
    }
}
```

可以看到实验成功创建了。

### 观测结果

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

![](https://tva3.sinaimg.cn/large/ad5fbf65gy1gfm2deqtdwg20p606c1kx.gif)

可以看到结果符合预期。

**停止实验**

执行命令：`kubectl delete -f delay_pod_network_by_names.yaml`

或者直接删除 blade 资源：`kubectl delete blade delay-pod-network-by-names`

## 结语

本篇我们讲解了如何部署 ChaosBlade-Operator 并进行了简单的实验，可以看到在云原生场景下，ChaosBlade 依旧有着简单的操作方式，多种实验场景，并对混沌实验模型进行了标准化实现。很友好的将混沌实验模型与 Kubernetes 声明式设计结合在一起，依靠混沌实验模型便捷开发场景的同时，又可以很好的结合 Kubernetes 设计理念。
