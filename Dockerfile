FROM node:10

# 在镜像中创建一个文件夹存放应用程序代码，应用程序工作目录
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 8098

CMD [ "npm", "run", "start" ]
