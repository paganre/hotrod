import { getDirection } from "../../apis/direction";
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

const DEFINITIONS: LibraryDefinition[] = [getDirection(1)];

const DEFAULT_CODE: string = `/**
 * Wow, you did it. Let's do it again.
 * But this time let's introduce the "Game Loop".
 * 
 * First of all, notice that your function's name is
 * "gameLoop" and not "main".
 * 
 * You are now coding what you want HotRod to do in a single turn.
 * The function "gameLoop" will be called until an end condition is reached.
 **/

/**
 * Direction is now rate-limited (https://en.wikipedia.org/wiki/Rate_limiting).
 * You can only call it once inside the gameLoop.
 * So you can only move the HotRod once per turn.
 * If you call it more than once, only the first call will be executed.
 **/
function gameLoop(direction: Direction) {
    // your code goes here.
}
`;

const METADATA: WorldMetadata = {
  nextLevel: "/playground/3",
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
