# 使用官方的 Node.js 运行时作为基础镜像
FROM node:18-slim

# 设置容器中的工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到容器中
COPY package*.json ./

# 安装依赖，包括 TypeScript 编译器
RUN npm install

# 复制整个项目文件到容器中
COPY . .

# 安装 TypeScript 编译器 (如果需要)
RUN npm install -g typescript

# 编译 TypeScript 文件
RUN tsc

# 暴露应用程序将要运行的端口
EXPOSE 3000

# 启动应用程序
CMD ["npm", "start"]
