---
title: "网络延迟实验场景"
linkTitle: "网络延迟实验场景"
weight: 1
type: docs
description: > 
    网络延迟实验场景
---
## 介绍
可以指定网卡、本地端口、远程端口、目标 IP 延迟。需要特别注意，如果不指定端口、ip 参数，而是整个网卡延迟，切记要添加 --timeout 参数或者 --exclude-port 参数，前者是指定运行时间，自动停止销毁实验，后者是指定排除掉的延迟端口，两者都是防止因延迟时间设置太长，造成机器无法连接的情况，如果真实发生此问题，重启机器即可恢复。

本地端口和远程端口之间是或的关系，即这两个端口都会发生延迟，只要指定了本地端口或者远程端口，无需指定需要排除的端口。端口与 IP 之间是与的关系，即指定的 IP:PORT 发生延迟。

网络延迟场景主要验证网络异常的情况下，系统的自我容错能力。

## 参数
```text
--destination-ip string   目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--exclude-port string     排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用
--exclude-ip string       排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--interface string        网卡设备，例如 eth0 (必要参数)
--local-port string       本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--offset string           延迟时间上下浮动的值, 单位是毫秒
--remote-port string      远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--time string             延迟时间，单位是毫秒 (必要参数)
--force                   强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用
--ignore-peer-port        针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口
--timeout string          设定运行时长，单位是秒，通用参数
```

## 案例
```text
# 访问本机 8080 和 8081 端口延迟 3 秒，延迟时间上下浮动 1 秒
blade create network delay --time 3000 --offset 1000 --interface eth0 --local-port 8080,8081

{"code":200,"success":true,"result":"9b4aa9fabe073624"}

# 可以在另一台相同网络内的机器通过 telnet 命令验证，即 telnet xxx.xxx.xxx.xxx 8080
# 销毁实验
blade destroy 9b4aa9fabe073624

# 本机访问外部 14.215.177.39 机器（ping www.baidu.com 获取到的 IP）80 端口延迟 3 秒
blade create network delay --time 3000 --interface eth0 --remote-port 80 --destination-ip 14.215.177.39

# 可在本机通过 telnet 14.215.177.39 80 命令验证
# 对整个网卡 eth0 做 5 秒延迟，排除 22 和 8000到8080 端口
blade create network delay --time 5000 --interface eth0 --exclude-port 22,8000-8080

# 会发现 22 端口和 8000 到 8080 端口不受影响，可在另一台相同网络内的机器通过分别 telnet xxx.xxx.xxx.xxx 8080 和 telnet xxx.xxx.xxx.xxx 8081 进行测试
```

## 实现原理

`tc` 实现

## 常见问题

Q: `{"code":604,"success":false,"error":"RTNETLINK answers: File exists\n exit status 2 exit status 1"}`

A： 网络相关的场景实验已存在，销毁原有的后再执行。
可以通过 blade status --type create 命令来查看已执行的实验， success 状态的表示正在执行；
如果查找不到相关实验，比如已经删除了原有的 chaosblade 目录，则可通过以下命令恢复实验，注意 eth0 替换为你机器的网卡设备：

```text
tc filter del dev eth0 parent 1: prio 4
tc qdisc del dev eth0 root
```

也可以添加 `--force` 命令强制覆盖原有规则。
