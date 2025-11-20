@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 Todo App 一键启动脚本
echo ========================================
echo.

:: 检查 Go 是否安装
where go >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Go 环境
    echo 请先安装 Go: https://go.dev/dl/
    pause
    exit /b 1
)

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js 环境
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

:: 启动后端
echo 📦 启动后端服务 (Go)...
start "Todo Backend" cmd /k "go run main.go"
timeout /t 2 /nobreak >nul

:: 启动前端
echo 📦 启动前端服务 (Vue)...
cd todo-frontend
start "Todo Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   ✨ 启动完成！
echo ========================================
echo.
echo 📌 后端地址: http://localhost:8080
echo 📌 前端地址: http://localhost:5173
echo.
echo 💡 关闭窗口可停止服务
echo ========================================
pause