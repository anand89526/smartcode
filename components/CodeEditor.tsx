"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"

export default function CodeEditor() {

  const [code,setCode] = useState("// Write your code here")

  return (
    <Editor
      height="500px"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={code}
      onChange={(value)=>setCode(value || "")}
    />
  )
}