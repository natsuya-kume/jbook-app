import * as esbuild from "esbuild-wasm";
// pluginsディレクトリからのインポート
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

// serviceの型を宣言
let service: esbuild.Service;

// bundle関数 ＊引数rawCodeには、コードエディタ内で入力したテキストが入ってくる
const bundle = async (rawCode: string) => {
  // serviceがない場合
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  // buildをする
  try {
    // resultには、以下optionをもとにbundleした後の情報が取得される
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      // fetchPluginにrawCodeを渡す
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        gloabal: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    // bundle後のtext情報とエラー文字を返す
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    // エラーの場合はエラーメッセージを返す
    return {
      code: "",
      err: err.message,
    };
  }
};

export default bundle;
