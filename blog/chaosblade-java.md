---
title: ChaosBlade Java 场景性能优化，那些你不知道的事
authors: binbin
tags: [ chaosblade ]
description: 本文会着重介绍什么chaosblade java场景性能优化的实现。
hide_table_of_contents: false
---

# 1.介绍
![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662013958501-7c1374a2-b064-47e3-8756-00eb0cd5d1b7.png#clientId=u52ad7d43-5028-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=137&id=u1ecc8f38&margin=%5Bobject%20Object%5D&name=image.png&originHeight=274&originWidth=1768&originalType=binary&ratio=1&rotation=0&showTitle=false&size=42360&status=done&style=none&taskId=u6cf92846-7846-4c93-b7a6-927b4be4787&title=&width=884)

[ChaosBlade](https://chaosblade.io/) 是阿里巴巴开源的一款遵循混沌工程原理和混沌实验模型的实验注入工具，帮助企业提升分布式系统的容错能力，并且在企业上云或往云原生系统迁移过程中业务连续性保障。

目前支持的场景有：基础资源、Java 应用、C++ 应用、Docker 容器以及 Kubernetes 平台。该项目将场景按领域实现封装成单独的项目，不仅可以使领域内场景标准化实现，而且非常方便场景水平和垂直扩展，通过遵循混沌实验模型，实现 ChaosBlade cli 统一调用。

不过Java场景下的故障注入目前有一些性能问题,主要体现在故障注入时会让CPU的使用率大幅度抖动,严重情况下可能会导致CPU的使用率100%。这种情况对于线下服务的影响还好，但是对于线上服务就比较严重了，因为CPU的使用率较高有可能会导致服务的整体性能变差，从而影响接口的耗时。

**通过对ChaosBlade Java 场景的性能优化，使CPU在故障注入时的抖动得到了有效的控制，不会再出现CPU使用率达到100%的抖动，经过测试在线上8C，4G，QPS 3K左右的服务实例上注入Dubbo 自定义抛异常的故障，CPU的使用率可以控制在40%左右的瞬时抖动范围内,性能整体提升近2.5倍。**

本文将会详细的介绍影响性能的问题点以及是如何对这些问题进行优化的。

# 2.Java场景
在介绍前先了解下ChaosBlade Java场景的注入流程。![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014005578-270f85a6-fd83-4e0a-b43b-dc97eb26f510.png#clientId=u52ad7d43-5028-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=232&id=u536ca7fe&margin=%5Bobject%20Object%5D&name=image.png&originHeight=464&originWidth=1598&originalType=binary&ratio=1&rotation=0&showTitle=false&size=107988&status=done&style=none&taskId=u5f0cd5e6-7193-4e6e-8b83-392a6b276dc&title=&width=799)Java场景的故障注入是基于字节码增强框架JVM-Sandbox实现的，注入一个故障分为两步：

1. ChaosBlade 执行prepare命令，触发sandbox对目标JVM挂载 Java agent。
2. ChaosBlade 执行create命令，触发sandbox对目标JVM进行字节码增强，从而达到故障注入的目的。


# 3.prepare(挂载)阶段优化

## 3.1 现象
本地模拟一个简单的HTTP服务，控制其CPU Idle在50%左右，当执行blade prepare jvm --pid挂载agent后，发现CPU空闲率迅速下降，并且下降的幅度较大。在生产中进行故障注入有可能会直接让Idle掉低从而触发告警![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014042664-6aa32560-c4ad-4cf9-af1c-12bbe48d3ef6.png#clientId=u52ad7d43-5028-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=172&id=u78f2e45e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=274&originWidth=1188&originalType=binary&ratio=1&rotation=0&showTitle=false&size=82193&status=done&style=none&taskId=u4e1a626e-a680-4a97-899e-090dc4062f5&title=&width=745)

## 3.2 定位
通过采集CPU profile生成火焰图来观察在执行blade prepare时CPU的使用情况，如下图可以看到loadPlugins方法是资源消耗的重灾区
[image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014182779-f714d227-c3c4-45ce-822b-7b68bc23e0b8.png#clientId=u52ad7d43-5028-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=325&id=u24cbcf93&margin=%5Bobject%20Object%5D&name=image.png&originHeight=484&originWidth=1074&originalType=binary&ratio=1&rotation=0&showTitle=false&size=354434&status=done&style=none&taskId=u2fe4bf22-dd36-46c5-adf4-77b0adb50c6&title=&width=721)

loadPlugins方法中主要是加载ChaosBlade Java中支持的全部插件，例如dubbo,redis,kafka等。当加载了这些插件后就可以进行故障注入了。加载插件的过程中会对插件中定义的类以及方法进行字节码增强。

![attach&加载.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014673785-ea235bde-77c7-49da-a083-df8cf33a8fee.png#clientId=u1e121cd7-cea1-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u9a60fe1b&margin=%5Bobject%20Object%5D&name=attach%26%E5%8A%A0%E8%BD%BD.png&originHeight=258&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30862&status=done&style=none&taskId=u69b3ea87-d7a9-4501-ab63-a88d77fea12&title=)

导致CPU消耗的问题就在于加载全量的插件耗时较大，而我们故障注入时会选择具体某个插件进行故障注入，显然全量加载并不是最优解

## 3.3 优化
优化思路:既然故障注入时会选择具体的插件，那么通过懒加载的方式即可解决，当我们要针对哪一个插件故障注入就加载哪个插件，加载的粒度变小，CPU的消耗自然就小了
![attach.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014682629-b696cbe2-83ff-42d4-bcd8-ffa3212b51c3.png#clientId=u1e121cd7-cea1-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=uf7664a78&margin=%5Bobject%20Object%5D&name=attach.png&originHeight=250&originWidth=1438&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28442&status=done&style=none&taskId=ua75afa23-dfe9-4a58-967f-918be317eac&title=)

核心代码：
在故障注入阶段，通过指定的插件进行懒加载。
```java
private void lazyLoadPlugin(ModelSpec modelSpec, Model model) throws ExperimentException {
    PluginLifecycleListener listener = ManagerFactory.getListenerManager().getPluginLifecycleListener();
    if (listener == null) {
        throw new ExperimentException("can get plugin listener");
    }
    PluginBeans pluginBeans = ManagerFactory.getPluginManager().getPlugins(modelSpec.getTarget());
    if (pluginBeans == null) {
        throw new ExperimentException("can get plugin bean");
    }
    if (pluginBeans.isLoad()) {
        return;
    }
    listener.add(pluginBean);
    ManagerFactory.getPluginManager().setLoad(pluginBeans, modelSpec.getTarget());
}
```
详细代码PR:[https://github.com/ChaosBlade-io/ChaosBlade-exec-jvm/pull/233](https://github.com/chaosblade-io/chaosblade-exec-jvm/pull/233)

## 3.4 改进后效果
CPU Idle 下降幅度降低
![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014777027-115887c7-3f45-4920-ac86-386ea965676b.png#clientId=u1e121cd7-cea1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=214&id=u9b9f16de&margin=%5Bobject%20Object%5D&name=image.png&originHeight=378&originWidth=1157&originalType=binary&ratio=1&rotation=0&showTitle=false&size=75312&status=done&style=none&taskId=u0d4cf015-6977-4180-af58-a7e30591c40&title=&width=655.5)

火焰图中的CPU使用率几乎“消失”

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014826580-a39a6aeb-1aaf-4395-9e86-a52c722a7e93.png#clientId=u1e121cd7-cea1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=284&id=u706b2e3e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=484&originWidth=1146&originalType=binary&ratio=1&rotation=0&showTitle=false&size=413253&status=done&style=none&taskId=ua87d9097-7a43-4975-b0b4-35889169026&title=&width=673)

# 4.create(注入)阶段优化
在实际使用中发现故障注入导致CPU Idle跌底的情况比较多，跌底的持续时间是比较短暂的基本都在20S左右，有一些情况是和目标服务的业务代码有关系或者是和目标服务的jvm参数设置有关，本文只介绍由ChaosBlade导致的或间接导致的CPU Idle跌底问题。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662014860747-8535e13d-dfa9-45eb-b9ca-56a51487c8a6.png#clientId=u1e121cd7-cea1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=203&id=uec06453d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=335&originWidth=1188&originalType=binary&ratio=1&rotation=0&showTitle=false&size=66082&status=done&style=none&taskId=u80bd32f1-7e4c-4bc7-821a-6d0063e4e10&title=&width=719)

> CPU Idle跌底:这里指的是CPU 空闲率降低为0，同时意味着CPU 使用率达到了100%


## 4.1 dubbo故障优化

### 4.1.1 问题描述
ChaosBlade中支持对dubbo provider或者consumer进行故障注入（例如抛异常），当一个服务既是provider又是consumer的时候，如果对provider故障注入则会触发bug，有可能会导致CPU Idle跌底。

**正常情况：**一个既是provider又是consumer的服务，它的请求处理流程是流量会首先进入到provider经过处理后交由业务逻辑执行，最后通过consumer将请求转发出去。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662015356816-ccd9ffd2-8b25-4299-8271-109f11f3af83.png#clientId=u2a5f2d5c-785c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=223&id=ua9805d3c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=446&originWidth=2062&originalType=binary&ratio=1&rotation=0&showTitle=false&size=84435&status=done&style=none&taskId=u363047b1-4e34-4518-ac7d-973c7beb21d&title=&width=1031)

**针对consumer故障注入：**当利用ChaosBlade对consumer进行故障注入时，流量到达consumer就会抛出异常，不会将流量真正的转发出去，从而达到一个模拟故障发生的效果。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662015418084-149453ef-e51d-4ebf-ae78-ef72bd75c610.png#clientId=u2a5f2d5c-785c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=310&id=u4e441628&margin=%5Bobject%20Object%5D&name=image.png&originHeight=620&originWidth=2080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=109051&status=done&style=none&taskId=u07dd9a40-afa8-4df7-9e7e-a34c5b07b51&title=&width=1040)

**针对provider故障注入：**当利用ChaosBlade对provider进行故障注入时，流量到达provider就会抛出异常，不会将流量向下转发。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662015421125-2b212d41-659f-42b7-af77-75bd47f6a427.png#clientId=u2a5f2d5c-785c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=311&id=uc41e07ca&margin=%5Bobject%20Object%5D&name=image.png&originHeight=622&originWidth=2082&originalType=binary&ratio=1&rotation=0&showTitle=false&size=108382&status=done&style=none&taskId=u5ce1b3ab-81a4-45fb-8850-3fd25e6c4a8&title=&width=1041)

**上面说的都是预期效果，实际上ChaosBlade无论是对provider或者consumer进行故障注入时，都会同时provider以及consumer同时进行故障注入，这就有可能造成额外的资源浪费**。

1. 字节码增强的类变的多了
2. 例如当注入provider故障时，我们希望流量不要经过业务逻辑，因为一旦是在consumer也抛出了异常，流量返回时自然要经过业务逻辑的异常处理（例如打印error日志，重试等），这就有可能因为业务逻辑的处理问题导致CPU Idle下降。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662015488924-3b805ca7-7b55-4500-8225-c90e5d7285d6.png#clientId=u2a5f2d5c-785c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=306&id=u4b3c3902&margin=%5Bobject%20Object%5D&name=image.png&originHeight=612&originWidth=2108&originalType=binary&ratio=1&rotation=0&showTitle=false&size=112277&status=done&style=none&taskId=u8fd572bc-c7eb-4e0f-b4cc-3423c81e79a&title=&width=1054)

**问题原因:因为ChaosBlade的字节码增强逻辑是按照插件的粒度进行的，例如dubbo就属于一个插件，不过像dubbo和kafka这种既有针对provider又有针对consumer故障注入的插件就会同时对provider和consumer都注入故障了。**

### 4.1.2 优化
在加载插件的时候，根据具体加载的插件名按需加载，例如执行命令:
```shell
./blade create dubbo throwCustomException --provider --exception Java.lang.Exception --service org.apache.dubbo.UserProvider --methodname GetUser 
```
代表实际要针对dubbo的provider注入故障，那么就只加载provider插件进行字节码增强。

修改的核心代码：
```java
private void lazyLoadPlugin(ModelSpec modelSpec, Model model) throws ExperimentException {
    // ...... 省略
    for (PluginBean pluginBean : pluginBeans.getPluginBeans()) {
        String flag = model.getMatcher().get(pluginBean.getName());
        if ("true".equalsIgnoreCase(flag)) {
            listener.add(pluginBean);
            break;
        }
        listener.add(pluginBean);
    }
    // ...... 省略
}
}
```
相关pr:[https://github.com/ChaosBlade-io/ChaosBlade-exec-jvm/pull/267](https://github.com/chaosblade-io/chaosblade-exec-jvm/pull/267)


## 4.2 自定义脚本故障优化

### 4.2.1 问题描述
在使用ChaosBlade 注入自定义脚本的故障时导致CPU Idle跌底，自定义脚本是ChaosBlade jvm故障中支持的一种方式，指的是用户可以编写任意一段Java代码，然后将这段代码注入到对应的目标类和方法上，这样的方式灵活度非常高，通过ChaosBlade的自定义脚本注入故障可以做很多事情。

ChaosBlade命令:
```shell
./blade c jvm script --classname com.example.xxx.HelloController --methodname Hello --script-content .....
```

### 4.2.2 问题排查
我们抓取了故障注入时的火焰图以及jstack日志，通过jstack打印的线程堆栈发现了一些问题。

1. 在故障注入后线程数量会突然上升
2. 有部分线程是blocked状态

**故障注入前:**

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662024346261-4f84e22b-db13-4626-a28d-8bb0edbbed64.png#clientId=u0a32c8ae-289c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=421&id=u3c6a7cd4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=716&originWidth=612&originalType=binary&ratio=1&rotation=0&showTitle=false&size=84822&status=done&style=none&taskId=u0a4730b2-934b-4365-8cf9-509d3a08f42&title=&width=360)

**故障注入后:**

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662024384319-6c65bb55-30d3-454c-9903-3259db20ada5.png#clientId=u0a32c8ae-289c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=456&id=uccb4930e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=768&originWidth=612&originalType=binary&ratio=1&rotation=0&showTitle=false&size=97382&status=done&style=none&taskId=ube55edef-27ae-4a7b-91fa-f9c7096278c&title=&width=363)

BLOCKED的线程堆栈:
```java
Stack Trace is: 
Java.lang.Thread.State: RUNNABLE
at Java.util.zip.ZipFile.getEntryTime(Native Method)
at Java.util.zip.ZipFile.getZipEntry(ZipFile.Java:586)
at Java.util.zip.ZipFile.access$900(ZipFile.Java:60)
at Java.util.zip.ZipFile$ZipEntryIterator.next(ZipFile.Java:539)
- locked <0x00000006c0a57670> (a sun.net.www.protocol.jar.URLJarFile)
at Java.util.zip.ZipFile$ZipEntryIterator.nextElement(ZipFile.Java:514)
at Java.util.zip.ZipFile$ZipEntryIterator.nextElement(ZipFile.Java:495)
at Java.util.jar.JarFile$JarEntryIterator.next(JarFile.Java:258)
at Java.util.jar.JarFile$JarEntryIterator.nextElement(JarFile.Java:267)
at Java.util.jar.JarFile$JarEntryIterator.nextElement(JarFile.Java:248)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine$InMemoryJavaFileManager.processJar(JavaCodeScriptEngine.Java:421)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine$InMemoryJavaFileManager.listUnder(JavaCodeScriptEngine.Java:401)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine$InMemoryJavaFileManager.find(JavaCodeScriptEngine.Java:390)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine$InMemoryJavaFileManager.list(JavaCodeScriptEngine.Java:375)
at com.sun.tools.Javac.api.ClientCodeWrapper$WrappedJavaFileManager.list(ClientCodeWrapper.Java:231)
at com.sun.tools.Javac.jvm.ClassReader.fillIn(ClassReader.Java:2796)
at com.sun.tools.Javac.jvm.ClassReader.complete(ClassReader.Java:2446)
at com.sun.tools.Javac.jvm.ClassReader.access$000(ClassReader.Java:76)
at com.sun.tools.Javac.jvm.ClassReader$1.complete(ClassReader.Java:240)
at com.sun.tools.Javac.code.Symbol.complete(Symbol.Java:574)
at com.sun.tools.Javac.comp.MemberEnter.visitTopLevel(MemberEnter.Java:507)
at com.sun.tools.Javac.tree.JCTree$JCCompilationUnit.accept(JCTree.Java:518)
at com.sun.tools.Javac.comp.MemberEnter.memberEnter(MemberEnter.Java:437)
at com.sun.tools.Javac.comp.MemberEnter.complete(MemberEnter.Java:1038)
at com.sun.tools.Javac.code.Symbol.complete(Symbol.Java:574)
at com.sun.tools.Javac.code.Symbol$ClassSymbol.complete(Symbol.Java:1037)
at com.sun.tools.Javac.comp.Enter.complete(Enter.Java:493)
at com.sun.tools.Javac.comp.Enter.main(Enter.Java:471)
at com.sun.tools.Javac.main.JavaCompiler.enterTrees(JavaCompiler.Java:982)
at com.sun.tools.Javac.main.JavaCompiler.compile(JavaCompiler.Java:857)
at com.sun.tools.Javac.main.Main.compile(Main.Java:523)
at com.sun.tools.Javac.api.JavacTaskImpl.doCall(JavacTaskImpl.Java:129)
at com.sun.tools.Javac.api.JavacTaskImpl.call(JavacTaskImpl.Java:138)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine.compileClass(JavaCodeScriptEngine.Java:149)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.Java.JavaCodeScriptEngine.compile(JavaCodeScriptEngine.Java:113)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.base.AbstractScriptEngineService.doCompile(AbstractScriptEngineService.Java:82)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.base.AbstractScriptEngineService.compile(AbstractScriptEngineService.Java:69)
at com.alibaba.ChaosBlade.exec.plugin.jvm.script.model.DynamicScriptExecutor.run(DynamicScriptExecutor.Java:74)
at com.alibaba.ChaosBlade.exec.common.injection.Injector.inject(Injector.Java:73)
at com.alibaba.ChaosBlade.exec.common.aop.AfterEnhancer.afterAdvice(AfterEnhancer.Java:46)
at com.alibaba.ChaosBlade.exec.common.plugin.MethodEnhancer.afterAdvice(MethodEnhancer.Java:47)
at com.alibaba.ChaosBlade.exec.bootstrap.jvmsandbox.AfterEventListener.onEvent(AfterEventListener.Java:93)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleEvent(EventListenerHandler.Java:116)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleOnEnd(EventListenerHandler.Java:426)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleOnReturn(EventListenerHandler.Java:363)
```
通过线程堆栈可以看到线程主要是在解压jar文件是阻塞了，为什么会阻塞到这里呢？

其实是在ChaosBlade 注入自定义脚本时，自定义脚本（Java代码）只是被当作一段字符串来处理，当真正的激活插件时会把这段字符串解析，然后变成Java代码让jvm进行加载编译并执行这段代码。

![脚本编译.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662024674788-83a1c267-9a95-416b-a84c-c8a8c1ffbb5a.png#clientId=u854e1a66-dc20-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u15e852b9&margin=%5Bobject%20Object%5D&name=%E8%84%9A%E6%9C%AC%E7%BC%96%E8%AF%91.png&originHeight=666&originWidth=1676&originalType=binary&ratio=1&rotation=0&showTitle=false&size=115604&status=done&style=none&taskId=u046c9be7-044c-44ac-997a-b5d9a724362&title=)

**问题就在这里,当故障注入时外部流量也是在源源不断的调用当前服务的。那么按照上面说的逻辑就有可能在激活插件时，因为外部流量也在不断调用，导致大量请求都来解析自定义脚本，这样的话就造成了线程被blocked，因为解析自定义脚本到正确的让jvm加载它，这个过程是相对复杂且缓慢的，而且有的地方是要保证线程安全的。**
> 其实ChaosBlade 也做了缓存，只要自定义脚本被编译过一次，后面的请求就会直接执行这个脚本了，但这样的缓存在并发请求的场景下编译效果并不好


### 4.2.3 优化
通过上面的排查，其实应该可以想到优化手段了，那就是要让自定义脚本的加载时间提前。

ChaosBlade注入故障分为两步,第一步挂载agent时拿不到自定义脚本信息，那么就在第二步**激活插件前进行加载**（因为一旦插件被激活后就有流量会执行到故障注入的埋点方法从而触发脚本的编译了）

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662024727494-f322ffc3-e397-406e-8d15-370d24673b78.png#clientId=u854e1a66-dc20-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=334&id=ub7fddc91&margin=%5Bobject%20Object%5D&name=image.png&originHeight=668&originWidth=1668&originalType=binary&ratio=1&rotation=0&showTitle=false&size=119885&status=done&style=none&taskId=uaf619068-ab50-4976-8b63-5af78a7b60b&title=&width=834)

**这个优化思路不仅仅适用于自定义脚本故障，例如自定义抛异常故障也是可以的。**

**在自定义抛异常的故障执行中，也是当流量过来时才会根据用户输入的异常类字符进行反射加载，类的加载(classloader)底层也是需要加锁的，所以也有可能造成线程blocked.**

优化内容:增加故障前置执行接口，针对需要在故障注入前，执行某些动作的插件可以去实现它。
```java
public interface PreActionExecutor {
    /**
     * Pre run executor
     *
     * @param enhancerModel
     * @throws Exception
     */
    void preRun(EnhancerModel enhancerModel) throws ExperimentException;
}

```
```java
private void applyPreActionExecutorHandler(ModelSpec modelSpec, Model model)
        throws ExperimentException {
    ActionExecutor actionExecutor = modelSpec.getActionSpec(model.getActionName()).getActionExecutor();
    if (actionExecutor instanceof PreActionExecutor) {
        EnhancerModel enhancerModel = new EnhancerModel(EnhancerModel.class.getClassLoader(), model.getMatcher());
        enhancerModel.merge(model);
        ((PreActionExecutor) actionExecutor).preRun(enhancerModel);
    }
}
```
相关pr:[https://github.com/ChaosBlade-io/ChaosBlade-exec-jvm/pull/269](https://github.com/chaosblade-io/chaosblade-exec-jvm/pull/269)

## 4.3 日志打印优化

###  4.3.1 问题描述
日志打印导致的CPU Idle跌底问题主要有两方面:

1. 业务系统内部自身的日志框架，例如使用log4j/logback同步日志打印，如果在注入故障后（例如抛异常）**很有可能因为业务系统处理异常并打印日志导致线程大面积被blocked。**因为同步日志打印是需要加锁处理，并且异常堆栈是相对内容较多的打印也相对耗时，从而当QPS较高时可能会导致大量线程被阻塞。
```java
- locked <0x00000006f08422d0> (a org.apache.log4j.DailyRollingFileAppender)
at org.apache.log4j.helpers.AppenderAttachableImpl.appendLoopOnAppenders(AppenderAttachableImpl.Java:66)
at org.apache.log4j.Category.callAppenders(Category.Java:206)
- locked <0x00000006f086daf8> (a org.apache.log4j.Logger)
at org.apache.log4j.Category.forcedLog(Category.Java:391)
at org.apache.log4j.Category.log(Category.Java:856)
at org.slf4j.impl.Log4jLoggerAdapter.log(Log4jLoggerAdapter.Java:601)
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662024805257-1df804ba-b2f4-4718-b85f-576efda49d21.png#clientId=u854e1a66-dc20-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=307&id=u7fc7ec6d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=435&originWidth=612&originalType=binary&ratio=1&rotation=0&showTitle=false&size=115307&status=done&style=none&taskId=u0fc9e5fd-9ce3-4d99-971d-b9c08f05cd2&title=&width=432)

2. ChaosBlade 自身的日志打印,每次故障注入规则匹配成功时都会输出info日志
```java
LOGGER.info("Match rule: {}", JsonUtil.writer().writeValueAsString(model));
```
在输出日志的时候都会将故障模型使用jackson序列化输出,这会触发类加载（加锁操作）当有大量请求时可能会导致大量线程阻塞。
```java
Java.lang.Thread.State: RUNNABLE
at Java.lang.String.charAt(String.Java:657)
at Java.io.UnixFileSystem.normalize(UnixFileSystem.Java:87)
at Java.io.File.<init>(File.Java:279)
at sun.net.www.protocol.file.Handler.openConnection(Handler.Java:80)
- locked <0x00000000c01f2740> (a sun.net.www.protocol.file.Handler)
at sun.net.www.protocol.file.Handler.openConnection(Handler.Java:72)
- locked <0x00000000c01f2740> (a sun.net.www.protocol.file.Handler)
at Java.net.URL.openConnection(URL.Java:979)
at sun.net.www.protocol.jar.JarFileFactory.getConnection(JarFileFactory.Java:65)
at sun.net.www.protocol.jar.JarFileFactory.getPermission(JarFileFactory.Java:154)
at sun.net.www.protocol.jar.JarFileFactory.getCachedJarFile(JarFileFactory.Java:126)
at sun.net.www.protocol.jar.JarFileFactory.get(JarFileFactory.Java:81)
- locked <0x00000000c00171f0> (a sun.net.www.protocol.jar.JarFileFactory)
at sun.net.www.protocol.jar.JarURLConnection.connect(JarURLConnection.Java:122)
at sun.net.www.protocol.jar.JarURLConnection.getInputStream(JarURLConnection.Java:152)
at Java.net.URL.openStream(URL.Java:1045)
at Java.lang.ClassLoader.getResourceAsStream(ClassLoader.Java:1309)
......
at Java.lang.reflect.Method.invoke(Method.Java:498)
at com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.Java:689)
at com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.Java:755)
at com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.Java:178)
at com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.Java:728)
at com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.Java:755)
at com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.Java:178)
at com.fasterxml.jackson.databind.ser.DefaultSerializerProvider._serialize(DefaultSerializerProvider.Java:480)
at com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.serializeValue(DefaultSerializerProvider.Java:319)
at com.fasterxml.jackson.databind.ObjectWriter$Prefetch.serialize(ObjectWriter.Java:1516)
at com.fasterxml.jackson.databind.ObjectWriter._writeValueAndClose(ObjectWriter.Java:1217)
at com.fasterxml.jackson.databind.ObjectWriter.writeValueAsString(ObjectWriter.Java:1086)
at com.alibaba.ChaosBlade.exec.common.injection.Injector.inject(Injector.Java:69)
at com.alibaba.ChaosBlade.exec.common.aop.AfterEnhancer.afterAdvice(AfterEnhancer.Java:46)
at com.alibaba.ChaosBlade.exec.common.plugin.MethodEnhancer.afterAdvice(MethodEnhancer.Java:47)
at com.alibaba.ChaosBlade.exec.bootstrap.jvmsandbox.AfterEventListener.onEvent(AfterEventListener.Java:93)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleEvent(EventListenerHandler.Java:116)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleOnEnd(EventListenerHandler.Java:426)
at com.alibaba.jvm.sandbox.core.enhance.weaver.EventListenerHandler.handleOnReturn(EventListenerHandler.Java:363)
at Java.com.alibaba.jvm.sandbox.spy.Spy.spyMethodOnReturn(Spy.Java:192)

```

###  4.3.2 优化
关于业务系统的日志打印引发的线程block，不在ChaosBlade优化的范围内，大家有遇到类似情况可以自行解决。

解决的思路:

1. 日志同步打印改为异步打印
2. ChaosBlade自定义抛异常时的错误堆栈可以尽量忽略，减少日志输出的内容。

关于ChaosBlade 打印日志的优化就比较简单了，只需要将match rule序列化故障模型的部分替换掉即可。将Model实现toString，打印时直接打印Model即可。
```java
LOGGER.info("Match rule: {}", model);
```
```java
@Override
public String toString() {
    return "Model{" +
            "target='" + target + '\'' +
            ", matchers=" + matcher.getMatchers().toString() +
            ", action=" + action.getName() +
            '}';
}
```
相关pr:[https://github.com/ChaosBlade-io/ChaosBlade-exec-jvm/pull/260](https://github.com/chaosblade-io/chaosblade-exec-jvm/pull/260)

# 5.Metaspace OOM优化
Metaspace 是什么，引用官方介绍
```java
Metaspace is a native (as in: off-heap) memory manager in the hotspot.
It is used to manage memory for class metadata. Class metadata are allocated when classes are loaded. 
Their lifetime is usually scoped to that of the loading classloader - when a loader gets collected, all class metadata it accumulated are released in bulk.
```
**简单来说：Metapace 是一块非堆内存，用来存储类的元数据，当加载类的时候会在 Metaspace 中分配空间存储类的元数据，当某个 ClassLoader 关闭时会对应释放掉对类元数据的引用，当触发 GC 时这部分类元数据占用的空间即可在 Metaspace 中被回收掉。**

## 5.1 现象
**日志表现**

在使用ChaosBlade注入无效后，登陆目标机器上观察日志，首先发现 jvm-sandbox 在 attach 目标 jvm 时失败

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025134235-ccc6d0c6-f059-4024-8b21-e6f108ef0d4e.png#clientId=u854e1a66-dc20-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=146&id=u252466f4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=291&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=565948&status=done&style=none&taskId=u6ffeaa9f-3222-47f4-b5ee-9e6f0eab537&title=&width=960)

其次看到更关键的日志:Metaspace 溢出了！！！

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025159003-cbe3e050-32c9-4cea-8bfb-b3950170f51c.png#clientId=u854e1a66-dc20-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=343&id=u74144a61&margin=%5Bobject%20Object%5D&name=image.png&originHeight=686&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1121123&status=done&style=none&taskId=u9e3ca2a4-cdec-419c-ab47-d1dfa4a9426&title=&width=960)

## 5.2 定位
在文章开始介绍了ChaosBlade注入Java故障的流程，知道在故障注入时会将 jvm-sandbox 动态的挂载(attach)到目标进程 JVM 上,在 attach 后会加载 sandbox 内部 jar 以及 sandbox 的自定义模块 jar 等，在这个过程中会加载大量的类，当加载类时会分配 Metaspace 空间存储类的元数据。

这里有两个思考点:

1. **会不会是因为业务服务 JVM 的 Metaspace 空间设置的太小？**
2. **Metaspace 的 GC 没有触发或者是有泄露导致类的元数据回收不掉？**

登陆到目标机器上利用 jinfo 观察 jvm 的参数,发现 MaxMetaspaceSize 设置了 128M，这个值确实不大，因为 MaxMetaspaceSize 的默认是-1(无限制，受限于本地内存)。

让业务服务调整 MaxMetaspaceSize 参数改为 256M，然后重启 Java 进程，再次故障注入 确实没问题了，故障正常生效了。

**但实际问题没怎么简单，在连续注入多次后依然出现 Metaspace OOM 故障依旧无效。看来应该是故障清除时无法回收掉 Metaspace 中对应的空间。**

**本地复现**

由于ChaosBlade Java故障注入本质是jvm-sandbox的一个插件，类加载，字节码增强等核心逻辑都在jvm-sandebox上，所以我们直接将问题定位在jvm-sandbox上，利用jvm-sandbox提供的demo项目进行复现。

启动参数设置了 MaxMetaspaceSize=30M，因为 demo 模块类非常少，其次为了快速的复现 OOM。

TraceClassLoading 和 TraceClassUnloding 参数则是为了观察 JVM-SANDBOX 在故障注入和清除时加载/卸载类的信息。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025224907-466c59fa-2368-42ac-b8d0-310a69b2dc3f.png#clientId=u4157e217-e5f5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=392&id=ub4ebcc30&margin=%5Bobject%20Object%5D&name=image.png&originHeight=784&originWidth=1420&originalType=binary&ratio=1&rotation=0&showTitle=false&size=110130&status=done&style=none&taskId=u3515020a-9a7c-4358-94e5-8d9ce0b9432&title=&width=710)

在多次注入以及清除的操作后，复现了线上业务出现的 Metaspace OOM，可以看到在多次注入的过程中，Metaspace 一直没有被回收过，占用空间曲线是一路上升。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025257540-54ad0e55-7bbb-4d6b-b974-254e786d8a72.png#clientId=u4157e217-e5f5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=661&id=u548266fd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1321&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=200347&status=done&style=none&taskId=uab1cb32a-8508-4f99-8943-d602ae934ed&title=&width=960)

**Metaspace OOM 是因为 Metaspace 没有进行过回收，Metaspace 回收的前提是 ClassLoader 关闭，而 JVM-SANDBOX 在 shutdown 时会关闭 ClassLoader。JVM-SANDBOX 中自定义的 ClassLoader 都是继承了 URLClassLoader，URLClassLoader 的关闭方法 官方介绍：**
```java
How to Close a URLClassLoader?
The URLClassLoader close() method effectively eliminates the problem of how to support updated implementations of the classes and resources loaded from a particular codebase, and in particular from JAR files. In principle, once the application clears all references to a loader object, the garbage collector and finalization mechanisms will eventually ensure that all resources (such as the JarFile objects) are released and closed.
```
简单来说：当 classLoader 加载的所有类没有被引用时即可被关闭。

**猜想**
**当故障清除时 jvm-sandbox 中的类还有被引用的情况导致 classloader 关闭失败了。**

**验证猜想**
**在故障清除后，在目标服务的方法上 debug 看一下线程信息，果然在 threadLocal 中找到了两个 jvm-sandbox 的内部类（EventProcesser$Process,SandboxProtector）的引用。说明猜想是对的，问题的原因就是出现在这里了**

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025409608-049339d0-4065-4e90-b6de-d27fd125b5f6.png#clientId=u90f09cf4-59dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=662&id=u56284955&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1324&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=677495&status=done&style=none&taskId=u3ddb2694-e1f6-4055-870b-c894ab9c7a5&title=&width=960)

jvm-sandbox源码在这里就不带大家分析了，感兴趣的可以查看这篇[文章](https://xie.infoq.cn/article/c5be9834709f7eb48cfa683b1)。主要是 jvm-sandbox 的代码实现有 bug，在以下两种情况会导致 processRef 的 ThreadLocal 没有及时 remove 造成泄漏

1. 假如在执行注入故障的过程中，进行故障清除会导致泄漏。如下：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025438733-39f99d72-7d45-477d-8bae-1b4fe23fa0db.png#clientId=u90f09cf4-59dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=612&id=u5597fc7a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1224&originWidth=1556&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1398788&status=done&style=none&taskId=ud0fe7ed4-f453-4fdb-b725-562334731c6&title=&width=778)

2. 假设使用了 jvm-sandbox 的特性-流程变更（例如立即返回，立即抛出异常），本质也是 thread local 没有及时 remove，导致造成了泄漏

## 5.3 优化
由于jvm-sandbox项目已经不在活跃了，我们将jvm-sandbox项目fork到了ChaosBlade中。
优化后的相关pr:[https://github.com/ChaosBlade-io/jvm-sandbox/pull/1](https://github.com/chaosblade-io/jvm-sandbox/pull/1)

## 5.4 改进后效果
启动参数还是相同的 MaxMetaspaceSize=30M，经过优化后多次注入和清除不会出现 Metaspace OOM，Metaspace可以被回收了。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025496836-b6895072-2d92-46ea-ba0f-59ab65035aff.png#clientId=u90f09cf4-59dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=638&id=u39968c09&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1275&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=143820&status=done&style=none&taskId=ub9a9c81b-5e4b-42d7-942a-51a6015c5c6&title=&width=960)

卸载类的信息也打印出来了

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662025512805-62c158bc-61fc-4443-befd-b10445f9fb92.png#clientId=u90f09cf4-59dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=344&id=u051ce70b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=687&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=344964&status=done&style=none&taskId=uebfee1f3-f546-47a5-a96e-0725dace717&title=&width=960)

## 5.4 再次优化
**虽然我们解决了JVM-Sandbox的ThreadLocal泄漏问题，但是由于Metaspace的内存分配以及回收机制还是有可能导致OOM!!!.**
> **关于Metaspace的内存分配以及回收的相关内容可以参考**[文章](https://www.javadoop.com/post/metaspace)


上面的优化基础上还需要在每一次故障注入前触发一次full gc，目的是让上一次jvm-sandbox占用的元空间强制释放掉。

改动点:
```java
public static void agentmain(String featureString, Instrumentation inst) {
    System.gc();
    LAUNCH_MODE = LAUNCH_MODE_ATTACH;
    final Map<String, String> featureMap = toFeatureMap(featureString);
    writeAttachResult(
            getNamespace(featureMap),
            getToken(featureMap),
            install(featureMap, inst)
    );
}
```

这样的改动的虽然能解决一部分场景下的Metaspace OOM，但是也有弊端,这样会导致每一次故障注入挂载agent时都会触发一次full GC,到目前为止还没有更好的解决办法，后面可以考虑将这个full gc做成配置，通过sandbox脚本来进行开启，让用户按需选择是否要在注入前强制full gc一次。

相关pr:[https://github.com/ChaosBlade-io/jvm-sandbox/pull/6](https://github.com/chaosblade-io/jvm-sandbox/pull/6)

那么如何彻底解决Metaspace OOM问题呢？先说结论：不能彻底解决，因为在使用反射的情况下会自动生成一些（sun.reflect.DelegatingClassLoader），所以在业务代码中很难去关闭，那就导致DelegatingClassLoader会一直存活，从而引发Metaspace 碎片化的问题，最终导致Metaspace空间无法被正确的回收（这部分内容比较复杂，一言两语很难描述清楚）
<a name="grkSk"></a>
## 5.5 思考
关于Metaspace OOM的问题，其实优化是一方面，换个角度想也许是我们使用的方式不正确。在我们的业务场景下是会频繁的对一个服务进行故障注入&卸载，每次的注入点不同。

如下图: 相当于每次都是重复1-4步骤，那么实际上我们并不需要这么做，因为在第一步时sandbox初始化会加载大量的类，填充metaspace。而我们每次注入只是故障点不同,agent不需要重新挂载，所以只需要重复的进行第2步和第三步即可。 在第2步和第3步中只是触发sandbox的激活和冻结事件，成本非常小。

后面我们会根据这个思路，对整个故障注入流程进行优化，相信会有更多的提升。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/215568/1662372406854-f575ffcf-01f9-4832-ae28-280d4b1848eb.png#clientId=u72ad57af-f46a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=371&id=ue01bb516&margin=%5Bobject%20Object%5D&name=image.png&originHeight=742&originWidth=1584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185312&status=done&style=none&taskId=ue7756adc-9d3d-40e1-a8d8-27adc8ff130&title=&width=792)

# 6.JIT(及时编译)导致CPU抖动
## 6.1 问题描述
在Java中编译器主要分为三类：

1. 前端编译器:JDK的Javac，即把*.Java文件转变成*.class文件的过程
2. 即时编译器:HotSpot虚拟机的C1,C2编译器,Graal编译器，JVM运行期把字节码转变成本地机器码的过程
3. 提前编译器:JDK的Jaotc,GNU Compiler for the Java(GCJ)等

在通过ChaosBlade进行故障注入后，本质是利用jvm-sandbox对目标类和放火进行了字节码增强。从而也会触发JVM的即时编译（JIT-	Just In Time）

JVM的即时编译目的是让字节码转换为机器码，从而可以更高效的执行。但是在JVM即时编译的过程中是会消耗资源的，最典型的场景就是Java的服务 在刚启动时CPU的使用率都会相对较高，一段时间后逐渐恢复平稳，出现这种现象部分情况下是因为即时编译的介入导致的。关于即时编译的内容可以参考[文章](https://xie.infoq.cn/article/dacbe19251f8ec828efacdfde)

对于即时编译引发的CPU使用率升高是正常现象，如果遇到JIT占用的CPU 使用率特别高，我们需要特殊关注下即时编译的参数即可。例如是否启用了分层编译，编译的线程数量等等。

# 7.总结
ChaosBlade 支持丰富的故障注入场景，尤其是在Java 生态中支持大量的插件。对于Java 场景的故障注入优势比较明显。

通过对上面介绍的问题进行优化，使用ChaosBlade进行Java场景的故障注入不会再导致CPU Idle跌底，即使在线上运行的服务进行故障注入也会将CPU的抖动控制在一个较小的波动范围。

但由于JVM JIT的问题在故障注入时CPU的瞬时抖动还是无法避免，如果大家有什么好的办法/想法也欢迎提交issue/pr来共同交流～

> ChaosBlade 官方网址：[https://chaosblade.io/](https://chaosblade.io/)
> ChaosBlade Github : [https://github.com/chaosblade-io/chaosblade](https://github.com/chaosblade-io/chaosblade)
> ChaosBlade 钉钉社区交流群:23177705

