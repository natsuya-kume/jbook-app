import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  // 全てのコードを取得する エディタ内で前のエディタコードを参照できるようにするために、
  // 全てのセルの情報を含む配列を作る
  return useTypedSelector((state) => {
    // dataとorderを取得
    const { data, order } = state.cells;
    // orderをマップして、dataオブジェクトと比較して新しい配列を作成
    const orderedCells = order.map((id) => data[id]);

    // previewウィンドウにシンプルにコードを表示させるためのファンクション
    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
        var show=(value)=>{
          const root =document.querySelector('#root')
          if(typeof value==='object'){
            if(value.$$typeof && value.props){
              _ReactDOM.render(value,root);
            }else{
              root.innerHTML=JSON.stringify(value);
            }
          }else{
            root.innerHTML=value;
          }
        };
      `;

    // 空のshowファンクション　二つ目のpreviewウィンドウには一つ目にエディタ内に書いたコードを表示させない
    const showFuncNoop = "var show=()=>{}";

    // 空の配列を定義
    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      // c.id === cell.idが見つかれば反復を停止
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
