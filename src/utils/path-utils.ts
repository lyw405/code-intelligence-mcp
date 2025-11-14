import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

/**
 * 扩展路径，处理 ~ 和环境变量
 * @param path 原始路径
 * @returns 扩展后的绝对路径
 */
export function expandPath(path: string): string {
  if (!path) return path;

  let expandedPath = path;

  // 处理 ~ 开头的路径
  if (expandedPath.startsWith('~/')) {
    expandedPath = join(homedir(), expandedPath.slice(2));
  } else if (expandedPath === '~') {
    expandedPath = homedir();
  }

  // 处理 $HOME 环境变量
  if (expandedPath.includes('$HOME')) {
    expandedPath = expandedPath.replace(/\$HOME/g, homedir());
  }

  // 处理其他环境变量 ${VAR} 或 $VAR
  expandedPath = expandedPath.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    return process.env[varName] || '';
  });
  expandedPath = expandedPath.replace(
    /\$([A-Z_][A-Z0-9_]*)/gi,
    (_, varName) => {
      return process.env[varName] || '';
    }
  );

  return expandedPath;
}

/**
 * 解析配置文件路径，尝试多个可能的位置
 * @param envVarName 环境变量名
 * @param fallbackPaths 降级路径列表
 * @param debugLogger 调试日志函数
 * @returns 找到的文件路径，如果未找到返回 null
 */
export function resolveConfigPath(
  envVarName: string | string[],
  fallbackPaths: string[],
  debugLogger?: (msg: string) => void
): string | null {
  const envVars = Array.isArray(envVarName) ? envVarName : [envVarName];

  // 尝试从环境变量读取
  for (const varName of envVars) {
    const envPath = process.env[varName];
    if (envPath) {
      const expandedPath = expandPath(envPath);
      if (existsSync(expandedPath)) {
        debugLogger?.(`从环境变量 ${varName} 找到配置: ${expandedPath}`);
        return expandedPath;
      } else {
        debugLogger?.(`环境变量 ${varName} 指定的路径不存在: ${expandedPath}`);
      }
    }
  }

  // 尝试降级路径
  for (const path of fallbackPaths) {
    const expandedPath = expandPath(path);
    if (existsSync(expandedPath)) {
      debugLogger?.(`找到配置文件: ${expandedPath}`);
      return expandedPath;
    } else {
      debugLogger?.(`未找到配置: ${expandedPath}`);
    }
  }

  return null;
}
