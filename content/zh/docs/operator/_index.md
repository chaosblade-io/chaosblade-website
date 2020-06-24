---
title: "云原生场景"
linkTitle: "云原生场景"
weight: 4
type: docs
description: >
  ChaosBlade Operator 使用文档。
---

### 面向云原生

[chaosblade-operator](https://github.com/chaosblade-io/chaosblade-operator) 项目是针对云原生平台所实现的混沌实验注入工具，遵循混沌实验模型规范化实验场景，把实验定义为 Kubernetes CRD 资源，将实验模型映射为 Kubernetes 资源属性，很友好的将混沌实验模型与 Kubernetes 声明式设计结合在一起，依靠混沌实验模型便捷开发场景的同时，又可以很好的结合 Kubernetes 设计理念，通过 kubectl 或者编写代码直接调用 Kubernetes API 来创建、更新、删除混沌实验，而且资源状态可以非常清晰的表示实验的执行状态，标准化实现 Kubernetes 故障注入。除了使用上述方式执行实验外，还可以使用 chaosblade cli 方式非常方便的执行 kubernetes 实验场景，查询实验状态等。

具体请阅读：[云原生下的混沌工程实践](/blog/cloudnative/chaosblade-operator/)

### Guestbook

文档中的示例实验会用到 [guestbook](https://github.com/cloudnativeapp/guestbook?spm=5176.2020520152.0.0.7c5f16ddH8myx6) 应用，尝试之前请先安装。

```bash
# helm 3
# add repo
$ helm repo add apphub-incubator https://apphub.aliyuncs.com/incubator/
# install
$ helm install guestbook apphub-incubator/guestbook --set service.type=NodePort --namespace=chaosblade
```

{{% pageinfo color="primary" %}}
默认的 Service 类型为 `LoadBalancer`，这里为了方便访问设置为了 `NodePort`。
{{% /pageinfo %}}
