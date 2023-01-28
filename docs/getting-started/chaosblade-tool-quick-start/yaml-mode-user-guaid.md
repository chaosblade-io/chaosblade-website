---
title: Yaml模式使用简介
---

本文档主要介绍如何通过 yaml 模式进行混沌工程实验
## 使用范围
用于 kubernetes环境下进行故障演练，使用 kubectl 命令执行
## 执行场景
可通过 `blade create k8s -h`命令进行查看 kubernetes 相关的实验场景
## 使用前提
目标的 Kubernetes 集群中已提前[部署 ChaosBlade Operator](https://chaosblade.io/docs/getting-started/installation-and-deployment/tool-chaosblade-install-and-uninstall#kubernetes%E7%8E%AF%E5%A2%83%E4%B8%8B%E5%AE%89%E8%A3%85)
## 准备实验yaml
以下用容器内 cpu 满载为例，以下 yaml 保存为`container-cpu.yaml`
```
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
    - name: container-names
      value:
      - "nginx"
    - name: cpu-percent
      value: ["100"]
      # pod names
    - name: names
      value: ["nginx-0"]
    - name: cgroup-root
      value: ["/host-sys/fs/cgroup"]
```
## 执行实验
使用以下命令执行实验场景
```
kubectl apply -f container-cpu.yaml
```
可通过以下命令查看每个实验的执行状态：
```
kubectl get blade cpu-load -o json
```
## 销毁实验
**根据实验资源名停止** 比如上述 `increase-container-cpu-load-by-id`场景，可以执行以下命令停止实验
```
kubectl delete chaosblade increase-container-cpu-load-by-id
```
**通过 yaml 配置文件停止** 指定上述创建好的 yaml 文件进行删除，命令如下：
```
kubectl delete -f container-cpu.yaml
```
## Q&A
Q: 演练如果执行报错，应该如何进行排查
A: 主要还是通过查看 `chaosblade-operator`的日志来定位问题

- kubectl get pods -n chaosblade 查看operator name
- kubectl logs operator-pod-name -n chaosblade
