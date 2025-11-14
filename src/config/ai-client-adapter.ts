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

    // 允许通过环境变量覆盖配置路径
    const envConfigPath =
      process.env.GAREN_MCP_CONFIG || process.env.CONFIG_PATH;

    // 尝试多个可能的配置文件路径（按优先级从高到低）
    const possiblePaths = [
      ...(envConfigPath ? [envConfigPath] : []),
      join(process.cwd(), 'data/config.json'), // 当前工作目录
      join(currentDir, '../../data/config.json'), // 相对于当前文件
    ];

    let configFilePath: string | null = null;
    let configFileContent: string | null = null;

    for (const path of possiblePaths) {
      try {
        logger.debug(`Trying config path: ${path}`);
        configFileContent = readFileSync(path, 'utf-8');
        configFilePath = path;
        logger.info(`Successfully loaded config from: ${configFilePath}`);
        break;
      } catch (err) {
        logger.debug(`Path not found: ${path}`);
        continue;
      }
    }

    if (!configFileContent || !configFilePath) {
      throw new Error(
        `Could not find config.json in any of the expected locations: ${possiblePaths.join(', ')}`
      );
    }

    const config = JSON.parse(configFileContent) as AIProvidersConfig;

    configCache = config;
    logger.info(`Loaded ${config.providers.length} providers`);

    return config;
  } catch (error) {
    logger.error('Error loading config:', error);
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
