import axios, { AxiosResponse } from "axios";
import fs from "node:fs";
import dotenv from "dotenv";
import { uploadedBoards } from "./boardList.js";
import { UploadedBoardType } from "./BoardType.js";

dotenv.config();

const DELETE_URL = process.env.DELETE_BOARD_URL || "";
const errorResponse: { index: number; code: "string" }[] = [];

const successResponse: {
  index: number;
  status: number | null;
}[] = [];
function deleteUploadedBoards() {
  const boards: UploadedBoardType[] = uploadedBoards;
  boards.forEach((board, index) => {
    const id = board.id;
    axios
      .delete(`${DELETE_URL}`, { params: { Id: id } })
      .then((response) => {
        // console.log(`Index: ${index}, Status: ${response.status}`);
        successResponse.push({ index: index, status: response.status });
        writeInto(
          "delete_success.json",
          JSON.stringify(successResponse, null, 2)
        );
      })
      .catch((err) => {
        // console.log(`Index: ${index}, Code: ${err.code}`);
        errorResponse.push({ index: index, code: err.code });
        writeInto(
          "response/delete_errors.json",
          JSON.stringify(errorResponse, null, 2)
        );
      });
  });
}

function writeInto(file_name: string, object_to_write: string) {
  fs.writeFile(file_name, object_to_write, "utf-8", (err) => {
    if (err) throw err;
    console.log("Written File Asynchronously");
  });
}

deleteUploadedBoards();
