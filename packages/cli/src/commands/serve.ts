// コマンドラインでserveコマンドの利用を可能にし、lacal-apiと接続する
//serveCommandのオプションで、コマンドラインの詳細を設定
import path from "path";
import { Command } from "commander";
import { serve } from "@jsnote-nk/local-api";

// ユーザーがマシンで何か実行しているかしていないか　true or false が返ってくる
const isProduction = process.env.NODE_ENV === "production";

// local-apiからserve関数をimportして、actionのなかで呼び出して、必要な値をserve関数に渡す
export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  // 非同期
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      //  第二引数には実行するファイル、第三引数にはカレントディレクトリを絶対パスで表示 第四引数にはfalse値
      const dir = path.join(process.cwd(), path.dirname(filename));
      // serve関数で正確な値が返ってくるのを待つ
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`
      );
      // serve関数でエラーが返ってきた時
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        console.log("Port is in use. Try running on a different port.");
      } else {
        console.log("Heres the problem", err.message);
      }
      process.exit(1);
    }
  });
