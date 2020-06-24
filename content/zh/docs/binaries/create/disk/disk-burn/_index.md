---
title: "磁盘读写 io 负载实验"
linkTitle: "磁盘读写 io 负载实验"
weight: 2
type: docs
description: > 
    磁盘读写 io 负载实验
---
## 介绍
提升磁盘读写 io 负载，可以指定受影响的目录，也可以通过调整读写的块大小提升 io 负载，默认值是 10，单位是 M，块的数量固定为 100，即在默认情况下，写会占用 1G 的磁盘空间，读会固定占用 600M 的空间，因为读操作会先创建一个 600M 的固定大小文件，预计 3s之内，在创建时写 io 会升高。

验证磁盘 io 高负载下对系统服务的影响，比如监控告警、服务稳定性等。

## 参数
```text
--path string      指定提升磁盘 io 的目录，会作用于其所在的磁盘上，默认值是 /
--read             触发提升磁盘读 IO 负载，会创建 600M 的文件用于读，销毁实验会自动删除
--size string      块大小, 单位是 M, 默认值是 10，一般不需要修改，除非想更大的提高 io 负载
--timeout string   设定运行时长，单位是秒，通用参数
--write            触发提升磁盘写 IO 负载，会根据块大小的值来写入一个文件，比如块大小是 10，则固定的块的数量是 100，则会创建 1000M 的文件，销毁实验会自动删除
```

## 案例
```text
# 在执行实验之前可先观察磁盘 io 读写负载
iostat -x -t 2

# 上述命令会 2 秒刷新一次读写负载数据，截取结果如下
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00     2.50    0.00    2.00     0.00    18.00    18.00     0.00    1.25    0.00    1.25   1.25   0.25

# 主要观察 rkB/s、wkB/s、%util 数据。执行磁盘读 IO 负载高场景
blade create disk burn --read --path /home

# 执行 iostat 命令可以看到读负载增大，使用率达 99.9%。执行 blade destroy UID(上述执行实验返回的 result 值)可销毁实验。

Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00     3.00  223.00    2.00 108512.00    20.00   964.73    11.45   50.82   51.19   10.00   4.44  99.90

# 销毁上述实验后，执行磁盘写 IO 负载高场景
blade create disk burn --write --path /home

# 执行 iostat 命令可以看到写负载增大，使用率达 90.10%。
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00    43.00    0.00  260.00     0.00 111572.00   858.25    15.36   59.71    0.00   59.71   3.47  90.10

# 可同时执行读写 IO 负载场景，不指定 path，默认值是 /
blade create disk burn --read --write

# 通过 iostat 命令可以看到，整个磁盘的 io 使用率达到了 100%
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00    36.00  229.50  252.50 108512.00 107750.00   897.35    30.09   62.70   53.49   71.07   2.07 100.00
```

## 实现原理
使用 `dd` 命令实现

## 常见问题
