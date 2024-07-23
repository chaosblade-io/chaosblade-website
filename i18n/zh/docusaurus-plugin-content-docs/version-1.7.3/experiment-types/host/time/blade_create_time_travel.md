---
title: 模拟系统时间偏移实验
---

## 介绍

通过指定偏移时间，模拟系统时间偏移实验。

## 命令

- `blade create time travel -h`

## 参数

| 参数名       | 说明                                   | 类型   | 值             |
| ------------ | -------------------------------------- | ------ | -------------- |
| `offset`     | 时间偏移。正数向前偏移，负数向后偏移。 | string | 例: `-2h3m50s` |
| `disableNtp` | 禁用自动同步时间。不传默认禁用。       | string | 例: `true`     |
| `timeout`    | 设定运行时长，单位是秒，通用参数 。    | int    | 例: `20`       |

## 案例

```text
# blade create time travel --offset 5m30s
{"code":200,"success":true,"result":"d8a016b96380d7f3"}
```

说明：系统时间向前偏移 5 分钟 30 秒。

## 实现原理

创建时间偏移实验：

- 通过 `date -s` 设置偏移后的时间。
- 通过 `timedatectl set-ntp false` 关闭自动同步时间。

恢复时间偏移实验：

- 通过`timedatectl set-ntp true` 开启自动时间同步。
- 通过`hwclock --hctosys` 将系统时钟调整为与目前的硬件时钟一致。

## 常见问题

Q: {"code":47000,"success":false,"error":"invalid `offset` parameter value: `100`. time: missing unit in duration 100"}

A：时间偏移参数不合法(未带单位)，不能解析为时长。
