---
title: "容器资源自身的场景"
linkTitle: "容器资源自身的场景"
weight: 4
type: docs
description: > 
    此命令主要执行 container 资源自身的场景，比如删容器
---
## 命令

支持场景命令如下

* `blade create docker container remove` 删除容器 

## 参数

```text
--container-id string      要删除的容器 ID
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
--force                    是否强制删除
```

删除容器后，执行 `blade destroy UID` 命令不会恢复容器，需要靠容器自身的管理拉起！

## 案例

删除 container id 是 a76d53933d3f 的容器，命令如下：

```text
blade create docker container remove --container-id a76d53933d3f
```

如果返回 `{"code":200,"success":true,"result":"ed79c686daa88152"}` 说明执行成功。如果执行失败，会有详细的错误提升。

## 常见问题
