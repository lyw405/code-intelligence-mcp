# Code Intelligence MCP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange)](https://pnpm.io/)

[English](./README.md) | [中文](./README.zh-CN.md)

Intelligent code suggestion MCP service that provides AI-powered component and utility method recommendations for AI IDEs.

## Introduction

This is an intelligent code suggestion service based on Model Context Protocol (MCP). It analyzes user requirements through AI and recommends the most suitable components and utility methods from private code repositories, helping developers improve code reuse and development efficiency.

### Core Capabilities

**🎨 UI Component Intelligent Recommendation**

- Analyze UI development requirements (pages, forms, interfaces, etc.)
- Match the most relevant private components from the knowledge base
- Generate optimized prompts with component imports and usage
- Provide complete implementation guides and code examples

**🔧 Utility Method Intelligent Recommendation**

- Analyze logic function requirements (data processing, format conversion, utility functions, etc.)
- Find reusable utility methods from the method knowledge base
- Generate optimized prompts with method imports and invocation
- Avoid reinventing the wheel and improve code quality

## Features

### Intelligent Analysis Engine

- **Requirement Understanding**: Deep understanding of user development intentions based on AI
- **Keyword Extraction**: Automatically identify core elements in requirements
- **Complexity Assessment**: Intelligently evaluate implementation difficulty and component fit

### Knowledge Base Management

- **Component Knowledge Base**: Manage private UI component library (props, events, slots, examples)
- **Method Knowledge Base**: Manage utility method library (parameters, return values, types, usage)
- **Relevance Algorithm**: Calculate recommendation scores based on semantic matching

### Prompt Optimization

- **Bidirectional Optimization**: Support prompt redesign for both component and method scenarios
- **Structured Output**: Generate complete solutions including import statements and implementation steps
- **Best Practices**: Integrate code standards and usage recommendations

## Project Structure

```
code-intelligence-mcp/
├── src/
│   ├── core/                          # Core functional modules
│   │   ├── knowledge-base.ts          # Component knowledge base management
│   │   ├── utility-knowledge-base.ts  # Utility method knowledge base management
│   │   ├── prompt-redesigner.ts       # UI component prompt redesign
│   │   ├── logic-prompt-redesigner.ts # Logic method prompt redesign
│   │   ├── ai-suggester.ts            # AI component recommendation engine
│   │   ├── ai-utility-suggester.ts    # AI method recommendation engine
│   │   └── index.ts
│   ├── config/                        # Configuration management
│   │   ├── model-manager.ts           # AI model manager
│   │   ├── ai-client-adapter.ts       # AI client adapter
│   │   ├── types.ts                   # Configuration type definitions
│   │   └── index.ts
│   ├── tools/                         # MCP tool definitions
│   │   ├── suggestion.ts              # Component suggestion tool
│   │   ├── utility-suggestion.ts      # Method suggestion tool
│   │   ├── query.ts                   # Query tool
│   │   └── index.ts
│   ├── resources/                     # MCP resource definitions
│   │   └── index.ts
│   ├── types/                         # Type definitions
│   │   └── mcp-types.ts
│   ├── utils/                         # Utility functions
│   │   ├── logger.ts                  # Logger utility
│   │   ├── ai-caller.ts               # AI unified caller
│   │   └── index.ts
│   └── mcp-server.ts                  # MCP server main entry
├── data/                              # Knowledge base data
│   ├── components.json                # UI component knowledge base
│   ├── utils.json                     # Utility method knowledge base
│   └── config.json                    # AI model configuration
├── scripts/                           # Script tools
│   ├── start.sh                       # Startup script
│   ├── test.js                        # Test script
│   └── test-*.ts                      # Feature tests
├── package.json
├── tsconfig.json
└── mcp-config.json                    # MCP service configuration
```

## Installation and Usage

### Prerequisites

**Configure Knowledge Base Data Files**

The project requires manual configuration of the following data files:

1. **`data/config.json`** - AI model configuration (including API Key)

   ```bash
   cp data/config.example.json data/config.json
   # Edit config.json and fill in your API Key
   ```

2. **`data/components.json`** - UI component knowledge base

   ```bash
   cp data/components.example.json data/components.json
   # Edit components.json based on your private component library
   ```

   - Add component information following the existing format: `description`, `import`, `relativePath`, etc.

3. **`data/utils.json`** - Utility method knowledge base

   ```bash
   cp data/utils.example.json data/utils.json
   # Edit utils.json based on your utility method library
   ```

   - Include method information: `description`, `import`, `params`, `returns`, etc.

**Note:**

- `config.json` contains sensitive information (API Key) and is added to `.gitignore`, will not be committed to the repository
- `components.json` and `utils.json` need to be configured based on your actual code repository
- Refer to example files like `config.example.json` for configuration format

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Production Mode

```bash
pnpm start:prod
```

## MCP Tools

### 🎨 UI Component Suggestion Tools

#### 1. suggest_components

Intelligently analyze UI development requirements and recommend the most suitable private components.

**Use Cases:**

- Create pages, forms, interfaces and other UI features
- Quick development using private component library
- Get complete implementation solutions

**Input Parameters:**

```typescript
{
  prompt: string; // User requirement description, e.g. "Create user login page"
}
```

**Output:**

- **Requirement Analysis**: Keywords, component types, complexity assessment
- **Suggested Components**: Component list + relevance score + recommendation reason
- **Optimized Prompt**: Including specific component imports and usage
- **Implementation Guide**: Step-by-step development suggestions

**Example:**

```json
// Input
{"prompt": "Generate a user information edit form"}

// Output
{
  "analysis": {
    "keywords": ["form", "edit", "user information"],
    "componentTypes": ["form", "input", "button"]
  },
  "suggestedComponents": [
    {
      "name": "das-form",
      "relevance": 0.95,
      "reason": "Most suitable for user information editing scenarios"
    }
  ],
  "redesignedPrompt": "Create using das-form component...",
  "implementationGuide": "1. Import component...\n2. Configure form fields..."
}
```

#### 2. query_component

Query detailed information of a specific component.

**Input Parameters:**

```typescript
{
  componentName: string; // Component name, e.g. "das-button"
}
```

**Output:**

- Component description, category, tags
- Props parameter list
- Events list
- Slots description
- Usage example code
- Import path

---

### 🔧 Utility Method Suggestion Tools

#### 1. suggest_utilities

Intelligently analyze logic development requirements and recommend reusable utility methods.

**Use Cases:**

- Implement data processing and format conversion functions
- Need encryption, validation and other utility functions
- Avoid reinventing the wheel

**Input Parameters:**

```typescript
{
  prompt: string; // Logic requirement description, e.g. "Need to format numbers with thousand separators"
}
```

**Output:**

- **Requirement Analysis**: Key function points, method types
- **Suggested Methods**: Method list + relevance score + recommendation reason
- **Optimized Prompt**: Including method imports and invocation
- **Implementation Guide**: Usage steps and notes

**Example:**

```json
// Input
{"prompt": "Implement password encryption function"}

// Output
{
  "analysis": {
    "keywords": ["encryption", "password", "security"],
    "methodTypes": ["encryption", "security"]
  },
  "suggestedUtilities": [
    {
      "name": "encryptPassword",
      "relevance": 0.98,
      "reason": "Provides MD5/SHA256 password encryption"
    }
  ],
  "redesignedPrompt": "Use encryptPassword method...",
  "implementationGuide": "1. Import method...\n2. Call encryption..."
}
```

#### 2. query_utility

Query detailed information of a specific utility method.

**Input Parameters:**

```typescript
{
  utilityName: string; // Method name, e.g. "formatNumber"
}
```

**Output:**

- Method description, category, type
- Parameter list (parameter name, type, description)
- Return value type and description
- Usage example code
- Import path

## MCP Resources

### code-intelligence://component-library

**Component Library Resource**

Provides complete private component library information, including:

- List of all available components
- Component categories and tags
- Component capability overview

### code-intelligence://utility-library

**Utility Method Library Resource**

Provides complete utility method library information, including:

- List of all available methods
- Method categories and functions
- Method capability overview

### code-intelligence://usage-guide

**Usage Guide Resource**

Includes:

- MCP tools usage instructions
- Best practice recommendations
- FAQs
- Integration configuration guide

## Tech Stack

**Core Framework**

- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment
- **MCP SDK** (@modelcontextprotocol/sdk) - Model Context Protocol implementation

**AI Integration**

- **Vercel AI SDK** - Unified AI interface
- **OpenAI** - GPT series model support
- **Anthropic** - Claude series model support
- **DeepSeek** - Domestic large model support

**Development Tools**

- **pnpm** - Package manager
- **tsx** - TypeScript executor
- **ESLint + Prettier** - Code standards
- **Husky** - Git hooks

## Development Standards

- Use TypeScript for type-safe development
- Follow ESLint and Prettier code standards
- Use Husky for Git hooks management

## Configuration

### 1. MCP Service Configuration (mcp-config.json)

Register MCP service in AI IDE:

```json
{
  "mcpServers": {
    "code-intelligence": {
      "command": "/bin/zsh",
      "args": ["/path/to/code-intelligence-mcp/scripts/start.sh"]
    }
  }
}
```

### 2. AI Model Configuration (data/config.json)

Configure AI models used by the recommendation engine:

```json
{
  "defaultModel": "claude-3-7-sonnet-latest",
  "providers": [
    {
      "provider": "anthropic",
      "models": [
        {
          "model": "claude-3-7-sonnet-latest",
          "title": "Claude 3.7 Sonnet",
          "baseURL": "https://api.302.ai/v1",
          "apiKey": "your-api-key"
        }
      ]
    },
    {
      "provider": "openai",
      "models": [
        {
          "model": "gpt-4o",
          "title": "GPT-4o",
          "baseURL": "https://api.openai.com/v1",
          "apiKey": "your-api-key"
        }
      ]
    }
  ]
}
```

**Configuration Description:**

- `defaultModel`: Default model name to use, must exist in `providers`
- `providers`: List of supported AI providers
  - `provider`: Provider type (`anthropic`, `openai`, `deepseek`, `ollama`)
  - `models`: List of model configurations for this provider
    - `model`: Model name (must match `defaultModel`)
    - `title`: Model display name
    - `baseURL`: API endpoint address
    - `apiKey`: API key

**Supported Providers:**

- `anthropic` - Claude series models
- `openai` - GPT series models
- `deepseek` - DeepSeek domestic models
- `ollama` - Local models

### 3. Knowledge Base Data

#### Component Knowledge Base (data/components.json)

```json
{
  "components": [
    {
      "name": "das-button",
      "description": "Button component",
      "category": "Basic component",
      "tags": ["button", "interaction"],
      "props": [...],
      "events": [...],
      "example": "..."
    }
  ]
}
```

#### Utility Method Knowledge Base (data/utils.json)

```json
{
  "utilities": [
    {
      "name": "formatNumber",
      "description": "Format number with thousand separators",
      "category": "Formatting",
      "type": "formatter",
      "params": [...],
      "returns": {...},
      "example": "..."
    }
  ]
}
```

## License

MIT

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.
