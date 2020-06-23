---
title: "Pod 场景"
linkTitle: "Pod 场景"
weight: 2
type: docs
description: > 
    Kubernetes Pod 实验场景
---
{{% pageinfo color="primary" %}}
值得注意的是：在实验途中，如果被实验的 Pod 被删除了，则会导致实验销毁失败，实验无法被销毁。这样设计的目的是为了在销毁失败的实验时，用户需要去检查是否真正的需要销毁。确认无误后，可以强制销毁该实验，详见 [https://github.com/chaosblade-io/chaosblade/issues/368](https://github.com/chaosblade-io/chaosblade/issues/368)。
{{% /pageinfo %}}

**参数**

Pod 资源均支持以下参数。

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `namespace` | string | Pod 所属的命名空间 | default |
| `evict-count` | string | 限制实验生效的数量 | |
| `evict-percent` | string | 限制实验生效数量的百分比，不包含 % | |
| `labels` | string | Pod 资源标签，多个标签之间是或的关系 | |
| `names` | string | Pod 资源名 | |
| `waiting-time` | string | 实验结果等待时间，参数值要包含单位，例如 10s，1m | 20s |
