import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}
const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;
    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState["data"]);
      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;
    case ActionType.UPDATE_CEll:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      // orderの中のidを取得し,比較してpayloadのidを削除
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      // 配列からidが一致しているインデックス番号を取得
      const index = state.order.findIndex((id) => id === action.payload.id);
      // 方向がup/downの場合にindex番号を新しく設定する
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      // 例外処理
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      // 順番を更新
      state.order[index] = state.order[targetIndex];
      // idの更新
      state.order[targetIndex] = action.payload.id;
      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;

      // 配列からidが一致しているインデックス番号を取得
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }

      return state;
    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
