import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { UtilityInfo } from '@/types/mcp-types.js';
import { logger } from '@/utils/index.js';

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
      const dataPath = path.join(__dirname, '../../data/utils.json');
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
