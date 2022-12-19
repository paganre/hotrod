"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA = exports.DEFAULT_CODE = exports.GRID = void 0;
exports.GRID = [
  ["W", "W", "P", "P", "P", "W", "W", "W", "W", "W"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "W"],
  ["W", "W", "P", "W", "P", "W", "W", "E", "P", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "P", "P", "P", "P"],
  ["W", "W", "P", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "P", "P", "W", "W", "W"],
  ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
];
exports.DEFAULT_CODE = `/**
 * Alright!
 * You are finally graduated. 
 * Let's put your previous code into some chaotic test!
 * Rules are the same.
 * 
 * TIP: Pedestrians are moving randomly now, but they will not move out of bounds.
 * Their "direction" might say they are going to move,
 * but they will stay within the bounds if they are on the edge. 
 **/


type Pedestrian = {
    location: Point; // Where Pedestrian is
    direction: "up" | "down" | "left" | "right" | "static"; // Which way Pedestrian will move.
};

type Sensor = {
    getPedestrians: () => Pedestrian[]; // Returns the Pedestrians on the map.
    getRoads: () => Point[] 
}

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
  
// Get to green tile without killing anyone
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {

}
`;
exports.METADATA = {
  nextLevel: "/2",
};
