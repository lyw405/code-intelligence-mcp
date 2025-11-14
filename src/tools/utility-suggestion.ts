import { logicPromptRedesigner } from '@/core/logic-prompt-redesigner.js';
import { utilityKB } from '@/core/utility-knowledge-base.js';
import { logger } from '@/utils/logger.js';

/**
 * 工具方法建议工具
 */
export async function suggestUtilitiesTool(args: any) {
  try {
    logger.info('=== 开始执行 suggestUtilitiesTool ===');
    logger.info('接收到的参数:', JSON.stringify(args));

    const { prompt } = args;

    if (!prompt || typeof prompt !== 'string') {
      logger.error('提示词参数无效:', prompt);
      throw new Error('提示词参数无效');
    }

    logger.info('开始分析逻辑需求:', prompt);

    // 使用逻辑提示词重设计器生成建议
    const result = await logicPromptRedesigner.redesignLogicPrompt(prompt);

    logger.info(
      `分析完成，找到 ${result.result.suggestedUtilities.length} 个建议工具方法`
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
    logger.error('工具方法建议失败:', error);
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

/**
 * 查询工具方法详情工具
 */
export async function queryUtilityTool(args: any) {
  try {
    logger.info('=== 开始执行 queryUtilityTool ===');
    logger.info('接收到的参数:', JSON.stringify(args));

    const { utilityName } = args;

    if (!utilityName || typeof utilityName !== 'string') {
      logger.error('工具方法名称参数无效:', utilityName);
      throw new Error('工具方法名称参数无效');
    }

    logger.info('查询工具方法:', utilityName);

    // 从知识库获取工具方法信息
    const utility = utilityKB.getUtilityByName(utilityName);

    if (!utility) {
      logger.warn(`未找到工具方法: ${utilityName}`);
      return {
        content: [
          {
            type: 'text',
            text: `未找到工具方法: ${utilityName}`,
          },
        ],
      };
    }

    logger.info(`找到工具方法: ${utilityName}`);

    // 格式化返回信息
    const result = {
      name: utility.name,
      description: utility.description,
      import: utility.import,
      relativePath: utility.relativePath,
      ...(utility.params && { params: utility.params }),
      ...(utility.returns && { returns: utility.returns }),
      ...(utility.type && { type: utility.type }),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('查询工具方法失败:', error);
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
