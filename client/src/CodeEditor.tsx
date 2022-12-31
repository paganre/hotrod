import Editor, { loader, useMonaco } from "@monaco-editor/react";
import React from "react";
import { useState } from "react";
import { getApiPath } from "./helpers/apiHelpers";
import { LibraryDefinition, Result } from "./types";

loader.config({
  paths: {
    vs: "/vs",
  },
});

export interface CodeEditorProps {
  defaultCode: string;
  libraries: LibraryDefinition[];
  simulating: boolean;
  result?: Result;
  runCode: (code: string) => void;
  reset: () => void;
  nextLevel: () => void;
}

function CodeEditor(props: CodeEditorProps) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      for (const library of props.libraries) {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          library.definition,
          library.filepath
        );
      }
    }
  }, [monaco, props.libraries]);

  const [code, setCode] = useState("");
  React.useEffect(() => {
    if (code === "") {
      let defaultCode = localStorage.getItem(getApiPath());
      if (!defaultCode) {
        defaultCode = props.defaultCode;
      }
      setCode(defaultCode);
    }
  }, [code, props.defaultCode]);

  return (
    <div className="hot-rod-code-editor">
      <div style={{ display: "flex" }}>
        <div className="section-title">Editor</div>
        {props.simulating ? (
          <div style={{ marginLeft: 10 }}>Running...</div>
        ) : (
          !props.result?.result && (
            <button
              style={{ marginLeft: 10 }}
              className="run-code"
              onClick={() => {
                props.runCode(code);
              }}
            >
              Run
            </button>
          )
        )}
        {!props.simulating && props.result?.result && (
          <button
            style={{ marginLeft: 10 }}
            className="run-code"
            onClick={() => {
              props.reset();
            }}
          >
            Restart
          </button>
        )}
        {!props.simulating && (
          <button
            className="reset-code"
            onClick={() => {
              setCode(props.defaultCode);
            }}
          >
            Reset Code
          </button>
        )}
        {props.result && (
          <div style={{ marginLeft: 10 }}>{props.result.result}</div>
        )}
        {props.result?.won && (
          <button
            style={{ marginLeft: 10 }}
            className="next-level"
            onClick={() => {
              props.nextLevel();
            }}
          >
            Next Level
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: 20 }}>
          <Editor
            height="90vh"
            defaultLanguage="typescript"
            value={code}
            onChange={(val) => {
              if (val) {
                setCode(val);
              }
            }}
            line={16}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
}
export default CodeEditor;
