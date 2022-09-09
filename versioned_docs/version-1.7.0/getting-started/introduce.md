---
title: Introduce
slug: / 
---

![](/img/en/en-overview.jpg)

ChaosBlade is an open source chaos engineering project of Alibaba in 2019. It includes chaos engineering experimental tool chaosblade and chaos engineering platform chaosblade-box. It aims to help enterprises solve high-availability problems in the cloud-native process through chaos engineering. The experimental tool chaosblade supports 3 large system platforms, 4 programming language applications, involving more than 200 experimental scenarios and more than 3000 experimental parameters, which can finely control the scope of the experiment. The chaos engineering platform chaosblade-box supports the hosting of experimental tools. In addition to the hosted chaosblade, it also supports the Litmuschaos experimental tools. There are more than [40](https://github.com/chaosblade-io/chaosblade/issues/32) registered companies, of which the ICBC, China Mobile, Xiaomi, JD.com and other companies have landed and used it.

## Features

* Rich experimental scenarios: including basic resources (CPU, memory, network, disk, process, kernel, files, etc.), multilingual application services (Java, C++, NodeJS, Golang, etc.), Kubernetes platform (covering Container, Pod, Node resources) Scenes, including the above experimental scenes).
* Diversified execution methods: In addition to using the platform white screen operation, it can also be executed through the blade tool or kubectl or coding that comes with the tool.
* Convenient scenario expansion capability: All experimental scenarios follow the chaos experimental model implementation, and different levels of scenarios correspond to different actuators, which are simple to implement and easy to expand.
* Automated deployment of experimental tools: There is no need to manually deploy experimental tools, and the automatic deployment of experimental tools on the host or cluster is realized.
* Support for hosting of open source experimental tools: The platform can host mainstream experimental tools in the industry, such as its own chaosblade and external litmuschaos.
* Unified Chaos Experiment User Interface: Users do not need to care about the way of using different tools, and perform chaos experiments in the unified user interface.
* Multi-dimensional experiment method: Support experiment orchestration from the host to Kubernetes resources, and then to the application dimension.
* Integrated cloud native ecology: Helm deployment management, integrated Prometheus monitoring, support for cloud native experiment tool hosting, etc.

## Architecture design

![](/img/en/en-architecture.jpg)

At the beginning of chaosblade design, we considered the ease of use and the convenience of scene expansion, which makes it convenient for everyone to use and expand more experimental scenes according to their own needs. Following the chaos experimental model, it provides unified operations and concise execution tools, and is divided according to domains. The scene realization is encapsulated into a single project to facilitate scene expansion in the field. Based on the domain implementation, chaosblade is packaged into a separate project. Each project is implemented according to best practices in each field. It can not only meet the usage habits of various fields, but also can establish a connection with the chaosblade cli project through the chaos experimental model, which is convenient to use, and uses chaosblade in a unified call. The yaml file based on the chaos experiment model describes the experimental scenes in various fields and is exposed to the upper chaos experiment platform. The Chaos Experiment Platform automatically perceives the changes in the experiment scene according to the changes in the experiment scene description file, without adding new scenes. Perform platform development again to make Chaos Platform more focused on other parts of Chaos Engineering.

![](/img/en/en-chaosblade-box.jpg)

Through the console page, automated deployment of managed tools such as chaosblade, litmuschaos, etc. can be realized. The experiment scene is unified according to the chaos experiment model established by the community, and the target resources are divided according to the host, Kubernetes, and applications. The target resource is controlled by the target manager, and the page is created in the experiment. The target resource selection of white screen can be realized. The platform executes experiment scenarios of different tools by calling the chaos experiment execution, and with access to prometheus monitoring, the experiment metric can be observed, and a wealth of experiment reports will be provided in the follow-up.

## Future

ChaosBlade will be based on cloud native in the future, providing chaos engineering platform and chaos engineering experiment tools for multi-cluster, multi-environment, and multi-language. Experimental tools will continue to focus on the richness and stability of experimental scenes, support more Kubernetes resource scenes and standardized application service experiment scene standards, and provide multilingual experiment scene standard implementations. The chaos engineering platform focuses on simplifying the deployment and implementation of chaos engineering. In the future, it will host more chaos experiment tools and mainstream compatible platforms to implement scene recommendations, provide business and system monitoring integration, output experiment reports, and complete chaos on the basis of ease of use Engineering operation closed loop.

Everyone is welcome to join the community to jointly promote the development of the chaotic engineering field, effectively land in the enterprise, and build a highly available distributed system.
