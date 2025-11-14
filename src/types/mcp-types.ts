/**
 * MCP 类型定义
 */

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageContent {
  type: 'image';
  data: string;
  mimeType?: string;
}

export type Content = TextContent | ImageContent;

/**
 * 组件信息
 */
export interface ComponentInfo {
  name: string;
  description: string;
  import: string;
  relativePath: string;
}

/**
 * 组件建议（AI 返回）
 * AI 只返回组件名称和推荐理由，不返回描述
 */
export interface ComponentSuggestion {
  componentName: string;
  reason: string;
}

/**
 * AI 返回的组件建议结果
 */
export interface AISuggestionResult {
  suggestedComponents: ComponentSuggestion[];
  optimizedPrompt: string;
}

/**
 * 重新设计的提示词
 */
export interface RedesignedPrompt {
  originalPrompt: string;
  result: AISuggestionResult;
  redesignedPrompt: string;
}

/**
 * 工具方法信息
 */
export interface UtilityInfo {
  name: string;
  description: string;
  import: string;
  relativePath: string;
  params?: string;
  returns?: string;
  type?: string;
}

/**
 * 工具方法建议（AI 返回）
 */
export interface UtilitySuggestion {
  utilityName: string;
  reason: string;
}

/**
 * AI 返回的工具方法建议结果
 */
export interface AIUtilitySuggestionResult {
  suggestedUtilities: UtilitySuggestion[];
  optimizedPrompt: string;
}

/**
 * 重新设计的逻辑提示词
 */
export interface RedesignedLogicPrompt {
  originalPrompt: string;
  result: AIUtilitySuggestionResult;
  redesignedPrompt: string;
}
