/**
 * useEditorState Hook
 * 
 * Manages the state of files and active file selection in the editor.
 * Handles file updates and reset functionality while notifying parent
 * component of changes through the onChange callback.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { FileMap, UseEditorStateReturn } from '../types/index';

export const useEditorState = (
  initialFiles: FileMap,
  onChange?: (files: FileMap) => void
): UseEditorStateReturn => {
  // Store initial files for reset functionality
  const initialFilesRef = useRef(initialFiles);
  
  // Current state
  const [files, setFiles] = useState<FileMap>(initialFiles);
  const [activeFile, setActiveFile] = useState<string | null>(() => {
    const fileNames = Object.keys(initialFiles);
    return fileNames.length > 0 ? fileNames[0] : null;
  });

  // Update initial files if config changes
  useEffect(() => {
    initialFilesRef.current = initialFiles;
    setFiles(initialFiles);
    
    // Reset active file if it doesn't exist in new files
    if (activeFile && !initialFiles[activeFile]) {
      const fileNames = Object.keys(initialFiles);
      setActiveFile(fileNames.length > 0 ? fileNames[0] : null);
    }
  }, [initialFiles, activeFile]);

  // Update a specific file's content
  const updateFile = useCallback((filename: string, code: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = {
        ...prevFiles,
        [filename]: {
          ...prevFiles[filename],
          code,
        },
      };
      
      // Notify parent of changes
      onChange?.(updatedFiles);
      
      return updatedFiles;
    });
  }, [onChange]);

  // Reset all files to initial state
  const resetFiles = useCallback(() => {
    setFiles(initialFilesRef.current);
    onChange?.(initialFilesRef.current);
  }, [onChange]);

  // Safe file selection
  const handleSetActiveFile = useCallback((filename: string) => {
    if (files[filename]) {
      setActiveFile(filename);
    }
  }, [files]);

  return {
    files,
    activeFile,
    setActiveFile: handleSetActiveFile,
    updateFile,
    resetFiles,
  };
};