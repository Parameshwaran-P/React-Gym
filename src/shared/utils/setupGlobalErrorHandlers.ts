// src/shared/utils/setupGlobalErrorHandlers.ts
import { logCriticalError, logError } from './errorLogger';

/**
 * Setup global error handlers for uncaught errors
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    
    logCriticalError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        type: 'unhandledRejection',
        promise: event.promise,
      }
    );

    // Show user-friendly error message
    if (import.meta.env.PROD) {
      console.error('An error occurred. Please refresh the page or contact support.');
    }
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    event.preventDefault();
    
    logCriticalError(event.error || new Error(event.message), {
      type: 'uncaughtError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Handle network errors
  window.addEventListener('offline', () => {
    logError('Network connection lost', 'medium', { type: 'offline' });
  });

  window.addEventListener('online', () => {
    console.log('Network connection restored');
  });

  // Log performance issues (if page is slow)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 3000) { // 3 seconds threshold
            logError(
              `Slow operation detected: ${entry.name}`,
              'low',
              {
                type: 'performance',
                duration: entry.duration,
                entryType: entry.entryType,
              }
            );
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // PerformanceObserver not supported in this browser
      console.warn('PerformanceObserver not supported');
    }
  }
}

/**
 * Check browser compatibility and log issues
 */
export function checkBrowserCompatibility(): void {
  const requiredFeatures = [
    { name: 'fetch', check: () => 'fetch' in window },
    { name: 'localStorage', check: () => 'localStorage' in window },
    { name: 'Promise', check: () => 'Promise' in window },
    { name: 'async/await', check: () => {
        try {
          eval('(async () => {})');
          return true;
        } catch {
          return false;
        }
      }
    },
  ];

  const unsupportedFeatures = requiredFeatures
    .filter(feature => !feature.check())
    .map(feature => feature.name);

  if (unsupportedFeatures.length > 0) {
    logCriticalError(
      new Error('Browser compatibility issues detected'),
      {
        type: 'browserCompatibility',
        unsupportedFeatures,
        userAgent: navigator.userAgent,
      }
    );

    // Show warning to user
    alert(
      `Your browser doesn't support some required features: ${unsupportedFeatures.join(', ')}. ` +
      'Please update your browser for the best experience.'
    );
  }
}