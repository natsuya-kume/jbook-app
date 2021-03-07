import "./cell-list.css";
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import { useActions } from "../hooks/use-actions";

const CellList: React.FC = () => {
  // 別ファイルで定義したのuseTypedSelectorを使用して、reduxにアクセスし、cellsとして、テキストエディタとコードエディタの情報を取得
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  // console.log(cells);

  // 上記cells配列をmapして、必要な情報(全ての情報を含む全体の配列がmapされて、オブジェクトがいくつも取り出されている状態)を
  // cell-list-itemコンポーネントとadd-cellコンポーネントにpropsとして渡す
  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  // cellsの数が０になっている時は、add-cellコンポーネントをずっと表示したいから、forceVisibleをpropsとして渡す
  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
