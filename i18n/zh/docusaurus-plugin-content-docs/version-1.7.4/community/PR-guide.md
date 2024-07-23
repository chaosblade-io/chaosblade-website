---
title: PR 提交指南
sidebar_position: 1
---

## 准备工作

- 在您准备向我们提交代码之前，请先阅读[开发规范](/docs/community/dev-standard)并严格遵守其中规定的代码格式
- 请确保您想要修复或增强的功能存在对应的 issue ，如果是您新发现的问题或想提供 issue 中没有的功能增强，请先新建一个 issue 并设置正确的标签，并在这个 issue 下回复表明您正在这个 issue 上工作。 提交或处理 issue 请参考[Issue 提交与处理规范](/docs/community/issue-standard)
- 请在 git 中正确设置`user.name`与`user.email`参数，否则您的 id 可能不会显示在 contributor 列表中，参考指令`git config --global user.name "username"`

## 开发流程

**1. 准备仓库**

到 [ChaosBlade Github Repo](https://github.com/chaosblade-io/chaosblade) fork 仓库到您的 Github 账号。

克隆到本地。

```
git clone https://github.com/{your-github-id}/chaosblade.git
```

注： 这里仅以 ChaosBlade 项目为例，ChaosBlade 将项目按场景和领域划分为了很多不同的项目，请正确拉取您想要更改的项目并确保项目能通过编译。

添加 ChaosBlade 远程仓库。

```
git remote add upstream https://github.com/{your-github-id}/chaosblade.git
git remote -v
```

执行编译命令`make build`确保项目可以通过编译，这里我们推荐您阅读项目内的 MakeFile 文件，如果您清楚的了解自己要修改项目的哪一部分，可以有选择性地仅执行对应的 make 指令，例如:

```
make build_with cli os
# If it is a mac system, run
make build_with cli os_darwin
# If you want to compile linux system version selectively, execute:
ARGS="cli os" make build_with_linux
```

**2. 选择 issue**

- 选择您想要修改的 issue ，在其中回复并表明您正在当前这个 issue 上工作，并在回复的时候为自己设置一个 deadline。
- 社区会有一位 Member 负责跟进该 issue 的处理，您也可以通过邮箱主动联系 Member，获得相关的建议、讨论或指导。

**3. 创建分支**

切换到拉取的 fork 分支，拉取最新的代码，并基于此分支创建这次的工作分支

```
git checkout master
git fetch upstream
git rebase upstream/master
git checkout -b issueNo
```

**4. 编码开发**

- 请您在开发过程中遵循 [ChaosBlade](/docs/community/dev-standard) 的开发规范。并在准备提交 pull request 之前完成相应的检查，测试涉及到的 ChaosBlade 命令工作正常。
- 将修改的代码 push 到 fork 库的分支上。

**5. 提交 PR**

- 在您 fork 的仓库首页向 ChaosBlade 的 master 发起一次 Pull Request，请在 PR 描述中附带您之前选择的 issue 链接以关联 issue 与这次 pr 提交。
- 接着，会有负责该 issue 的 Reviewer 审阅这次提交，他可能会在 PR 中与您讨论一些实现上的细节和问题。当 Reviewer 对这次提交满意之后，会将提交合并到开发版本的分支之中。
- 最后，恭喜您已经成为了 ChaosBlade 的贡献者！

在您的分支被合并之后，您可以删除远程分支（Origin/issueNo）和与其关联的本地分支（issueNo）

## 提交规则

**Commit Message**

Commit Message 可以帮助 Reviewer 更好地理解提交 PR 的目的是什么。它也可以帮助加速代码 review 过程。我们鼓励贡献者使用明确的提交消息而不是模棱两可的消息。一般来说，我们提倡以下提交消息类型：

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug or adds a feature
- perf: A code change that improves performance
- test: Adding missing or correcting existing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

我们不鼓励开发者提交类似以下的 Commit Message：

- fix bug
- update
- add doc

**Commit Content**

提交内容代表一次提交中包含的所有内容更改。我们最好在一个提交中包含可以支持 Reviewer 完整审阅的内容，而无需任何其他提交的帮助。换句话说，一次提交中的内容可以通过 CI 以避免代码混乱。简而言之，我们需要记住一条小规则：

- 尽量将设计精细化拆分；做到小幅度修改，多次数提交，但应保证提交的完整性。

## 其他

开发者应遵循社区贡献者行为准备，详情查看[CONTRIBUTOR COVENANT CODE OF CONDUCT](https://github.com/chaosblade-io/chaosblade/blob/master/CODE_OF_CONDUCT.md)

**对您的提交签名**

请对您提交信息的尾行增加签名，这将证明是您编写了该补丁且有权将其作为开源补丁传递。

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
660 York Street, Suite 102,
San Francisco, CA 94110 USA

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

您需要在每一个 Commit Message 的末尾行加上

```
Signed-off-by: Joe Smith <joe.smith@email.com>
```

请使用您的真实姓名（抱歉，暂不接受匿名或化名的贡献）

如果您在 git 参数中设置了 `user.name` 和 `user.email`，可以直接通过 `git commit -s` 进行签名，`-s`参数会自动将签名行加入 Commit Message 末尾
