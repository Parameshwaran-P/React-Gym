// src/features/learning/components/UniversalPracticeEditor.enhanced.tsx

import { useState, useMemo, useCallback } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import type { UniversalPracticeEditorProps } from '../types/editor.types';
import {
  getTemplateForLanguage,
  needsPreview,
  getDefaultFilesForLanguage,
  normalizeSandpackFiles,
  getDefaultActiveFile,
  getDefaultHiddenFiles,
} from '../utils/fileNormalizer';

export function UniversalPracticeEditor({
  config,
  onCodeChange,
  onReset,
}: UniversalPracticeEditorProps) {
  const { language, title, description, files: configFiles } = config;

  // Normalize files on mount
  const normalizedFiles = useMemo(() => {
    return getDefaultFilesForLanguage(language, configFiles);
  }, [language, configFiles]);

  // Store initial state for reset
  // const [originalFiles] = useState(normalizedFiles);

  // Determine Sandpack template
  const template = getTemplateForLanguage(language);

  // Determine UI visibility
  const showPreview = config.showPreview ?? needsPreview(language);
  const showConsole = config.showConsole ?? true;

  // Get active file
  const activeFile = config.activeFile || getDefaultActiveFile(language);

  // Get hidden files
  const hiddenFiles = config.hiddenFiles || getDefaultHiddenFiles(language);

  // Convert to Sandpack format
  const sandpackFiles = useMemo(() => {
    return normalizeSandpackFiles(normalizedFiles, activeFile, hiddenFiles);
  }, [normalizedFiles, activeFile, hiddenFiles]);

  // Handle reset
  const handleReset = useCallback(() => {
    onReset?.();
    // Note: Sandpack reset is handled internally via key prop change
  }, [onReset]);

  // Use a key to force Sandpack remount on reset
  const [editorKey, setEditorKey] = useState(0);

  const handleResetClick = () => {
    setEditorKey(prev => prev + 1);
    handleReset();
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <EditorHeader
        language={language}
        title={title}
        onReset={handleResetClick}
      />

      {/* Description */}
      {description && <EditorDescription description={description} />}

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden" key={editorKey}>
        <SandpackProvider
          template={template}
          files={sandpackFiles}
          theme="dark"
          options={{
            externalResources: [],
            autorun: true,
            autoReload: true,
            recompileMode: 'delayed',
            recompileDelay: 300,
          }}
        >
          <EditorContent
            showPreview={showPreview}
            showConsole={showConsole}
            onCodeChange={onCodeChange}
          />
        </SandpackProvider>
      </div>
    </div>
  );
}

/**
 * Inner component that has access to Sandpack context
 */
function EditorContent({
  showPreview,
  showConsole,
  // onCodeChange,
}: {
  showPreview: boolean;
  showConsole: boolean;
  onCodeChange?: (files: Record<string, string>) => void;
}) {
  // const { sandpack } = useSandpack();

  // Track file changes
  // const handleCodeUpdate = useCallback(() => {
  //   if (onCodeChange) {
  //     const files: Record<string, string> = {};
  //     Object.entries(sandpack.files).forEach(([path, file]) => {
  //       files[path] = file.code;
  //     });
  //     onCodeChange(files);
  //   }
  // }, [sandpack.files, onCodeChange]);

  return (
    <SandpackLayout>
      {/* Left Panel: Code Editor */}
      <div className="flex-1 overflow-hidden">
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          showInlineErrors
          wrapContent
          closableTabs={false}
          style={{ height: '100%' }}
        />
      </div>

      {/* Right Panel: Preview & Console */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview */}
        {showPreview && (
          <div className="flex-1 overflow-hidden border-b border-gray-300">
            <div className="bg-gray-800 text-white text-sm font-semibold px-3 py-2 border-b border-gray-700">
              Preview
            </div>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              style={{ height: 'calc(100% - 40px)' }}
            />
          </div>
        )}

        {/* Console */}
        {showConsole && (
          <div className={showPreview ? 'h-64' : 'flex-1'}>
            <div className="bg-gray-800 text-white text-sm font-semibold px-3 py-2 border-b border-gray-700">
              Console
            </div>
            <SandpackConsole
              showHeader={false}
              style={{ height: showPreview ? '220px' : 'calc(100% - 40px)' }}
            />
          </div>
        )}
      </div>
    </SandpackLayout>
  );
}

/**
 * Editor Header Component
 */
function EditorHeader({
  language,
  title,
  onReset,
}: {
  language: string;
  title?: string;
  onReset: () => void;
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LanguageBadge language={language} />
        {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Reset code to original state"
      >
        🔄 Reset Code
      </button>
    </div>
  );
}

/**
 * Editor Description Component
 */
function EditorDescription({ description }: { description: string }) {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
      <p className="text-sm text-blue-800">{description}</p>
    </div>
  );
}

/**
 * Language Badge Component
 */
function LanguageBadge({ language }: { language: string }) {
  const colors: Record<string, string> = {
    html: 'bg-orange-100 text-orange-800',
    css: 'bg-blue-100 text-blue-800',
    javascript: 'bg-yellow-100 text-yellow-800',
    react: 'bg-cyan-100 text-cyan-800',
    nextjs: 'bg-gray-100 text-gray-800',
    nodejs: 'bg-green-100 text-green-800',
  };

  const labels: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    react: 'React',
    nextjs: 'Next.js',
    nodejs: 'Node.js',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[language] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {labels[language] || language.toUpperCase()}
    </span>
  );
}