// CodeEditorかTextEditorのどちらかを画面に追加するコンポーネント
import "./add-cell.css";
import { useActions } from "../hooks/use-actions";

// forceVisible={cells.length === 0}より、true/falseで型を宣言
interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ forceVisible, previousCellId }) => {
  // useAction()を使用して、insertCellAfter(id,CellTyles)のactionを取得 ()の中は引数
  const { insertCellAfter } = useActions();

  // ボタンを3つ作り、onClickメソットでそれぞれのボタンがクリックされた時に、actionを呼び出してdispatchする
  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, "code")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, "text")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
export default AddCell;
