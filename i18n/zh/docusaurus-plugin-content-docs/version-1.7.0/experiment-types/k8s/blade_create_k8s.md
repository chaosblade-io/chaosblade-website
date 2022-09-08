---
id: blade create k8s 
---

# Kubernetes实验场景

## 介绍
创建 kubernetes 相关的实验场景，除了使用 blade 命令创建场景外，还可以将实验使用 yaml 文件描述，使用 kubectl 命令执行。目前支持的实验场景如下：
* [blade create k8s node-cpu](/docs/experiment-types/k8s/blade%20create%20k8s%20node-cpu) Node 节点 CPU 负载场景
* [blade create k8s node-network](/docs/experiment-types/k8s/blade%20create%20k8s%20node-network) Node 节点网络场景
* [blade create k8s node-process](/docs/experiment-types/k8s/blade%20create%20k8s%20node-process) Node 节点进程场景
* [blade create k8s node-disk](/docs/experiment-types/k8s/blade%20create%20k8s%20node-disk) Node 节点磁盘场景
* [blade create k8s pod-pod](/docs/experiment-types/k8s/blade%20create%20k8s%20pod-pod) Pod 资源场景，比如杀 Pod
* [blade create k8s pod-network](/docs/experiment-types/k8s/blade%20create%20k8s%20pod-network) Pod 网络资源场景，比如网络延迟
* [blade create k8s pod-IO](/docs/experiment-types/k8s/blade%20create%20k8s%20pod-IO) Pod IO 文件系统异常场景
* [blade create k8s pod-fail](/docs/experiment-types/k8s/blade%20create%20k8s%20pod-fail) Pod 不可用异常场景
* [blade create k8s container-container](/docs/experiment-types/k8s/blade%20create%20k8s%20container-container) Container 资源场景，比如杀容器
* [blade create k8s container-cpu](/docs/experiment-types/k8s/blade%20create%20k8s%20container-cpu) 容器内 CPU 负载场景
* [blade create k8s container-network](/docs/experiment-types/k8s/blade%20create%20k8s%20container-network) 容器内网络场景
* [blade create k8s container-process](/docs/experiment-types/k8s/blade%20create%20k8s%20container-process) 容器内进程场景

## 部署
执行 Kubernetes 实验场景，需要提前部署 ChaosBlade Operator，Helm 安装包下载地址：https://github.com/chaosblade-io/chaosblade-operator/releases 。使用以下命令安装:

 ```
 helm install --namespace kube-system --name chaosblade-operator chaosblade-operator-<VERSION>.tgz
 ```
 
会安装在 kube-system 命令空间下。ChaosBlade Operator 启动后会在每个节点部署 chaosblade-tool Pod 和一个 chaosblade-operator Pod.可通过以下命令查看安装结果:
```
kubectl get pod -n kube-system -o wide | grep chaosblade
```

![install-result](https://user-images.githubusercontent.com/3992234/68177275-c4ae3400-ffc2-11e9-9306-77956412242e.png)

如果显示 chaosblade-operator 和 chaosblade-tool Pod 都处于 Running 状态，说明部署成功，如果部署出现问题，可详见下发的QA。

## 创建实验
执行方式有两种，一是通过配置 yaml 方式，使用 kubectl 执行，另一种是直接使用 chaosblade 包中的 blade 命令执行，下面以指定一台节点，做 CPU 负载 80% 实验举例。

**yaml 配置方式** 
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: cpu-load
spec:
  experiments:
  - scope: node
    target: cpu
    action: fullload
    desc: "increase node cpu load by names"
    matchers:
    - name: names
      value:
      - "cn-hangzhou.192.168.0.205"
    - name: cpu-percent
      value:
      - "80"
```
例如配置好文件后，保存为 chaosblade_cpu_load.yaml，使用以下命令执行实验场景：
 ```
 kubectl apply -f chaosblade_cpu_load.yaml
 ```
 可通过以下命令查看每个实验的执行状态：
 ```
 kubectl get blade cpu-load -o json
 ``` 
更多的实验场景配置事例可查看: https://github.com/chaosblade-io/chaosblade-operator/tree/master/examples

**blade 命令执行方式**
下载 chaosblade 工具包，下载地址：https://github.com/chaosblade-io/chaosblade/releases ，解压即可使用。还是上述例子，使用 blade 命令执行如下：
```shell
blade create k8s node-cpu fullload --names cn-hangzhou.192.168.0.205 --cpu-percent 80 --kubeconfig ~/.kube/config 
```
使用 blade 命令执行，如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID，使用查询命令可以查询详细的实验结果：
```
blade query k8s create <UID>
```

## 修改实验
yaml 配置文件的方式支持场景动态修改，比如将上述的 cpu 负载调整为 60%，则只需将上述 value 的值从 80 改为 60 即可，例如：
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: cpu-load
spec:
  experiments:
  - scope: node
    target: cpu
    action: fullload
    desc: "increase node cpu load by names"
    matchers:
    - name: names
      value:
      - "cn-hangzhou.192.168.0.205"
    - name: cpu-percent
      value:
      - "80"
```
然后使用 `kubeclt apply -f chaosblade_cpu_load.yaml` 命令执行更新即可。

## 销毁实验
可以通过以下三种方式停止实验：
**根据实验资源名停止**
比如上述 cpu-load 场景，可以执行以下命令停止实验
```
kubectl delete chaosblade cpu-load
```

**通过 yaml 配置文件停止**
指定上述创建好的 yaml 文件进行删除，命令如下：
```
kubectl delete -f chaosblade_cpu_load.yaml
```

**通过 blade 命令停止**
此方式仅限使用 blade 创建的实验，使用以下命令停止：
```
blade destroy <UID>
```
UID 是执行 blade create 命令返回的结果，如果忘记，可使用 blade status --type create 命令查询

## 卸载
执行 `helm del --purge chaosblade-operator` 卸载即可，将会停止全部实验，删除所有创建的资源。

## 常见问题
Q:validation failure list:spec.experiments.matchers.value in body must be of type array: "string"
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

Q：{"code":800,"success":false,"error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","result":{"uid":"08dec77bd45c8e55","success":false,"error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","statuses":[{"id":"08dec77bd45c8e55","state":"Error","kind":"","error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","success":false}]}}
A：没有指定 --kubeconfig 文件路径

Q: {"code":504,"success":false,"error":"unexpected status, the real value is Error","result":{"uid":"78abb71fb0587c2e","success":false,"error":"unexpected status, the real value is Error","statuses":[{"state":"Error","kind":"","error":"must specify one flag in evict-count,evict-percent,labels,names","success":false}]}}
A: 缺少必要参数
