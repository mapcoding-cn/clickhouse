# clickhouse
开箱即用的容器化部署clickhouse高可用集群方案
<img width="963" alt="image" src="https://github.com/mapcoding-cn/clickhouse/assets/15833367/c2681fc7-419e-4ddf-a247-b6b429d808ec">


## clickhouse-server
支持多副本多分片,支持zookeeper一致性副本的高可用集群,修复了docker化部署的一些问题
示例中是一个6节点3shard2副本的配置,真实部署需要修改docker IP和zookeeper指向地址
## zookeeper-server
一个三节点的zookeeper高可用集群,clickhouse用它来注册配置和维护副本一致性
## clickhouse-tabix
一个支持语法高亮和代码提示的sql编辑器,可以部署前端访问clickhouse,该版本做了部分优化,仍有非常多的beta特性,但也足够使用

