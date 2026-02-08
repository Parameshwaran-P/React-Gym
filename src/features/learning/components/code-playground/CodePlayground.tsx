/**
 * CodePlayground Component
 * 
 * A production-grade, fully configurable code editor and execution environment
 * for gamified learning platforms. Supports multiple languages, live preview,
 * and sandboxed execution.
 * 
 * @author Senior Frontend Architect
 * @version 1.0.0
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { CodePlaygroundProps, ConsoleMessage } from './types/index';
import { FileExplorer } from './components/FileExplorer';
import { ConsolePanel } from './components/ConsolePanel';
import { PreviewPanel } from './components/PreviewPanel';
import { Toolbar } from './components/Toolbar';
import { useCodeExecution } from './hooks/useCodeExecution';
import { useEditorState } from './hooks/useEditorState';
import { configureMonaco } from './utils/monacoConfig';

/**
 * Main CodePlayground Component
 * 
 * This component provides a complete code editing and execution environment
 * that can be dropped into any part of the application. It handles:
 * - Multi-file code editing with Monaco Editor
 * - Live preview for frontend languages
 * - Console output capture
 * - Sandboxed code execution
 * - State management and persistence
 */
export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  config,
  onRun,
  onChange,
}) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const {
    files,
    activeFile,
    setActiveFile,
    updateFile,
    resetFiles,
  } = useEditorState(config.files, onChange);

  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
 // const [layoutRatio, setLayoutRatio] = useState(50); // Left/Right split percentage
  const editorRef = useRef<any>(null);

  // ============================================
  // CODE EXECUTION HOOK
  // ============================================
  
  const { executeCode, clearExecution } = useCodeExecution({
    onConsoleMessage: (message) => {
      setConsoleMessages((prev) => [...prev, message]);
    },
    onExecutionComplete: (result) => {
      setIsExecuting(false);
      onRun?.(result);
    },
  });

  // ============================================
  // HANDLERS
  // ============================================

  const handleRun = useCallback(async () => {
    setIsExecuting(true);
    setConsoleMessages([]);
    clearExecution();

    const result = await executeCode(config.language, files);
    
    if (result.error) {
   setConsoleMessages(prev => [
  ...prev,
  {
    type: "error",
    message: result.error ?? "Unknown error",
    timestamp: Date.now(),
  }
]);
    }
  }, [config.language, files, executeCode, clearExecution]);

  const handleReset = useCallback(() => {
    resetFiles();
    setConsoleMessages([]);
    clearExecution();
  }, [resetFiles, clearExecution]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFile(activeFile, value);
    }
  }, [activeFile, updateFile]);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    configureMonaco(monaco);
  }, []);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const activeFileData = useMemo(() => {
    return activeFile ? files[activeFile] : null;
  }, [activeFile, files]);

  const showPreview = config.showPreview !== false && 
    ['html', 'css', 'javascript', 'react'].includes(config.language);

  const showConsole = config.showConsole !== false;

  const theme = config.theme || 'dark';
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

  function setLayoutRatio(_arg0: number) {
    throw new Error('Function not implemented.');
  }

  // ============================================
  // RENDER
  // ============================================

  return (
  <div
  className={`code-playground font-['JetBrains_Mono',_'Fira_Code',_monospace]
    ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}
    border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
    rounded-lg overflow-hidden flex flex-col shadow-2xl`}
  style={{ height: config.height || '600px' }}
>
  {/* Toolbar */}
  <Toolbar
    onRun={handleRun}
    onReset={handleReset}
    isExecuting={isExecuting}
    isReadOnly={config.readOnly}
    theme={theme}
    language={config.language}
  />

  {/* Main Layout */}
  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
    
    {/* Left Panel: File Explorer (Desktop only) */}
    <div
      className={`hidden md:block
        ${theme === 'dark' ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-200'}
        border-r`}
      style={{ width: '200px' }}
    >
      <FileExplorer
        files={files}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        theme={theme}
      />
    </div>

    {/* Center Panel: Editor */}
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      
      {/* File Tabs */}
      <div
        className={`flex gap-1 px-2 py-1
          ${theme === 'dark' ? 'bg-[#0d0d0d] border-gray-800' : 'bg-gray-100 border-gray-200'}
          border-b overflow-x-auto`}
      >
        {Object.keys(files).map((filename) => (
          <button
            key={filename}
            onClick={() => setActiveFile(filename)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap
              ${
                activeFile === filename
                  ? theme === 'dark'
                    ? 'bg-[#1e1e1e] text-white shadow-lg shadow-blue-500/10 border border-blue-500/20'
                    : 'bg-white text-gray-900 shadow-sm border border-blue-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a1a]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            {filename}
          </button>
        ))}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        {activeFileData && (
          <Editor
            height="100%"
            language={activeFileData.language}
            value={activeFileData.code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme={monacoTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              readOnly: config.readOnly || activeFileData.readOnly,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              folding: true,
              bracketPairColorization: { enabled: true },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
            }}
          />
        )}
      </div>
    </div>

    {/* Right Panel: Preview (Desktop only) */}
    {showPreview && (
      <div className="hidden md:flex flex-1 overflow-hidden">
        
        {/* Resizer */}
        <div
          className={`w-1 cursor-col-resize
            ${theme === 'dark'
              ? 'bg-gray-800 hover:bg-gradient-to-b hover:from-blue-600 hover:to-purple-600'
              : 'bg-gray-300 hover:bg-blue-500'}
            transition-all duration-200`}
          onMouseDown={(e) => {
            e.preventDefault();

            const handleMouseMove = (e: MouseEvent) => {
              const container = (e.target as HTMLElement).closest('.code-playground');
              if (!container) return;

              const rect = container.getBoundingClientRect();
              const newRatio =
                ((e.clientX - rect.left - 200) / (rect.width - 200)) * 100;

              setLayoutRatio(Math.min(Math.max(newRatio, 30), 70));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Preview */}
        <div className="flex-1 overflow-hidden">
          <PreviewPanel
            files={files}
            language={config.language}
            theme={theme}
          />
        </div>
      </div>
    )}
  </div>

  {/* Bottom Panel: Console */}
  {showConsole && (
    <div
      className={`${theme === 'dark' ? 'bg-[#0d0d0d] border-gray-800' : 'bg-gray-50 border-gray-200'}
        border-t h-[120px] md:h-[160px]`}
    >
      <ConsolePanel
        messages={consoleMessages}
        onClear={() => setConsoleMessages([])}
        theme={theme}
      />
    </div>
  )}
</div>

  );
};