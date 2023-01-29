---
title: Environment Prepare
---

## Installation in Kubernetes Environment
### First， Kubernetes cluster prepared
Before using it, ensure that the **Kubernetes cluster** is deployed in the environment. If the Kubernetes cluster has not been deployed, you can follow the following links to complete the deployment:
- [Kubernetes](https://kubernetes.io/docs/setup/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [K3s](https://rancher.com/docs/k3s/latest/en/quick-start/)
- [Microk8s](https://microk8s.io/)
> ⚠️Attention：
> Your Kubernetes server version must be no less than version v1.16. Get version information，please enter `kubectl version`

### Second，Helm prepared
Ensure that it is installed in the environment [Helm](https://helm.sh/docs/intro/install/)。
To see if Helm is installed, run the following command:
```shell
helm version
```
Here is the expected output:
```shell
version.BuildInfo{Version:"v3.4.2", GitCommit:"23dd3af5e19a02d4f4baa5b2f242645a1a3af629", GitTreeState:"dirty", GoVersion:"go1.15.5"}
```

If your actual output is roughly the same as you expected, the Helm has been installed successfully.
> ️Attention：
> The commands in this article will use Helm v3 to manipulate the Chaos Mesh. If the version of Helm in your environment is v2, please refer to[将 Helm v2  migrate to v3](https://helm.sh/docs/topics/v2_v3_migration/)Or change  values in the format of v2.


