---
title: 模拟网络本地端口占用实验
---

## 介绍

本地端口占用，验证端口已被占用的情况下，使用此端口的业务容错能力

## 参数

```text
--port string             指定被占用的端口，（必填项）
--force                   强制占用此端口，会将已使用此端口的进程杀掉
--timeout string          设定运行时长，单位是秒，通用参数
```

## 案例

```text
# 指定 8080 端口占用
blade c network occupy --port 8080 --force

# 命令执行前
netstat -tanp | grep 8080
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      19562/java

# 命令执行后
netstat -tanp | grep 8080
tcp6       0      0 :::8080                 :::*                    LISTEN      20041/chaos_occupyn
```

## 实现原理

指定端口启动 server 实现

## 常见问题

Q: {"code":604,"success":false,"error":"Error: listen tcp :8080: bind: address already in use exit status 1"}
A：指定的端口已被占用，可以添加 `--force` 参数，强制杀掉使用此端口的进程
