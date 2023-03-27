# build stage
FROM node:current-alpine3.16 as build-stage

LABEL maintainer=wangzhigang1999@live.cn

# 创建一个工作目录
WORKDIR /app

# 拷贝所有的文件到工作目录下（非源码需要忽略的文件 .dockerignore 中配置）
COPY . .

RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

WORKDIR /
COPY --from=build-stage /app/dist/memes-fe  /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf  .

EXPOSE 80

CMD ["nginx", "-c","/nginx.conf","-g", "daemon off;"]
