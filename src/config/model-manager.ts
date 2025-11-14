/**
 * AI模型配置管理器
 * 提供统一的模型获取和配置管理
 */

import { loadAIProvidersConfig } from './ai-client-adapter.js';
import { AIProvidersConfig, AIModelConfig } from './types.js';

// 模型配置缓存
let modelConfigCache: AIProvidersConfig | null = null;

/**
 * 获取模型配置（带缓存）
 */
export function getModelConfig(forceReload = false): AIProvidersConfig {
  if (!modelConfigCache || forceReload) {
    modelConfigCache = loadAIProvidersConfig(forceReload);
  }
  return modelConfigCache;
}

/**
 * 获取默认模型名称
 */
export function getDefaultModel(): string {
  const config = getModelConfig();

  // 使用配置的默认模型
  if (config.defaultModel) {
    const modelExists = config.providers.some(provider =>
      provider.models.some(model => model.model === config.defaultModel)
    );

    if (modelExists) {
      return config.defaultModel;
    }
  }

  // 如果没有配置默认模型，返回第一个可用的模型
  for (const provider of config.providers) {
    if (provider.models.length > 0) {
      return provider.models[0].model;
    }
  }

  throw new Error('No AI models configured');
}

/**
 * 获取模型详细信息
 */
export function getModelInfo(modelName: string): AIModelConfig | null {
  const config = getModelConfig();

  for (const provider of config.providers) {
    const model = provider.models.find(m => m.model === modelName);
    if (model) {
      return model;
    }
  }

  return null;
}

/**
 * 根据模型名称获取提供商
 */
export function getProviderByModel(modelName: string): string | null {
  const config = getModelConfig();

  for (const provider of config.providers) {
    const model = provider.models.find(m => m.model === modelName);
    if (model) {
      return provider.provider;
    }
  }

  return null;
}
