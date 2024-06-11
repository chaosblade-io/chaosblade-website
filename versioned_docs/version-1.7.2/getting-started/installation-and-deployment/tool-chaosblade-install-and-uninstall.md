---
title: Tool ChaosBlade Install And Uninstall
sidebar_position: 2
---

This document describes how to install the Chaos Engineering tool : ChaosBlade
## Install on a host
### Install and download the command line toolkit
ChaosBlade is an end - side command line tool that supports cli commands. So in a host environment, you just need to add [Chaosblade Releases](https://github.com/chaosblade-io/chaosblade/releases) The binary package can be downloaded to the corresponding folder and decompressed. As `1.17.0 amd64`example：
```shell
# 1. download tar
wget https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.2/chaosblade-1.7.2-linux-amd64.tar.gz

# 2. unzip and entry chaosblade directory
tar -xvf chaosblade-1.7.2-linux-amd64.tar.gz && cd chaosblade-1.7.2/
```
### Verify installation
To check whether the installation is successful, run the following command:
```shell
./blade v
```
Here is the expected output：
```shell
version: 1.7.2
env: #1 SMP Thu Mar 17 17:08:06 UTC 2022 x86_64
build-time: Tue Sep  6 07:06:55 UTC 2022
```
### Uninstallation and Installation
You only need to delete the downloaded and decompressed toolkit
```shell
rm -rf chaosblade-1.7.2*
```
##  Installation in Kubernetes Environment
### Environment Preparation
For details, see ：[Prepare the Kubernetes installation  environment](./environment-prepare.md/#Prepare the kubernetes installation environment)
### Install with Helm
#### First, download the ChaosBlade Operator Chart package
See all available for download [chaosblade-release](https://github.com/chaosblade-io/chaosblade/releases)，Download to local，as `1.7.2 amd64`example：
```shell
wget https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.2/chaosblade-operator-1.7.2.tgz
```
#### Second，Performing the installation
```shell
helm install chaosblade-operator chaosblade-operator-1.7.2.tgz --namespace chaosblade
```
### Verify installation
To see how the Box is running, run the following command:
```shell
kubectl get po -n chaosblade
```
Here is the expected output
```shell
NAME                                    READY   STATUS    RESTARTS   AGE
chaosblade-operator-688568959-lcwgb     1/1     Running   0          6s
chaosblade-tool-c9xjd                   1/1     Running   0          6s
chaosblade-tool-hvqcv                   1/1     Running   0          6s
chaosblade-tool-q8jjd                   1/1     Running   0          6s
```

If your actual output matches the expected output, ChaosBlade has been installed successfully.
> ⚠️Attention 
> If the actual output **STATUS** is not Running, you need to run the following command to view Pod details, and then troubleshoot the problem according to the error message

```shell
# as chaosblade-operator example
kubectl describe po chaosblade-operator-688568959-lcwgb -n chaosblade
```
###  Uninstall ChaosBlade
To uninstall ChaosBlade, run the following command:
```shell
helm un chaosblade-operator -n chaosblade
```
After the uninstallation, you can check whether crd resources are also deleted:
```shell
kubectl get crds | grep chaos
```
If blade crd resource still exists, it can be deleted by the following command:
```shell
kubectl delete crd chaosblades.chaosblade.io
```
If the crd resource fails to be deleted for a long time, run the following command to delete it:
```shell
blades=$(kubectl get blade | grep -v NAME | awk '{print $1}' | tr '\n' ' ') && kubectl patch blade $blades --type merge -p '{"metadata":{"finalizers":[]}}'
```
