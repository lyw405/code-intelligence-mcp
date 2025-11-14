import { utilityKB } from './utility-knowledge-base.js';
import { logger } from '@/utils/logger.js';
import { callAIForJSON } from '@/utils/ai-caller.js';
import type { AIUtilitySuggestionResult } from '@/types/mcp-types.js';

/**
 * AI 工具方法建议器
 * 使用大模型完成工具方法推荐和逻辑提示词优化
 */
export class AIUtilitySuggester {
  /**
   * 使用 AI 生成工具方法建议
   */
  async suggest(userPrompt: string): Promise<AIUtilitySuggestionResult> {
    try {
      logger.info('=== AI Utility Suggester 开始执行 ===')
      logger.info('用户逻辑需求:', userPrompt);

      // 获取工具方法摘要
      const utilitiesSummary = utilityKB.getUtilitiesSummary();
      logger.info(`加载了 ${utilitiesSummary.length} 个工具方法`);

      // 调用 AI
      const result = await callAIForJSON<AIUtilitySuggestionResult>({
        systemPrompt: this.buildSystemPrompt(),
        userPrompt:
          this.buildUserMessage(userPrompt, utilitiesSummary) +
          '\n\n请以JSON格式返回，包含suggestedUtilities数组和optimizedPrompt字符串',
      });

      logger.info(
        `AI 返回 ${result.suggestedUtilities.length} 个工具方法建议`
      );

      return result;
    } catch (error) {
      logger.error('AI 工具方法建议生成失败:', error);
      throw error;
    }
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(): string {
    return `你是一个专业的前端工具方法推荐助手。你的任务是:

1. **从提供的工具方法知识库中推荐最合适的方法**
   - 只推荐知识库中存在的工具方法
   - 根据用户需求选择最相关的工具方法
   - 给出简要而清晰的推荐理由
   - 优先推荐能直接复用的方法，避免重复开发

2. **优化用户的逻辑需求描述**
   - 只优化语言表达，使其更清晰准确
   - 不要添加用户没有提到的功能
   - 不要扩展需求范围
   - 保持原意，只改善表达

注意事项:
- 严格基于知识库推荐工具方法
- 推荐理由要简洁明了
- 优化提示词时不要画蛇添足
- 返回格式：{ "suggestedUtilities": [{ "utilityName": "方法名", "reason": "推荐理由" }], "optimizedPrompt": "优化后的提示词" }
- 只返回方法名称和推荐理由，不需要返回方法描述`;
  }

  /**
   * 构建用户消息
   */
  private buildUserMessage(
    userPrompt: string,
    utilitiesSummary: Array<{ name: string; description: string }>
  ): string {
    const utilitiesText = utilitiesSummary
      .map(util => `- ${util.name}: ${util.description}`)
      .join('\n');

    return `用户逻辑需求: ${userPrompt}

可用的工具方法知识库:
${utilitiesText}

请根据用户需求，从上述工具方法库中推荐合适的方法，帮助用户避免重复开发，并优化用户的需求描述。`;
  }
}

export const aiUtilitySuggester = new AIUtilitySuggester();
