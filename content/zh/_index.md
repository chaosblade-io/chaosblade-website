---
title: "ChaosBlade"
linkTitle: "chaosblade.io homepage"

exclude_search: true
---

{{<blocks/cover title="简单易用且功能强大的混沌实验实施工具" image_anchor="center" height="med" color="info">}}
<div class="mx-auto">
  <a class="btn btn-lg btn-dark mr-3 mb-4" href="{{< relref "/docs" >}}">
		快速开始 <i class="fas fa-arrow-alt-circle-right ml-2"></i>
	</a>
	<a class="btn btn-lg btn-light mr-3 mb-4" href="https://github.com/chaosblade-io/chaosblade">
		GitHub <i class="fab fa-github ml-2 "></i>
	</a>
  <!-- <div class="mx-auto mt-5">
    {{<blocks/link-down color="light">}}
  </div> -->
</div>
{{</blocks/cover>}}

<div id="overview">
  <div class="contain">
    <h3 class="section-head">ChaosBlade 是什么？</h4>
    <p>ChaosBlade 是阿里巴巴开源的一款遵循混沌工程原理和混沌实验模型的实验注入工具，帮助企业提升分布式系统的容错能力，并且在企业上云或往云原生系统迁移过程中业务连续性保障。</p>
  </div>
  <!-- <img src="https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/release/chaosblade-demo-0.0.1.gif"  height="50%" width="50%" /> -->
</div>

{{% blocks/lead color="warning" %}}
### 支持场景

将场景按领域实现封装成一个个单独的项目，不仅可以使领域内场景标准化实现，而且非常方便场景水平和垂直扩展，通过遵循混沌实验模型，实现 chaosblade cli 统一调用。目前包含的项目如下：

{{% /blocks/lead %}}

{{< blocks/section color="dark" >}}
{{% blocks/feature icon="fa-database" title="基础资源" %}}
CPU、内存、网络、磁盘、进程等实验场景
{{% /blocks/feature %}}
{{% blocks/feature icon="fab fa-java" title="Java 应用" %}}
数据库、缓存、消息、JVM 本身、微服务等，还可以指定任意类方法注入各种复杂的实验场景
{{% /blocks/feature %}}
{{% blocks/feature icon="fab fa-cuttlefish" title="C++ 应用" %}}
指定任意方法或某行代码注入延迟、变量和返回值篡改等实验场景
{{% /blocks/feature %}}
{{% blocks/feature icon="fab fa-docker" title="Docker 容器" %}}
杀容器、容器内 CPU、内存、网络、磁盘、进程等实验场景
{{% /blocks/feature %}}
{{% blocks/feature icon="fas fa-dharmachakra" title="云原生平台" %}}
Kubernetes 平台节点上 CPU、内存、网络、磁盘、进程实验场景，Pod 网络和 Pod 本身实验场景如杀 Pod，容器的实验场景
{{% /blocks/feature %}}
{{% blocks/feature icon="fab fa-node" title="Node js 应用" %}}
{{% /blocks/feature %}}
{{< /blocks/section >}}

<div id="community">
  <div class="contain">
    <h4 class="section-head">加入社区</h4>
    <p>
      我们非常欢迎每个 Issue 和 PR，即使一个标点符号，如何参加贡献请阅读  <a href="/contributing/">CONTRIBUTING</a> 文档，或者通过下面的方式联系我们。 
    </p>
    <a class="btn btn-lg btn-primary mr-3 mb-4" href="{{< relref "/contributing" >}}">
      贡献指南 <i class="fas fa-arrow-alt-circle-right ml-2"></i>
    </a>
  </div>
</div>
