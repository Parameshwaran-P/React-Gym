import { SandpackProvider, SandpackCodeEditor } from "@codesandbox/sandpack-react";

interface CodeDisplayProps {
  code: string;
  language?: string;
}

export function CodeDisplay({ code, language = 'jsx' }: CodeDisplayProps) {
  const fileName =
    language === 'tsx'
      ? '/App.tsx'
      : language === 'ts'
      ? '/App.ts'
      : language === 'jsx'
      ? '/App.jsx'
      : '/App.js';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <SandpackProvider
        template="react"
        theme="dark"
        files={{
          [fileName]: {
            code,
            active: true,
          },
        }}
      >
        <SandpackCodeEditor
          readOnly
          showLineNumbers
          showInlineErrors={false}
          wrapContent
          style={{ height: 'auto', minHeight: '200px' }}
        />
      </SandpackProvider>
    </div>
  );
}
