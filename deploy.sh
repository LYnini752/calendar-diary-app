#!/bin/bash

# 确保脚本在错误时停止
set -e

# 构建目录
BUILD_DIR="build"

# 你的服务器信息
SERVER_USER="your_username"
SERVER_HOST="your_server_host"
SERVER_PATH="/var/www/calendar-diary"

# 确保构建目录存在
if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: Build directory not found!"
  exit 1
fi

# 部署到服务器
echo "Deploying to production server..."
rsync -avz --delete $BUILD_DIR/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH

echo "Deployment completed successfully!" 