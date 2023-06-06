---
title: 模拟Redis缓存内存限制实验
---

## 介绍

通过修改maxmemory的大小，模拟Redis缓存内存限制实验。

Redis在内存超过指定maxmemory之后，触发缓存淘汰策略释放内存。

## 命令

- `blade create redis cache-expire -h`

## 参数

| 参数名        | 说明                                                     | 类型     | 值                       |
|------------|--------------------------------------------------------|--------|-------------------------|
| `addr`     | Redis服务器地址及端口号（必要参数） IP:Port | string | 例：`192.168.56.101:6379` |
| `password` | Redis服务器密码（必要参数）| string | 例: `123456`             |
| `size`     | 指定 maxmemory 的大小	。默认为 0，0表示不限制内存大小| string | 例: `256M`               |
| `percent`  | 指定 maxmemory 为原值的百分比。| string | 例: `50`                 |


## 案例

```text
# 设置Redis maxmemory为256M
# blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --size 256M
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# 设置Redis maxmemory为原值的50%
# blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --percent 50
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}
```

## 实现原理

通过使用go-redis包中的Golang接口修改Redis的`maxmemory`。

## 常见问题

Q: {"code":44000,"success":false,"error":"`redis set origin max memory error: OOM command not allowed when used memory \u003e 'maxmemory'.`: action not supported"}

A：size参数不合法，需要为类似`256M`这种参数。
