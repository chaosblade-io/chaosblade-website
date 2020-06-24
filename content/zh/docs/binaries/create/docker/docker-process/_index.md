---
title: "容器内进程场景"
linkTitle: "容器内进程场景"
weight: 3
type: docs
description: > 
    容器内进程场景，同基础资源进程场景
---
## 命令

支持的进程场景如下：

* `blade create docker process kill`， 杀容器内指定的进程，同 [blade create process kill](../../process/process-kill)
* `blade create docker process stop`，挂起容器内指定的进程，同 [blade create process stop](../../process/process-stop)

## 参数

除了上述基础场景各自所需的参数外，在 docker 实验场景下还支持的参数是：

```text
--blade-override           是否覆盖容器内已有的 chaosblade 工具，默认是 false，表示不覆盖，chaosblade 在容器内的部署路径为 /opt/chaosblade
--blade-tar-file string    指定本地 chaosblade-VERSION.tar.gz 工具包全路径，用于拷贝到容器内执行
--container-id string      目标容器 ID
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
```

## 案例

杀掉容器内 nginx 进程，命令执行如下：

```text
blade create docker process kill --process nginx --blade-tar-file /root/chaosblade-0.4.0.tar.gz --container-id ee54f1e61c08
```

## 常见问题

Q: `{"code":801,"success":false,"error":"open : no such file or directory"}`

A: 没有指定 `--blade-tar-file` 参数

Q：`{"code":801,"success":false,"error":"\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0002\u0000\u0000\u0000\u0000\u0000\u0000\u0000"}`

A：重试即可

Q: `{"code":503,"success":false,"error":"ps command not found"}`

A: 目标容器内没有 `ps` 命令
