# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-14

### Added

- **Core Features**
  - AI-powered component recommendation engine
  - AI-powered utility method recommendation engine
  - Intelligent prompt redesign for UI components
  - Intelligent prompt redesign for logic methods
  - Component knowledge base management
  - Utility knowledge base management

- **MCP Tools**
  - `suggest_components`: Recommend UI components based on user requirements
  - `suggest_utilities`: Recommend utility methods based on logic requirements
  - `query_component`: Query detailed information of specific components
  - `query_utility`: Query detailed information of specific utility methods

- **MCP Resources**
  - `component-library`: Access to complete component library information
  - `utility-library`: Access to complete utility method library information
  - `usage-guide`: Usage guide and best practices

- **AI Model Support**
  - OpenAI (GPT-4, GPT-4o, etc.)
  - Anthropic (Claude 3.5 Sonnet, Claude 3 Haiku, etc.)
  - DeepSeek (DeepSeek Chat)
  - Ollama (Local models: Llama, Qwen, etc.)
  - Flexible model configuration with default model selection

- **Configuration Management**
  - Multi-provider AI model configuration
  - Secure API key management with .gitignore
  - Example configuration files for easy setup
  - Path alias support (@/\* imports)

- **Developer Experience**
  - TypeScript with strict type checking
  - ESLint + Prettier code formatting
  - Husky Git hooks for pre-commit checks
  - pnpm package management
  - Hot reload development mode

- **Documentation**
  - Comprehensive README with setup instructions
  - Detailed MCP tools documentation
  - Configuration examples
  - Architecture overview

### Technical Stack

- TypeScript 5.x
- Node.js >= 18.0.0
- MCP SDK (@modelcontextprotocol/sdk)
- Vercel AI SDK
- pnpm 10.x

---

## Release Notes

### Version 1.0.0

This is the initial release of Code Intelligence MCP, providing intelligent code suggestion capabilities for AI IDEs. The project enables teams to leverage their private component libraries and utility methods more effectively through AI-powered recommendations.

**Key Capabilities:**

- Semantic understanding of development requirements
- Context-aware component and method recommendations
- Automated prompt optimization for better AI assistance
- Support for multiple AI model providers
- Extensible knowledge base architecture

**Getting Started:**

1. Install dependencies: `pnpm install`
2. Configure knowledge bases: Copy example files and customize
3. Set up AI model API keys in `data/config.json`
4. Register MCP service in your AI IDE
5. Start development: `pnpm dev`

For detailed setup instructions, please refer to the [README.md](README.md).
