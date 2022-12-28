export const GRID: string[][] = [
  ["W", "W", " ", " ", " ", "W", "W", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", "W", "E", " ", " "],
  ["W", "W", " ", "W", "P2", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", " ", " ", " ", " "],
  ["W", "W", "P1", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", " ", " ", "W", "W", "W"],
  ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
];

export const DEFAULT_CODE: string = `
/** 
 * Pretty cool.
 * Now, let's make things a bit more stressful.
 * Let's introduce the concept of a "Pedestrian"
 * (yes that little black dot).
 **/

/**
 * A "Pedestrian" is at s "location", which is a "Point".
 * Also they have a "direction", which shows you where they are headed the next turn.
 * If they are "static", they will stay at the same square.
 * Otherwise they try to move one square towards the "direction".
 * They can go to any square (including gray ones) but they can't go out of bounds.
 * After they move, they might change the direction for the next turn.
 * Some "Pedestrian"s will move in patterns, some will move randomly.
 **/
type Pedestrian = {
    location: Point; // Where Pedestrian is on the grid.
    direction: "up" | "down" | "left" | "right" | "static"; // Which way Pedestrian will move next turn.
};

/**
 * New rules to the game:
 * [1] If you move and end up in a Point with a Pedestrian, you lose the game.
 * [2] If you do not move, you do not lose even if the Pedestrian runs into you.
 * [3] You can exchange positions on the board with a Pedestrian if you move at the same time.
 * [4] More than one Pedestrian can be in the same Point.
 **/

/**
 * Now, your Sensor is upgraded! 
 * It gives you all the Pedestrians on the map.
 **/
type Sensor = {
    getPedestrians: () => Pedestrian[]; // Returns the Pedestrians on the map.
    getRoads: () => Point[] 
}

/**
 * In addition, your GPS now will give you the world's bounds.
 **/
type GPS = {
    getBounds: () => Point // x, y will give you the maximum value of x, y.
    getLocation: () => Point
    getTarget: () => Point
}

type DataStore = {
    has(key: string): boolean
    get(key: string): string | undefined
    set(key: string, value: string): void
};

type Direction = {
    up: () => void 
    left: () => void
    down: () => void 
    right: () => void
}

type Point = {
    x: number
    y: number
}

// Can you get to the green tile without running into the Pedestrian?
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {

}
`;

export const METADATA = {
  nextLevel: "/world",
  pedMoves: {
    "1": ["right", "right", "right", "right", "left", "left", "left", "left"],
    "2": ["left", "left", "right", "right"],
  },
};
