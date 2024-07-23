---
id: blade create jvm
---

# Jvm相关场景
## 介绍
jvm 本身相关场景，以及可以指定类，方法注入延迟、返回值、异常故障场景，也可以编写 groovy 和 java 脚本来实现复杂的场景。目前支持的场景如下
* [blade create jvm CodeCacheFilling](blade_create_jvm_CodeCacheFilling.md) 填充 jvm code cache
* [blade create jvm OutOfMemoryError](blade_create_jvm_OutOfMemoryError.md) 内存溢出，支持堆、栈、metaspace 区溢出
* [blade create jvm cpufullload](blade_create_jvm_cpufullload.md) java 进程 CPU 使用率满载
* [blade create jvm delay](blade_create_jvm_delay.md) 方法延迟
* [blade create jvm return](blade_create_jvm_return.md) 指定返回值
* [blade create jvm script](blade_create_jvm_script.md) 编写 groovy 和 java 实现场景
* [blade create jvm throwCustomException](blade_create_jvm_throwCustomException.md) 抛自定义异常场景

## 参数
此处列举 jvm 支持的通用参数：
```
--pid string         指定 java 进程号
--process string     指定 java 进程名，如果同时填写
--timeout string     设定运行时长，单位是秒，通用参数
```

JVM 方法级别的故障场景通用参数：
```
--classname string        指定类名，必须是实现类，带全包名，例如 com.xxx.xxx.XController (必填项)
--methodname string       指定方法名，注意相同方法名的方法都会被注入相同故障 (必填项)
--after                   方法执行完成返回前注入故障，比如修改复杂的返回对象
--effect-count string     限制影响数量
--effect-percent string   限制影响百分比
```

各场景还有自身所独有的参数，可以在每个场景文档中查看

## 案例
此处举个简单的例子：当前 Java 进程 CPU 使用率满载
```
# 先执行 prepare 操作
blade prepare jvm --process tomcat
{"code":200,"success":true,"result":"af9ec083eaf32e26"}

# 执行进程内 CPU 满载
blade create jvm cpufullload --process tomcat
{"code":200,"success":true,"result":"2a97b8c2fe9d7c01"}
```

<!-- 这里验证结果图片 -->

<!-- 验证结果： -->


![-w461](/img/doc-image/15756201454147/15758721082138.jpg)

```
# 停止实验
blade destroy 2a97b8c2fe9d7c01

# 卸载 agent
blade revoke af9ec083eaf32e26
```

## 实验原理

## 常见问题