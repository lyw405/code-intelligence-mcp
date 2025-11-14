/**
 * 统一的 AI 调用工具
 * 封装所有 AI 调用逻辑，简化使用
 */

import { getDefaultModel, getModelInfo } from '@/config/model-manager.js';
import { logger } from './logger.js';

export interface AICallOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  modelName?: string; // 可选指定模型，不指定则使用默认模型
}

/**
 * 调用 AI 模型生成响应
 */
export async function callAI(options: AICallOptions): Promise<string> {
  const { systemPrompt, userPrompt, temperature = 0.7, modelName } = options;

  try {
    // 获取模型名称（使用指定的或默认的）
    const finalModelName = modelName || getDefaultModel();
    logger.info(`使用模型: ${finalModelName}`);

    // 获取模型配置
    const modelInfo = getModelInfo(finalModelName);
    if (!modelInfo) {
      throw new Error(`模型配置未找到: ${finalModelName}`);
    }

    // 调用 API
    logger.debug('调用参数:', {
      modelName: finalModelName,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      temperature,
    });

    const response = await fetch(`${modelInfo.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${modelInfo.apiKey}`,
      },
      body: JSON.stringify({
        model: finalModelName,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('API 调用失败:', error);
      throw new Error(`API调用失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    logger.info('AI 调用成功');

    return data.choices[0].message.content;
  } catch (error) {
    logger.error('AI 调用失败:', error);
    throw error;
  }
}

/**
 * 调用 AI 并解析 JSON 响应
 */
export async function callAIForJSON<T = any>(
  options: AICallOptions
): Promise<T> {
  const responseText = await callAI(options);

  // 处理 Markdown 代码块
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(jsonText) as T;
  } catch (error) {
    logger.error('JSON 解析失败:', error);
    logger.error('原始响应:', responseText);
    throw new Error(`JSON 解析失败: ${error}`);
  }
}
