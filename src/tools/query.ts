import { componentKB } from '@/core/index.js';
import { logger } from '@/utils/logger.js';

/**
 * 查询组件详情工具
 */
export async function queryComponentTool(args: any) {
  try {
    const { componentName } = args;

    if (!componentName || typeof componentName !== 'string') {
      throw new Error('组件名称参数无效');
    }

    logger.info('查询组件:', componentName);

    const component = componentKB.getComponentByName(componentName);

    if (!component) {
      return {
        content: [
          {
            type: 'text',
            text: `未找到组件: ${componentName}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(component, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('查询组件失败:', error);
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
