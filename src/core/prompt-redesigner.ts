import type { RedesignedPrompt, ComponentInfo } from '@/types/mcp-types.js';
import { aiSuggester } from './ai-suggester.js';
import { componentKB } from './knowledge-base.js';
import { logger } from '@/utils/logger.js';

/**
 * 提示词重设计器
 */
export class PromptRedesigner {
  /**
   * 重新设计提示词
   */
  async redesignPrompt(originalPrompt: string): Promise<RedesignedPrompt> {
    logger.info('开始分析提示词:', originalPrompt);

    // 使用 AI 生成组件建议
    const result = await aiSuggester.suggest(originalPrompt);

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

    parts.push(`# 组件建议\n`);
    parts.push(`原始需求: "${originalPrompt}"\n`);
    parts.push(`优化后的需求: "${result.optimizedPrompt}"\n`);

    parts.push(`## 推荐使用的组件\n`);

    result.suggestedComponents.forEach((suggestion: any, index: number) => {
      // 从知识库获取完整组件信息
      const fullComponent = componentKB.getComponentByName(
        suggestion.componentName
      );

      parts.push(`### ${index + 1}. ${suggestion.componentName}`);

      if (fullComponent) {
        parts.push(`- 描述: ${fullComponent.description}`);
        parts.push(`- 推荐理由: ${suggestion.reason}`);
        parts.push(`- 引入方式: \`${fullComponent.import}\``);
        parts.push(`- 文件路径: ${fullComponent.relativePath}\n`);
      } else {
        logger.warn(`未找到组件: ${suggestion.componentName}`);
      }
    });

    parts.push(`## 实现建议\n`);
    parts.push(`1. 导入推荐的组件`);
    parts.push(`2. 根据需求配置组件的 props 和事件`);
    parts.push(`3. 使用 Less 编写样式，遵循 BEM 命名规范`);
    parts.push(`4. 确保组件支持响应式设计`);
    parts.push(`5. 如需了解组件详细用法，可使用 query_component 工具查询\n`);

    parts.push(`---\n`);
    parts.push(`**先不要输出代码，请用户确认是否采纳以上组件建议?**\n`);

    return parts.join('\n');
  }
}

export const promptRedesigner = new PromptRedesigner();
