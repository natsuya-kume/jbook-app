import "./resizable.css";
import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  // 画面の高さと幅を管理するstate
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // エディタの幅を管理するstate
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  // ウィンドウの幅を伸縮させる時の調整用
  useEffect(() => {
    let timer: any;
    const listener = () => {
      // timerがあれば、setTimeout()でセットしたタイマーを解除する
      if (timer) {
        clearTimeout(timer);
      }
      // 一定時間後に処理を一回だけ実行する
      timer = setTimeout(() => {
        // 画面の高さと幅を取得してそれぞれ管理してるstateに代入
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    // resizeされるごとに呼び出される
    window.addEventListener("resize", listener);

    // 上記のイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);

  // 移動方向で場合分け
  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width: width,
      resizeHandles: ["e"],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      // エディタの幅調整を止めた時
      onResizeStop: (event, data) => {
        // 取得したエディタの幅をstateに代入
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
