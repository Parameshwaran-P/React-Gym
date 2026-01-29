// src/features/learning/utils/fileNormalizer.ts

import type { SandpackTemplate, SupportedLanguage, EditorFile } from '../types/editor.types';
import type { SandpackFiles } from '@codesandbox/sandpack-react';

/**
 * Maps our language types to Sandpack templates
 */
export function getTemplateForLanguage(language: SupportedLanguage): SandpackTemplate {
  const mapping: Record<SupportedLanguage, SandpackTemplate> = {
    html: 'vanilla',
    css: 'vanilla',
    javascript: 'vanilla',
    react: 'react',
    nextjs: 'nextjs',
    nodejs: 'node',
  };
  return mapping[language];
}

/**
 * Determines if language needs preview or just console
 */
export function needsPreview(language: SupportedLanguage): boolean {
  return ['html', 'css', 'javascript', 'react', 'nextjs'].includes(language);
}

/**
 * Converts simple string files to Sandpack file format
 */
export function normalizeSandpackFiles(
  files: Record<string, string>,
  activeFile?: string,
  hiddenFiles: string[] = []
): SandpackFiles {
  const normalized: SandpackFiles = {};

  Object.entries(files).forEach(([filepath, code]) => {
    normalized[filepath] = {
      code,
      hidden: hiddenFiles.includes(filepath),
      active: filepath === activeFile,
    };
  });

  return normalized;
}

/**
 * Creates default file structure for each language
 * Used when user provides minimal config
 */
export function getDefaultFilesForLanguage(
  language: SupportedLanguage,
  userFiles: Record<string, string>
): Record<string, string> {
  
  // If user provides complete file structure, use it
  const hasCompleteStructure = validateFileStructure(language, userFiles);
  if (hasCompleteStructure) {
    return userFiles;
  }

  // Otherwise, create proper structure with user code
  switch (language) {
    case 'html':
    case 'css':
    case 'javascript':
      return normalizeVanillaFiles(userFiles);
    
    case 'react':
      return normalizeReactFiles(userFiles);
    
    case 'nextjs':
      return normalizeNextFiles(userFiles);
    
    case 'nodejs':
      return normalizeNodeFiles(userFiles);
    
    default:
      return userFiles;
  }
}

/**
 * Validates if user provided all required files
 */
function validateFileStructure(
  language: SupportedLanguage,
  files: Record<string, string>
): boolean {
  const requiredFiles: Record<SupportedLanguage, string[]> = {
    html: ['/index.html'],
    css: ['/index.html', '/styles.css'],
    javascript: ['/index.html', '/index.js'],
    react: ['/App.js'],
    nextjs: ['/pages/index.js'],
    nodejs: ['/index.js'],
  };

  const required = requiredFiles[language] || [];
  return required.every(file => file in files);
}

/**
 * HTML/CSS/JS (Vanilla) normalization
 */
function normalizeVanillaFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  // If user provided index.html, use it; otherwise create wrapper
  if (userFiles['/index.html']) {
    normalized['/index.html'] = userFiles['/index.html'];
  } else {
    // Create HTML wrapper that imports CSS and JS
    normalized['/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Practice</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>`;
  }

  // Add CSS
  normalized['/styles.css'] = userFiles['/styles.css'] || userFiles['/style.css'] || `
body {
  font-family: sans-serif;
  padding: 20px;
}
`.trim();

  // Add JS
  normalized['/index.js'] = userFiles['/index.js'] || userFiles['/script.js'] || `
console.log('JavaScript is working!');
`.trim();

  return normalized;
}

/**
 * React normalization
 */
function normalizeReactFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  // Main App component
  normalized['/App.js'] = userFiles['/App.js'] || userFiles['/App.jsx'] || `
export default function App() {
  return (
    <div>
      <h1>React App</h1>
    </div>
  );
}
`.trim();

  // Optional: Add styles if provided
  if (userFiles['/styles.css'] || userFiles['/App.css']) {
    normalized['/styles.css'] = userFiles['/styles.css'] || userFiles['/App.css'];
  }

  // Optional: Add additional components
  Object.entries(userFiles).forEach(([path, code]) => {
    if (path !== '/App.js' && path !== '/App.jsx' && !normalized[path]) {
      normalized[path] = code;
    }
  });

  return normalized;
}

/**
 * Next.js normalization
 */
function normalizeNextFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  // Main page
  normalized['/pages/index.js'] = userFiles['/pages/index.js'] || userFiles['/index.js'] || `
export default function Home() {
  return (
    <div>
      <h1>Next.js Page</h1>
    </div>
  );
}
`.trim();

  // Optional: Custom _app.js
  if (userFiles['/pages/_app.js'] || userFiles['/_app.js']) {
    normalized['/pages/_app.js'] = userFiles['/pages/_app.js'] || userFiles['/_app.js'];
  }

  // Optional: Add styles
  if (userFiles['/styles.css'] || userFiles['/styles/globals.css']) {
    normalized['/styles/globals.css'] = userFiles['/styles.css'] || userFiles['/styles/globals.css'];
  }

  // Add any other user files
  Object.entries(userFiles).forEach(([path, code]) => {
    if (!normalized[path] && !path.includes('index.js') && !path.includes('_app.js')) {
      normalized[path] = code;
    }
  });

  return normalized;
}

/**
 * Node.js normalization
 */
function normalizeNodeFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  // Main entry file
  normalized['/index.js'] = userFiles['/index.js'] || `
console.log('Node.js is working!');
`.trim();

  // Package.json (minimal)
  normalized['/package.json'] = userFiles['/package.json'] || `
{
  "name": "nodejs-practice",
  "version": "1.0.0",
  "main": "index.js"
}
`.trim();

  // Add any other user files
  Object.entries(userFiles).forEach(([path, code]) => {
    if (!normalized[path]) {
      normalized[path] = code;
    }
  });

  return normalized;
}

/**
 * Gets the default active file for each language
 */
export function getDefaultActiveFile(language: SupportedLanguage): string {
  const defaults: Record<SupportedLanguage, string> = {
    html: '/index.html',
    css: '/styles.css',
    javascript: '/index.js',
    react: '/App.js',
    nextjs: '/pages/index.js',
    nodejs: '/index.js',
  };
  return defaults[language];
}

/**
 * Gets files that should be hidden from tabs
 */
export function getDefaultHiddenFiles(language: SupportedLanguage): string[] {
  const hidden: Record<SupportedLanguage, string[]> = {
    html: [],
    css: [],
    javascript: [],
    react: ['/public/index.html'], // Hide React boilerplate
    nextjs: ['/pages/_app.js', '/pages/_document.js'], // Hide Next.js boilerplate
    nodejs: ['/package.json'], // Hide package.json for simplicity
  };
  return hidden[language] || [];
}