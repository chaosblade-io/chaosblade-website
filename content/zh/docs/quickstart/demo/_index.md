---
title: "快速体验"
linkTitle: "快速体验"
type: docs
weight: 2
description: >
    使用 docker 镜像快速体验 ChaosBlade。
---

如果想不下载 chaosblade 工具包，快速体验 chaosblade，可以拉取 docker 镜像并运行，在容器内体验。

![](https://camo.githubusercontent.com/a4660c53b58e95736005c0c892bf0e633dbbd134/68747470733a2f2f6368616f73626c6164652e6f73732d636e2d68616e677a686f752e616c6979756e63732e636f6d2f6167656e742f72656c656173652f6368616f73626c6164652d64656d6f2d302e302e312e676966)

操作步骤如下： 下载镜像：

```bash
docker pull chaosbladeio/chaosblade-demo
```

启动镜像：

```bash
docker run -it --privileged chaosbladeio/chaosblade-demo
```

进入镜像之后，可阅读 README.txt 文件实施混沌实验，**Enjoy it**。
