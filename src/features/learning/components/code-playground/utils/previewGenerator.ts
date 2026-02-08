/**
 * Preview HTML Generator
 * 
 * Generates sandboxed HTML for iframe preview.
 * Handles different language types and injects console capture logic.
 */

import type { FileMap, SupportedLanguage } from '../types/index';

/**
 * Generate HTML content for iframe preview
 */
export const generatePreviewHTML = (
  files: FileMap,
  language: SupportedLanguage
): string => {
  // Extract file contents
  const htmlFile = Object.keys(files).find(f => f.endsWith('.html'));
  const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
  const jsFile = Object.keys(files).find(f => f.endsWith('.js') || f.endsWith('.jsx'));

  let html = '';
  let css = '';
  let javascript = '';

  // Get content based on language
  if (language === 'html' || language === 'css' || language === 'javascript') {
    html = htmlFile ? files[htmlFile].code : '';
    css = cssFile ? files[cssFile].code : '';
    javascript = jsFile ? files[jsFile].code : '';
  } else if (language === 'react') {
    return generateReactPreviewHTML(files);
  }

  // Build complete HTML document
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 16px;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  
  <script>
    // Console capture for parent communication
    (function() {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };

      ['log', 'error', 'warn', 'info'].forEach(method => {
        console[method] = function(...args) {
          originalConsole[method].apply(console, args);
          
          // Send to parent (if accessible)
          try {
            window.parent.postMessage({
              type: 'console',
              method: method,
              args: args.map(arg => {
                try {
                  return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                } catch (e) {
                  return String(arg);
                }
              }),
            }, '*');
          } catch (e) {
            // Parent not accessible - sandboxed correctly
          }
        };
      });

      // Global error handler
      window.addEventListener('error', (event) => {
        console.error(event.error?.message || event.message);
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
      });
    })();

    // User code
    try {
      ${javascript}
    } catch (error) {
      console.error('Runtime Error:', error.message);
    }
  </script>
</body>
</html>
  `.trim();
};

/**
 * Generate React preview HTML
 */
const generateReactPreviewHTML = (files: FileMap): string => {
  const jsxFile = Object.keys(files).find(f => f.endsWith('.jsx') || f.endsWith('.js'));
  const cssFile = Object.keys(files).find(f => f.endsWith('.css'));
  
  const jsxCode = jsxFile ? files[jsxFile].code : '';
  const css = cssFile ? files[cssFile].code : '';

  // Transform JSX to executable code
  const transformedCode = transformJSX(jsxCode);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    #root {
      padding: 16px;
    }
    ${css}
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    // Console capture
    (function() {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };

      ['log', 'error', 'warn', 'info'].forEach(method => {
        console[method] = function(...args) {
          originalConsole[method].apply(console, args);
          try {
            window.parent.postMessage({
              type: 'console',
              method: method,
              args: args.map(arg => {
                try {
                  return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                } catch (e) {
                  return String(arg);
                }
              }),
            }, '*');
          } catch (e) {}
        };
      });

      window.addEventListener('error', (event) => {
        console.error(event.error?.message || event.message);
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
      });
    })();
  </script>

  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef } = React;
    
    try {
      ${transformedCode}
      
      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      
      // Try to render App component or the default export
      if (typeof App !== 'undefined') {
        root.render(<App />);
      } else {
        console.error('No App component found. Please export a component named "App".');
      }
    } catch (error) {
      console.error('React Error:', error.message);
      document.getElementById('root').innerHTML = 
        '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>
  `.trim();
};

/**
 * Basic JSX transformation helper
 * In production, this would use Babel for proper transformation
 */
const transformJSX = (code: string): string => {
  // Remove import statements (we're loading React from CDN)
  let transformed = code.replace(/import .+ from .+['"];?\n?/g, '');
  
  // Remove export default if present
  transformed = transformed.replace(/export default /g, '');
  
  return transformed;
};