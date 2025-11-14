/**
 * AI配置相关的类型定义和枚举
 */

// AI提供商枚举
export enum AIProvider {
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
  OLLAMA = 'ollama',
}

// 模型用途枚举
export enum ModelPurpose {
  ANALYSIS = 'ANALYSIS', // 需求分析和复杂度分析
  DESIGN = 'DESIGN', // 组件设计和策略生成
  QUERY = 'QUERY', // 组件查询和文档获取
  INTEGRATION = 'INTEGRATION', // 设计集成和组合
}

// 模型特性枚举
export enum ModelFeature {
  VISION = 'vision', // 视觉能力
  CODE = 'code', // 代码生成
  REASONING = 'reasoning', // 推理能力
  CREATIVITY = 'creativity', // 创意能力
}

// 模型配置接口
export interface AIModelConfig {
  model: string;
  title: string;
  baseURL: string;
  apiKey: string;
}

// 提供商配置接口
export interface AIProviderConfig {
  provider: AIProvider;
  models: AIModelConfig[];
}

// 默认模型配置接口
export interface DefaultModelsConfig {
  [ModelPurpose.ANALYSIS]: string;
  [ModelPurpose.DESIGN]: string;
  [ModelPurpose.QUERY]: string;
  [ModelPurpose.INTEGRATION]: string;
}

// 模型用途映射接口
export interface ModelPurposesConfig {
  [modelName: string]: ModelPurpose[];
}

// 完整配置接口
export interface AIProvidersConfig {
  defaultModel?: string;
  providers: AIProviderConfig[];
}

// 可用模型信息接口
export interface AvailableModel {
  model: string;
  title: string;
  provider: AIProvider;
  purposes: ModelPurpose[];
}

// 配置验证结果接口
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  availableModels: string[];
  providers: AIProvider[];
}

// 连接测试结果接口
export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  responseTime?: number;
}

// 配置摘要接口
export interface ConfigSummary {
  totalProviders: number;
  totalModels: number;
  providers: Array<{
    name: AIProvider;
    modelCount: number;
    models: string[];
  }>;
}
