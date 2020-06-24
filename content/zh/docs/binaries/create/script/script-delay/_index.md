---
title: "脚本函数执行延迟"
linkTitle: "脚本函数执行延迟"
weight: 1
type: docs
description: >
  通过指定脚本和函数执行延迟场景。
---
## 参数

```text
--time string      延迟时间，单位是毫秒（必要参数）
--timeout string   设定运行时长，单位是秒，通用参数
--file string      脚本路径（必要参数）
--function-name string  脚本中的函数名（必要参数） 
```

## 案例

```text
#  blade create script delay --time 10000 --file test.sh --function-name start0

{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# 会在脚本中添加如下命令：
start0() {
sleep 10.000000
...
}
```

## 实现原理

备份原有脚本，根据函数名添加 `sleep` 命令

## 常见问题

Q: `{"code":602,"success":false,"error":"get too many lines by the install function name"}`

A：查找到多个函数，不能执行
