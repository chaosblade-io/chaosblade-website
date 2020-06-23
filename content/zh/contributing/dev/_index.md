---
title: "开发者人员指南"
linkTitle: "开发者人员指南"
weight: 2
type: docs
description: > 
    开发者人员指南
---

## 编译

此项目采用 golang 语言编写，所以需要先安装最新的 golang 版本，最低支持的版本是 1.11。Clone 工程后进入项目目录执行以下命令进行编译：

```bash
make
```

如果在 mac 系统上，编译当前系统的版本，请执行：

```bash
make build_darwin
```

如果想在 mac 系统上，编译 linux 系统版本，请执行：

```bash
make build_linux
```

也可以选择性编译，比如只需要编译 cli、os 场景，则执行：

```bash
make build_with cli os
# 如果是 mac 系统，执行
make build_with cli os_darwin
# 如果是 mac 系统，想选择性的编译 linux 版本的 cli，os，则执行：
ARGS="cli os" make build_with_linux
```
