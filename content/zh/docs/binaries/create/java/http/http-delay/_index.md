---
title: "http 请求延迟"
linkTitle: "http 请求延迟"
weight: 1
type: docs
description: >
  Java http 请求延迟
---
## 参数

以下是此场景特有参数，通用参数详见：[blade create http](../)

```text
--time string             延迟时间，单位是毫秒，必填项
--offset string           延迟时间上下偏移量，比如 --time 3000 --offset 1000，则延迟时间范围是 2000-4000 毫秒
```

## 案例

http-client 进程的 `/httpdemo/hello` 接口：内部通过 `restTemplate` 组件访问 `http://127.0.0.1:8801/getName` 接口获取返回值，代码如下：

```java
@RequestMapping("/httpdemo/hello")
@ResponseBody
public String hello(long timeout) {
    if (timeout == 0) {
        timeout = 3000;
    }
    try {
        FutureTask futureTask = new FutureTask(new Callable() {
            @Override
            public Object call() throws Exception {
                RestTemplate restTemplate = new RestTemplate();
                String name = restTemplate.getForObject("http://127.0.0.1:8801/getName?name=friend", String.class);
                return "hello " + name + "\n";
            }
        });
        new Thread(futureTask).start();
        return (String) futureTask.get(timeout, TimeUnit.MILLISECONDS);
    } catch (TimeoutException e) {
        return "timeout, " + e.getMessage() + "\n";
    } catch (Exception e) {
        return "exception, " + e.getMessage() + "\n";
    }
}
```

我们开始执行混沌实验，对 `http://127.0.0.1:8801/getName` 接口请求注入 3 秒延迟故障。`futureTask.get(2000, TimeUnit.MILLISECONDS)` 会发生超时返回：

```shell
blade c http delay --time 3000 --uri http://127.0.0.1:8801/getName --rest --process http-client

{"code":200,"success":true,"result":"9fd5572869968775"}
```

验证结果，故障注入前：

![before_chaos](https://tvax2.sinaimg.cn/large/ad5fbf65ly1gg38fntcpij20dw023wes.jpg)

故障注入后：

![after_delay](https://tvax1.sinaimg.cn/large/ad5fbf65ly1gg38fx5xgcj20dw024dg5.jpg)

停止实验：

```shell
blade d 9fd5572869968775
```
