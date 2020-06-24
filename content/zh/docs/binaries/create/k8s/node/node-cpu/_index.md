---
title: "节点 CPU 负载实验场景"
linkTitle: "CPU 负载实验场景"
weight: 1
type: docs
description: >
  kubernetes 节点 CPU 负载实验场景，同基础资源的 CPU 场景
---
## 命令

支持 CPU 场景命令如下：

* `blade create k8s node-cpu load`，节点 CPU 负载场景，同 [blade create cpu load](../../../resource/cpu-load)

## 参数

除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```text
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          节点资源标签
--names string           节点资源名，多个资源名之间使用逗号分隔
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例

面以指定一台节点，做 CPU 负载 80% 实验举例。

### blade 命令执行方式

下载 chaosblade 工具包，下载地址：[https://github.com/chaosblade-io/chaosblade/releases/tag/v0.4.0-alpha](https://github.com/chaosblade-io/chaosblade/releases/tag/v0.4.0-alpha) ，解压即可使用。还是上述例子，使用 blade 命令执行如下：

```shell
blade create k8s node-cpu fullload --names cn-hangzhou.192.168.0.205 --cpu-percent 80 --kubeconfig ~/.kube/config 
```
使用 blade 命令执行，如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID，使用查询命令可以查询详细的实验结果：
```
blade query k8s create <UID>
```

#### 销毁实验

此方式仅限使用 blade 创建的实验，使用以下命令停止：

```shell
blade destroy <UID>
```

`<UID>` 是执行 blade create 命令返回的结果，如果忘记，可使用 `blade status --type create` 命令查询。

### kubectl 执行方式

yaml 的配置方式见：[Node CPU 负载场景](../../../../../operator/node/node-resource/cpu-load/)
