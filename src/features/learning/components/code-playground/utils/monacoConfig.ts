/**
 * Monaco Editor Configuration
 * 
 * Configures Monaco Editor with custom settings, IntelliSense,
 * and language-specific features.
 */

/**
 * Configure Monaco Editor instance
 * Sets up TypeScript compiler options, React JSX support, and custom themes
 */
export const configureMonaco = (monaco: any) => {
  // Configure TypeScript/JavaScript compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
  });

  // Enable semantic validation
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Add React type definitions
  const reactTypes = `
    declare module 'react' {
      export function useState<T>(initialState: T | (() => T)): [T, (value: T) => void];
      export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
      export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
      export function useMemo<T>(factory: () => T, deps: any[]): T;
      export function useRef<T>(initialValue: T): { current: T };
      export const Fragment: any;
      export default React;
    }

    declare namespace React {
      type FC<P = {}> = (props: P) => JSX.Element | null;
      type ReactNode = any;
      interface HTMLAttributes<T> {
        className?: string;
        style?: any;
        onClick?: (e: any) => void;
        onChange?: (e: any) => void;
        [key: string]: any;
      }
    }

    declare namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  `;

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactTypes,
    'file:///node_modules/@types/react/index.d.ts'
  );

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    reactTypes,
    'file:///node_modules/@types/react/index.d.ts'
  );
};

/**
 * Get Monaco language identifier from file extension or language name
 */
export const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    py: 'python',
    python: 'python',
    md: 'markdown',
    react: 'javascript',
    javascript: 'javascript',
    node: 'javascript',
  };

  return languageMap[language.toLowerCase()] || 'plaintext';
};