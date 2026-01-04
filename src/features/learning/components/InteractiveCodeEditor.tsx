// src/features/learning/components/InteractiveCodeEditor.tsx
import { Sandpack } from '@codesandbox/sandpack-react';

interface InteractiveCodeEditorProps {
  code: string;
  readOnly?: boolean;
  showPreview?: boolean;
  onCodeChange?: (code: string) => void;
}

export function InteractiveCodeEditor({
  code,
  readOnly = false,
  showPreview = true,
  onCodeChange,
}: InteractiveCodeEditorProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Sandpack
        template="react"
        theme="dark"
        files={{
          '/App.js': {
            code: code,
            active: true,
          },
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 400,
          editorWidthPercentage: showPreview ? 50 : 100,
          readOnly: readOnly,
        }}
        customSetup={{
          dependencies: {
            'react': '^18.0.0',
            'react-dom': '^18.0.0',
          },
        }}
      />
    </div>
  );
}