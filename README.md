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

```
--创建数据库
CREATE DATABASE mapcoding on CLUSTER map ; 

--创建本地表
CREATE TABLE mapcoding.uk_price_paid on CLUSTER map
(
      price UInt32,
      date Date,
      postcode1 LowCardinality(String),
      postcode2 LowCardinality(String),
      type Enum8('terraced' = 1, 'semi-detached' = 2, 'detached' = 3, 'flat' = 4, 'other' = 0),
      is_new UInt8,
      duration Enum8('freehold' = 1, 'leasehold' = 2, 'unknown' = 0),
      addr1 String,
      addr2 String,
      street LowCardinality(String),
      locality LowCardinality(String),
      town LowCardinality(String),
      district LowCardinality(String),
      county LowCardinality(String)
)
ENGINE = ReplicatedMergeTree('/clickhouse/map/mapcoding/{shard}/uk_price_paid', '{replica}')
ORDER BY (postcode1, postcode2, addr1, addr2);

--创建分布式表
create TABLE mapcoding.uk_price_paid_distributed on cluster map as mapcoding.uk_price_paid ENGINE = Distributed("map", "mapcoding", "uk_price_paid", rand());

--插入测试数据
INSERT INTO mapcoding.uk_price_paid_distributed
WITH
    splitByChar(' ', postcode) AS p
SELECT
      toUInt32(price_string) AS price,
      parseDateTimeBestEffortUS(time) AS date,
      p[1] AS postcode1,
      p[2] AS postcode2,
      transform(a, ['T', 'S', 'D', 'F', 'O'], ['terraced', 'semi-detached', 'detached', 'flat', 'other']) AS type,
      b = 'Y' AS is_new,
      transform(c, ['F', 'L', 'U'], ['freehold', 'leasehold', 'unknown']) AS duration,
      addr1,
      addr2,
      street,
      locality,
      town,
      district,
      county
FROM url(
      'http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-complete.csv',
      'CSV',
      'uuid_string String,
      price_string String,
      time String,
      postcode String,
      a String,
      b String,
      c String,
      addr1 String,
      addr2 String,
      street String,
      locality String,
      town String,
      district String,
      county String,
      d String,
      e String'
) SETTINGS max_http_get_redirects=10;
```


