/**
 * Toolbar Component
 * 
 * Provides action buttons for running, resetting code, and displays
 * current execution state and language information.
 */

import React from 'react';
import type { ToolbarProps } from '../types/index';

export const Toolbar: React.FC<ToolbarProps> = ({
  onRun,
  onReset,
  isExecuting,
  isReadOnly,
  theme,
  language,
}) => {
  const languageLabels: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    react: 'React',
    node: 'Node.js',
    python: 'Python',
  };

  const languageColors: Record<string, string> = {
    html: 'bg-orange-500',
    css: 'bg-blue-500',
    javascript: 'bg-yellow-500',
    react: 'bg-cyan-500',
    node: 'bg-green-500',
    python: 'bg-blue-600',
  };

  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-[#0d0d0d] via-[#111111] to-[#0d0d0d] border-gray-800' 
        : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-200'
    } border-b`}>
      {/* Left Section: Language Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${languageColors[language]} animate-pulse`} />
          <span className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {languageLabels[language]}
          </span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {!isReadOnly && (
          <>
            <button
              onClick={onReset}
              disabled={isExecuting}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:bg-gray-900 disabled:text-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'
              } disabled:cursor-not-allowed`}
            >
              Reset
            </button>
            
            <button
              onClick={onRun}
              disabled={isExecuting}
              className={`px-6 py-1.5 text-sm font-semibold rounded-md transition-all shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500'
              } disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2`}
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
          </>
        )}
        
        {isReadOnly && (
          <div className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
          }`}>
            <span>🔒</span>
            <span>Read Only</span>
          </div>
        )}
      </div>
    </div>
  );
};