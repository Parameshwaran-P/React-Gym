// src/features/learning/utils/fileNormalizer.ts
// COMPLETE VERSION WITH HTML FIX

import type { SandpackTemplate, SupportedLanguage } from '../types/editor.types';
import type { SandpackFiles } from '@codesandbox/sandpack-react';

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

export function needsPreview(language: SupportedLanguage): boolean {
  return ['html', 'css', 'javascript', 'react', 'nextjs'].includes(language);
}

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

export function getDefaultFilesForLanguage(
  language: SupportedLanguage,
  userFiles: Record<string, string>
): Record<string, string> {
  
  switch (language) {
    case 'html':
    case 'css':
    case 'javascript':
      return normalizeVanillaFiles(userFiles, language);
    
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

// ============================================
// 🔧 CRITICAL FIX: This function prevents the error
// ============================================
function normalizeVanillaFiles(
userFiles: Record<string, string>, _language: string,
  // language: SupportedLanguage
): Record<string, string> {
  const normalized: Record<string, string> = {};

  // Get the HTML code from user
  const htmlCode = userFiles['/index.html'] || '';
  
  // Check if it's a complete HTML document
  const isCompleteHTML = 
    htmlCode.includes('<html') || 
    htmlCode.includes('<!DOCTYPE') ||
    htmlCode.includes('<body>');

  console.log('🔍 HTML Detection:', {
    isCompleteHTML,
    hasHtmlTag: htmlCode.includes('<html'),
    hasDoctype: htmlCode.includes('<!DOCTYPE'),
    hasBody: htmlCode.includes('<body>')
  });

  if (isCompleteHTML) {
    // ✅ CRITICAL: User provided complete HTML
    // Use their HTML as-is and create EMPTY JS file
    normalized['/index.html'] = htmlCode;
    
    // ✅ THIS IS THE FIX: Empty JS prevents Sandpack's default code
    normalized['/index.js'] = '// Your JavaScript code here\n';
    
    // Empty CSS
    normalized['/styles.css'] = userFiles['/styles.css'] || '';
    
    console.log('✅ Complete HTML detected - using empty JS file');
    
  } else {
    // HTML snippet - wrap it
    normalized['/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${htmlCode}
  <script src="index.js"></script>
</body>
</html>`;

    normalized['/styles.css'] = userFiles['/styles.css'] || `
body {
  font-family: sans-serif;
  padding: 20px;
}
`.trim();

    normalized['/index.js'] = userFiles['/index.js'] || `
console.log('Page loaded');
`.trim();

    console.log('📦 HTML snippet detected - wrapping in document');
  }

  console.log('📁 Final files:', Object.keys(normalized));
  
  return normalized;
}

function normalizeReactFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  normalized['/App.js'] = userFiles['/App.js'] || userFiles['/App.jsx'] || `
export default function App() {
  return (
    <div>
      <h1>React App</h1>
    </div>
  );
}
`.trim();

  if (userFiles['/styles.css'] || userFiles['/App.css']) {
    normalized['/styles.css'] = userFiles['/styles.css'] || userFiles['/App.css'];
  }

  Object.entries(userFiles).forEach(([path, code]) => {
    if (path !== '/App.js' && path !== '/App.jsx' && !normalized[path]) {
      normalized[path] = code;
    }
  });

  return normalized;
}

function normalizeNextFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  normalized['/pages/index.js'] = userFiles['/pages/index.js'] || userFiles['/index.js'] || `
export default function Home() {
  return (
    <div>
      <h1>Next.js Page</h1>
    </div>
  );
}
`.trim();

  if (userFiles['/pages/_app.js'] || userFiles['/_app.js']) {
    normalized['/pages/_app.js'] = userFiles['/pages/_app.js'] || userFiles['/_app.js'];
  }

  if (userFiles['/styles.css'] || userFiles['/styles/globals.css']) {
    normalized['/styles/globals.css'] = userFiles['/styles.css'] || userFiles['/styles/globals.css'];
  }

  Object.entries(userFiles).forEach(([path, code]) => {
    if (!normalized[path] && !path.includes('index.js') && !path.includes('_app.js')) {
      normalized[path] = code;
    }
  });

  return normalized;
}

function normalizeNodeFiles(userFiles: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  normalized['/index.js'] = userFiles['/index.js'] || `
console.log('Node.js is working!');
`.trim();

  normalized['/package.json'] = userFiles['/package.json'] || `
{
  "name": "nodejs-practice",
  "version": "1.0.0",
  "main": "index.js"
}
`.trim();

  Object.entries(userFiles).forEach(([path, code]) => {
    if (!normalized[path]) {
      normalized[path] = code;
    }
  });

  return normalized;
}

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

export function getDefaultHiddenFiles(language: SupportedLanguage): string[] {
  const hidden: Record<SupportedLanguage, string[]> = {
    html: ['/index.js', '/styles.css'], // Hide empty files
    css: [],
    javascript: [],
    react: [],
    nextjs: [],
    nodejs: ['/package.json'],
  };
  return hidden[language] || [];
}