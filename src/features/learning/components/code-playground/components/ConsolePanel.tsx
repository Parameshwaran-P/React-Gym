/**
 * ConsolePanel Component
 * 
 * Displays console output, errors, warnings, and logs.
 * Provides clear button and message filtering capabilities.
 */

import React from 'react';
import type { ConsolePanelProps } from '../types/index';

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  messages,
  onClear,
  theme,
}) => {
  console.log('Rendering ConsolePanel with messages:', messages);
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '▸';
    }
  };

  const getMessageColor = (type: string) => {
    if (theme === 'dark') {
      switch (type) {
        case 'error':
          return 'text-red-400';
        case 'warn':
          return 'text-yellow-400';
        case 'info':
          return 'text-blue-400';
        default:
          return 'text-gray-300';
      }
    } else {
      switch (type) {
        case 'error':
          return 'text-red-600';
        case 'warn':
          return 'text-yellow-600';
        case 'info':
          return 'text-blue-600';
        default:
          return 'text-gray-700';
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      } border-b`}>
        <div className={`text-xs font-semibold tracking-wide uppercase ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Console
        </div>
        <button
          onClick={onClear}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto font-mono text-sm">
        {messages.length === 0 ? (
          <div className={`flex items-center justify-center h-full ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-xs">Console output will appear here</div>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 px-2 py-1 rounded ${
                  msg.type === 'error'
                    ? theme === 'dark'
                      ? 'bg-red-900/20'
                      : 'bg-red-50'
                    : ''
                }`}
              >
                <span className="flex-shrink-0">{getMessageIcon(msg.type)}</span>
                <span className={`flex-1 ${getMessageColor(msg.type)} break-all`}>
                  {msg.message}
                </span>
                <span className={`flex-shrink-0 text-xs ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};