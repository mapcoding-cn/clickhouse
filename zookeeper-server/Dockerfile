FROM zookeeper:3.8.1

#修改配置文件
COPY ./source.list /etc/apt/sources.list
COPY ./logback.xml /conf/logback.xml
COPY ./zoo.cfg /conf/zoo.cfg


#安装必要命令
RUN mkdir -p /data/ && apt-get update && apt-get -y install vim less net-tools

#设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime