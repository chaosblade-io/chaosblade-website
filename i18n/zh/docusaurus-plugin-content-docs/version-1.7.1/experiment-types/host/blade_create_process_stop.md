---
id: blade create process stop
---

# 模拟暂停进程实验

暂停进程

## 介绍
此实验会暂停进程。支持命令行或者命令中进程匹配。

此实验可以验证程序 Hang 时，系统的容错能力。

## 命令
* `blade create process stop -h`

## 参数

| 参数名           | 说明                | 类型     | 值          |
|---------------|-------------------|--------|------------|
| `process`     | 进程关键词，会在整个命令行中查找  | string | 例：`tomcat` |
| `process-cmd` | 进程命令，只会在命令中查找     | string | 例: `java`  |
| `timeout`     | 设定运行时长，单位是秒，通用参数  | int    |            |


## 案例
```text
# 暂停包含 SimpleHTTPServer 关键词的进程
blade create process stop --process SimpleHTTPServer

# 暂停 java 进程
blade create process stop --process-cmd java
```

## 实现原理
--process 内部使用 ps -ef | grep KEY 查找；--process-cmd 内部使用 pgrep 命令查找。使用 kill -STOP PIDS 暂停进程，使用 kill -CONT PIDS 恢复进程。

## 常见错误
Q：查找不到 UID，无法恢复暂停的进程
A：手动执行 kill -CONT PIDS
