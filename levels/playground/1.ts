export const GRID: string[][] = [
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

export const DEFAULT_CODE: string = `/**
* Welcome to HotRod.
* An exciting adventure in Typescript that will blow your mind.
* These are the playground levels, where you will learn the very basics.
**/

/**
 * Direction is how you control HotRod.
 * Which is (you guessed it) the red dot in the center.
 * Here is the API:
 **/
type Direction = {
    up: () => void // Move HotRod one square up
    left: () => void // Move HotRod one square left
    down: () => void // Move HotRod one square down
    right: () => void // Move HotRod one square right
} 

/**
 * Try to get to the green tile.
 * Be careful: avoid the gray tiles and do not go out of bounds.
 **/
function main(direction: Direction) {
    // your code goes here.
}
`;

export const METADATA = {
  executeOnce: true,
  nextLevel: "/playground/2",
  rateLimitOverrides: {
    direction: 0,
  },
};
