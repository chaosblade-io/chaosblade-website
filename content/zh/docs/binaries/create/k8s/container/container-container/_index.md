---
title: "容器资源自身的场景"
linkTitle: "容器资源自身的场景"
weight: 4
type: docs
description: >
  Kubernetes 下 container 资源自身的场景，比如删容器，需要注意，执行容器场景，必须先确定 Pod，所以需要配置 Pod 相关参数
---
## 命令

支持场景命令如下

* `blade create k8s container-container remove` 删除容器

## 参数

```text
--container-ids string     容器ID，支持配置多个
--container-names string   容器名称，支持配置多个
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
--namespace string       Pod 所属的命名空间，只能填写一个值，必填项
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          Pod 资源标签，多个标签之前是或的关系
--names string           Pod 资源名
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
--force                    是否强制删除
```

## 案例

删除 `default` 命名空间下，Pod 名为 `frontend-d89756ff7-szblb` 下的 container id 是 `072aa6bbf2e2e2` 的容器

### blade 执行方式

```shell
blade create k8s container-container remove --container-ids 060833967b0a37 --names frontend-d89756ff7-szblb --namespace default --kubeconfig config
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：

```json
{"code":200,"success":true,"result":"17d7021c777b76e3"}
```

可通过以下命令查询实验状态：

```shell
blade query k8s create 17d7021c777b76e3 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"17d7021c777b76e3","success":true,"error":"","statuses":[{"id":"205515ad8fcc31da","uid":"060833967b0a3733d10f0e64d3639066b8b7fbcf371e0ace2401af150dbd9b12","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```

执行前后，可以看到 Pod 内容器的变化:

执行前：

![before](https://user-images.githubusercontent.com/3992234/68177415-2ff80600-ffc3-11e9-8bd3-ea8d66bf935d.png)

执行后：

![after](https://user-images.githubusercontent.com/3992234/68177442-4ef69800-ffc3-11e9-9f5a-910d477b131a.png)

#### 销毁实验

```shell
blade destroy 17d7021c777b76e3
```

{{% alert title="Warning" color="warning" %}}
删除容器后，执行销毁实验命令不会恢复容器，需要靠容器自身的管理拉起！
{{% /alert %}}

### kubectl 执行方式

yaml 的配置方式见：[Kubernetes 删除 Container 场景](../../../../../operator/container/container-resource/remove/)
