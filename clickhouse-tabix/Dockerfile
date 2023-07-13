FROM nginx:stable-alpine3.17-perl

# 修改配置文件
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tencent.com/g' /etc/apk/repositories

# 安装必要命令
RUN apk update && apk add vim less net-tools nodejs npm yarn

# 复制资源
COPY ./tabix-server /root/tabix-server
COPY ./nginx.conf /etc/nginx/nginx.conf

# Yarn setup
WORKDIR /root/tabix-server
RUN yarn config set registry https://mirrors.tencent.com/npm/
RUN yarn set version 3.1.1
RUN yarn install
RUN yarn build
RUN mv /root/tabix-server/dist /var/tabix
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

