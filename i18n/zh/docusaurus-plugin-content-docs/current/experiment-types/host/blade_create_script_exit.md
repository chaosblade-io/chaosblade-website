---
id: blade create script exit
---

# 模拟脚本函数执行退出实验

## 介绍

通过指定脚本和函数执行退出场景。

## 命令

* `blade create script exit -h`

## 参数

| 参数名             | 说明               | 类型     | 值                          |
|-----------------|------------------|--------|----------------------------|
| `exit-code`     | 退出码，默认值是 1       | int    | 例: `1`                     |
| `exit-message`  | 退出信息             | string | 例: `this-is-error-message` |
| `file`          | 脚本路径（必要参数）       | string | 例: `test.sh`               |
| `function-name` | 脚本中的函数名（必要参数）    | string | 例: `start0`                |
| `timeout`       | 设定运行时长，单位是秒，通用参数 | int    | 例: `20`                    |

## 案例

```text
# blade create script exit --exit-code 1 --exit-message this-is-error-message --file test.sh --function-name start0
{"code":200,"success":true,"result":"d8a016b96380d7f3"}

# 执行脚本会触发场景。查看脚本修改如下:
start0() {
    echo this-is-error-message;exit 1
    ...
}
```

## 实现原理

备份原有脚本，根据函数名添加 `echo` 和 `exit` 命令。恢复时还原脚本。

## 常见问题
Q: {"code":602,"success":false,"error":"get too many lines by the install function name"} 

A：查找到多个函数，不能执行
