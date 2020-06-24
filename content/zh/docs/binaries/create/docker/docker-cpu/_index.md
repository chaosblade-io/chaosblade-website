---
title: "容器内 CPU 负载实验场景"
linkTitle: "容器内 CPU 负载实验场景"
weight: 1
type: docs
description: > 
    容器内 CPU 负载实验场景，同基础资源的 CPU 场景
---
## 命令

支持 CPU 场景命令如下：

* `blade create docker cpu load` 容器内 CPU 负载场景，同 [blade create cpu load](blade create cpu load.md)

## 参数

除了上述基础场景各自所需的参数外，在 docker 环境下，还支持的参数如下：

```text
--blade-override           是否覆盖容器内已有的 chaosblade 工具，默认是 false，表示不覆盖，chaosblade 在容器内的部署路径为 /opt/chaosblade
--blade-tar-file string    指定本地 chaosblade-VERSION.tar.gz 工具包全路径，用于拷贝到容器内执行
--container-id string      目标容器 ID
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
```

## 案例

对 container id 是 `5239e26f6329` 的做 CPU 使用率 80% 的实验场景，执行命令如下：

```text
 blade create docker cpu fullload --cpu-percent 80 --blade-tar-file /root/chaosblade-0.4.0.tar.gz --container-id 5239e26f6329
```

执行成功会返回 `{"code":200,"success":true,"result":"0a47bb2f75dc71ab"}`
可在本机或者容器内使用 top 命令验证 CPU 使用率：

```text
%Cpu(s): 22.7 us, 57.2 sy,  0.0 ni, 20.1 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```

销毁实验执行以下命令：

```text
blade destroy 0a47bb2f75dc71ab
```

## 常见问题

Q: 执行报如下错误：`{"code":801,"success":false,"error":"\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0002\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0002\u0000\u0000\u0000\u0000\u0000\u0000Omv: cannot stat '/opt/chaosblade-0.4.0.linux-amd64': No such file or directory"}`

A：需要修改将 chaosblade-0.4.0.linux-amd64.tar.gz 包名改为 chaosblade-VERSION.tar.gz 格式，即此处改为 chaosblade-0.4.0.tar.gz

Q: 执行报如下错误：
`{"code":801,"success":false,"error":"\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0002\u0000\u0000\u0000\u0000\u0000\u0000\u0000"}`

A：重试即可 

## 兜底方案

登录容器，kill 掉 chaos_burncpu 进程即可，或者主机上执行。
