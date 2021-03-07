import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// localForageは同じAPIでデータの保存や取り出しが行えるようになる
// ↓インスタンスを作る　名前空間はfilecache
const fileCache = localForage.createInstance({
  name: "filecache",
});
// console.log(fileCache);

// プラグインを作成する　 ＊引数inputCodeには、コードエディタ内で入力したテキストが入ってくる
export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // index.jsを実コンテンツに変換
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // 非同期通信 // .で始まるファイルを実コンテンツに変換
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // setItem() で保存したデータを取得する
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      // 非同期通信  /.css~/で始まるファイルを実コンテンツに変換
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
              const style=document.createElement('style');
              style.innerText='${escaped}';
              document.head.appendChild(style)
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        // データの保存
        await fileCache.setItem(args.path, result);

        return result;
      });

      // 非同期通信  /.~/で始まるファイルを実コンテンツに変換
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // データの保存
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
