import "./code-editor.css";
import "./syntax.css";
import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeshift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

// 型の定義
interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

// code-cell.tsxからpropsを受け取る
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  // エディターへの参照
  const editorRef = useRef<any>();

  // エディター内の変更を監視する関数
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      // valueの変更を取得
      onChange(getValue());
    });

    // タブの調整
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // コードをハイライトする
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeshift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  // エディタ内のコードをフォーマットする関数
  const onFormatClick = () => {
    //エディターからvalueを取得
    const unformatted = editorRef.current.getModel().getValue();

    // valueをフォーマットする
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    // フォーマットされたvalueをエディターにセット
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        options={{
          fontSize: 16,
          wordWrap: "on",
          folding: false,
          showUnused: false,
          automaticLayout: true,
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
        theme="dark"
        height="100%"
        language="javascript"
        value={initialValue}
        editorDidMount={onEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
