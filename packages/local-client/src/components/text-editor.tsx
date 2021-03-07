import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  //   MDEditor表示の管理
  const [editing, setEditing] = useState(false);

  // エディタ内で入力されるテキストの管理
  const { updateCell } = useActions();

  //   MDEditorの内部or外部がクリックされているか
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // MDEditor内がクリックされているかを判定
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        // console.log("エディタの中がクリックされました");
        return;
      }
      // MDEditor外がクリックされれば、MDEditorを閉じる
      //   console.log("エディタの外がクリックされました");
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  //   editingがtrueの場合
  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || "")}
        />
      </div>
    );
  }
  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "クリックして編集する"} />
      </div>
    </div>
  );
};

export default TextEditor;
