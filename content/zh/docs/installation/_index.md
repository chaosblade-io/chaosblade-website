---
title: "安装部署"
linkTitle: "安装部署"
weight: 1
type: docs
description: >
  ChaosBlade CLI 和 ChaosBlade Operator 安装方式。
---

## CLI 安装

### 下载 chaosblade

获取 chaosblade 最新的 [release](https://github.com/chaosblade-io/chaosblade/releases) 包，目前支持的平台是 linux/amd64 和 darwin/64，下载对应平台的包。

下载完成后解压即可，无需编译。

### 使用 chaosblade

进入解压后的文件夹，可以看到以下内容：

```
├── bin
│   ├── chaos_burncpu
│   ├── chaos_burnio
│   ├── chaos_changedns
│   ├── chaos_delaynetwork
│   ├── chaos_dropnetwork
│   ├── chaos_filldisk
│   ├── chaos_killprocess
│   ├── chaos_lossnetwork
│   ├── jvm.spec.yaml
│   └── tools.jar
├── blade
└── lib
    └── sandbox

```
其中 blade 是可执行文件，即 chaosblade 工具的 cli，混沌实验执行的工具。执行 `./blade help` 可以查看支持命令有哪些：

```
An easy to use and powerful chaos engineering experiment toolkit

Usage:
  blade [command]

Available Commands:
  create      Create a chaos engineering experiment
  destroy     Destroy a chaos experiment
  help        Help about any command
  prepare     Prepare to experiment
  revoke      Undo chaos engineering experiment preparation
  status      Query preparation stage or experiment status
  version     Print version info

Flags:
  -d, --debug   Set client to DEBUG mode
  -h, --help    help for blade

Use "blade [command] --help" for more information about a command.
```

## Operator 安装

在 Kubernetes 平台上运行 ChaosBlade，请使用 ChaosBlade Operator。

ChaosBlade Operator 需要使用 Helm 安装，进入 [release 页面](https://github.com/chaosblade-io/chaosblade-operator/releases) 下载安装包（ChaosBlade 还提供了阿里云 OSS 的下载地址，提升国内下载速度）。

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

{{% pageinfo color="primary" %}}
ChaosBlade Operator 启动后将会在每个节点部署一个 `chaosblade-tool` Pod 和一个 `chaosblade-operator` Pod，如果都运行正常，则安装成功。上面设置 `--set webhook.enable=true` 是为了进行 Pod 文件系统 I/O 故障实验，如果不需要进行该实验，则无需添加该设置。
{{% /pageinfo %}}

### 卸载

执行 `helm del --purge chaosblade-operator` 卸载即可，将会停止全部实验，删除所有创建的资源。
