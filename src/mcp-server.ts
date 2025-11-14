#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import {
  suggestComponentsTool,
  queryComponentTool,
  suggestUtilitiesTool,
  queryUtilityTool,
} from '@/tools/index.js';
import {
  getComponentLibraryResource,
  getUsageGuideResource,
} from '@/resources/index.js';
import { logger } from '@/utils/index.js';

/**
 * 代码智能建议 MCP 服务
 */
class CodeIntelligenceMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'code-intelligence-service',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {
            listChanged: true,
          },
          resources: {
            subscribe: true,
            listChanged: true,
          },
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // 工具列表处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        {
          name: 'suggest_components',
          description:
            'USE WHEN: 用户想要创建/生成/新建/开发页面、组件或界面时。分析用户需求，从私有组件库@private-basic-components中智能推荐最合适的组件，生成包含具体实现建议的优化提示词。自动触发场景："创建页面"、"生成组件"、"新建界面"、"开发表单"、"实现功能"等所有UI开发任务。',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description:
                  '用户的原始需求提示词，例如"生成一个登录页面"、"创建用户列表"、"新建表单组件"',
              },
            },
            required: ['prompt'],
          },
        },
        {
          name: 'query_component',
          description:
            '根据组件名称查询详细信息，包括 props、events、slots、使用示例等。用于了解推荐组件的具体用法。',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: '要查询的组件名称，例如 "das-button"',
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'suggest_utilities',
          description:
            'USE WHEN: 用户想要实现某些逻辑功能、数据处理、格式转换、工具函数等时。分析用户的逻辑需求，从工具方法库中智能推荐可以直接复用的方法，避免重复开发。自动触发场景："实现数据格式化"、"需要加密功能"、"时间处理"、"IP校验"、"数据转换"等所有逻辑开发任务。',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description:
                  '用户的逻辑需求描述，例如"需要格式化数字显示千分位"、"实现密码加密"、"转换时间戳为日期"',
              },
            },
            required: ['prompt'],
          },
        },
        {
          name: 'query_utility',
          description:
            '根据工具方法名称查询详细信息，包括参数、返回值、使用示例等。用于了解推荐工具方法的具体用法。',
          inputSchema: {
            type: 'object',
            properties: {
              utilityName: {
                type: 'string',
                description: '要查询的工具方法名称，例如 "formatNumber"',
              },
            },
            required: ['utilityName'],
          },
        },
      ];

      return { tools };
    });

    // 工具调用处理器
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      logger.info(`调用工具: ${name}`);

      switch (name) {
        case 'suggest_components':
          return await suggestComponentsTool(args);

        case 'query_component':
          return await queryComponentTool(args);

        case 'suggest_utilities':
          return await suggestUtilitiesTool(args);

        case 'query_utility':
          return await queryUtilityTool(args);

        default:
          throw new McpError(ErrorCode.MethodNotFound, `未知工具: ${name}`);
      }
    });

    // 资源列表处理器
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'code-intelligence://component-library',
            name: '组件库',
            description: '私有组件库 @private-basic-components 的所有组件列表',
            mimeType: 'application/json',
          },
          {
            uri: 'code-intelligence://usage-guide',
            name: '使用指南',
            description: '组件建议工具的使用指南和最佳实践',
            mimeType: 'text/plain',
          },
        ],
      };
    });

    // 资源读取处理器
    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      const { uri } = request.params;

      switch (uri) {
        case 'code-intelligence://component-library':
          return getComponentLibraryResource();
        case 'code-intelligence://usage-guide':
          return getUsageGuideResource();
        default:
          throw new McpError(ErrorCode.InvalidRequest, `未知资源: ${uri}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('代码智能 MCP 服务已启动');
  }
}

// 启动服务器
const server = new CodeIntelligenceMCPServer();
server.run().catch(error => {
  logger.error('服务器错误:', error);
  process.exit(1);
});
