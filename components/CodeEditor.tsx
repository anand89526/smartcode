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
  fontSize?: number;
  wordWrap?: "on" | "off";
  minimap?: boolean;
  readOnly?: boolean;
};

export default function CodeEditor({
  code,
  language = "javascript",
  onChange,
  height = "500px",
  onRun,
  onSubmit,
  fontSize = 14,
  wordWrap = "off",
  minimap = false,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount = useCallback((editor: Parameters<OnMount>[0], monaco: Parameters<OnMount>[1]) => {
    editorRef.current = editor as Parameters<OnMount>[0];

    monaco.editor.defineTheme("smartcode-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8A8B90", fontStyle: "italic" },
        { token: "keyword", foreground: "1C1D22", fontStyle: "bold" },
        { token: "string", foreground: "0F9F8D" },
        { token: "number", foreground: "B36A1A" },
        { token: "type", foreground: "5F5BFF" },
        { token: "function", foreground: "D96BA7" },
        { token: "variable", foreground: "26272B" },
        { token: "operator", foreground: "1C1D22" },
        { token: "delimiter", foreground: "767881" },
        { token: "identifier", foreground: "26272B" },
      ],
      colors: {
        "editor.background": "#F7F4EE",
        "editor.foreground": "#18191D",
        "editor.lineHighlightBackground": "#ECE8DF",
        "editor.selectionBackground": "#79F2DD55",
        "editor.inactiveSelectionBackground": "#D7D1C444",
        "editorCursor.foreground": "#171719",
        "editorLineNumber.foreground": "#AAA79F",
        "editorLineNumber.activeForeground": "#34353B",
        "editor.selectionHighlightBackground": "#79F2DD33",
        "editorBracketMatch.background": "#17171912",
        "editorBracketMatch.border": "#17171966",
        "editorIndentGuide.background": "#DED9CE",
        "editorIndentGuide.activeBackground": "#BDB7AA",
        "editorGutter.background": "#F7F4EE",
        "editorWhitespace.foreground": "#DDD7CA",
        "scrollbarSlider.background": "#17171922",
        "scrollbarSlider.hoverBackground": "#17171933",
        "scrollbarSlider.activeBackground": "#17171944",
      },
    });

    monaco.editor.setTheme("smartcode-light");

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
      theme="smartcode-light"
      value={code}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: minimap },
        fontSize,
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
        wordWrap,
        automaticLayout: true,
        readOnly,
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
