"use client";

import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
}

export default function Editor({ value, onChange, language }: EditorProps) {
  return (
    <div className="flex-1 w-full h-full rounded-lg overflow-hidden border border-zinc-800 shadow-xl bg-[#1e1e1e]">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          wordWrap: "on",
          padding: { top: 16 },
          roundedSelection: false,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
        }}
      />
    </div>
  );
}
