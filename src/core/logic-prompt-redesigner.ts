import type { RedesignedLogicPrompt, UtilityInfo } from '@/types/mcp-types.js';
import { aiUtilitySuggester } from './ai-utility-suggester.js';
import { utilityKB } from './utility-knowledge-base.js';
import { logger } from '@/utils/logger.js';

/**
 * 逻辑提示词重设计器
 */
export class LogicPromptRedesigner {
  /**
   * 重新设计逻辑提示词
   */
  async redesignLogicPrompt(
    originalPrompt: string
  ): Promise<RedesignedLogicPrompt> {
    logger.info('开始分析逻辑需求:', originalPrompt);

    // 使用 AI 生成工具方法建议
    const result = await aiUtilitySuggester.suggest(originalPrompt);

    // 生成最终的提示词
    const redesignedPrompt = this.formatRedesignedPrompt(
      originalPrompt,
      result
    );

    return {
      originalPrompt,
      result,
      redesignedPrompt,
    };
  }

  /**
   * 格式化最终的提示词
   */
  private formatRedesignedPrompt(originalPrompt: string, result: any): string {
    const parts: string[] = [];

    parts.push(`# 工具方法建议\n`);
    parts.push(`原始需求: "${originalPrompt}"\n`);
    parts.push(`优化后的需求: "${result.optimizedPrompt}"\n`);

    parts.push(`## 推荐使用的工具方法\n`);

    result.suggestedUtilities.forEach((suggestion: any, index: number) => {
      // 从知识库获取完整工具方法信息
      const fullUtility = utilityKB.getUtilityByName(suggestion.utilityName);

      parts.push(`### ${index + 1}. ${suggestion.utilityName}`);

      if (fullUtility) {
        parts.push(`- 描述: ${fullUtility.description}`);
        parts.push(`- 推荐理由: ${suggestion.reason}`);
        parts.push(`- 引入方式: \`${fullUtility.import}\``);

        if (fullUtility.params) {
          parts.push(`- 参数: ${fullUtility.params}`);
        }

        if (fullUtility.returns) {
          parts.push(`- 返回值: ${fullUtility.returns}`);
        }

        if (fullUtility.type) {
          parts.push(`- 类型: ${fullUtility.type}`);
        }

        parts.push(`- 文件路径: ${fullUtility.relativePath}\n`);
      } else {
        logger.warn(`未找到工具方法: ${suggestion.utilityName}`);
      }
    });

    parts.push(`## 实现建议\n`);
    parts.push(`1. 导入推荐的工具方法`);
    parts.push(`2. 根据参数说明正确传递参数`);
    parts.push(`3. 处理返回值并进行必要的错误处理`);
    parts.push(`4. 确保方法调用符合业务逻辑`);
    parts.push(`5. 如需了解方法详细用法，可查看源文件\n`);

    parts.push(`---\n`);
    parts.push(`**先不要输出代码，请用户确认是否采纳以上工具方法建议?**\n`);

    return parts.join('\n');
  }
}

export const logicPromptRedesigner = new LogicPromptRedesigner();
