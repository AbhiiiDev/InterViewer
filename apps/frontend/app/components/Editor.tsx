"use client";
import React, { useRef } from "react";
import { Editor } from "@monaco-editor/react";

type Edit = {
  code: string;
  onChange: (code: string) => void;
};

const CodeEditor = ({ code, onChange }: Edit) => {
  const isLocalChange = useRef(false);
  return (
    <Editor
      className="w-full h-[70vh] bg-slate-900 border border-slate-700 rounded-md p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      height="90vh"
      theme="vs-dark"
      defaultLanguage="javascript"
      defaultValue="//Write your code here"
      value={code}
      onChange={(newCode) => {
        if (typeof newCode === "string") {
          isLocalChange.current = true;
          onChange(newCode);

          setTimeout(() => {
            isLocalChange.current = false;
          }, 50);
        }
      }}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "off",
        tabCompletion: "off",
        wordBasedSuggestions: "off",
        contextmenu: false,
      }}
    />
  );
};

export default CodeEditor;
