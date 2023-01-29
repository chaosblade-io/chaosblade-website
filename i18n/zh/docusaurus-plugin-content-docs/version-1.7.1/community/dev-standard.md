---
title: 开发规范
---

## 代码风格

代码风格是编写软件项目源代码时的一组规则或指南。 遵循特定的代码风格肯定会帮助贡献者很好地阅读和理解源代码。 此外，它还有助于减少代码错误。

### 代码风格检查工具

Chaosblade 项目是用 Golang 编写的。 目前我们使用两个工具来帮助在这个项目中符合代码样式。这两个工具是：

* [gofmt](https://golang.org/cmd/gofmt)
* [go vet](https://golang.org/cmd/vet/)

### 代码审阅评论

在 Chaosblade 项目贡献时，我们遵循 [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments) 的风格。 在贡献之前，我们将其视为必读。

### 额外风格规则

对于一个项目，现有的工具和规则可能还不够。 为了在样式上保持一致，我们建议贡献者彻底查看以下附加样式规则：

#### RULE001 - 在字段注释之间增加空行

构造结构体时，如果结构体中的字段需要注释，则字段之间留空行。 建议的方式如下：

``` golang
// correct example
// ContainerManager is the default implement of interface ContainerMgr.
type ContainerManager struct {
	// Store stores containers in Backend store.
	// Element operated in store must has a type of *ContainerMeta.
	// By default, Store will use local filesystem with json format to store containers.
	Store *meta.Store

	// Client is used to interact with containerd.
	Client ctrd.APIClient

	// NameToID stores relations between container's name and ID.
	// It is used to get container ID via container name.
	NameToID *collect.SafeMap
	......
}
```

而不是:

```golang
// wrong example
// ContainerManager is the default implement of interface ContainerMgr.
type ContainerManager struct {
	// Store stores containers in Backend store.
	// Element operated in store must has a type of *ContainerMeta.
	// By default, Store will use local filesystem with json format to store containers.
	Store *meta.Store
	// Client is used to interact with containerd.
	Client ctrd.APIClient
	// NameToID stores relations between container's name and ID.
	// It is used to get container ID via container name.
	NameToID *collect.SafeMap
	......
}
```

#### RULE002 - 在接口定义中标注参数名

在定义接口函数时，我们应该总是显式地添加形式参数，这对代码的可读性有很大帮助。 例如，建议以下方式：

``` golang
// correct example
// ContainerMgr is an interface to define all operations against container.
type ContainerMgr interface {
	// Start a container.
	Start(ctx context.Context, id, detachKeys string) error

	// Stop a container.
	Stop(ctx context.Context, name string, timeout int64) error
	......
}
```

但是，缺少形式参数的名称会使接口不可读，除非查看该接口的一种实现，否则我们永远不会知道参数的真正含义：

``` golang
// wrong example
type ContainerMgr interface {
	// Start a container.
	Start(context.Context, string, string) error

	// Stop a container.
	Stop(context.Context, string, int64) error
	......
}

```

此外，函数注释之间的空行会使接口更具可读性。

#### RULE003 - 引入包

导入包时，为了提高可读性，我们应该按顺序导入包：

* Golang 的内置系统包；
* 项目自己的包；
* 第三方包。

我们应该在这三种包中保留一个空行，如下所示：

``` golang
import (
	"fmt"
	"strings"
	"time"

	"github.com/chaosblade-io/chaosblade/data"
	"github.com/chaosblade-io/chaosblade/util"

	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)
```

#### RULE004 - 变量声明位置

变量对象应该在包名和导入之后的 go 文件的开头声明。

#### RULE005 - Generation of action failure

当一个函数执行失败产生异常时，我们一般使用下面的方式附加字符串“failed to do something”和具体的err实例来构造一个新的错误：

``` golang
fmt.Errorf("failed to do something: %v", err)
```

当可能抛出错误时，请记住将其添加到错误构造中。

#### RULE006 - 及时Return以减少锁进

Chaosblade 鼓励贡献者利用“快速返回”来简化源代码并减少缩进。 例如，不鼓励使用以下代码：

``` golang
// wrong example
if retry {
	if t, err := calculateSleepTime(d); err == nil {
		time.Sleep(t)
		times++
		return retryLoad()
	}
	return fmt.Errorf("failed to calculate timeout: %v", err)
}
return nil
```

在上面的代码中，有一些缩进是可以避免的。 鼓励的方式如下：

``` golang
// correct example
if !retry {
	return nil
}

t, err := calculateSleepTime(d);
if err != nil {
	return fmt.Errorf("failed to calculate timeout: %v", err)
}

time.Sleep(t)
times++

return retryLoad()
```

#### RULE007 - 小写的log和error

无论是日志还是错误，消息的首字母必须小写。 因此，鼓励使用 `log.Debugf("failed to add list: %v", err)`。 并且不推荐使用 `log.Debugf("Failed to add list: %v", err)`。

#### RULE008 - 嵌套error

当发生嵌套error时，我们建议首先考虑使用包 `github.com/pkg/errors`。

#### RULE009 - 正确的注释

无论对于变量、结构、函数、代码块和其他任何内容，每条注释都必须以 `//` 加一个空格开头。 请不要忘记空格，并以“.”结束所有句子。 此外，鼓励使用第三人称单数来润色大多数函数的注释。 例如下面的方式

```golang
// wrong example
// ExecContainer execute a process in container.
func (c *Client) ExecContainer(ctx context.Context, process *Process) error {
	......
}
```

可以修改为 `executes` 而不是 `execute`:

```golang
// correct example
// ExecContainer executes a process in container.
func (c *Client) ExecContainer(ctx context.Context, process *Process) error {
	......
}
```

#### RULE010 - 永远记得 DRY

在添加任何内容时，我们应该考虑到 `DRY(Don't Repeat Yourself)`。

#### RULE011 - 欢迎你的补充

如果您认为 Chaosblade 应该引入更实用的代码样式。请提交 PR 以使其更好。


### 参考
[Pouch Code Style](https://github.com/alibaba/pouch/blob/master/docs/contributions/code_styles.md)

