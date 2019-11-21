FROM node:10-slim

# 在镜像中创建一个文件夹存放应用程序代码，应用程序工作目录
WORKDIR /usr/src/app

COPY package*.json ./
# If you are building your code for production
# RUN npm ci --only=production

COPY dist/index.js ./usr/src/app

EXPOSE 81

CMD [ "npm", "run", "start" ]
