#!/bin/bash

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "  🚀 Todo App 一键启动脚本"
echo -e "========================================${NC}"
echo ""

# 检查 Go 是否安装
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 Go 环境${NC}"
    echo "请先安装 Go: https://go.dev/dl/"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 Node.js 环境${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 启动后端
echo -e "${YELLOW}📦 启动后端服务 (Go)...${NC}"
go run main.go &
BACKEND_PID=$!
sleep 2

# 启动前端
echo -e "${YELLOW}📦 启动前端服务 (Vue)...${NC}"
cd todo-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${BLUE}========================================"
echo -e "  ✨ 启动完成！"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}📌 后端地址: http://localhost:8080${NC}"
echo -e "${GREEN}📌 前端地址: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}💡 按 Ctrl+C 停止所有服务${NC}"
echo -e "${BLUE}========================================${NC}"

# 等待用户中断
wait $BACKEND_PID $FRONTEND_PID