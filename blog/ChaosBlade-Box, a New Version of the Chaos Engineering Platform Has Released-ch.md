# 混沌工程是什么？
在2020.11.25 AWS发生了服务大面积故障，造成了多个云产品服务受影响，不到一个月的时间内谷歌发生了那年的第三次大规模宕机，造成了波及20亿用户，损失170万美元的巨大损失。
系统架构经历了单机 到 分布式，再到现在的云原生架构，其复杂度不断上涨，问题定位的难度也随之上涨。面对随时都可能发生的故障，有没有什么的办法能很好解决这个困境。
混沌工程（Chaos Engineering）在分布式系统上进行实验的学科，通过主动注入故障的方式，提前发现系统的薄弱点，推进架构的改进，最终实现业务韧性。从而避免故障在线上运行环境上发生。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193440764-a84cfee2-a2de-4d12-974b-e8c32dc97008.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=699&id=u6f254632&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1398&originWidth=2608&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1584386&status=done&style=none&taskId=ubed9da50-b1ef-4171-891b-cc0320a66aa&title=&width=1304)
这里拿云原生架构来举例说明，为什么混沌工程能解决系统架构中存在的问题。云原生架构原则和混沌工程原则是可以找到对应关系，以服务化原则说明，服务化原则其根本就是服务如何治理的问题，也就是判断上下游服务之间强弱依赖关系的问题。通过混沌工程，可以通过将请求定位到具体机器，再缩小到具体机器上的应用，不断最小化爆炸半径，通过在应用之间注入故障，判断上下游服务是否正常，来判断其强弱依赖关系。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193482401-14663f2a-7426-4643-b3e8-1529075483e6.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=720&id=u2e02c9dd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1440&originWidth=2592&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1399696&status=done&style=none&taskId=u021c3bfa-3342-48bd-b9e5-906f83f81bf&title=&width=1296)
混沌工程的目标是实现韧性架构，这里包含两个部分：韧性系统和韧性组织。韧性系统具有冗余性、扩展性、不可变基础设施、无状态应用、避免级联故障等。韧性组织包含高效交付、故障预案、应急响应机制等。高度韧性的系统也会出现预期之外的故障，所以韧性的组织能弥补韧性系统缺失的部分，通过混沌工程构建极致的韧性架构。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193540623-c8de3ed5-38ab-4b31-ae69-021de93c3062.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=602&id=ud82d1959&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1204&originWidth=2614&originalType=binary&ratio=1&rotation=0&showTitle=false&size=594612&status=done&style=none&taskId=u20a80134-3079-4004-883d-9c18416cf1c&title=&width=1307)
混沌工程就是通过主动注入故障的方式，提前发现系统的薄弱点，推进架构改进，最终实现业务韧性。引入混沌工程对于不同职能的人而言，其业务价值有所不同：

- 架构师：能帮助其验证架构的容错能力
- 开发/运维：能提高其故障的应急效率
- 测试：帮助其提早暴露线上问题，降低故障复发率
- 产品/设计：提示客户使用体验

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193560450-21c561c8-eb0e-4645-a450-7e6c4e86a6ca.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=712&id=u19d3a65b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1424&originWidth=2552&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1213402&status=done&style=none&taskId=u74394064-4c3f-4481-b66a-e8e9d4dddbb&title=&width=1276)

# 如何落地混沌工程？
对于企业或业务如何对混沌工程进行落地？有无工具或平台能帮助其快速落地？
ChaosBlade 是一款遵循混沌实验模型的混沌实验执行工具，具有场景丰富度高，简单易用等特点，支持多平台、多语言环境，包括Linux、Kubernetes和Docker平台，支持Java、NodeJS、C++、Golang 语言应用。支持200多个场景，3000多个参数。是一款用于端侧的故障注入工具，但在业务进行落地时，会存在以下几个问题：

- 故障注入过程如何可视化？
- 如何同时对多个集群或主机进行故障注入？
- 如何拿到整体演练的统计信息
- ......

所以在ChaosBlade之上还需要平台层，对混沌工程执行工具进行管理与演练编排。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193595992-5dae9f91-09e4-48c7-96ea-aff888795124.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=721&id=u94f2e3cf&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1442&originWidth=2606&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1124042&status=done&style=none&taskId=uab2adcb6-b31a-4be6-8ac4-5faffd38eaa&title=&width=1303)
ChaosBlade-Box是面向多集群、多语言、多环境，开源的云原生混沌工程控制台。
开源平台和注入工具的整体架构如下，主要包括几个组成模块：

- ChaosBlade-Box Console ：混沌实验用户界面
- ChaosBlade-Box：Server后端服务，主要包括演练场景的编排和安全管控、混沌工程工具部署（ChaosBlade、LitmusChaos...）、支持探针管理和多维度实验
- Agent：探针，主要有（ChaosBlade-Box）Server端进行建联并保持心跳、上报k8s相关数据、演练命令下发通道等功能
- ChaosBlade：部署在业务的主机或k8s集群内，在端侧进行演练的工具

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193651940-32f39b9e-33bd-48b7-9f68-23cbec98050f.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=746&id=u69231df8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1492&originWidth=2676&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1717081&status=done&style=none&taskId=u45b8a797-86e0-4344-958d-7390d59ba77&title=&width=1338)

新版ChaosBlade-Box平台是一个面向多集群、多环境、多语言的云原生混沌工程平台。支持国际化中英文切换，支持全局命名空间，使得同一用户可根据自己需求，设置不同的全局命名空间，如：测试空间、沙盒空间和线上空间等。提供自动化的工具部署，简化工具安装步骤，提高执行效率。平台支持不同环境的探针安装和演练，如主机和Kubernetes，其中Kubernetes环境下支持 Node、Pod、Container维度下的演练。在Kubernetes环境下会自动收集集群内的Pod相关数据，并在应用管理中进行统一管理，这样简化用户演练查询步骤，无需去集群内查看要演练应用的Pod名或Container名。并支持一键迁移到企业版，按需将社区版的演练数据同步到企业版。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655193686831-5886eeaf-8e93-436c-bccd-94fb8e22390a.png#clientId=ud43b2306-2c6a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=737&id=u74726628&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1474&originWidth=2720&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1690193&status=done&style=none&taskId=u13ce7c19-92e3-43ec-89f7-51eaa777d22&title=&width=1360)
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205642988-2d72203d-97b7-4ea8-a345-1a11abc5d001.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=401&id=uefe8f673&margin=%5Bobject%20Object%5D&name=image.png&originHeight=713&originWidth=1330&originalType=binary&ratio=1&rotation=0&showTitle=false&size=339663&status=done&style=none&taskId=u99505b43-f41f-41f3-9078-4e580c0ea59&title=&width=748)

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205671114-4929367f-dcd3-4248-a6e1-e5b20d067137.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=367&id=uc481add7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=659&originWidth=1341&originalType=binary&ratio=1&rotation=0&showTitle=false&size=245678&status=done&style=none&taskId=uf492429e-b532-4b28-9033-d82a24426f7&title=&width=746.5)
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205733293-5fff1fb1-bf40-437e-9fba-ff39b2da7213.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=392&id=NJwg6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=675&originWidth=1283&originalType=binary&ratio=1&rotation=0&showTitle=false&size=284553&status=done&style=none&taskId=uf759c3fe-d6cb-4bd2-8ffb-8911b7f3ca1&title=&width=744.5)
以下是在新版ChaosBlade-Box平台上进行一次演练的全过程，支持顺序执行、阶段执行两种流程编排，顺序执行指的是多个演练场景依次生效，阶段执行值得是多个演练场景同时生效。通过多种安全策略保证演练得到恢复，如手动处罚和自动停止，自动停止通过在演练配置的时候设置超时参数来进行配置，这样即便平台和探针（Agent）失联，无法进行手动停止时，也能在超时时间到达的时候，自动恢复故障。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205704809-8fb9bce7-df2e-4b04-a0d9-3aff6f5cfc4d.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=391&id=ua703b13b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=689&originWidth=1320&originalType=binary&ratio=1&rotation=0&showTitle=false&size=319299&status=done&style=none&taskId=u5b71e7ae-8fc1-4272-bb55-0a3185cc1b2&title=&width=750)
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205716388-67c05919-65eb-420d-9ae0-3c169d2ffe5b.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=387&id=u08ed02ee&margin=%5Bobject%20Object%5D&name=image.png&originHeight=678&originWidth=1302&originalType=binary&ratio=1&rotation=0&showTitle=false&size=343434&status=done&style=none&taskId=u4ab4161b-3516-4db4-b8c5-dddd6d28bfd&title=&width=743)
# 新版优势是什么？
此次发布的新版相较于老版，前端界面和企业版进行统一，简化使用习惯的切换成本，更为完善的国际化中英文切换，并支持全局命名空间的切换；后端提供了更为流畅的演练编排，完善的应用管理，并加强了对探针的管控，并支持一键迁移到企业版；加强了探针的功能，提供了更加完善的API，支持多环境部署且支持在不同环境作为演练通道，支持自动安装卸载，并收集并上报数据简化演练流畅。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/340851/1655205746242-5228e229-75fe-47e3-98a8-f0c9766bad85.png#clientId=u6b60648b-6d11-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=400&id=ub846bb6a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=700&originWidth=1294&originalType=binary&ratio=1&rotation=0&showTitle=false&size=274770&status=done&style=none&taskId=ue2d019a0-5e1d-4e98-83a2-ace325a58f5&title=&width=740)
