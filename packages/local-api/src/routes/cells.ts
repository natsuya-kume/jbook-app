import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}
// セルルーターの作成
export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  //　bodyにアクセスするためのコード
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // ファイルの読み取り
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });

      res.send(JSON.parse(result));
    } catch (err) {
      // エンティティがない、ファイルが存在しない場合
      if (err.code === "ENOENT") {
        //   ファイルを追加して、デフォルトのセルを追加する
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // リクエストオブジェクトからセルのリストを取得する。
    // 安全に書き込むことができる形式に変換
    const { cells }: { cells: Cell[] } = req.body;

    // ファイルに書き込む
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
