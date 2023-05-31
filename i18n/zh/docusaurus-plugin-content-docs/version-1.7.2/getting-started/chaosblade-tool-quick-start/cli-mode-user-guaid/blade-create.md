---
title: blade create
---

本文档主要介绍`blade create`命令使用

## Usage

创建混沌工程演练实验。每个实验对应一个 `uid`，后续的查询、销毁实验都要用到此 `uid`，如果遗忘了 `uid`，可以通过 `blade status --type create` 命令进行查询。 `create` 可以简写为 `c`，即 `blade create` 可以简写为 `blade c`。

```shell
Usage:
  blade create [command]

Aliases:
  create, c

blade create [target] [action] [flags]
```

## Exec

进入解压包本地所放置的路径，可通过`blade create -h`查看所有支持的演练场景的`target`，具体该`target`下支持那些`action`和`flags`，可通过在命令后面加`-h`来进行查看。

```
[root@test chaosblade]# ./blade c -h
Create a chaos engineering experiment

Usage:
  blade create [command]

Aliases:
  create, c

Examples:
blade create cpu load --cpu-percent 60

Available Commands:
  cplus       C++ chaos experiments
  cpu         Cpu experiment
  cri         CRI experiment
  disk        Disk experiment
  druid       Experiment with the Druid
  dubbo       Experiment with the Dubbo
  es          ElasticSearch experiment!
  feign       feign experiment
  file        File experiment
  gateway     gateway experiment!
  hbase       hbase experiment!
  hsf         Hsf experiment
  jedis       jedis experiment
  jvm         Experiment with the JVM
  k8s         Kubernetes experiment
  kafka       kafka experiment
  lettuce     redis client lettuce experiment
  log         log experiment
  mem         Mem experiment
  mysql       mysql experiment
  network     Network experiment
  notify      notify send or receive message error
  process     Process experiment
  psql        Postgrelsql experiment
  redisson    redisson experiment
  rocketmq    Rocketmq experiment,can make message send or pull delay and exception
  script      Script chaos experiment
  sentinel    Sentinel experiment
  servlet     java servlet experiment
  shutdown    Support shutdown, halt or reboot experiment.
  strace      strace experiment
  stressng    stressng experiment
  systemd     Systemd experiment
  tair        Tair experiment
  tars        tars experiment
  tddl        Tddl experiment
  time        Time experiment
  zuul        Zuul experiment

Flags:
  -a, --async             whether to create asynchronously, default is false
  -e, --endpoint string   the create result reporting address. It takes effect only when the async value is true and the value is not empty
  -h, --help              help for create
  -n, --nohup             used to internal async create, no need to config
      --uid string        Set Uid for the experiment, adapt to docker and cri

Global Flags:
  -d, --debug   Set client to DEBUG mode

Use "blade create [command] --help" for more information about a command.
```

## Examples

### 主机场景

在`Host`进行 cpu 满载的演练，具体支持参数，可通过`./blade c cpu fullload -h`进行查看，里面会有具体参数解析

```
# 查看 create 命令帮助文档
blade create -h

# 查看如何创建 cpu 混沌实验
blade create cpu -h

# 查看如何创建 cpu 满载实验
blade create cpu fullload -h

# 创建 cpu 满载实验
blade create cpu fullload --cpu-count 1

# 返回结果如下
{"code":200,"success":true,"result":"6fa04946baf42920"}

# code 的值等于 200 说明执行成功，其中 result 的值就是 uid。使用 top 命令验证实验效果
%Cpu0  :100.0 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st

# 销毁上述实验
blade destroy 6fa04946baf42920

# 返回结果如下
{"code":200,"success":true,"result":"command: cpu fullload --cpu-count 2 --debug false --help false"}

# 返回值会打印此次实验的命令。再次使用 top 命令验证实验效果
%Cpu0  :  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```

> 其中上述结果中的`6fa04946baf42920`就是该次演练的`uid`

### K8S 场景

在`Kubernetes`对集群中 `default` namespace 中的，`nginx-swer23kj-12345` pod 进行 cpu 满载演练

```
# 查看如何创建 k8s 混沌实验
blade create k8s -h

# 查看如何创建 k8s下pod cpu 满载实验
blade create k8s pod-cpu fullload -h

# 创建 cpu 满载实验
blade c k8s pod-cpu fullload --cpu-percent 100 --names nginx-swer23kj-12345 --namespace default --kubeconfig ~/.kube/config

# 返回结果如下
{"code":200,"success":true,"result":"6fa04946baf42920"}

# 销毁上述实验
blade destroy 6fa04946baf42920
```

可通 `kubectl top`命令验证实验效果，并和 pod 中 resource limit 进行比较

```
kubectl top pod nginx-swer23kj-12345 -n default
```
