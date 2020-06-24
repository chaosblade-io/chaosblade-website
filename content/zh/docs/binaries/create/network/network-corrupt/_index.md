---
title: "网络包损坏实验场景"
linkTitle: "网络包损坏实验场景"
weight: 4
type: docs
description: > 
    网络包损坏实验场景
---
## 介绍

可以指定网卡、本地端口、远程端口、目标 IP 包损坏。需要特别注意，如果不指定端口、ip 参数，而是整个网卡包损坏，切记要添加 --timeout 参数或者 --exclude-port 参数，前者是指定运行时间，自动停止销毁实验，后者是指定排除掉的延迟端口，两者都是防止机器无法连接的情况，如果真实发生此问题，重启机器即可恢复。

本地端口和远程端口之间是或的关系，即这两个端口都会生效，只要指定了本地端口或者远程端口，无需指定需要排除的端口。端口与 IP 之间是与的关系，即指定的 IP:PORT 发生包损坏。

## 参数

```text
--destination-ip string   目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--exclude-port string     排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用
--exclude-ip string       排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--interface string        网卡设备，例如 eth0 (必要参数)
--local-port string       本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--offset string           延迟时间上下浮动的值, 单位是毫秒
--remote-port string      远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--percent                 包损坏百分比，取值是不带%号的正整数
--force                   强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用
--ignore-peer-port        针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口
--timeout string          设定运行时长，单位是秒，通用参数
```

## 案例

```text
# 访问指定的 ip 请求包损坏，百分比 80%
blade create network corrupt --percent 80 --destination-ip 180.101.49.12 --interface eth0

ping 180.101.49.12

64 bytes from 180.101.49.12: icmp_seq=100 ttl=50 time=9.75 ms
64 bytes from 180.101.49.12: icmp_seq=101 ttl=50 time=9.94 ms
64 bytes from 180.101.49.12: icmp_seq=102 ttl=50 time=9.76 ms
64 bytes from 180.101.49.12: icmp_seq=107 ttl=50 time=9.80 ms
64 bytes from 180.101.49.12: icmp_seq=109 ttl=50 time=9.71 ms
64 bytes from 180.101.49.12: icmp_seq=111 ttl=50 time=10.2 ms
64 bytes from 180.101.49.12: icmp_seq=118 ttl=50 time=9.72 ms
64 bytes from 180.101.49.12: icmp_seq=119 ttl=50 time=9.94 ms
64 bytes from 180.101.49.12: icmp_seq=120 ttl=50 time=10.0 ms
64 bytes from 180.101.49.12: icmp_seq=121 ttl=50 time=9.86 ms
64 bytes from 180.101.49.12: icmp_seq=122 ttl=50 time=9.76 ms
```

可以看出执行命令后 icmp_seq=102 开始出现包丢失的情况，执行恢复命令后，从 icmp_seq=118 开始正常

## 实现原理

`tc` 实现

## 常见问题
