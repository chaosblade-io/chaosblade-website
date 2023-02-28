---
title: 字节码篇
sidebar_position: 4
---

本篇介绍 `chaosblade-exec-jvm` 如何篡改`java应用`的字节码来实现故障能力的注入。

## JavaAgent

使用 JavaAgent 技术可以在 jvm 启动或者运行时动态的修改字节码。

- 启动时：java -jar app.jar -javaagent:/temp/instrument-1.0.0.jar

- 运行时（Attach）：VirtualMachine 加载

下面介绍一个 JavaAgent 运行时修改字节码的例子，`/temp/NumberAdd.jar` `NumberAdd`的`main`方法循环生成两个随机数调用`add`方法做加法操作，使用 JavaAgent 将变量 a 改成 100。

```java
public static void main(String[] args) throws Exception {
    while (true) {
        Random random = new Random();
        int a = random.nextInt(10);
        int b = random.nextInt(10);
        int add = new NumberAdd().add(a, b);
        System.out.println("a(" + a + ")\t+\tb(" + b + ")\t=" + add);
        TimeUnit.SECONDS.sleep(3);
    }
}

public int add(int a, int b) {
    return a + b;
}
```

### ClassFileTransformer

`java.lang.instrument.ClassFileTransformer`实现该接口，继承 tranform 方法，这里使用`javassistct`修改字节码，`ctMethod.insertBefore("a = 100;");`在原方法执行前将变量 a 修改成 100，也可以使用`ASM`等其他第三方 Lib。

```java
public class NumberAddTransform implements ClassFileTransformer {

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) {

        ClassPool classPool = ClassPool.getDefault();
        try {
            if ("com.xx.NumberAdd".replace(".", "/").equals(className)) {
                CtClass ctClass = classPool
                  .makeClass(new ByteArrayInputStream(classfileBuffer));
                CtMethod ctMethod = ctClass.getDeclaredMethod("add");
                ctMethod.insertBefore("a = 100;");
                byte[] bytes = ctClass.toBytecode();
                ctClass.detach();
                return bytes;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

这里可以将`class byte[]`字节流写入到本地文件`xx.class`，使用`javap`可观察字节码的变化，发现`add`方法多了`bipush 100`和` istore_0`两条指令，`bipush 100`将 100`push`到操作数栈栈顶，` istore_0`将栈顶元素`store`到局部变量表第 0 个位置，这时候局部变量表原来的值就被替换掉了。

```java
public static int add(int, int);
    descriptor: (II)I
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=2
         0: bipush        100
         2: istore_0
         3: iload_0
         4: iload_1
         5: iadd
         6: ireturn
      LineNumberTable:
        line 31: 3
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       7     0     a   I
            0       7     1     b   I
```

### 自定义 Agent

JavaAgent 运行时修改字节码，需要自定义类并且方法签名如下其一，且定义定义 MANIFEST.MF，指定`Agent-Class`为自定义类。

- `public static void agentmain(String agentArgs, Instrumentation inst)   `
- `public static void agentmain(String agentArgs)`

```java
public class MainAgent {

    // 以Attach的方式载入，在Java程序运行时载入
    public static void agentmain(String agentArgs, Instrumentation inst) throws UnmodifiableClassException {
      	//添加 Transformer
      	inst.addTransformer(new NumberAddTransform(), true);
        Class[] allLoadedClasses = inst.getAllLoadedClasses();
        for (Class allLoadedClass : allLoadedClasses) {
            String simpleName = allLoadedClass.getName();
          	// 需要转换的类
          	if ("com.xx.NumberAdd".equals(allLoadedClass.getName())) {
                inst.retransformClasses(allLoadedClass);
            }
        }
    }

  	// 在Java程序启动时载入 -javaagent:
    public static void premain(String agentArgs, Instrumentation inst) {

    }
}
```

### Maven 插件生成 MANIFEST.MF

使用`maven-assembly-plugin`插件生成 MANIFEST.MF，指定`Premain-Class`、`Agent-Class`、`Can-Redefine-Classes`、`Can-Retransform-Classes`。

```xml
<manifestEntries>
  <Premain-Class>com.xx.MainAgent</Premain-Class>
  <Agent-Class>com.xx.MainAgent</Agent-Class>
  <Can-Redefine-Classes>true</Can-Redefine-Classes>
  <Can-Retransform-Classes>true</Can-Retransform-Classes>
</manifestEntries>
```

### 编译打包

编译打包`Agent jar`，复制到`/temp/instrument-1.0.0.jar`

```shell script
mvn clean package
```

### 启动应用 jar

执行应用的`jar`

```shell script
java -jar NumberAdd.jar
```

### 加载 Agent

使用 VirtualMachine 加载 Agent，加载成功后，`add`方法的参数就被篡改了。

```java
public static void main(String[] args) throws Exception {
    VirtualMachine virtualMachine = VirtualMachine.attach("53110");
    virtualMachine.loadAgent("/temp/instrument-1.0.0.jar");
    virtualMachine.detach();
}
```

![](/img/doc-image/java-dev-guide/agent.gif)

## Jvm-SandBox

可见上述例子单纯的使用 JavaAgent，编程模型相对复杂，配置度较高，还需考虑类隔离、卸载、多模块的管理等等。`Jvm-SandBox`通过`Module`沙箱隔离机制很好的实现了这些，`chaosblade-exec-jvm`集成了`Jvm-SandBox`。

### Module

新建一个工程，依赖 Jvm-SandBox

```xml
<parent>
    <groupId>com.alibaba.jvm.sandbox</groupId>
    <artifactId>sandbox-module-starter</artifactId>
    <version>1.2.0</version>
</parent>
```

新建 Module，打包成 jar，只需要简单的几行代码即可实现基于 JavaAgent 的运行时字节码修改。

```java
@MetaInfServices(Module.class)
@Information(id = "NumberAdd")
public class NumberAddModule implements Module {

    @Resource
    private ModuleEventWatcher moduleEventWatcher;

    @Command("add")
    public void repairCheckState() {
        new EventWatchBuilder(moduleEventWatcher)
                .onClass("com.xy.NumberAdd")
                .onBehavior("add")
                .onWatch(new AdviceListener() {
                    @Override
                    protected void before(Advice advice) throws Throwable {
                        Object[] parameterArray = advice.getParameterArray();
                        parameterArray[0] = 100;
                    }
                });
    }

}
```

### 加载 Agent

下载[Jvm-SandBox](http://ompc.oss-cn-hangzhou.aliyuncs.com/jvm-sandbox/release/sandbox-stable-bin.zip)解压：

```shell
cd sandbox
./install-local.sh
```

把 jar 包拷贝到` 'module/`的模块下面，启动沙箱：

```shell
./sandbox.sh -p 24253 -d 'NumberAdd/add'
```

启动成功后，`add`方法的参数就被篡改了。

卸载沙箱：

```shell
./sandbox.sh -p 24253 -S
```

![](/img/doc-image/java-dev-guide/agent-jvm-sandbox.gif)

## chaosblade-exec-jvm

`chaosblade-exec-jvm`集成了`Jvm-SandBox`，在`make`编译之后，作为`Jvm-SandBox`的一个 module。`chaosblade-exec-jvm`基于`Jvm-SandBox`的事件监听机制，拓展了插件的设计。
