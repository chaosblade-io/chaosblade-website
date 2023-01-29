---
id: blade create network reorder
---

# 模拟网络包重排序实验

网络包重排序实验场景

## 介绍
可以指定网卡、本地端口、远程端口、目标 IP 包重排。需要特别注意，如果不指定端口、ip 参数，而是整个网卡包重复，切记要添加 --timeout 参数或者 --exclude-port 参数，前者是指定运行时间，自动停止销毁实验，后者是指定排除掉不受影响的端口，两者都是防止机器无法连接的情况，如果真实发生此问题，重启机器即可恢复。

本地端口和远程端口之间是或的关系，即这两个端口都会生效，只要指定了本地端口或者远程端口，无需指定需要排除的端口。端口与 IP 之间是与的关系，即指定的 IP:PORT 发生包重排。

## 参数
```text
--destination-ip string   目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--exclude-port string     排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用
--exclude-ip string       排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。
--interface string        网卡设备，例如 eth0 (必要参数)
--local-port string       本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--offset string           延迟时间上下浮动的值, 单位是毫秒
--remote-port string      远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080
--correlation string      和上一包的相关性，取值在 0~100，必要参数，例如 --correlation 70
--gap string              包序列大小，取值是正整数，例如 --gap 5
--percent string          立即发送百分比，取值是不带%号的正整数，例如 --percent 50，(必要参数)
--time string             网络包延迟时间，单位是毫秒，默认值是 10，取值时正整数
--force                   强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用
--ignore-peer-port        针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口
--timeout string          设定运行时长，单位是秒，通用参数
```

## 案例
```text
# 访问指定的 ip 请求包乱序
blade c network reorder --correlation 80 --percent 50 --gap 2 --time 500 --interface eth0 --destination-ip 180.101.49.12

ping 180.101.49.12 -A

PING 180.101.49.12 (180.101.49.12) 56(84) bytes of data.
64 bytes from 180.101.49.12: icmp_seq=1 ttl=50 time=510 ms
64 bytes from 180.101.49.12: icmp_seq=2 ttl=50 time=9.66 ms
64 bytes from 180.101.49.12: icmp_seq=4 ttl=50 time=9.70 ms
64 bytes from 180.101.49.12: icmp_seq=3 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=6 ttl=50 time=10.0 ms
64 bytes from 180.101.49.12: icmp_seq=5 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=8 ttl=50 time=9.71 ms
64 bytes from 180.101.49.12: icmp_seq=7 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=10 ttl=50 time=9.72 ms
64 bytes from 180.101.49.12: icmp_seq=9 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=11 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=12 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=13 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=15 ttl=50 time=9.90 ms
64 bytes from 180.101.49.12: icmp_seq=14 ttl=50 time=509 ms
64 bytes from 180.101.49.12: icmp_seq=16 ttl=50 time=509 ms
```
可以看出执行命令后开始出现包乱序的情况，执行恢复命令后，开始正常


## 实现原理
tc 实现

## 常见问题

