#!/usr/bin/env node
import { program } from "commander";
import { serveCommand } from "./commands/serve";

// コマンドの追加
program.addCommand(serveCommand);
// コマンドラインで引数を受け取る
program.parse(process.argv);
