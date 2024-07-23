---
title: 模拟脚本函数执行延迟实验
---

## 介绍

通过指定脚本和函数执行延迟场景。

## 命令

- `blade create script delay -h`

## 参数

| 参数名          | 说明                             | 类型   | 值            |
| --------------- | -------------------------------- | ------ | ------------- |
| `time`          | 延迟时间，单位是毫秒（必要参数） | int    | 例：`10000`   |
| `file`          | 脚本路径（必要参数）             | string | 例: `test.sh` |
| `function-name` | 脚本中的函数名（必要参数）       | string | 例: `start0`  |
| `timeout`       | 设定运行时长，单位是秒，通用参数 | int    | 例: `30`      |

## 案例

```text
# blade create script delay --time 10000 --file test.sh --function-name start0
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# 会在脚本中添加如下命令：
start0() {
    sleep 10.000000
    ...
}
```

## 实现原理

备份原有脚本，根据函数名添加 `sleep` 命令。恢复时还原脚本。

## 常见问题

Q: {"code":602,"success":false,"error":"get too many lines by the install function name"}

A：查找到多个函数，不能执行。
