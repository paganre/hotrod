import Direction from "../../apis/direction";
import {
  Grid,
  LevelDefinition,
  LibraryDefinition,
  WorldMetadata,
} from "../../types";
import { WorldState } from "../../world";

const GRID: Grid = [
  ["W", "W", "W", "W", "W", "W", "W", "W", "W"],
  ["W", " ", " ", " ", "E", " ", " ", " ", " "],
  ["W", " ", " ", " ", " ", " ", " ", " ", " "],
  ["W", " ", " ", " ", " ", " ", " ", " ", " "],
  ["W", " ", " ", " ", " ", " ", " ", " ", " "],
  ["W", " ", " ", " ", " ", " ", " ", " ", " "],
  ["W", " ", " ", " ", " ", " ", " ", " ", " "],
  ["W", " ", " ", " ", "S", " ", " ", " ", " "],
  ["W", "W", "W", "W", "W", "W", "W", "W", "W"],
];

const DEFINITIONS: LibraryDefinition[] = [Direction];

const DEFAULT_CODE: string = `/**
* Welcome to HotRod.
* An exciting adventure in Typescript that will blow your mind.
* These are the playground levels, where you will learn the very basics.
**/

/**
 * Goal is to get to the green tile.
 * Be careful: avoid the gray tiles and do not go out of bounds.
 * You need to use the input \`Direction\` API.
 * Hover over it to see its definition and how to use it!
 **/
function main(direction: Direction) {
    // your code goes here.
}
`;

const METADATA: WorldMetadata = {
  executeOnce: true,
  nextLevel: "/playground/2",
  rateLimitOverrides: {
    direction: 0,
  },
};

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: GRID,
    code: DEFAULT_CODE,
    libraries: DEFINITIONS,
    metadata: METADATA,
  };
};
