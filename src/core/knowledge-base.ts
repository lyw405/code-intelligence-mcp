import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ComponentInfo } from '@/types/mcp-types.js';
import { logger } from '@/utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 组件知识库管理器
 */
export class ComponentKnowledgeBase {
  private components: Map<string, ComponentInfo> = new Map();
  private initialized = false;

  constructor() {
    this.loadComponents();
  }

  /**
   * 加载组件数据
   */
  private loadComponents() {
    try {
      const dataPath = path.join(__dirname, '../../data/components.json');
      const data = fs.readFileSync(dataPath, 'utf-8');
      const componentsObj = JSON.parse(data) as Record<
        string,
        {
          description: string;
          import: string;
          relativePath: string;
        }
      >;

      // 转换为 Map 结构
      Object.entries(componentsObj).forEach(([name, info]) => {
        this.components.set(name, {
          name,
          description: info.description,
          import: info.import,
          relativePath: info.relativePath,
        });
      });

      this.initialized = true;
      logger.info(`已加载 ${this.components.size} 个组件到知识库`);
    } catch (error) {
      logger.error('加载组件数据失败:', error);
      this.components.clear();
    }
  }

  /**
   * 获取所有组件
   */
  getAllComponents(): ComponentInfo[] {
    return Array.from(this.components.values());
  }

  /**
   * 根据名称获取组件
   */
  getComponentByName(name: string): ComponentInfo | undefined {
    return this.components.get(name);
  }

  /**
   * 获取组件名称和描述列表（用于发送给 AI）
   */
  getComponentsSummary(): Array<{ name: string; description: string }> {
    return Array.from(this.components.entries()).map(([name, info]) => ({
      name,
      description: info.description,
    }));
  }
}

export const componentKB = new ComponentKnowledgeBase();
