---
title: 混沌工程工具ChaosBlade安装与卸载
---

本篇文档主要描述如何安装混沌工程工具ChaosBlade。
# 主机环境下安装
## 安装下载命令行工具包
ChaosBlade是一款可通过支持cli命令的端侧命令行工具。所以在主机环境下只需要将 [Chaosblade Releases](https://github.com/chaosblade-io/chaosblade/releases) 二进制包下载到对应文件夹中，并进行解压就可使用。以下以 `1.17.0 amd64`举例：
```shell
# 1. download tar
wget https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.0/chaosblade-1.7.0-linux-amd64.tar.gz

# 2. unzip and entry chaosblade directory
tar -xvf chaosblade-1.7.0-linux-amd64.tar.gz && cd chaosblade-1.7.0/
```
## 验证安装
查看是否安装成功，用以下命令进行验证：
```shell
./blade v
```
以下是预期输出：
```shell
version: 1.7.0
env: #1 SMP Thu Mar 17 17:08:06 UTC 2022 x86_64
build-time: Tue Sep  6 07:06:55 UTC 2022
```
## 卸载安装
只需要将下载和解压的工具包直接删除即可
```shell
rm -rf chaosblade-1.7.0*
```
#  Kubernetes环境下安装
## 环境准备
具体环境准备参见：[Kubernetes下安装环境准备](./environment-prepare.md/#kubernetes下安装环境准备)
## 使用Helm安装
### 第一步，下载Box Chart包
查看所有可以下载的 [chaosblade-release](https://github.com/chaosblade-io/chaosblade/releases)，下载到本地，以下`1.7.0 amd64`版本为例：
```shell
wget https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.0/chaosblade-operator-1.7.0.tgz
```
### 第二步，进行安装
```shell
helm install chaosblade-operator chaosblade-operator-1.7.0.tgz --namespace chaosblade
```
## 验证安装
要查看Box运行情况，请执行以下命令：
```shell
kubectl get po -n chaosblade
```
以下是预期输出
```shell
NAME                                    READY   STATUS    RESTARTS   AGE
chaosblade-operator-688568959-lcwgb     1/1     Running   0          6s
chaosblade-tool-c9xjd                   1/1     Running   0          6s
chaosblade-tool-hvqcv                   1/1     Running   0          6s
chaosblade-tool-q8jjd                   1/1     Running   0          6s
```
如果你的实际输出与预期输出相符，表示ChaosBlade-Box已经安装成功。
> ⚠️注意
> 如果实际输出的`STATUS` 状态不是 `Running`，则需要运行以下命令查看 Pod 的详细信息，然后依据错误提示排查并解决问题。

```shell
# 以chaosblade-operator为例
kubectl describe po chaosblade-operator-688568959-lcwgb -n chaosblade
```
##  卸载ChaosBlade
如果需要卸载ChaosBlade，请执行以下命令：
```shell
helm un chaosblade-operator -n chaosblade
```
卸载后可在查看crd资源是否也已经删除：
```shell
kubectl get crds | grep chaos
```
如果blade crd资源还存在可通过以下命令进行删除：
```shell
kubectl delete crd chaosblades.chaosblade.io
```
如果crd资源删除长时间没有成功，可通过以下命令进行删除：
```shell
blades=$(kubectl get blade | grep -v NAME | awk '{print $1}' | tr '\n' ' ') && kubectl patch blade $blades --type merge -p '{"metadata":{"finalizers":[]}}'
```
