# Code Intelligence MCP - Installation & Configuration Guide

## Installation

### Via npm

```bash
npm install code-intelligence-mcp
```

### Via pnpm

```bash
pnpm add code-intelligence-mcp
```

### Via yarn

```bash
yarn add code-intelligence-mcp
```

## Configuration

After installation, you need to configure the MCP service with your AI provider and knowledge base data.

### Step 1: Run Setup Script

```bash
npm run setup:dev
```

This interactive script will:

1. Create the `data/` directory
2. Copy example configuration files
3. Guide you through the setup process

### Step 2: Configure AI Models (`data/config.json`)

Edit `data/config.json` and add your AI provider credentials:

```json
{
  "defaultModel": "gpt-4o",
  "providers": [
    {
      "provider": "openai",
      "models": [
        {
          "model": "gpt-4o",
          "title": "GPT-4o",
          "baseURL": "https://api.openai.com/v1",
          "apiKey": "sk-your-api-key-here"
        }
      ]
    }
  ]
}
```

**Supported Providers:**

- `openai` - OpenAI (GPT series)
- `anthropic` - Anthropic (Claude series)
- `deepseek` - DeepSeek (Chinese AI)
- `ollama` - Local models via Ollama

### Step 3: Configure Components (`data/components.json`)

Define your UI component library:

```json
{
  "Button": {
    "description": "能力：提供按钮交互；特性：支持多种样式、尺寸与禁用状态。",
    "import": "import Button from '@/components/Button'",
    "relativePath": "your-component-library/src/components/Button"
  },
  "Form": {
    "description": "能力：表单数据收集；特性：支持校验、布局配置与动态表单项。",
    "import": "import Form from '@/components/Form'",
    "relativePath": "your-component-library/src/components/Form"
  }
}
```

### Step 4: Configure Utilities (`data/utils.json`)

Define your utility functions:

```json
{
  "formatNumber": {
    "description": "能力：数字格式化展示；特性：千分位分隔符展示，自动处理 NaN 返回 0。",
    "import": "import { formatNumber } from '@/utils/format'",
    "relativePath": "your-utils-library/src/utils/format.js",
    "params": "n: number | string - 需要格式化的数字",
    "returns": "string - 格式化后的数字字符串，如 '1,000'"
  }
}
```

## Usage

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm run start:prod
```

### Build for Production

```bash
npm run build
```

## Environment Variables

You can optionally specify custom configuration paths via environment variables:

```bash
# Use custom config path
export GAREN_MCP_CONFIG=/path/to/your/config.json
npm run dev

# Or use CONFIG_PATH
export CONFIG_PATH=/path/to/your/config.json
npm run dev
```

## MCP Tool Usage

Once configured, the MCP service provides 4 tools:

### 1. `suggest_components`

Analyzes user needs and recommends UI components from your knowledge base.

```json
{
  "prompt": "生成一个登录页面"
}
```

### 2. `query_component`

Get detailed information about a specific component.

```json
{
  "componentName": "Button"
}
```

### 3. `suggest_utilities`

Recommends reusable utility functions based on logic requirements.

```json
{
  "prompt": "需要格式化数字显示千分位"
}
```

### 4. `query_utility`

Get detailed information about a specific utility function.

```json
{
  "utilityName": "formatNumber"
}
```

## Configuration File Structure

### config.json

```typescript
{
  defaultModel: string; // Default AI model to use
  providers: Array<{
    provider: string; // 'openai' | 'anthropic' | 'deepseek' | 'ollama'
    models: Array<{
      model: string; // Model identifier
      title: string; // Display name
      baseURL: string; // API base URL
      apiKey: string; // API key (can be empty for local models)
    }>;
  }>;
}
```

### components.json

```typescript
{
  [componentName: string]: {
    description: string;          // Component capability and features
    import: string;               // Import statement
    relativePath: string;         // File path in your library
  }
}
```

### utils.json

```typescript
{
  [utilityName: string]: {
    description: string;          // Utility capability and features
    import: string;               // Import statement
    relativePath: string;         // File path in your library
    params?: string;              // Parameter documentation
    returns?: string;             // Return value documentation
    type?: string;                // Type information
  }
}
```

## File Location Resolution

The configuration loader searches for files in this order:

1. **Environment Variable Path** (if `GAREN_MCP_CONFIG` or `CONFIG_PATH` is set)
2. **Current Working Directory** (`./data/config.json`)
3. **Package Installation Directory** (`node_modules/code-intelligence-mcp/data/config.json`)

## Troubleshooting

### Configuration file not found

- Ensure `data/config.json` exists in your project
- Check the file path set in `GAREN_MCP_CONFIG` or `CONFIG_PATH`
- Run `npm run setup:dev` to create the file

### API key errors

- Verify your API keys are correct in `data/config.json`
- Check that the API keys have sufficient permissions
- Ensure network connectivity to the API endpoints

### Knowledge base is empty

- Edit `data/components.json` and `data/utils.json`
- Add your actual components and utilities
- Restart the MCP server

## Version Management

When publishing new versions:

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major

# Publish to npm
npm publish
```

## Support

For issues and questions, please visit: https://github.com/lyw405/code-intelligence-mcp/issues
