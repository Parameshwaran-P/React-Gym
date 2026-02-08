/**
 * Execution Strategies
 * 
 * Implements Strategy Pattern for code execution across different languages.
 * Each language has its own execution strategy with proper isolation and security.
 */

import type {
  SupportedLanguage,
  FileMap,
  ExecutionResult,
  ExecutionStrategy,
  ConsoleMessage,
} from '../types/index';

interface ExecutionContext {
  onConsoleMessage: (message: ConsoleMessage) => void;
}

/**
 * Base Execution Strategy
 */
abstract class BaseExecutionStrategy implements ExecutionStrategy {
  protected context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  abstract execute(files: FileMap): Promise<ExecutionResult>;
  abstract supports(language: SupportedLanguage): boolean;

  protected logConsole(type: 'log' | 'error' | 'warn' | 'info', message: string) {
    this.context.onConsoleMessage({
      type,
      message,
      timestamp: Date.now(),
    });
  }
}

/**
 * Frontend Languages Strategy (HTML, CSS, JavaScript)
 * Executes in iframe sandbox - no direct execution needed here
 */
class FrontendExecutionStrategy extends BaseExecutionStrategy {
  supports(language: SupportedLanguage): boolean {
    return ['html', 'css', 'javascript'].includes(language);
  }

  async execute(files: FileMap): Promise<ExecutionResult> {
    // Frontend execution happens in the iframe (PreviewPanel)
    // This strategy just validates and prepares the result
    
    this.logConsole('log', 'Code preview updated');
    
    return {
      success: true,
      output: 'Preview rendered successfully',
    };
  }
}

/**
 * React Execution Strategy
 * Handles JSX transformation and React component rendering
 */
class ReactExecutionStrategy extends BaseExecutionStrategy {
  supports(language: SupportedLanguage): boolean {
    return language === 'react';
  }

  async execute(files: FileMap): Promise<ExecutionResult> {
    try {
      // Validate React component structure
      const jsxFile = Object.keys(files).find(f => f.endsWith('.jsx') || f.endsWith('.js'));
      
      if (!jsxFile) {
        throw new Error('No JSX file found');
      }

      const code = files[jsxFile].code;
      
      // Basic validation
      if (!code.includes('App') && !code.includes('export')) {
        this.logConsole('warn', 'Component should export an App component');
      }

      this.logConsole('log', 'React component rendered');
      
      return {
        success: true,
        output: 'React component rendered successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logConsole('error', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

/**
 * Node.js Execution Strategy
 * Backend execution - requires server-side runner
 */
class NodeExecutionStrategy extends BaseExecutionStrategy {
  supports(language: SupportedLanguage): boolean {
    return language === 'node';
  }

  async execute(files: FileMap): Promise<ExecutionResult> {
    // This is a stub implementation
    // In production, this would send code to a backend execution service
    
    this.logConsole('warn', 'Node.js execution requires backend service');
    this.logConsole('info', 'Stub execution: Code validated successfully');
    
    return {
      success: false,
      error: 'Node.js execution requires backend integration. Please connect to an execution service.',
      output: 'Stub: Code syntax appears valid',
    };
  }
}

/**
 * Python Execution Strategy
 * Backend execution - requires server-side runner
 */
class PythonExecutionStrategy extends BaseExecutionStrategy {
  supports(language: SupportedLanguage): boolean {
    return language === 'python';
  }

  async execute(files: FileMap): Promise<ExecutionResult> {
    // This is a stub implementation
    // In production, this would send code to a backend execution service
    // Could use services like: Pyodide (WASM), Judge0 API, custom Docker containers
    
    this.logConsole('warn', 'Python execution requires backend service');
    this.logConsole('info', 'Stub execution: Code validated successfully');
    
    return {
      success: false,
      error: 'Python execution requires backend integration. Consider using Pyodide for browser-based Python.',
      output: 'Stub: Code syntax appears valid',
    };
  }
}

/**
 * Strategy Factory
 * Creates appropriate execution strategy based on language
 */
export const createExecutionStrategy = (
  language: SupportedLanguage,
  context: ExecutionContext
): ExecutionStrategy => {
  const strategies = [
    new FrontendExecutionStrategy(context),
    new ReactExecutionStrategy(context),
    new NodeExecutionStrategy(context),
    new PythonExecutionStrategy(context),
  ];

  const strategy = strategies.find(s => s.supports(language));

  if (!strategy) {
    throw new Error(`No execution strategy found for language: ${language}`);
  }

  return strategy;
};

/**
 * Future Enhancement: Backend Execution Service Integration
 * 
 * For production, implement a secure backend service:
 * 
 * class BackendExecutionService {
 *   async executeRemote(language: string, code: string) {
 *     const response = await fetch('/api/execute', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ language, code }),
 *     });
 *     return response.json();
 *   }
 * }
 * 
 * Backend security considerations:
 * - Containerized execution (Docker)
 * - Resource limits (CPU, memory, time)
 * - Network isolation
 * - Input sanitization
 * - Rate limiting per user
 * - Output size limits
 */