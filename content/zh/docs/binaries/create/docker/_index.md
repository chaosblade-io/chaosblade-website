---
title: "docker 容器场景"
linkTitle: "docker 容器场景"
weight: 6
type: docs
description: > 
    docker 容器场景
---
## 执行

执行 docker 相关实验场景，必须确保本地能访问 docker server，可通过 tcp 或 socket 方式访问，默认是通过本地 socket 访问，也可通过 --docker-endpoint 参数指定。

很重要的一点是，如果执行 CPU 场景，必须指定 chaosblade 安装包，因为需要将安装包拷贝到容器 `/opt` 目录下执行，使用 --blade-tar-file 参数指定，例如 `--blade-tar-file /home/admin/chaosblade-0.4.0.tar.gz`。如果执行网络或者进程场景，无需指定，但这两个场景依赖 chaosblade-tool 镜像，默认是从 `registry.cn-hangzhou.aliyuncs.com/chaosblade` 仓库下载，也可以通过 `--image-repo` 参数指定，例如 `--image-repo registry-vpc.cn-hangzhou.aliyuncs.com/chaosblade`

## 案例

实验场景案例请点击各场景查看

## 常见问题

Q: `{"code":801,"success":false,"error":"Error: No such image: xxx/chaosblade-tool:0.4.0"}`

A: 说明 chaosblade-tool 镜像拉取失败，需要通过 `--image-repo` 指定正确的镜像仓库地址


创建 docker 相关的混沌实验，比如杀容器，容器网络延迟、丢包，杀容器里的进程等，不同的场景依赖的参数不同，目前支持以下实验场景：
