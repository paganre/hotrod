"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA = exports.DEFAULT_CODE = exports.GRID = void 0;
exports.GRID = [
    ["W", "W", " ", " ", " ", "W", "W", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", "W", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", "W", "E", " ", " "],
    ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
    ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
    ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
    ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
    ["W", "W", " ", "W", " ", "W", " ", " ", " ", " "],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
    ["W", "W", " ", "W", " ", " ", " ", "W", "W", "W"],
    ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
];
exports.DEFAULT_CODE = `/**
* Alright, let's get serious. 
* Now let's do a maze that is a little bit more complicated.
* First, let's define some essentials.
**/

/**
 * First one is the "Point", which corresponds to a point on the grid.
 * "x" is the row and "y" is the column.
 * Top left corner of the grid is (0,0).
 * As you go down "x" increases and as you go right "y" increases.
 **/
type Point = {
    x: number // row. increases as you go down on the grid.
    y: number // column. increases as you go right on the grid.
}

/**
 * Now, on top of the Direction, let's define a few more APIs you can use.
 * GPS gives information about the world.
 * You can get your location, or your target's location.
 **/
type GPS = {
    getLocation: () => Point // Gets your HotRod's location.
    getTarget: () => Point // Gets your target location.
}

/**
 * Sensor API gives you information about your immediate surroundings.
 **/
type Sensor = {
    /**
     * Returns a list of available roads immediately around you,
     * in the 4 squares you can move (up, down, left, right).
     **/ 
    getRoads: () => Point[] 
}

/** 
 * Last one is the DataStore.
 * You can use it to store and use data in subsequent game-loop calls. 
 * You will need to handle the serialization and deserialization of data,
 * as it only accepts and returns strings.
 * 
 * Example usage to store data:
 * """
 * const seenPoints = ["1,1", "2,2"]
 * data.set("seenPoints", JSON.stringify(seenPoints))
 * """
 * 
 * Example usage to retrieve data:
 * """
 * let lastPoint: Point = {x: 0, y: 0}
 * if (data.has("lastPoint")) {
 *    lastPoint = JSON.parse(data.get("lastPoint")) as Point
 * }
 * """
 * 
 * DataStore has no rate-limits.
 **/
type DataStore = {
    has(key: string): boolean // returns if the key is in the data store.
    get(key: string): string | undefined // returns the value of the key if it exists.
    set(key: string, value: string): void // sets the value for the key.
};


// And our old friend Direction
type Direction = {
    up: () => void 
    left: () => void
    down: () => void 
    right: () => void
}

function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
// your code goes here.
} 
`;
exports.METADATA = {
    nextLevel: "/playground/4",
};
