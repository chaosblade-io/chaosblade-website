---
id: blade create process kill
---

# 模拟杀进程实验

杀进程

## 介绍
此实验会指定进程号杀掉进程。支持命令行或者命令中进程匹配。

此实验可以验证程序的自愈能力，或者服务进程不存在时，系统的容错能力。

> 注：blade destroy销毁实验无法恢复被杀掉的进程，请谨慎使用

## 命令
* `blade create process kill -h`

## 参数

| 参数名           | 说明                | 类型     | 值          |
|---------------|-------------------|--------|------------|
| `process`     | 进程关键词，会在整个命令行中查找  | string | 例：`tomcat` |
| `process-cmd` | 进程命令，只会在命令中查找     | string | 例: `java`  |
| `count`       | 限制杀掉进程的数量，0 表示无限制 | int    |            |
| `signal`      | 指定杀进程的信号量，默认是 9   | string | 例:`15`     |
| `timeout`     | 设定运行时长，单位是秒，通用参数  | int    |            |


## 案例
```text
# 删除包含 SimpleHTTPServer 关键词的进程
blade create process kill --process SimpleHTTPServer

# 删除 java 进程
blade create process kill --process-cmd java

# 指定信号量和本地端口杀进程
blade c process kill --local-port 8080 --signal 15 

# 执行前
netstat -tanp | grep 8080
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      10764/java

# 执行后此进程已不存在
```

## 实现原理
--process 内部使用 ps -ef | grep KEY 查找；--process-cmd 内部使用 pgrep 命令查找。使用 kill -9 PIDS 杀死进程。

## 常见问题
Q：信号量有哪些？
A：Common kill signals

Signal name	Signal value	Effect
SIGHUP	1	Hangup
SIGINT	2	Interrupt from keyboard
SIGKILL	9	Kill signal
SIGTERM	15	Termination signal
SIGSTOP	17,19,23	Stop the process


Q：杀死的进程能否恢复
A：blade 命令不能恢复杀掉的进程
