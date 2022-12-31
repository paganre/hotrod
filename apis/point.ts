import { LibraryDefinition } from "../types";

export const Point: LibraryDefinition = {
  definition: [
    `/**
    * \`Point\` corresponds to a location on the grid.
    * \`x\` is the row and \`y\` is the column.
    * Top left corner of the grid is \`{x:0, y:0}\`.
    * As you go down \`x\` increases and as you go right \`y\` increases.
    **/
   type Point = {
    x: number;
    y: number;
  };`,
  ].join("\n"),
  filepath: "inmemory://model/common/Point.d.ts",
};
export default Point;
