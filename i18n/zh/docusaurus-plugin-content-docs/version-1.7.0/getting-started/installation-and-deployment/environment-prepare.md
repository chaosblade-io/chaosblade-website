---
title: 环境准备
---

## Kubernetes下安装环境准备
### 第一步， Kubernetes 集群准备
在使用之前，请先确保环境中已经部署 Kubernetes 集群。如果尚未部署 Kubernetes 集群，可以参考以下链接完成部署：

- [Kubernetes](https://kubernetes.io/docs/setup/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [K3s](https://rancher.com/docs/k3s/latest/en/quick-start/)
- [Microk8s](https://microk8s.io/)
> ⚠️注意：
> 您的 Kubernetes 服务器版本必须不低于版本 v1.16. 要获知版本信息，请输入 `kubectl version`

### 第二步，Helm准备
确保环境中已经安装 [Helm](https://helm.sh/docs/intro/install/)。
如要查看 Helm 是否已经安装，请执行如下命令：
```shell
helm version
```
以下是预期输出：
```shell
version.BuildInfo{Version:"v3.4.2", GitCommit:"23dd3af5e19a02d4f4baa5b2f242645a1a3af629", GitTreeState:"dirty", GoVersion:"go1.15.5"}
```
如果你的实际输出与预期输出大体一致，表示 Helm 已经成功安装。
> 注意
> 本文中的命令将会使用 Helm v3 来操作 Chaos Mesh。如果你的环境中 Helm 的版本为 v2，请参考[将 Helm v2 迁移到 v3](https://helm.sh/docs/topics/v2_v3_migration/)或按照 v2 的格式进行修改。


