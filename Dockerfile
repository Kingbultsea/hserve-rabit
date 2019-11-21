FROM node:10-slim

# 在镜像中创建一个文件夹存放应用程序代码，应用程序工作目录
WORKDIR /usr/src/app

COPY package*.json ./
# If you are building your code for production
# RUN npm ci --only=production

COPY dist/index.js ./

# 配置系统变量，指定端口
ENV HOST 0.0.0.0
ENV PORT 8096

EXPOSE 81

CMD [ "npm", "run", "start" ]
