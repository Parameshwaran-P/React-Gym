/**
 * useCodeExecution Hook
 * 
 * Manages code execution across different languages using a strategy pattern.
 * Handles console message capture and execution lifecycle.
 */

import { useCallback, useRef } from 'react';
import type {
  SupportedLanguage,
  FileMap,
  ExecutionResult,
  UseCodeExecutionOptions,
  UseCodeExecutionReturn,
} from '../types/index';
import { createExecutionStrategy } from '../utils/executionStrategies';

export const useCodeExecution = (
  options: UseCodeExecutionOptions
): UseCodeExecutionReturn => {
  const { onConsoleMessage, onExecutionComplete } = options;
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Execute code based on language
   */
  const executeCode = useCallback(
    async (language: SupportedLanguage, files: FileMap): Promise<ExecutionResult> => {
      const startTime = Date.now();

      try {
        // Get appropriate execution strategy
        const strategy = createExecutionStrategy(language, {
          onConsoleMessage,
        });

        // Execute with timeout protection
        const executionPromise = strategy.execute(files);
        const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
          executionTimeoutRef.current = setTimeout(() => {
            reject(new Error('Execution timeout: Code took too long to execute (max 10s)'));
          }, 10000); // 10 second timeout
        });

        const result = await Promise.race([executionPromise, timeoutPromise]);
        
        // Clear timeout
        if (executionTimeoutRef.current) {
          clearTimeout(executionTimeoutRef.current);
        }

        const executionTime = Date.now() - startTime;
        const finalResult = { ...result, executionTime };

        onExecutionComplete(finalResult);
        return finalResult;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        const errorResult: ExecutionResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown execution error',
          executionTime,
        };

        onExecutionComplete(errorResult);
        return errorResult;
      }
    },
    [onConsoleMessage, onExecutionComplete]
  );

  /**
   * Clear any ongoing execution
   */
  const clearExecution = useCallback(() => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = null;
    }
  }, []);

  return {
    executeCode,
    clearExecution,
  };
};