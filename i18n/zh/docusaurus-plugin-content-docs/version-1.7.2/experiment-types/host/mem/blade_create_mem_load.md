---
title: 模拟内存占用实验
---

## 介绍

指定内存占用，注意，此场景触发内存占用满，即使指定了 --timeout 参数，也可能出现通过 blade 工具无法恢复的情况，可通过重启机器解决！！！推荐指定内存百分比！

由于目前内存大小计算通过 memory.stat 等文件计算，所以和 free 命令计算不一致，同 top 命令一致，验证时请使用 top 命令查看内存使用。后续会针对内存占用场景进行优化。

## 参数

```text
--mem-percent string    内存使用率，取值是 0 到 100 的整数
--mode string   内存占用模式，有 ram 和 cache 两种，例如 --mode ram。ram 采用代码实现，可控制占用速率，优先推荐此模式；cache 是通过挂载tmpfs实现；默认值是 --mode cache
--reserve string    保留内存的大小，单位是MB，如果 mem-percent 参数存在，则优先使用 mem-percent 参数
--rate string 内存占用速率，单位是 MB/S，仅在 --mode ram 时生效
--timeout string   设定运行时长，单位是秒，通用参数
```

## 案例

```console
# 在执行命令之前，先使用 top 命令查看内存使用信息，如下，总内存大小是 8G，使用了 7.6%
KiB Mem :  7.6/8010196

# 执行内存占用 50%
blade c mem load --mode ram --mem-percent 50

# 查看内存使用
KiB Mem : 50.0/8010196

# 执行内存占用 100%
KiB Mem : 99.6/8010196

# 保留 200M 内存，总内存大小 1G
blade c mem load --mode ram --reserve 200 --rate 100
KiB Mem :  1014744 total,    78368 free,   663660 used,   272716 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   209652 avail Mem
KiB Mem : 79.7/1014744  [||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||                   ]
```

## 实现原理

ram 模式采用代码申请内存实现
cache 模式采用 dd、mount 命令实现，挂载 tmpfs 并且进行文件填充

## 常见错误

Q：如果执行了内存满载，无法恢复，如何处理
A：重启机器恢复
