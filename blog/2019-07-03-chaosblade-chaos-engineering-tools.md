---
title: Chaosblade, 阿里一个超级牛逼的混沌实验实施工具
tags: [ chaosblade ]
author: 1点25
author_url: https://juejin.cn/user/4353721774901806
author_image_url: https://p3-passport.byteimg.com/img/user-avatar/023f14b3a5377f09b98af09696e3c6ac~180x180.awebp
hide_table_of_contents: false
---

> 转自：https://juejin.cn/post/6844903879814053901
> 来源：稀土掘金

# Chaosblade是什么？

Chaosblade是遵循混沌工程（Chaos Engineering）原理的实验工具，用于模拟常见的故障场景，帮助提升分布式系统的可恢复性和对故障的容错性。
Chaosblade是建立在阿里巴巴近十年故障测试和演练实践基础上，结合了集团各业务的最佳创意和实践。
目前支持的演练场景有操作系统类的 CPU、磁盘、进程、网络，Java 应用类的 Dubbo、MySQL、Servlet 和自定义类方法延迟或抛异常等以及杀容器、杀 Pod，具体可执行 blade create -h 查看。
好了，上面的介绍是从Chaosblade的github主页抄的。
github主页地址：[chaosblade-github](https://github.com/chaosblade-io/chaosblade)
说白了，Chaosblade是一个故障模拟工具，可以模拟比如服务器CPU满了、磁盘满了、网络慢、Dubbo某个服务响应时间长、jvm中某个方法抛出异常、调用Mysql慢等等。所以这个工具对于大公司来说是非常非常有用的，因为可以提前模拟出各种各样的故障，从而保证系统的高可用与稳定。
<!--truncate-->

# Chaosblade怎么用？

用法非常简单，分为两步：

1. 下载压缩包并解压：github.com/chaosblade-…
2. 解压之后的文件中有一个blade的可执行文件，这就是Chaosblade提供的客户端工具，我们主要使用这个工具来进行故障模拟。

关于blade的各种参数详解，大家还是去github主页上去看吧，这里不介绍了，我主要想给大家看一下故障模拟的具体使用以及效果。
接下来会介绍Chaosblade六个使用场景：

- 模拟服务器CPU爆满
- 模拟服务器磁盘爆满
- 模拟调用某个Dubbo服务超时
- 模拟JVM中某个方法抛出异常或者修改方法返回值
- 模拟调用Mysql超时或出现异常
- 模拟服务器网络缓慢

## 场景一：服务器CPU爆满

故障演练前系统的cpu状态，直接使用 `top -o CPU` 命令查看：

![top](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/3/16bb7fde31ca7131~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
进行故障演练：
```
$ ./blade create cpu fullload
{"code":200,"success":true,"result":"a0682a98d0d7d900"}
```

命令执行后返回成功则证明故障演练成功，再查看`top -o CPU` 命令：
![top](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/3/16bb7fde32271a1d~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
我们通过结果可以看出来Chaosblade应该就是让自己去占满cpu从而使服务器的cpu爆满。
## 场景二：服务器磁盘爆满

如果要模拟磁盘爆满，实际上只需要在某个文件夹中去生成一个很大的文件就行了，所以我们这里创建一个/bladedisk文件夹。
进行故障演练前，/bladedisk文件夹的大小为：
```
$ du -sh /bladedisk/
  0B	/bladedisk/
```
进行故障演练，执行一下命令：
```
./blade create disk fill -d --mount-point /bladedisk --size 1024
```
正常情况下会在/bladedisk文件夹下创建一个chaos_filldisk.log.dat文件。此文件的大小为1024个字节。
我这里为什么说正常情况下，因为我用的是Max OX系统，在执行上面的命令时会报错。具体的错误已提交github issues，感兴趣的同学可以关注一下，issue地址。

> 小花絮：在提交issue时，我用的中文，但是被chaosblade-bot自动翻译为了英文，很厉害。

那么大家可以在自己的系统中试试，这个issue解决后，我会对文章进行更新后补充。大家这里只需要知道Chaosblade可以模拟这种场景以及对应的原理就行了。

## 场景三：调用某个Dubbo服务超时

官网的Demo中给我们提供了：

* [dubbo-provider](https://link.juejin.cn/?target=https%3A%2F%2Fchaosblade.oss-cn-hangzhou.aliyuncs.com%2Fdemo%2Fdubbo-provider-1.0-SNAPSHOT.jar)
* [dubbo-consumer](https://link.juejin.cn/?target=https%3A%2F%2Fchaosblade.oss-cn-hangzhou.aliyuncs.com%2Fdemo%2Fdubbo-consumer-1.0-SNAPSHOT.jar)

大家把上面的服务提供者和服务消费者jar包下载下来之后，进到下载目录，然后通过下面命令运行起来：
```
# 启动 dubbo-provider
nohup java -Djava.net.preferIPv4Stack=true -Dproject.name=dubbo-provider -jar dubbo-provider-1.0-SNAPSHOT.jar > provider.nohup.log 2>&1 &
# 稍等 2 秒，然后启动 dubbo-consumer
nohup java -Dserver.port=8080 -Djava.net.preferIPv4Stack=true -Dproject.name=dubbo-consumer -jar dubbo-consumer-1.0-SNAPSHOT.jar > consumer.nohup.log 2>&1 &
```

> nohup是linux中的命令，可以让java命令后台运行。

运行起来后，可以通过下面的命令来进行服务调用：
```
http://localhost:8080/hello?msg=world
```
正常情况下，该请求会很快的完成并返回：
```
{
"date": "Wed Jul 03 16:33:10 CST 2019",
"msg": "Dubbo Service: Hello world"
}
```
进行故障演练：
```
$ ./blade prepare jvm --process dubbo.consumer
{"code":200,"success":true,"result":"5cdbc31f46a3d621"}
$ ./blade create dubbo delay --time 3000 --service com.alibaba.demo.HelloService --methodname hello --consumer --process dubbo.consumer
{"code":200,"success":true,"result":"3e705e8babe8a86c"}
```

上面的命令会使consumer在调用com.alibaba.demo.HelloService服务的hello方法时增加3秒的延时。当我们访问上面访问的路径时会比之前等待的更久一点。
在对dubbo进行故障演练时，其实支持的细分场景很多，因为在dubbo中分为consumer和provider两种角色，当consumer在调用provider时，我们现在想使这个请求增加延时，我们既可以在provider端针对指定的服务增加延时，也可以在consumer调用时针对指定的服务进行延时，所以我们可以稍微看下上面的命令，它其实是在consumer进行控制的，命令也是支持在provider端进行控制的，我们运行一下以下命令：
```
blade create dubbo delay --help
```
将看到帮助中有下面的信息：
```
Flags:
      --appname string          The consumer or provider application name
      --consumer                To tag consumer role experiment.
      --effect-count string     The count of chaos experiment in effect
      --effect-percent string   The percent of chaos experiment in effect
  -h, --help                    help for delay
      --methodname string       The method name
      --offset string           delay offset for the time
      --process string          Application process name
      --provider                To tag provider experiment
      --service string          The service interface
      --time string             delay time (required)
      --timeout string          set timeout for experiment
      --version string          the service version
```
其中就有`--consumer` 和`--provider` ，表示的就是命令中可以控制服务调用的两端。所以如果我们想控制provider端，想让某个接口被调用时超时的话，是完全可以进行故障演练的。
那么关于底层原理的话，需要大家对Dubbo比较了解，Dubbo中是有动态配置功能的，所以Chaosblade应该也是利用了dubbo的动态配置功能。
## 场景四：JVM中某个方法抛出异常或者修改方法返回值

Chaosblade支持直接操作jvm中的方法，使它抛出异常或修改其返回值。
先准备一个MockJvm类：
```
package com;
import java.util.concurrent.TimeUnit;
public class MockJvm {
    public String test() {
        return "test...";
    }

    public static void main(String[] args) throws InterruptedException {
        MockJvm testJVM = new MockJvm();

        while (true) {
            try {
                System.out.println(testJVM.test());
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            TimeUnit.SECONDS.sleep(3);
        }
    }
}
```
这个类会每隔三秒调用一下test方法，并打印出方法的返回值，并且在捕获test方法所抛出的异常进行打印，test方法默认返回"test"。我们运行这个类，让这个类一直在运行状态，正常运行时，控制台会打印如下：
```
test...
test...
test...
test...
```
### 方法抛出异常
```
$ ./blade prepare jvm --process MockJvm
{"code":200,"success":true,"result":"5ff98509d2334906"}
$ ./blade create jvm throwCustomException --process MockJvm --classname com.MockJvm --methodname test --exception java.lang.Exception
{"code":200,"success":true,"result":"f9052478db2f7ffc"}
```
上面的命令模拟了MockJvm进程下的com.MockJvm类中的test方法会抛出java.lang.Exception异常。一旦这个命令执行成功，那么我们上面一直在运行的代码控制台将抛出异常：
```
test...
test...
test...
chaosblade-mock-exception
chaosblade-mock-exception
```
使用以下命令可以撤回刚刚的场景模拟：
```
./blade destroy f9052478db2f7ffc // f9052478db2f7ffc。
```
撤回之后，控制台将恢复正常的打印：
```
chaosblade-mock-exception
chaosblade-mock-exception
chaosblade-mock-exception
chaosblade-mock-exception
test...
test...
```
### 修改方法的返回值
使用以下命令可以修改方法的返回值：
```
$ ./blade create jvm return --process MockJvm --classname com.MockJvm --methodname test --value hahaha...
{"code":200,"success":true,"result":"9ffce12b1fdc2580"}
```
控制台将打印出：
```
test...
test...
test...
hahaha...
hahaha...
hahaha...
```
可以看到成功修改了test方法的返回值。
## 场景五：调用Mysql超时或出现异常
Chaosblade目前支持Mysql场景分为调用Mysql超时或者执行语句时出现异常。但是它是在JDBC这一层进行控制的，并没有真正的去控制mysql服务端。
这里先用JDBC写一个测试类：

```
package com;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

public class JDBCConnection {
    public static String url_encrypt="jdbc:mysql://127.0.0.1:3306/test?useSSL=false";
    public static String user="root";
    public static String password="Nice89163";

    public static void main(String[] args) throws Exception
    {
        Class.forName("com.mysql.jdbc.Driver");
        Connection conn  = DriverManager.getConnection(url_encrypt,user,password);
        Statement stmt= conn.createStatement();

        while (true) {
            try {
                LocalDateTime before = LocalDateTime.now();
                ResultSet rs = stmt.executeQuery("select * from t_test");
                LocalDateTime after = LocalDateTime.now();
                System.out.println("执行时间：" + (after.getSecond() - before.getSecond()));
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            TimeUnit.SECONDS.sleep(3);
        }

    }
}
```
这个JDBCConnection类直接使用JDBC来执行sql，依赖mysql-connector-java对应的jar。这里我在测试的时候发现，如果使用mysql-connector-java@5.1.47这个版本可以正常的进行故障模拟，如果使用mysql-connector-java@8.0.15版本则不能进行正常的故障模拟，具体原因还没有去查。
这个测试的功能是去进行select查询，并且如果在select的时候如果抛出异常会被捕获并且进行打印，并且还会计算select语句执行所花费的时间。
首先将上面的类运行起来，控制台将一直打印如下：
```
执行时间：0
执行时间：0
执行时间：0
```
### 调用Mysql抛出异常
运行下面的命令开始故障模拟：
```
$ ./blade prepare jvm --process JDBCConnection
{"code":200,"success":true,"result":"f278e66ddb1b4e11"}
$ ./blade create mysql throwCustomException --database test --host 127.0.0.1 --port 3306 --process JDBCConnection --sqltype select --table t_test --exception java.lang.Exception
{"code":200,"success":true,"result":"ddd6799da50f9201"}
```
命令执行成功后，控制台将打印出异常：
```
执行时间：0
执行时间：0
执行时间：0
Unexpected exception encountered during query.
Unexpected exception encountered during query.
```
使用以下命令可以撤回刚刚的场景模拟：
```
./blade destroy ddd6799da50f9201 
```
撤回之后，控制台将恢复正常的打印：
```
Unexpected exception encountered during query.
Unexpected exception encountered during query.
Unexpected exception encountered during query.
执行时间：0
执行时间：0
```
### 调用Mysql增加延迟
直接使用以下命令将使得在执行select时增加4秒的延时，注意都是在JDBC层控制的。
```
$ ./blade create mysql delay --database test --host 127.0.0.1 --port 3306 --process JDBCConnection --sqltype select --table t_test --time 4000
{"code":200,"success":true,"result":"8e5b35e76098caab"}
```
命令执行完成后，控制台将打印出：
```
执行时间：0
执行时间：0
执行时间：4
执行时间：4
执行时间：4
```
## 场景六：服务器网络缓慢
Chaosblade也可以对网络进行控制，比如运行下面命令可以限制经过eth0网卡的网络都会延迟3秒：
```
./blade create network delay --interface eth0 --time 3000
```
不过Mac系统还不支持这个场景，因为它实际是利用的linux系统下的tc(Traffic Control)命令，所以要模拟的话就要使用linux系统，这里我就不去模拟了。
## 总结
本来，我是打算写一篇关于Chaosblade完整使用的文章的，但是目前看来它还不是很完善，所以这次就写到这里，我要去github上面提issue去了。
但是，我相信通过这篇文章，大家应该对Chaosblade的作用和功能都有所了解了，你们有收获就是我的目的。
