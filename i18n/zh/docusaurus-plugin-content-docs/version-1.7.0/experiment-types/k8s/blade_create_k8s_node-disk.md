---
id: blade create k8s node-disk
---

# 模拟节点磁盘场景

## 介绍
本文档介绍如何向 kubernetes 节点注入磁盘场景故障，包含磁盘填充和磁盘IO读写高

用于在 Kubernetes 环境下验证节点磁盘填充或负载上升对 K8S 集群和服务的影响

## 命令
支持 CPU 场景命令如下：
* `blade create k8s node-disk fill`，节点磁盘填充，同 [blade create disk fill](../host/blade_create_disk_fill.md)
* `blade create k8s node-disk burn`，节点磁盘IO读写负载，同 [blade create disk burn](../host/blade_create_disk_burn.md)

## 参数
除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

|  参数名 |  说明 | 类型 | 值 |
|  ----  | ---- | ---- | ---- |
| `evict-count`         | 限制实验生效的数量 | int |  |
| `evict-percent`       | 限制实验生效数量的百分比，不包含 % | int | |
| `labels`              | Pod 资源标签，多个标签之间是或的关系 | string | |
| `names`               | Pod 资源名 | string | |
| `kubeconfig`          | kubeconfig 文件全路径（仅限使用 blade 命令调用时使用） | string | 例: "/root/.kube/config" |
| `waiting-time`        | 实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m | string | |


## 案例

下面以指定一台节点，做 磁盘占用 80% 实验举例。

**yaml 配置方式** 
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: disk-fill
spec:
  experiments:
  - scope: node
    target: disk
    action: fill
    desc: "fill node disk by names"
    matchers:
    - name: names
      value:
      - "cn-beijing.172.28.206.99"
    - name: percent
      value:
      - "80"
```

例如配置好文件后，保存为 chaosblade_disk_fill.yaml，使用以下命令执行实验场景：
```
kubectl apply -f chaosblade_disk_fill.yaml
```
可通过以下命令查看每个实验的执行状态：
```
kubectl get blade disk-fill -o json
``` 

执行前后可通过监控观察到磁盘填充变化:
![recovery](/img/doc-image/k8s_disk_fill_recovery.jpg)
![inject](/img/doc-image/k8s_disk_fill.jpg)

可通过以下命令终止实验
```
kubectl delete -f chaosblade_disk_fill.yaml
```

更多的实验场景配置事例可查看: https://github.com/chaosblade-io/chaosblade-operator/tree/master/examples


**blade 命令执行方式**
```shell
blade c k8s node-disk fill --names cn-hangzhou.192.168.0.35 --percent 80 --kubeconfig ~/.kube/config
{"code":200,"success":true,"result":"ec322fbb977a455c"}

df -h
Filesystem                Size      Used Available Use% Mounted on
/dev/vda1                 118.0G     89.0G     24.0G  79% / 

# 恢复实验
blade d ec322fbb977a455c

{"code":200,"success":true,"result":{"Target":"node-disk","Scope":"","ActionName":"fill","ActionFlags":{"kubeconfig":"~/.kube/config","names":"cn-hangzhou.192.168.0.35","percent":"80"}}}

df -h
Filesystem                Size      Used Available Use% Mounted on
/dev/vda1                 118.0G     74.8G     38.1G  66% /
```

使用 blade 命令执行，如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID，使用查询命令可以查询详细的实验结果：
```
blade query k8s create <UID>
```


## 常见问题
其他问题参考 [blade create k8s](./blade_create_k8s.md) 常见问题
