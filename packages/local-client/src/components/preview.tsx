import "./preview.css";
import { useEffect, useRef } from "react";

// propsで受け取る値の型宣言
interface PreviewProps {
  code: string;
  err: string;
}

// iframe内のhtmlドキュメント
const html = `
<html>
  <head>
      <style>html {background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError=(err)=>{
        const root=document.querySelector('#root');
        root.innerHTML='<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
        console.error(err)
      }
      window.addEventListener('error',(event)=>{
        event.preventDefault();
        handleError(event.error);
      })
      window.addEventListener('message',(event)=>{
        try{
          eval(event.data)
        }catch(err){
          handleError(err)
        }
      },false);
    </script>
  </body>
</hmtl>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  // iframeへの参照
  const iframe = useRef<any>();

  // codeの値が変更されるたびに実行
  useEffect(() => {
    // iframeの内容をリセットするためのコード
    iframe.current.srcdoc = html;
    // 正確なコードを取得するために時間を少し遅らせる
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
