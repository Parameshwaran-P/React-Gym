/**
 * Type Definitions for CodePlayground
 * 
 * Comprehensive type system for the code playground component.
 * Ensures type safety across all modules and enables better IDE support.
 */

// ============================================
// CORE TYPES
// ============================================

export type SupportedLanguage = 
  | 'html' 
  | 'css' 
  | 'javascript' 
  | 'react' 
  | 'node' 
  | 'python';

export type Theme = 'light' | 'dark';

// ============================================
// FILE SYSTEM
// ============================================

export interface FileContent {
  language: string;
  code: string;
  readOnly?: boolean;
}

export type FileMap = Record<string, FileContent>;

// ============================================
// EXECUTION RESULTS
// ============================================

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  logs?: ConsoleMessage[];
  executionTime?: number;
}

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
  args?: any[];
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface CodePlaygroundConfig {
  language: SupportedLanguage;
  files: FileMap;
  showPreview?: boolean;
  showConsole?: boolean;
  readOnly?: boolean;
  height?: string;
  theme?: Theme;
}

export interface CodePlaygroundProps {
  config: CodePlaygroundConfig;
  onRun?: (result: ExecutionResult) => void;
  onChange?: (files: FileMap) => void;
}

// ============================================
// COMPONENT-SPECIFIC PROPS
// ============================================

export interface FileExplorerProps {
  files: FileMap;
  activeFile: string | null;
  onFileSelect: (filename: string) => void;
  theme: Theme;
}

export interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  theme: Theme;
}

export interface PreviewPanelProps {
  files: FileMap;
  language: SupportedLanguage;
  theme: Theme;
}

export interface ToolbarProps {
  onRun: () => void;
  onReset: () => void;
  isExecuting: boolean;
  isReadOnly?: boolean;
  theme: Theme;
  language: SupportedLanguage;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseCodeExecutionOptions {
  onConsoleMessage: (message: ConsoleMessage) => void;
  onExecutionComplete: (result: ExecutionResult) => void;
}

export interface UseCodeExecutionReturn {
  executeCode: (language: SupportedLanguage, files: FileMap) => Promise<ExecutionResult>;
  clearExecution: () => void;
}

export interface UseEditorStateReturn {
  files: FileMap;
  activeFile: string | null;
  setActiveFile: (filename: string) => void;
  updateFile: (filename: string, code: string) => void;
  resetFiles: () => void;
}

// ============================================
// PREVIEW TYPES
// ============================================

export interface PreviewMessage {
  type: 'console' | 'error' | 'ready';
  payload?: any;
}

// ============================================
// EXECUTION STRATEGY
// ============================================

export interface ExecutionStrategy {
  execute: (files: FileMap) => Promise<ExecutionResult>;
  supports: (language: SupportedLanguage) => boolean;
}