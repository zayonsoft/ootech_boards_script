import { boardList } from "./boardList.js";
import axios from "axios";
import fs from "node:fs";
import dotenv from "dotenv";

import { BoardType } from "./BoardType.js";

dotenv.config();

type BoardListType = {
  boards: BoardType[];
};

const createBoardUrl: string = process.env.CREATE_BOARD_URL || "";

let testErrorList: { board_index: number; error: string }[] = [];
let boardResponseList: { index: number; response: {} }[] = [];

function automate(): void {
  const theBoards: BoardListType = boardList;

  const boards = theBoards.boards;
  let count = 0;
  for (const i in boards) {
    const each_board = boards[i];
    axios
      .post(createBoardUrl, each_board)
      .then((response) => {
        console.log(response.data);
        boardResponseList.push({ index: count, response: response.data });
        writeInto(
          "response/upload_success.json",
          JSON.stringify(boardResponseList, null, 2)
        );
      })
      .catch((err) => {
        testErrorList.push({
          board_index: count,
          error: err.code ? err.code : "Unknown Error",
        });
        writeInto("upload_errors.json", JSON.stringify(testErrorList, null, 2));
      });
    count++;
  }
}

function writeInto(file_name: string, object_to_write: string) {
  fs.writeFile(file_name, object_to_write, "utf-8", (err) => {
    if (err) throw err;
    console.log("Written File Asynchronously");
  });
}

automate();
