import * as dotenv from "dotenv";
import { recognizeText } from "./ocr.js";
import { readFileSync } from "node:fs";

dotenv.config();

(async () => {
  const imagePath = process.argv[2];

  if (!imagePath) {
    console.error("Please provide valid image path.");
    return;
  }

  const imageContent = readFileSync(imagePath);

  console.log(await recognizeText(imageContent));
})();
