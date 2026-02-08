/**
 * PreviewPanel Component
 * 
 * Renders live preview of code execution in a sandboxed iframe.
 * Supports HTML, CSS, JavaScript, and React rendering.
 * Implements security best practices and console capture.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { PreviewPanelProps } from '../types/index';
import { generatePreviewHTML } from '../utils/previewGenerator';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  language,
  theme,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  // Debounced preview update
  const previewHTML = useMemo(() => {
    return generatePreviewHTML(files, language);
  }, [files, language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLastUpdate(Date.now());
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [previewHTML]);

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      
      // Security: Kill previous iframe to prevent memory leaks
      const iframe = iframeRef.current;
      
      // Wait for iframe to be ready
      const handleLoad = () => {
        setIsLoading(false);
      };

      iframe.addEventListener('load', handleLoad);
      
      // Update iframe content
      iframe.srcdoc = previewHTML;

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [lastUpdate, previewHTML]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 ${
        theme === 'dark' ? 'bg-[#0d0d0d] border-gray-800' : 'bg-gray-100 border-gray-200'
      } border-b`}>
        <div className={`text-xs font-semibold tracking-wide uppercase ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Preview
        </div>
        {isLoading && (
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Loading...
          </div>
        )}
      </div>

      {/* Preview Frame */}
      <div className={`flex-1 overflow-hidden ${theme === 'dark' ? 'bg-white' : 'bg-white'}`}>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-0"
          title="Code Preview"
        />
      </div>
    </div>
  );
};