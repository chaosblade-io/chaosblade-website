---
title: "容器内网络实验场景"
linkTitle: "容器内网络实验场景"
weight: 2
type: docs
description: > 
    容器内网络实验场景，同基础资源的网络场景
---
## 命令

支持的网络场景命令如下：

* `blade create docker network delay` 容器网络延迟，同 [blade create network delay](../../network/network-delay/)
* `blade create docker network loss` 容器网络丢包，同 [blade create network loss](../../network/network-loss/)
* `blade create docker network dns` 容器内域名访问异常，同 [blade create network dns](../../network/network-dns/)

## 参数
除了上述基础场景各自所需的参数外，在 docker 环境下，还支持的参数如下：

```text
--container-id string      目标容器 ID
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
--image-repo string        chaosblade-tool 镜像仓库地址，默认是从 `registry.cn-hangzhou.aliyuncs.com/chaosblade`
```

## 案例
对 nginx 容器 80 端口做访问延迟 3 秒，执行命令如下：

```text
blade create docker network delay --time 3000 --interface eth0 --local-port 80 --container-id 5239e26f6329
```

第一次会拉取 chaosblade-tool 镜像，可能会慢一些。返回 `{"code":200,"success":true,"result":"fc3a1b0b4295e47f"}` 表示执行成功，可以看到新启动了一个名字为 5239e26f6329-delay 的容器，通过 sidecar 方式，复用目标容器网络，执行实验。

在本机访问该容器映射出的端口服务，比如映射的端口为 `0.0.0.0:32768->80/tcp`，可以看出发生延迟：

```text
[root@izbp11rrxxxx ~]# time curl localhost:32768
real	0m9.001s
user	0m0.004s
sys	    0m0.002s
```

此处延迟 9 秒的原因是涉及到多次 80 端口访问。

也可以在同一网段下的另外一台容器内访问目标容器的 80 服务，同样能验证效果：

```text
bash-4.4# time curl 172.17.0.2:80
real	0m9.005s
user	0m0.004s
sys 	0m0.001s
```

执行以下命令可销毁实验：

```text
blade destroy fc3a1b0b4295e47f
```

启动的 sidecar 容器会被销毁，网络恢复。可以通过上述方法再次验证。

```text
[root@izbp11rr7oumxxxxx ~]# time curl localhost:32768
real	0m0.011s
user	0m0.003s
sys	    0m0.002s
```

## 常见问题

Q：执行命令报错：
`{"code":604,"success":false,"error":"RTNETLINK answers: File exists\n exit status 2 exit status 1"}`

A：网络演练场景已存在，可以使用 `docker ps | grep chaosblade` 来查看正在运行的 sidecar 容器
