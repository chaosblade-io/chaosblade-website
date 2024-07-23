---
title: 插件篇
sidebar_position: 3
---

本篇介绍 `chaosblade-exec-jvm` 插件的扩展和使用。

## 插件的介绍

一个简单的插件包含`Plugin`、`PointCut`、`Enhancer`、`ModelSpec`、`ActionSpec`、`ActionExecutor`

## 调用插件的时序图

一个简单的插件调用的顺序图，非`DirectlyInjectionAction`的`ActionFlag`。
![时序图](/img/doc-image/java-dev-guide/plugin.jpg)

## 插件扩展的步骤

首先 fork [chaosblade-exec-jvm](https://github.com/chaosblade-io/chaosblade-exec-jvm)

### 1、新建一个工程

在 chaosblade-exec-plugin 模块下新建子模块，如 chaosblade-exec-plugin-servlet

### 2、自定义 Enhancer

例如 ServletEnhancer，获取 ContextPath、RequestURI、Method 等，将获取到的参数放到 MatcherModel，返回 EnhancerModel，Inject 阶段会与输入的参数做比对。

```java
public class ServletEnhancer extends BeforeEnhancer {

    @Override
    public EnhancerModel doBeforeAdvice(ClassLoader classLoader,
                                        String className,
                                        Object object,
                                        Method method,
                                        Object[] methodArguments
                                        ) throws Exception {
        Object request = methodArguments[0];
        // 执行被增强类的方法，获取一些需要的值
        String queryString = ReflectUtil.invokeMethod(request, "getQueryString", new Object[] {}, false);
        String contextPath = ReflectUtil.invokeMethod(request, "getContextPath", new Object[] {}, false);
        String requestURI = ReflectUtil.invokeMethod(request, "getRequestURI", new Object[] {}, false);
        String requestMethod = ReflectUtil.invokeMethod(request, "getMethod", new Object[] {}, false);

        String requestPath = StringUtils.isBlank(contextPath) ? requestURI : requestURI.replaceFirst(contextPath, "");

        MatcherModel matcherModel = new MatcherModel();
        matcherModel.add(ServletConstant.QUERY_STRING_KEY, queryString);
        matcherModel.add(ServletConstant.METHOD_KEY, requestMethod);
        matcherModel.add(ServletConstant.REQUEST_PATH_KEY, requestPath);

        return new EnhancerModel(classLoader, matcherModel);
    }
}
```

需不同的通知可继承不同的类

- beforeAdvice：继承 com.alibaba.chaosblade.exec.common.aop.BeforeEnhancer
- afterAdvice：继承 com.alibaba.chaosblade.exec.common.aop.AfterEnhancer

### 3、自定义 PointCut

例如 ServletPointCut 拦截类：spring 的 FrameworkServlet、webx 的 WebxFrameworkFilter、及父类为 HttpServletBean 或 HttpServlet 的子类。

拦截方法：doGet、doPost、doDelete、doPut、doFilter

```java
public class ServletPointCut implements PointCut {

    public static final String SPRING_FRAMEWORK_SERVLET = "org.springframework.web.servlet.FrameworkServlet";
    public static final String ALIBABA_WEBX_FRAMEWORK_FILTER = "com.alibaba.citrus.webx.servlet.WebxFrameworkFilter";
    public static final String SPRING_HTTP_SERVLET_BEAN = "org.springframework.web.servlet.HttpServletBean";
    public static final String HTTP_SERVLET = "javax.servlet.http.HttpServlet";

    public static Set<String> enhanceMethodSet = new HashSet<String>();
    public static Set<String> enhanceMethodFilterSet = new HashSet<String>();

    static {
        enhanceMethodSet.add("doGet");
        enhanceMethodSet.add("doPost");
        enhanceMethodSet.add("doDelete");
        enhanceMethodSet.add("doPut");
        enhanceMethodFilterSet.add("doFilter");
    }

    @Override
    public ClassMatcher getClassMatcher() {
        OrClassMatcher orClassMatcher = new OrClassMatcher();
        orClassMatcher.or(new NameClassMatcher(SPRING_FRAMEWORK_SERVLET)).or(
            new NameClassMatcher(ALIBABA_WEBX_FRAMEWORK_FILTER)).or(
            new SuperClassMatcher(SPRING_HTTP_SERVLET_BEAN, HTTP_SERVLET));
        return orClassMatcher;
    }

    @Override
    public MethodMatcher getMethodMatcher() {
        AndMethodMatcher andMethodMatcher = new AndMethodMatcher();
        OrMethodMatcher orMethodMatcher = new OrMethodMatcher();
        orMethodMatcher.or(new ManyNameMethodMatcher(enhanceMethodSet)).or(new ManyNameMethodMatcher
            (enhanceMethodFilterSet));
        andMethodMatcher.and(orMethodMatcher).and(new ParameterMethodMatcher(1, ParameterMethodMatcher.GREAT_THAN));
        return andMethodMatcher;
    }
}
```

- 继承 com.alibaba.chaosblade.exec.common.aop.PointCut
- getClassMatcher：类匹配
  - SuperClassMatcher：父类名称匹配
  - OrClassMatcher：多个匹配
  - NameClassMatcher：类名匹配
- getMethodMatcher：类方法匹配
  - ManyNameMethodMatcher：方法名集合
  - NameMethodMatcher：方法名称匹配
  - OrMethodMatcher：多个方法匹配
  - AndMethodMatcher：多条件匹配
  - ParameterMethodMatcher：参数匹配

### 4、自定义 Spec

举个例子：命令[./blade create servlet delay --time=3000] 对于命令而言主要分为 phases、target、action、flag，phases 相对插件而言不需要很强的灵活性，因此由 chaosblade-exec-service 模块管理，对于自定义插件只需要扩展 ModelSpec(target)、action、 flag。
![](/img/doc-image/java-dev-guide/command.png)

#### ModelSpec

ModelSpec 的 getTarget()方法对于命令中 target 部分的名称，如 servlet、dubbo 等，createNewMatcherSpecs()方法添加 ModelSpec 下的 FlagSpec，例如 ServletModelSpec 的 getTarget()返回 servlet，createNewMatcherSpecs()包含很多 flagSpec，那么 ModelSpec 支持的命令如下：

./blade create servlet --method=post --requestpath=/index --contextpath=/shop

--参数可任意组合。

```java
public class ServletModelSpec extends FrameworkModelSpec {

    @Override
    public String getTarget() {
        return "servlet";
    }

    @Override
    public String getShortDesc() {
        return "java servlet experiment";
    }

    @Override
    public String getLongDesc() {
        return "Java servlet experiment, support path, query string, context path and request method matcher";
    }

    @Override
    public String getExample() {
        return "servlet --requestpath /hello --method post";
    }

    @Override
    protected List<MatcherSpec> createNewMatcherSpecs() {
        ArrayList<MatcherSpec> matcherSpecs = new ArrayList<MatcherSpec>();
        matcherSpecs.add(new ServletContextPathMatcherSpec());
        matcherSpecs.add(new ServletQueryStringMatcherSpec());
        matcherSpecs.add(new ServletMethodMatcherSpec());
        matcherSpecs.add(new ServletRequestPathMatcherSpec());
        return matcherSpecs;
    }
}
```

ModelSpec 的实现方式如下：

- 实现 com.alibaba.chaosblade.exec.common.model.ModelSpec
- 继承 BaseModelSpec，实现了对 CreateHandler 阶段的输入参数的校验
- 继承 FrameworkModelSpec 包含 DelayActionSpec、ThrowCustomExceptionActionSpec，默认实现了不同 target 的延迟侵入和异常侵入。

#### ActionSpec

例如 DelayActionSpec，支持参数 --time=xx --offset=xx

./blade create servlet --method=post delay --time=3000 ----offset=10

```java
public class DelayActionSpec extends BaseActionSpec {

    private static TimeFlagSpec timeFlag = new TimeFlagSpec();
    private static TimeOffsetFlagSpec offsetFlag = new TimeOffsetFlagSpec();

    public DelayActionSpec() {
       //添加 actionExecutor
        super(new DefaultDelayExecutor(timeFlag, offsetFlag));
    }

    @Override
    public String getName() {
        return "delay";
    }

    @Override
    public String[] getAliases() {
        return new String[0];
    }

    @Override
    public String getShortDesc() {
        return "delay time";
    }

    @Override
    public String getLongDesc() {
        return "delay time...";
    }

    @Override
    public List<FlagSpec> getActionFlags() {
        return Arrays.asList(timeFlag, offsetFlag);
    }

    @Override
    public PredicateResult predicate(ActionModel actionModel) {
        if (StringUtil.isBlank(actionModel.getFlag(timeFlag.getName()))){
            return PredicateResult.fail("less time argument");
        }
        return PredicateResult.success();
    }
}
```

ActionSpec 的 getName()方法对应命令中 action 部分的名称，如 delay、throwCustomExceptionde 等，ActionSpec 由 ModelSpec 的 addActionSpec()方法添加，可以有以下方式实现：

- 实现 com.alibaba.chaosblade.exec.common.model.action.ActionSpec

- 继承 BaseActionSpec，实现了对 CreateHandler 阶段的输入参数的校验

#### FlagSpec

例如 TimeOffsetFlagSpec， 支持--offset=10 的参数

```java
public class TimeOffsetFlagSpec implements FlagSpec {
    @Override
    public String getName() {
        return "offset";
    }

    @Override
    public String getDesc() {
        return "delay offset for the time";
    }

    @Override
    public boolean noArgs() {
        return false;
    }

    @Override
    public boolean required() {
        return false;
    }
}
```

FlagSpec 的 getName()方法对应命令中 flag 部分的名称，如--time 等

- 实现 com.alibaba.chaosblade.exec.common.model.FlagSpec，由 ActionSpec 的 getFlagSpec 方法添加

- 继承 com.alibaba.chaosblade.exec.common.model.matcher.MatcherSpec，由 ActionSpec 的 addActionSpec 添加，CreateHandler 阶段会做参数校验

- 继承 com.alibaba.chaosblade.exec.common.model.matcher.BasePredicateMatcherSpec

#### ActionExecutor

ActionExecutor 执行器作为 BaseActionSpec 的构造参数，ActionExecutor 可以自定义一些增强业务的操作，如修改方法的参数、篡改方法的返回值等。

```java
public interface ActionExecutor {

    /**
     * Run executor
     *
     * @param enhancerModel
     * @throws Exception
     */
    void run(EnhancerModel enhancerModel) throws Exception;
}
```

实现 ActionExecutor 的接口，EnhancerModel 里面可以拿到命令行输入的参数以及原始方法的参数，类型，返回值、异常，做一些增强业务操作。

```java
// 延迟多少毫秒
Long time = Long.valueOf(enhancerModel.getActionFlag("time"));
TimeUnit.MILLISECONDS.sleep(time);
```

### 5、自定义 Plugin

继承 com.alibaba.chaosblade.exec.common.aop.Plugin，自定义 target 名称，添加 Enhancer、PointCut、ModelSpec 即可，实现类需要全路径名复制到 :
resources/META-INF/services/com.alibaba.chaosblade.exec.common.aop.Plugin
挂载 Agent，模块激活后 plugin 自动加载。

```java
public class ServletPlugin implements Plugin {

    @Override
    public String getName() {
        return "servlet";
    }

    @Override
    public ModelSpec getModelSpec() {
        return new ServletModelSpec();
    }

    @Override
    public PointCut getPointCut() {
        return new ServletPointCut();
    }

    @Override
    public Enhancer getEnhancer() {
        return new ServletEnhancer();
    }
}
```

## 打包和执行

首先提交代码 push 到自己的仓库

### 准备

需要 go 环境、java_home 、maven

- clone

```shell script
git clone https://github.com/chaosblade-io/chaosblade
```

- 修改 Makefile

```shell script
cd chaosblade
vi Makefile
```

把 Makefile 里面的 BLADE_EXEC_JVM_PROJECT 改成修改成你 fork 的仓库地址，保存退出
![](/img/doc-image/java-dev-guide/edit-chaosblade-exec-jvm.png)

- 编译

```shell script
make build_linux
```

- 挂载 agent：--pid 3356 是被攻击应用的 jvm 进程号
  每次挂载对应一个 uid，卸载 agent 的时候需要 uid

```shell script
cd target/chaosblade-0.6.0/
./blade prepare jvm --pid 3356
```

### 混沌实验

每个实验对应一个 uid，后续的查询、销毁实验都要用到此 uid，如果遗忘了 uid，可以通过 blade status --type create 命令进行查询。 create 可以简写为 c，即 blade create 可以简写为 blade c。一个简单的例子，对 servlet 容器，api 接口延迟 3 秒。

- 创建混沌实验

```shell script
./blade create servlet delay --time=3000 --requestpath=/index
```

此时访问 Java 应用/index 应用将延迟 3 秒后响应。

- 销毁

```shell script
./blade create destroy 863c8c5a2c2c3deb
```

### 卸载 agent

```shell script
./blade destroy 6a0863a4f0da8a38
```
