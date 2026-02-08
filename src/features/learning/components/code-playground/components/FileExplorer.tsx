/**
 * FileExplorer Component
 * 
 * Displays a hierarchical file tree with file selection capabilities.
 * Supports icons based on file types and active state highlighting.
 */

import React from 'react';
import type { FileExplorerProps } from '../types/index';

// File icon mapping based on extension
const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    js: '📜',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    html: '🌐',
    css: '🎨',
    json: '📋',
    py: '🐍',
    md: '📝',
  };
  
  return iconMap[ext || ''] || '📄';
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFile,
  onFileSelect,
  theme,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase ${
        theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-gray-600 border-gray-200'
      } border-b`}>
        Files
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(files).map((filename) => {
          const isActive = filename === activeFile;
          const isReadOnly = files[filename].readOnly;

          return (
            <button
              key={filename}
              onClick={() => onFileSelect(filename)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono transition-all ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                    : 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800/50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{getFileIcon(filename)}</span>
              <span className="flex-1 text-left truncate">{filename}</span>
              {isReadOnly && (
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  🔒
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className={`px-3 py-2 text-xs ${
        theme === 'dark' ? 'text-gray-500 border-gray-800' : 'text-gray-500 border-gray-200'
      } border-t`}>
        {Object.keys(files).length} file{Object.keys(files).length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};