---
title: 模拟Redis缓存过期实验
---

## 介绍

通过修改Redis指定的key过期时间，模拟Redis缓存过期实验。

## 命令

- `blade create redis cache-expire -h`

## 参数

| 参数名             | 说明                                                       | 类型     | 值                       |
|-----------------|----------------------------------------------------------|--------|-------------------------|
| `addr`          | Redis服务器地址及端口号（必要参数） IP:Port                             | string | 例：`192.168.56.101:6379` |
| `password`          | Redis服务器密码（必要参数）                                         | string | 例: `123456`             |
| `key` | 要设置过期时间的键, 默认为 ""。当该值为默认时，将对所有键设置过期时间。                   | string | 例: `test1`              |
| `expiry` | 指定的键值对将会在到达expiry之后过期，需要转为时间段，例如"5s" 或 "30m"             | string | 例: `5s`                 |
| `option`       | 用于设置键的过期条件。只有Redis 7.0.0之后的版本支持该参数。默认""。只支持 NX，XX，GT，LT。 | string | 例: `GT`                 |


## 案例

```text
# 设置key 1分钟后过期
# blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --key test1 --expiry 1m
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# 当要设置的过期时间大于key当前过期时间时，设置新过期时间。不存在则直接设置。 
# blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --key test1 --option GT --expiry 1m
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}
```

## 实现原理

通过使用go-redis包中的Golang接口修改Redis key的过期时间。

## 常见问题

Q: {"code":44000,"success":false,"error":"`parse duration error: time: missing unit in duration \"1\"`: action not supported"}

A：expiry必须转为时间段，例如"5s" 或 "30m"。
