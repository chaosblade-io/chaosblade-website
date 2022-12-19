---
id: blade create time travel
---

# Simulating the system time offset

## Introduction

An experiment that simulates the system time offset will be performed after specifying the offset.

## CLI Command

* `blade create time travel -h`

## Parameter

| Name         | Introduction                                                       | Type   | Required | Example Value |
|--------------|--------------------------------------------------------------------|--------|----------|---------------|
| `offset`     | The length of time offset.                                         | string | `N`      | `-2h3m50s`    |
| `disableNtp` | Disable synchronizing time automatically. Default value is `ture`. | string | `N`      | `true`        |
| `timeout`    | Running time(s).                                                   | int    | `N`      | `20`          |


## Case

```text
# Move the system time forward by 5 minutes and 30 seconds.
blade create time travel --offset 5m30s
{"code":200,"success":true,"result":"d8a016b96380d7f3"}
```

## Principle

Create the time offset：
- Set the target time by the `date -s` command；
- Disable synchronizing time automatically by the `timedatectl set-ntp false` command.

Destroy the time offset：
- Enable synchronizing time automatically by the `timedatectl set-ntp true` command
- Copy hardware time to system time by the `hwclock --hctosys` command.


## Q&A
Q: {"code":47000,"success":false,"error":"invalid `offset` parameter value: `100`. time: missing unit in duration 100"}

A：Execution failed because the `offset` parameter without unit was invalid.
