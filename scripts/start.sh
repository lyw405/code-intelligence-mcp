#!/bin/bash

# 组件建议 MCP 服务启动脚本

set -e

# 获取脚本所在目录 (兼容 bash 和 zsh)
if [ -n "${BASH_SOURCE[0]}" ]; then
    SCRIPT_PATH="${BASH_SOURCE[0]}"
elif [ -n "${(%):-%x}" ]; then
    SCRIPT_PATH="${(%):-%x}"
else
    SCRIPT_PATH="$0"
fi

SCRIPT_DIR="$( cd "$( dirname "$SCRIPT_PATH" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 启动组件建议 MCP 服务..."
echo "📁 项目目录: $PROJECT_DIR"

cd "$PROJECT_DIR"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 运行服务
echo "✨ 启动服务..."
pnpm mcp:dev
