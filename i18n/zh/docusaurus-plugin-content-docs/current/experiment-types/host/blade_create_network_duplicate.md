---
id: blade create network duplicate
---

# 模拟网络包重复实验

# blade create network duplicate
网络包重复实验场景

## 介绍
可以指定网卡、本地端口、远程端口、目标 IP 包重复。需要特别注意，如果不指定端口、ip 参数，而是整个网卡包重复，切记要添加 --timeout 参数或者 --exclude-port 参数，前者是指定运行时间，自动停止销毁实验，后者是指定排除掉不受影响的端口，两者都是防止机器无法连接的情况，如果真实发生此问题，重启机器即可恢复。

本地端口和远程端口之间是或的关系，即这两个端口都会生效，只要指定了本地端口或者远程端口，无需指定需要排除的端口。端口与 IP 之间是与的关系，即指定的 IP:PORT 发生包重复。

## 命令
* `blade create network duplicate -h`

## 参数

| 参数名                | 说明                                                                                                                                                                        | 类型     | 值                                  |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------------|
| `destination-ip`   | 目标 IP. 支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。    | string | 例：`192.168.1.0/24` 或 `192.168.1.1` |
| `exclude-port`     | 排除掉的端口，默认会忽略掉通信的对端端口，目的是保留通信可用。可以指定多个，使用逗号分隔或者连接符表示范围，例如 22,8000 或者 8000-8010。 这个参数不能与 --local-port 或者 --remote-port 参数一起使用                                               | string | 例 `22,8000` 或者 `8000-8010`         |
| `exclude-ip`       | 排除受影响的 IP，支持通过子网掩码来指定一个网段的IP地址, 例如 192.168.1.0/24. 则 192.168.1.0~192.168.1.255 都生效。你也可以指定固定的 IP，如 192.168.1.1 或者 192.168.1.1/32，也可以通过都号分隔多个参数，例如 192.168.1.1,192.168.2.1。 | string | 例：`192.168.1.0/24`或 `192.168.1.1`  | 
| `interface`        | 网卡设备，例如 eth0 (必要参数)                                                                                                                                                       | string | 例：`eth0`                           |
| `local-port`       | 本地端口，一般是本机暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围，例如 80,8000-8080                                                                                                                  | string | 例: `80`                            |
| `percent`          | 包重复百分比，取值在[0, 100]的正整数 (必要参数)                                                                                                                                             | int    | 例: `50`                            |
| `remote-port`      | 远程端口，一般是要访问的外部暴露服务的端口。可以指定多个，使用逗号分隔或者连接符表示范围                                                                                                                              | string | 例：`80,8000-8080`                   |
| `force`            | 强制覆盖已有的 tc 规则，请务必在明确之前的规则可覆盖的情况下使用                                                                                                                                        | string | 例: `true` 或 `false`                |
| `ignore-peer-port` | 针对添加 --exclude-port 参数，报 ss 命令找不到的情况下使用，忽略排除端口                                                                                                                            | string |                                    |
| `timeout`          | 设定运行时长，单位是秒，通用参数                                                                                                                                                          | int    |                                    |


## 案例
```text
# 访问指定的 ip 请求包损坏，百分比 80%
blade create network duplicate --percent 80 --destination-ip 180.101.49.12 --interface eth0

ping 180.101.49.12

64 bytes from 180.101.49.12: icmp_seq=64 ttl=50 time=9.94 ms
64 bytes from 180.101.49.12: icmp_seq=65 ttl=50 time=9.73 ms
64 bytes from 180.101.49.12: icmp_seq=65 ttl=50 time=9.74 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=66 ttl=50 time=9.77 ms
64 bytes from 180.101.49.12: icmp_seq=66 ttl=50 time=9.80 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=67 ttl=50 time=9.70 ms
64 bytes from 180.101.49.12: icmp_seq=67 ttl=50 time=9.71 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=68 ttl=50 time=11.0 ms
64 bytes from 180.101.49.12: icmp_seq=68 ttl=50 time=11.1 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=69 ttl=50 time=9.78 ms
64 bytes from 180.101.49.12: icmp_seq=69 ttl=50 time=9.78 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=70 ttl=50 time=9.70 ms
64 bytes from 180.101.49.12: icmp_seq=70 ttl=50 time=9.70 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=71 ttl=50 time=9.71 ms
64 bytes from 180.101.49.12: icmp_seq=71 ttl=50 time=9.71 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=72 ttl=50 time=9.73 ms
64 bytes from 180.101.49.12: icmp_seq=72 ttl=50 time=9.74 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=73 ttl=50 time=9.69 ms
64 bytes from 180.101.49.12: icmp_seq=73 ttl=50 time=9.73 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=74 ttl=50 time=9.73 ms
64 bytes from 180.101.49.12: icmp_seq=74 ttl=50 time=9.73 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=75 ttl=50 time=9.68 ms
64 bytes from 180.101.49.12: icmp_seq=75 ttl=50 time=9.68 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=76 ttl=50 time=10.0 ms
64 bytes from 180.101.49.12: icmp_seq=76 ttl=50 time=10.0 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=77 ttl=50 time=9.68 ms
64 bytes from 180.101.49.12: icmp_seq=77 ttl=50 time=9.80 ms (DUP!)
64 bytes from 180.101.49.12: icmp_seq=78 ttl=50 time=9.70 ms
64 bytes from 180.101.49.12: icmp_seq=79 ttl=50 time=9.70 ms
64 bytes from 180.101.49.12: icmp_seq=80 ttl=50 time=9.74 ms
```
可以看出执行命令后开始出现包重复的情况，执行恢复命令后，开始正常


## 实现原理
tc 实现

## 常见问题

