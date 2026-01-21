// src/features/learning/components/CodeDisplay.tsx
import { SandpackProvider, SandpackCodeEditor } from '@codesandbox/sandpack-react';

interface CodeDisplayProps {
  code: string;
  language?: string;
}

export function CodeDisplay({ code, language = 'jsx' }: CodeDisplayProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <SandpackProvider
        template="react"
        theme="dark"
        files={{
           "/App.js": {
      code,
      active: true,
    },
        }}
        options={{
          editorHeight: 400,
        }}
      >
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors={false}
          wrapContent
          style={{ height: 'auto', minHeight: '200px' }}
        />
      </SandpackProvider>
    </div>
  );
}