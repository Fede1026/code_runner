"use client";

import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
}

export default function Editor({ value, onChange, language }: EditorProps) {
  return (
    <div className="flex-1 w-full h-full bg-transparent overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), monospace",
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          roundedSelection: false,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          fontLigatures: true,
          lineHeight: 24,
        }}
      />
    </div>
  );
}
