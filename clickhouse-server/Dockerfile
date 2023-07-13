FROM clickhouse/clickhouse-server:23.3.5.9

#修改配置文件
COPY ./source.list /etc/apt/sources.list
COPY ./config.xml /etc/clickhouse-server/config.xml
COPY ./users.xml /etc/clickhouse-server/users.xml
COPY ./entrypoint.sh /entrypoint.sh
COPY ./macros /macros

#安装必要命令
RUN apt-get update && apt-get -y install vim less net-tools pixz libcap2-bin curl

#添加可执行权限
RUN chmod +x /entrypoint.sh

#设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime