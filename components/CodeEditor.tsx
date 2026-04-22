"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useCallback } from "react";

type CodeEditorProps = {
  code: string;
  language?: string;
  onChange: (value: string) => void;
  height?: string;
  onRun?: () => void;
  onSubmit?: () => void;
};

export default function CodeEditor({
  code,
  language = "javascript",
  onChange,
  height = "500px",
  onRun,
  onSubmit,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount = useCallback((editor: Parameters<OnMount>[0], monaco: Parameters<OnMount>[1]) => {
    editorRef.current = editor as Parameters<OnMount>[0];

    // Define custom SmartCode dark theme
    monaco.editor.defineTheme("smartcode-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a737d", fontStyle: "italic" },
        { token: "keyword", foreground: "ff7b72" },
        { token: "string", foreground: "a5d6ff" },
        { token: "number", foreground: "79c0ff" },
        { token: "type", foreground: "ffa657" },
        { token: "function", foreground: "d2a8ff" },
        { token: "variable", foreground: "c9d1d9" },
        { token: "operator", foreground: "ff7b72" },
        { token: "delimiter", foreground: "8b949e" },
        { token: "identifier", foreground: "c9d1d9" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editor.lineHighlightBackground": "#161b2280",
        "editor.selectionBackground": "#264f7840",
        "editor.inactiveSelectionBackground": "#264f7820",
        "editorCursor.foreground": "#62ffb6",
        "editorLineNumber.foreground": "#484f58",
        "editorLineNumber.activeForeground": "#8b949e",
        "editor.selectionHighlightBackground": "#264f7830",
        "editorBracketMatch.background": "#3dd2ff20",
        "editorBracketMatch.border": "#3dd2ff40",
        "editorIndentGuide.background": "#21262d",
        "editorIndentGuide.activeBackground": "#30363d",
        "scrollbarSlider.background": "#484f5833",
        "scrollbarSlider.hoverBackground": "#484f5855",
        "scrollbarSlider.activeBackground": "#484f5877",
      },
    });

    monaco.editor.setTheme("smartcode-dark");

    // Keyboard shortcuts
    if (onRun) {
      editor.addAction({
        id: "smartcode-run",
        label: "Run Code",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => onRun(),
      });
    }
    if (onSubmit) {
      editor.addAction({
        id: "smartcode-submit",
        label: "Submit Code",
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
        ],
        run: () => onSubmit(),
      });
    }
  }, [onRun, onSubmit]);

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      language={language}
      theme="smartcode-dark"
      value={code}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        padding: { top: 16, bottom: 16 },
        roundedSelection: true,
        scrollBeyondLastLine: false,
        fontLigatures: true,
        smoothScrolling: true,
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "all",
        tabSize: 2,
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
          useShadows: false,
        },
        wordWrap: "off",
        automaticLayout: true,
        suggest: {
          showMethods: true,
          showFunctions: true,
          showVariables: true,
          showWords: true,
        },
      }}
    />
  );
}
