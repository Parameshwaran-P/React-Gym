// src/shared/utils/errorLogger.ts

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorLog {
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  /**
   * Log an error
   */
  log(
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context?: Record<string, any>
  ): void {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      severity,
      message: error instanceof Error ? error.message : error,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      userId: this.getUserId(),
    };

    // Add to in-memory logs
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console log in development
    if (import.meta.env.DEV) {
      const style = this.getConsoleStyle(severity);
      console.group(`%c${severity.toUpperCase()} ERROR`, style);
      console.error('Message:', log.message);
      if (log.code) console.error('Code:', log.code);
      if (log.context) console.error('Context:', log.context);
      if (log.stack) console.error('Stack:', log.stack);
      console.groupEnd();
    }

    // In production, send to analytics/monitoring service
    if (import.meta.env.PROD) {
      this.sendToMonitoring(log);
    }
  }

  /**
   * Get console style based on severity
   */
  private getConsoleStyle(severity: ErrorSeverity): string {
    const styles = {
      low: 'color: #3b82f6; font-weight: bold',
      medium: 'color: #f59e0b; font-weight: bold',
      high: 'color: #ef4444; font-weight: bold',
      critical: 'color: #dc2626; font-weight: bold; font-size: 14px',
    };
    return styles[severity];
  }

  /**
   * Get user ID from localStorage or generate anonymous ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('anonymous_user_id');
    if (!userId) {
      userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymous_user_id', userId);
    }
    return userId;
  }

  /**
   * Send error to monitoring service (placeholder for future implementation)
   */
  private sendToMonitoring(log: ErrorLog): void {
    // TODO: Integrate with services like:
    // - Sentry: Sentry.captureException()
    // - LogRocket: LogRocket.captureException()
    // - Custom API endpoint
    
    // For now, just store in localStorage for analytics
    try {
      const stored = localStorage.getItem('error_logs');
      const logs = stored ? JSON.parse(stored) : [];
      logs.unshift(log);
      
      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(50);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      // Silently fail if localStorage is full
      console.warn('Failed to store error log:', e);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('error_logs');
  }

  /**
   * Export logs as JSON (for debugging)
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions
export function logError(
  error: Error | string,
  severity: ErrorSeverity = 'medium',
  context?: Record<string, any>
): void {
  errorLogger.log(error, severity, context);
}

export function logCriticalError(error: Error | string, context?: Record<string, any>): void {
  errorLogger.log(error, 'critical', context);
}

export function logWarning(message: string, context?: Record<string, any>): void {
  errorLogger.log(message, 'low', context);
}