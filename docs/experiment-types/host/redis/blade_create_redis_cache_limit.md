---
title: Simulating setting the memory limit of redis cache
---

## Introduction

An experiment that simulates setting the memory limit of redis cache by modifying the `maxmemory` of redis.

Redis triggers the cache elimination policy to release the memory after the memory exceeds the specified `maxmemory`.

## CLI Command

- `blade create redis cache-limit -h`

## Parameter

| Name       | Introduction                                                                            | Type   | Required | Example Value         |
|------------|-----------------------------------------------------------------------------------------| ------ |----------|-----------------------|
| `addr`     | The address of redis server, the format is `ip:port`.                                   | string | `Y`      | `192.168.56.101:6379` |
| `password` | The password of redis server.                                                           | string | `Y`      | `123456`              |
| `size`     | The size of maxmemory, default does not limit the memory size.The default value is `0`. | string    | `N`      | `256M`|
| `percent`  | The percentage of maxmemory.                                                            | string    | `N`      | `50`|


## Case

```text
# set the maxmemory to 256M
# blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --size 256M
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# set the maxmemory to the 50% of the original value.
# blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --percent 50
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}
```

## Principle

Modify the `maxmemory` by using Golang interface in go-redis package.

## Q&A

Q: {"code":44000,"success":false,"error":"`redis set origin max memory error: OOM command not allowed when used memory \u003e 'maxmemory'.`: action not supported"}

A：The `size` parameter was illegal, and it needed to be a parameter similar to `256M`.
