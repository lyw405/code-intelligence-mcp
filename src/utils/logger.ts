/**
 * 日志工具模块
 * 提供统一的日志输出接口，支持不同级别的日志
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private prefix: string = '';

  constructor(prefix?: string, level?: LogLevel) {
    if (prefix) this.prefix = prefix;
    if (level !== undefined) this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}]` : '';
    return `${timestamp} ${prefix} ${level}: ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      // eslint-disable-next-line no-console
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }
}

// 创建默认日志实例
export const logger = new Logger('ComponentSuggestion');

// 创建带前缀的日志实例
export function createLogger(prefix: string, level?: LogLevel): Logger {
  return new Logger(prefix, level);
}

// 导出Logger类以便自定义使用
export { Logger };
