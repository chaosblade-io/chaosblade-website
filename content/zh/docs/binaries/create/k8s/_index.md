---
title: "kubernetes 实验场景"
linkTitle: "kubernetes 实验场景"
weight: 7
type: docs
description: > 
    kubernetes 相关的实验场景
---
## 介绍

创建 kubernetes 相关的实验场景，除了使用 blade 命令创建场景外，还可以将实验使用 yaml 文件描述，使用 kubectl 命令执行。

更详细 Kubernetes 平台实验场景介绍见：[Kubernetes 平台场景](../../../operator/)

## 部署

执行 Kubernetes 实验场景，需要提前部署 ChaosBlade Operator，Helm 安装包下载地址：[https://github.com/chaosblade-io/chaosblade-operator/releases](https://github.com/chaosblade-io/chaosblade-operator/releases) 。

部署方式见[安装部署](../../../installation/#operator-安装)。

## 创建实验

执行方式有两种，一是通过配置 yaml 方式，使用 kubectl 执行，另一种是直接使用 chaosblade 包中的 blade 命令执行。

配置 yaml 使用 kubectl 执行方式见：[Kubernetes 平台场景](../../../operator)

### blade 命令执行方式

下载 chaosblade 工具包，下载地址：[https://github.com/chaosblade-io/chaosblade/releases](https://github.com/chaosblade-io/chaosblade/releases) ，解压即可使用。还是上述例子，使用 `blade` 命令执行如下：

```shell
blade create k8s node-cpu fullload --names cn-hangzhou.192.168.0.205 --cpu-percent 80 --kubeconfig ~/.kube/config
```

使用 blade 命令执行，如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID，使用查询命令可以查询详细的实验结果：

```
blade query k8s create <UID>
```

## 销毁实验

可以通过以下三种方式停止实验：

### 根据实验资源名停止

比如上述 cpu-load 场景，可以执行以下命令停止实验

```shell
kubectl delete chaosblade cpu-load
```

### 通过 yaml 配置文件停止

指定上述创建好的 yaml 文件进行删除，命令如下：

```shell
kubectl delete -f chaosblade_cpu_load.yaml
```

### 通过 blade 命令停止

此方式仅限使用 blade 创建的实验，使用以下命令停止：

```shell
blade destroy <UID>
```

`<UID>` 是执行 `blade create` 命令返回的结果，如果忘记，可使用 `blade status --type create` 命令查询。

## 常见问题
Q: `validation failure list:spec.experiments.matchers.value in body must be of type array: "string"`

A: 所有 matchers 中 value 参数必须是字符串数组，例如：

```yaml
- name: names
  value: ["cn-hangzhou.192.168.0.205"]
```

或者

```yaml
- name: names
  value: 
  - "cn-hangzhou.192.168.0.205"
```

Q：`{"code":800,"success":false,"error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","result":{"uid":"08dec77bd45c8e55","success":false,"error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","statuses":[{"id":"08dec77bd45c8e55","state":"Error","kind":"","error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","success":false}]}}`

A：没有指定 `--kubeconfig` 文件路径

Q: `{"code":504,"success":false,"error":"unexpected status, the real value is Error","result":{"uid":"78abb71fb0587c2e","success":false,"error":"unexpected status, the real value is Error","statuses":[{"state":"Error","kind":"","error":"must specify one flag in evict-count,evict-percent,labels,names","success":false}]}}`

A: 缺少必要参数
