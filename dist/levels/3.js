"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODE = exports.GRID = void 0;
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
 * Awesome!  
 * Now, we have some pedestrians around, actually a lot of them.
 * Let's define what they are.
 **/

/**
 * A "Pedestrian" is at a given "location", which is a "Point".
 * Also they have a "direction", which shows you where they are headed.
 * If they are "static", they will stay at the same square.
 * Otherwise they try to move one square towards the "direction".
 * They can go to any square but they can't go out of bounds.
 * After they move, they will randomly select another direction for the next round.
 **/
type Pedestrian = {
    location: Point; // Where Pedestrian is
    direction: "up" | "down" | "left" | "right" | "static"; // Which way Pedestrian will move.
};

/**
 * Rules:
 * [1] If you move and end up in a Point with a Pedestrian, you lose the game.
 * [2] If you do not move, you do not lose even if the Pedestrian runs into you.
 * [3] You can exchange positions on the board with a Pedestrian if you move at the same time.
 * [4] More than one Pedestrian can be in the same Point.
 **/

/**
 * Now, your Sensor is upgraded! 
 * It gives you the whole list of Pedestrians on the map.
 * Not just around you.
 **/
type Sensor = {
    getPedestrians: () => Pedestrian[]; // Returns the Pedestrians on the map.
    getRoads: () => Point[] 
}

/**
 * In addition, your GPS now will give you the world's bounds
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
  
// Game loop: your code goes here!
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {

}
`;
