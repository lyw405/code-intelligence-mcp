/**
 * AI模型配置管理器
 * 提供统一的模型选择、配置管理和默认值设置
 */

import { loadAIProvidersConfig } from './ai-client-adapter.js';
import { ModelPurpose, AIProvidersConfig, AIModelConfig } from './types.js';

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
 * 根据用途获取推荐的模型名称
 */
export function getRecommendedModel(description: ModelPurpose): string {
  const config = getModelConfig();

  // 首先尝试从配置文件获取默认模型
  if (config.defaultModels && config.defaultModels[description]) {
    const recommendedModelName = config.defaultModels[description];

    // 检查推荐的模型是否在配置中存在
    const modelExists = config.providers.some(provider =>
      provider.models.some(model => model.model === recommendedModelName)
    );

    if (modelExists) {
      return recommendedModelName;
    }
  }

  // 如果配置文件中没有指定，尝试根据模型用途映射找到合适的模型
  if (config.modelPurposes) {
    for (const [modelName, purposes] of Object.entries(config.modelPurposes)) {
      if (purposes.includes(description)) {
        // 检查模型是否在配置中存在
        const modelExists = config.providers.some(provider =>
          provider.models.some(model => model.model === modelName)
        );

        if (modelExists) {
          return modelName;
        }
      }
    }
  }

  // 如果没有找到合适的模型，返回第一个可用的模型
  for (const provider of config.providers) {
    if (provider.models.length > 0) {
      return provider.models[0].model;
    }
  }

  throw new Error('No AI models configured');
}

/**
 * 获取所有可用的模型列表
 */
export function getAvailableModels(): Array<{
  model: string;
  title: string;
  provider: string;
  purposes: ModelPurpose[];
}> {
  const config = getModelConfig();
  const models: Array<{
    model: string;
    title: string;
    provider: string;
    purposes: ModelPurpose[];
  }> = [];

  for (const provider of config.providers) {
    for (const model of provider.models) {
      // 从配置文件获取模型用途
      let purposes: ModelPurpose[] = [ModelPurpose.DESIGN]; // 默认用途

      if (config.modelPurposes && config.modelPurposes[model.model]) {
        purposes = config.modelPurposes[model.model] as ModelPurpose[];
      }

      models.push({
        model: model.model,
        title: model.title,
        provider: provider.provider,
        purposes,
      });
    }
  }

  return models;
}

/**
 * 验证模型是否可用
 */
export function validateModel(modelName: string): boolean {
  const config = getModelConfig();
  return config.providers.some(provider =>
    provider.models.some(model => model.model === modelName)
  );
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
