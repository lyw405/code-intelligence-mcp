import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { UtilityInfo } from '@/types/mcp-types.js';
import { logger, resolveConfigPath } from '@/utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 工具方法知识库管理器
 */
export class UtilityKnowledgeBase {
  private utilities: Map<string, UtilityInfo> = new Map();
  private initialized = false;

  constructor() {
    this.loadUtilities();
  }

  /**
   * 加载工具方法数据
   */
  private loadUtilities() {
    try {
      // 统一配置文件路径解析逻辑
      // 优先级：
      // 1. CI_MCP_UTILS - 直接指定 utils.json 文件路径
      // 2. CI_MCP_DATA_DIR - 指定配置目录，拼接 utils.json
      // 3. GAREN_MCP_DATA_DIR - 向后兼容
      // 4. 当前工作目录的 ci-mcp-data/utils.json
      // 5. 相对于代码的 ../../ci-mcp-data/utils.json

      const possiblePaths: string[] = [];

      // 优先级 1: 直接指定 utils.json 文件
      if (process.env.CI_MCP_UTILS) {
        possiblePaths.push(process.env.CI_MCP_UTILS);
      }

      // 优先级 2: 通过 CI_MCP_DATA_DIR 拼接
      if (process.env.CI_MCP_DATA_DIR) {
        possiblePaths.push(
          path.join(process.env.CI_MCP_DATA_DIR, 'utils.json')
        );
      }

      // 优先级 3: 向后兼容
      if (process.env.GAREN_MCP_DATA_DIR) {
        possiblePaths.push(
          path.join(process.env.GAREN_MCP_DATA_DIR, 'utils.json')
        );
      }

      // 优先级 4-5: 默认路径
      possiblePaths.push(
        path.join(process.cwd(), 'ci-mcp-data/utils.json'),
        path.join(__dirname, '../../ci-mcp-data/utils.json')
      );

      const dataPath = resolveConfigPath(
        ['CI_MCP_UTILS', 'CI_MCP_DATA_DIR', 'GAREN_MCP_DATA_DIR'],
        possiblePaths,
        msg => logger.debug(msg)
      );

      if (!dataPath) {
        throw new Error(
          `无法在任何预期位置找到 utils.json。请设置环境变量：\n` +
            `  CI_MCP_DATA_DIR=/path/to/config/dir  (推荐)\n` +
            `  CI_MCP_UTILS=/path/to/utils.json  (直接指定文件)\n` +
            `尝试过的路径：${possiblePaths.join(', ')}`
        );
      }

      const data = fs.readFileSync(dataPath, 'utf-8');
      const utilitiesObj = JSON.parse(data) as Record<
        string,
        {
          description: string;
          import: string;
          relativePath: string;
          params?: string;
          returns?: string;
          type?: string;
        }
      >;

      // 转换为 Map 结构
      Object.entries(utilitiesObj).forEach(([name, info]) => {
        this.utilities.set(name, {
          name,
          description: info.description,
          import: info.import,
          relativePath: info.relativePath,
          params: info.params,
          returns: info.returns,
          type: info.type,
        });
      });

      this.initialized = true;
      logger.info(`已加载 ${this.utilities.size} 个工具方法到知识库`);
    } catch (error) {
      logger.error('加载工具方法数据失败:', error);
      this.utilities.clear();
    }
  }

  /**
   * 获取所有工具方法
   */
  getAllUtilities(): UtilityInfo[] {
    return Array.from(this.utilities.values());
  }

  /**
   * 根据名称获取工具方法
   */
  getUtilityByName(name: string): UtilityInfo | undefined {
    return this.utilities.get(name);
  }

  /**
   * 获取工具方法名称和描述列表（用于发送给 AI）
   */
  getUtilitiesSummary(): Array<{ name: string; description: string }> {
    return Array.from(this.utilities.entries()).map(([name, info]) => ({
      name,
      description: info.description,
    }));
  }
}

export const utilityKB = new UtilityKnowledgeBase();
