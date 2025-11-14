import { componentKB } from './knowledge-base.js';
import { logger } from '@/utils/logger.js';
import { callAIForJSON } from '@/utils/ai-caller.js';
import type { AISuggestionResult } from '@/types/mcp-types.js';

/**
 * AI 组件建议器
 * 使用大模型完成组件推荐和提示词优化
 */
export class AISuggester {
  /**
   * 使用 AI 生成组件建议
   */
  async suggest(userPrompt: string): Promise<AISuggestionResult> {
    try {
      logger.info('=== AI Suggester 开始执行 ===');
      logger.info('用户提示词:', userPrompt);

      // 获取组件摘要
      const componentsSummary = componentKB.getComponentsSummary();
      logger.info(`加载了 ${componentsSummary.length} 个组件`);

      // 调用 AI
      const result = await callAIForJSON<AISuggestionResult>({
        systemPrompt: this.buildSystemPrompt(),
        userPrompt:
          this.buildUserMessage(userPrompt, componentsSummary) +
          '\n\n请以JSON格式返回，包含suggestedComponents数组和optimizedPrompt字符串',
      });

      logger.info(`AI 返回 ${result.suggestedComponents.length} 个组件建议`);

      return result;
    } catch (error) {
      logger.error('AI 建议生成失败:', error);
      throw error;
    }
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(): string {
    return `你是一个专业的前端组件推荐助手。你的任务是:

1. **从提供的组件知识库中推荐最合适的组件**
   - 只推荐知识库中存在的组件
   - 根据用户需求选择最相关的组件
   - 给出简要而清晰的推荐理由

2. **优化用户的提示词**
   - 只优化语言表达，使其更清晰准确
   - 不要添加用户没有提到的功能
   - 不要扩展需求范围
   - 保持原意，只改善表达

注意事项:
- 严格基于知识库推荐组件
- 推荐理由要简洁明了
- 优化提示词时不要画蛇添足
- 返回格式：{ "suggestedComponents": [{ "componentName": "组件名", "reason": "推荐理由" }], "optimizedPrompt": "优化后的提示词" }
- 只返回组件名称和推荐理由，不需要返回组件描述`;
  }

  /**
   * 构建用户消息
   */
  private buildUserMessage(
    userPrompt: string,
    componentsSummary: Array<{ name: string; description: string }>
  ): string {
    const componentsText = componentsSummary
      .map(comp => `- ${comp.name}: ${comp.description}`)
      .join('\n');

    return `用户需求: ${userPrompt}

可用的组件知识库:
${componentsText}

请根据用户需求，从上述组件库中推荐合适的组件，并优化用户的提示词。`;
  }
}

export const aiSuggester = new AISuggester();
