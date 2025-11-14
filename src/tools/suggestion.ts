import { promptRedesigner } from '@/core/index.js';
import { logger } from '@/utils/logger.js';

/**
 * 组件建议工具
 */
export async function suggestComponentsTool(args: any) {
  try {
    logger.info('=== 开始执行 suggestComponentsTool ===');
    logger.info('接收到的参数:', JSON.stringify(args));

    const { prompt } = args;

    if (!prompt || typeof prompt !== 'string') {
      logger.error('提示词参数无效:', prompt);
      throw new Error('提示词参数无效');
    }

    logger.info('开始分析提示词:', prompt);

    // 使用提示词重设计器生成建议
    const result = await promptRedesigner.redesignPrompt(prompt);

    logger.info(
      `分析完成，找到 ${result.result.suggestedComponents.length} 个建议组件`
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('组件建议失败:', error);
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
        },
      ],
      isError: true,
    };
  }
}
