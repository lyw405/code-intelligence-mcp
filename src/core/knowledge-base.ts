import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ComponentInfo } from '@/types/mcp-types.js';
import { logger, resolveConfigPath } from '@/utils/index.js';

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
      // 统一配置文件路径解析逻辑
      // 优先级：
      // 1. CI_MCP_COMPONENTS - 直接指定 components.json 文件路径
      // 2. CI_MCP_DATA_DIR - 指定配置目录，拼接 components.json
      // 3. GAREN_MCP_DATA_DIR - 向后兼容
      // 4. 当前工作目录的 ci-mcp-data/components.json
      // 5. 相对于代码的 ../../ci-mcp-data/components.json

      const possiblePaths: string[] = [];

      // 优先级 1: 直接指定 components.json 文件
      if (process.env.CI_MCP_COMPONENTS) {
        possiblePaths.push(process.env.CI_MCP_COMPONENTS);
      }

      // 优先级 2: 通过 CI_MCP_DATA_DIR 拼接
      if (process.env.CI_MCP_DATA_DIR) {
        possiblePaths.push(
          path.join(process.env.CI_MCP_DATA_DIR, 'components.json')
        );
      }

      // 优先级 3: 向后兼容
      if (process.env.GAREN_MCP_DATA_DIR) {
        possiblePaths.push(
          path.join(process.env.GAREN_MCP_DATA_DIR, 'components.json')
        );
      }

      // 优先级 4-5: 默认路径
      possiblePaths.push(
        path.join(process.cwd(), 'ci-mcp-data/components.json'),
        path.join(__dirname, '../../ci-mcp-data/components.json')
      );

      const dataPath = resolveConfigPath(
        ['CI_MCP_COMPONENTS', 'CI_MCP_DATA_DIR', 'GAREN_MCP_DATA_DIR'],
        possiblePaths,
        msg => logger.debug(msg)
      );

      if (!dataPath) {
        throw new Error(
          `无法在任何预期位置找到 components.json。请设置环境变量：\n` +
            `  CI_MCP_DATA_DIR=/path/to/config/dir  (推荐)\n` +
            `  CI_MCP_COMPONENTS=/path/to/components.json  (直接指定文件)\n` +
            `尝试过的路径：${possiblePaths.join(', ')}`
        );
      }

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
