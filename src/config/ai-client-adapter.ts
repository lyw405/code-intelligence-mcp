/**
 * AI客户端适配器
 * 将项目中的AI客户端系统适配到MCP服务器中使用
 */

// 设置环境变量以处理 TLS 警告（仅在开发环境中）
// 注意：这会禁用证书验证，仅用于开发环境
if (
  process.env.NODE_ENV === 'development' &&
  !process.env.NODE_TLS_REJECT_UNAUTHORIZED
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { AIProvider, AIModelConfig, AIProvidersConfig } from './types.js';
import { createLogger } from '../utils/logger.js';
import { resolveConfigPath } from '../utils/path-utils.js';

// 创建AI适配器专用的日志实例
const logger = createLogger('AI-Adapter');

// 配置缓存
let configCache: AIProvidersConfig | null = null;

/**
 * 加载AI提供商配置
 */
export function loadAIProvidersConfig(forceReload = false): AIProvidersConfig {
  if (configCache && !forceReload) {
    return configCache;
  }

  try {
    // 获取当前文件的目录
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDir = dirname(currentFilePath);

    // 统一配置文件路径解析逻辑
    // 优先级：
    // 1. CI_MCP_CONFIG - 直接指定 config.json 文件路径
    // 2. CI_MCP_DATA_DIR - 指定配置目录，拼接 config.json
    // 3. GAREN_MCP_CONFIG, GAREN_MCP_DATA_DIR - 向后兼容
    // 4. CONFIG_PATH - 通用配置路径
    // 5. 当前工作目录的 ci-mcp-data/config.json
    // 6. 相对于代码的 ../../ci-mcp-data/config.json

    const possiblePaths: string[] = [];

    // 优先级 1: 直接指定 config.json 文件
    if (process.env.CI_MCP_CONFIG) {
      possiblePaths.push(process.env.CI_MCP_CONFIG);
    }

    // 优先级 2: 通过 CI_MCP_DATA_DIR 拼接
    if (process.env.CI_MCP_DATA_DIR) {
      possiblePaths.push(join(process.env.CI_MCP_DATA_DIR, 'config.json'));
    }

    // 优先级 3: 向后兼容的环境变量
    if (process.env.GAREN_MCP_CONFIG) {
      possiblePaths.push(process.env.GAREN_MCP_CONFIG);
    }
    if (process.env.GAREN_MCP_DATA_DIR) {
      possiblePaths.push(join(process.env.GAREN_MCP_DATA_DIR, 'config.json'));
    }
    if (process.env.CONFIG_PATH) {
      possiblePaths.push(process.env.CONFIG_PATH);
    }

    // 优先级 4-5: 默认路径
    possiblePaths.push(
      join(process.cwd(), 'ci-mcp-data/config.json'),
      join(currentDir, '../../ci-mcp-data/config.json')
    );

    const configFilePath = resolveConfigPath(
      ['CI_MCP_CONFIG', 'CI_MCP_DATA_DIR', 'GAREN_MCP_CONFIG', 'CONFIG_PATH'],
      possiblePaths,
      msg => logger.debug(msg)
    );

    if (!configFilePath) {
      throw new Error(
        `无法在任何预期位置找到 config.json。请设置环境变量：\n` +
          `  CI_MCP_DATA_DIR=/path/to/config/dir  (推荐)\n` +
          `  CI_MCP_CONFIG=/path/to/config.json  (直接指定文件)\n` +
          `尝试过的路径：${possiblePaths.join(', ')}`
      );
    }

    logger.info(`成功加载配置文件: ${configFilePath}`);
    const configFileContent = readFileSync(configFilePath, 'utf-8');
    const config = JSON.parse(configFileContent) as AIProvidersConfig;

    configCache = config;
    logger.info(`已加载 ${config.providers.length} 个 AI 提供商`);

    return config;
  } catch (error) {
    logger.error('加载配置失败:', error);
    throw new Error(`Failed to load AI providers configuration: ${error}`);
  }
}

/**
 * 查找模型配置
 */
export function findModelConfig(
  provider: AIProvider,
  modelName: string
): AIModelConfig {
  const config = loadAIProvidersConfig();

  const providerConfig = config.providers.find(p => p.provider === provider);
  if (!providerConfig) {
    throw new Error(`Provider "${provider}" not found`);
  }

  const modelConfig = providerConfig.models.find(m => m.model === modelName);
  if (!modelConfig) {
    throw new Error(
      `Model "${modelName}" not found for provider "${provider}"`
    );
  }

  return modelConfig;
}

/**
 * 创建AI客户端
 */
export function getAIClient(provider: AIProvider, modelName: string) {
  const modelConfig = findModelConfig(provider, modelName);

  logger.info(`Creating ${provider} client for model: ${modelName}`);
  logger.debug(`Using baseURL: ${modelConfig.baseURL}`);

  switch (provider) {
    case AIProvider.OPENAI:
      return createOpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      })(modelConfig.model);

    case AIProvider.ANTHROPIC: {
      // 检查是否是代理服务
      const isProxyService =
        modelConfig.baseURL &&
        (modelConfig.baseURL.includes('302.ai') ||
          modelConfig.baseURL.includes('openrouter.ai') ||
          !modelConfig.baseURL.includes('api.anthropic.com'));

      if (isProxyService) {
        logger.info(`Using OpenAI-compatible mode for proxy service`);
        // 使用OpenAI兼容模式处理代理服务
        // 不添加 anthropic/ 前缀，直接使用原始模型名，避免触发 responses API
        const finalModelName = modelConfig.model;

        logger.info(`Final model name: ${finalModelName}`);

        return createOpenAI({
          baseURL: modelConfig.baseURL,
          apiKey: modelConfig.apiKey,
        })(finalModelName);
      } else {
        logger.info(`Using native Anthropic API`);
        return createAnthropic({
          baseURL: modelConfig.baseURL,
          apiKey: modelConfig.apiKey,
        })(modelConfig.model);
      }
    }

    case AIProvider.DEEPSEEK:
      return createDeepSeek({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      })(modelConfig.model);

    case AIProvider.OLLAMA:
      // Ollama 使用 OpenAI 兼容的 API
      return createOpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey || 'ollama', // Ollama 通常不需要 API key
      })(modelConfig.model);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Automatically detect provider and create client based on model name
 */
export function getAIClientByModelName(modelName: string) {
  const config = loadAIProvidersConfig();

  // Find model in all providers
  for (const providerConfig of config.providers) {
    const modelConfig = providerConfig.models.find(m => m.model === modelName);
    if (modelConfig) {
      logger.info(
        `Found model ${modelName} in provider ${providerConfig.provider}`
      );
      return getAIClient(providerConfig.provider, modelName);
    }
  }

  throw new Error(`Model "${modelName}" not found in any provider`);
}
