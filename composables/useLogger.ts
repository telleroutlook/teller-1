export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export enum LogCategory {
  ROUTE = 'ROUTE',
  ANIMATION = 'ANIMATION',
  INIT = 'INIT',
  I18N = 'I18N',
  COMPONENT = 'COMPONENT',
  USER_ACTION = 'USER_ACTION',
  ERROR = 'ERROR'
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private currentLevel = LogLevel.DEBUG

  private formatMessage(level: LogLevel, category: LogCategory, message: string, data?: any): LogEntry {
    const timestamp = new Date().toISOString()
    const entry: LogEntry = {
      timestamp,
      level,
      category,
      message,
      data
    }

    if (level === LogLevel.ERROR && data instanceof Error) {
      entry.stack = data.stack
    }

    return entry
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: any) {
    if (level < this.currentLevel) return

    const entry = this.formatMessage(level, category, message, data)
    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output in development
    if (process.dev || import.meta.dev) {
      const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR']
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                          level === LogLevel.WARN ? 'warn' : 
                          level === LogLevel.INFO ? 'info' : 'log'
      
      console[consoleMethod](
        `[${levelNames[level]}] [${category}] ${message}`,
        data ? data : ''
      )
    }
  }

  debug(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.DEBUG, category, message, data)
  }

  info(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.INFO, category, message, data)
  }

  warn(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.WARN, category, message, data)
  }

  error(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.ERROR, category, message, data)
  }

  // Specialized logging methods for common scenarios
  logRouteChange(from: string, to: string, locale?: string) {
    this.info(LogCategory.ROUTE, `Route change: ${from} → ${to}`, { 
      from, 
      to, 
      locale,
      timestamp: Date.now()
    })
  }

  logAnimationStart(animationType: string, data?: any) {
    this.debug(LogCategory.ANIMATION, `Animation started: ${animationType}`, data)
  }

  logAnimationEnd(animationType: string, duration?: number) {
    this.debug(LogCategory.ANIMATION, `Animation completed: ${animationType}`, { duration })
  }

  logComponentInit(componentName: string, props?: any) {
    this.info(LogCategory.INIT, `Component initialized: ${componentName}`, props)
  }

  logLanguageChange(from: string, to: string) {
    this.info(LogCategory.I18N, `Language changed: ${from} → ${to}`, {
      from,
      to,
      timestamp: Date.now()
    })
  }

  logUserAction(action: string, data?: any) {
    this.info(LogCategory.USER_ACTION, action, data)
  }

  logError(context: string, error: Error | string, data?: any) {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    this.error(LogCategory.ERROR, `Error in ${context}: ${errorObj.message}`, {
      error: errorObj,
      context,
      data
    })
  }

  // Get logs for debugging
  getLogs(category?: LogCategory, level?: LogLevel): LogEntry[] {
    return this.logs.filter(log => {
      if (category && log.category !== category) return false
      if (level !== undefined && log.level < level) return false
      return true
    })
  }

  // Clear logs
  clearLogs() {
    this.logs = []
    this.info(LogCategory.INIT, 'Logs cleared')
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  setLogLevel(level: LogLevel) {
    this.currentLevel = level
    this.info(LogCategory.INIT, `Log level changed to ${LogLevel[level]}`)
  }
}

const logger = new Logger()

export const useLogger = () => {
  return {
    logger,
    LogLevel,
    LogCategory
  }
} 