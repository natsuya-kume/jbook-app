import express from "express";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells";

//cliの中のserve.tsより値を受け取る
export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  // 別ディレクトリのcreateCellsRouter関数にfilename, dirを渡す
  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // 実際に開発環境でアプリケーションを実行している時
    // reactアプリとブラウザを繋ぐプロキシの作成
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
      })
    );
  } else {
    // ユーザーがcliをローカルマシンにインストールした場合
    const packagePath = require.resolve(
      "@jsnote/local-client/build/index.html"
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  // resolve or rejectを判定
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
