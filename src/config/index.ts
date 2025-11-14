/**
 * 配置模块统一导出
 */

export {
  getAIClientByModelName,
  loadAIProvidersConfig,
} from './ai-client-adapter.js';

// Model management
export {
  getRecommendedModel,
  getAvailableModels,
  validateModel,
  getModelInfo,
  getProviderByModel,
} from './model-manager.js';

// Types and enums
export {
  AIProvider,
  ModelPurpose,
  ModelFeature,
  type AIModelConfig,
  type AIProviderConfig,
  type AIProvidersConfig,
  type AvailableModel,
} from './types.js';
