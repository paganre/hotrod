import { LibraryDefinition } from "../types";

export const Input: LibraryDefinition = {
  definition: [
    `/**
    * \`Input\` API is the first \`asynchronous\` API that you will use.
    * It is used to receive your input frame for the puzzle and is rate-limited to 1 call per \`gameLoop\`.
    * Frame dimensions are the same as your computer terminal dimensions.
    * 
    * ###Example usage:
    * \`\`\`
    * const frame: number[][] = await input.getFrame(); // you need \`await\` to resolve the input
    * // frame.length -> number of rows on the terminal (maximum x value can be frame.length-1)
    * // frame[0].length -> number of columns on the terminal (maximum y value can be frame[0].length-1)
    * const pixelValue: number = frame[0][0] 
    * // pixelValue is a number between [0,255] and corresponds to top-left corner of the screen
    * \`\`\`
    **/
   type Input = {
       getFrame(): Promise<number[][]>
   }`,
  ].join("\n"),
  filepath: "inmemory://model/common/Input.d.ts",
};
export default Input;
