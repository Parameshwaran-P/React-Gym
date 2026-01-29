// src/features/learning/types/editor.types.ts

export type SupportedLanguage = 'html' | 'css' | 'javascript' | 'react' | 'nextjs' | 'nodejs';

export type SandpackTemplate = 'vanilla' | 'react' | 'nextjs' | 'node';

export interface EditorFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

export interface EditorConfig {
  language: SupportedLanguage;
  title?: string;
  description?: string;
  files: Record<string, string>; // filepath -> code content
  hiddenFiles?: string[]; // files to hide from tabs
  activeFile?: string; // which file to show initially
  showConsole?: boolean; // force console visibility
  showPreview?: boolean; // force preview visibility
}

export interface UniversalPracticeEditorProps {
  config: EditorConfig;
  onCodeChange?: (files: Record<string, string>) => void;
  onReset?: () => void;
  initialFiles?: Record<string, string>; // for reset functionality
}