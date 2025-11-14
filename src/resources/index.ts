/**
 * MCP 资源提供者
 */

import { componentKB } from '@/core/index.js';

/**
 * 获取组件库资源
 */
export function getComponentLibraryResource() {
  const components = componentKB.getAllComponents();

  const library = {
    description: '私有组件库 dboneFEcommon',
    totalComponents: components.length,
    components: components.map(c => ({
      name: c.name,
      description: c.description,
      import: c.import,
      relativePath: c.relativePath,
    })),
  };

  return {
    contents: [
      {
        type: 'text',
        text: JSON.stringify(library, null, 2),
      },
    ],
  };
}

/**
 * 获取使用指南资源
 */
export function getUsageGuideResource() {
  const guide = `
# 组件建议工具使用指南

## 工具简介

本 MCP 工具用于智能分析用户的组件/页面需求提示词，从知识库中选择最合适的组件，并重新设计提示词以包含具体的实现方案。

## 主要功能

### 1. suggest_components - UI组件智能建议
分析UI开发需求,推荐最合适的私有组件。

**输入参数:**
- prompt (string): 用户的UI需求描述

**返回内容:**
- 需求分析结果
- 推荐的组件列表(含相关性评分和推荐理由)
- 重新设计的详细提示词
- 完整的实现指南(包含引入方式、代码结构、实现建议)

**使用场景:** 创建页面、表单、界面等UI功能

### 2. query_component - 查询组件详情
根据组件名称查询详细信息。

**输入参数:**
- componentName (string): 组件名称,如 'das-button'

**返回内容:**
- 组件完整信息(props、events、slots、使用示例等)

**使用场景:** 了解特定组件的使用方法

### 3. suggest_utilities - 工具方法智能建议
分析逻辑开发需求,推荐可复用的工具方法。

**输入参数:**
- prompt (string): 用户的逻辑需求描述

**返回内容:**
- 需求分析结果
- 推荐的工具方法列表(含相关性评分和推荐理由)
- 重新设计的详细提示词
- 完整的实现指南(包含引入方式、使用步骤)

**使用场景:** 实现数据处理、格式转换、加密校验等逻辑功能

### 4. query_utility - 查询工具方法详情
根据工具方法名称查询详细信息。

**输入参数:**
- utilityName (string): 方法名称,如 'formatNumber'

**返回内容:**
- 方法完整信息(参数、返回值、使用示例等)

**使用场景:** 了解特定工具方法的使用方法

## 工作流程

1. **用户输入提示词** (例如: "创建一个用户列表页面，需要支持搜索、分页和编辑功能")

2. **工具分析提示词**
   - 提取关键词: 列表、搜索、分页、编辑
   - 识别组件类型: 数据展示
   - 评估复杂度: medium

3. **匹配合适组件**
   - das-table (表格组件)
   - das-button (操作按钮)
   - das-modal (编辑弹窗)
   等

4. **生成新提示词**
   包含具体的组件选择、引入方式、实现建议

5. **AI IDE 使用新提示词**
   生成更准确、更符合规范的代码

## 最佳实践

1. 提示词要包含具体的功能需求
2. 使用中文或英文关键词都可以
3. 描述清楚交互方式和数据展示需求
4. 复杂需求可以分步处理

## 示例

**原始提示词:**
"创建一个产品管理页面"

**工具分析后的新提示词包含:**
- 使用 das-table 展示产品列表
- 使用 das-button 添加操作按钮
- 使用 das-modal 实现新增/编辑产品
- 具体的引入方式和代码结构
- 遵循 Vue 3 + TypeScript + Less 规范
`;

  return {
    contents: [
      {
        type: 'text',
        text: guide,
      },
    ],
  };
}
