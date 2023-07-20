---
title: Simulating expiring the key in redis
---

## Introduction

An experiment that simulates expiring the key in redis by modifying the key expiration time。

## CLI Command

- `blade create redis cache-expire -h`

## Parameter
| Name         | Introduction                                                                                                      | Type   | Required | Example Value         |
| ------------ |-------------------------------------------------------------------------------------------------------------------| ------ |----------|-----------------------|
| `addr`     | The address of redis server, the format is `ip:port`.                                                             | string | `Y`      | `192.168.56.101:6379` |
| `password` | The password of redis server.                                                                                     | string | `Y`      | `123456`              |
| `key`    | The key to be set an expiry, default expires all keys. The default value is `""`.                                 | string    | `N`      | `test1`               |
| `expiry`    | The expiry of the key. An expiry string should be able to be converted to a time duration, such as "5s" or "30m". | string    | `Y`      | `10s`                 |
| `option`    | The additional options of expiry, only NX, XX, GT, LT supported.                                                  | string    | `N`      | `GT`                  |


## Case

```text
# Set the expiration time to 1 minute.
# blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --key test1 --expiry 1m
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# Set the expiration time when the new expiration time is greater than current one.
# blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --key test1 --option GT --expiry 1m
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}
```

## Principle

Modify the expiration time by using Golang interface in go-redis package.

## Q&A

Q: {"code":44000,"success":false,"error":"`parse duration error: time: missing unit in duration \"1\"`: action not supported"}

A： An expiry string should be able to be converted to a time duration, such as "5s" or "30m".
