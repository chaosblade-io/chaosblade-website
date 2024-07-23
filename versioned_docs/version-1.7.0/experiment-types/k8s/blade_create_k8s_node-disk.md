---
id: blade create k8s node-disk
---

# 模拟节点磁盘场景

## 介绍
kubernetes 节点磁盘场景，包含磁盘填充和磁盘IO读写高

## 命令
支持 CPU 场景命令如下：
* `blade create k8s node-disk fill`，节点磁盘填充，同 [blade create disk fill](../../host/disk/blade_create_disk_fill.md)
* `blade create k8s node-disk burn`，节点磁盘IO读写负载，同 [blade create disk burn](../../host/disk/blade_create_disk_burn.md)

## 参数
除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：
```
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          节点资源标签
--names string           节点资源名，多个资源名之间使用逗号分隔
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例
### 指定节点磁盘占用 80%
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
其他问题参考 [blade create k8s](blade create k8s.md) 常见问题