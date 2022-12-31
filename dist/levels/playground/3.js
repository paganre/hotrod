"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = void 0;
const datastore_1 = __importDefault(require("../../apis/datastore"));
const direction_1 = require("../../apis/direction");
const gps_1 = require("../../apis/gps");
const point_1 = __importDefault(require("../../apis/point"));
const sensor_1 = require("../../apis/sensor");
const GRID = [
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
const getDefinitions = function (worldData) {
    return [
        (0, direction_1.getDirection)(1),
        (0, gps_1.getGPS)(["getLocation"]),
        (0, sensor_1.getSensor)(worldData),
        datastore_1.default,
        point_1.default,
    ];
};
const DEFAULT_CODE = `/**
 * Alright, let's get serious. 
 * Now let's do a maze that is a little bit more complicated.
 * First, let's define some essentials.
**/

/**
 * First one is the "Point", which corresponds to a point on the grid.
 * "x" is the row and "y" is the column. 
 * As you go down "x" increases and as you go right "y" increases.
 **/

/**
 * Now, on top of the Direction, let's define a few more APIs you can use.
 * 
 * GPS gives information about the world.
 * You can get your location on the grid using it.
 * 
 * Sensor API gives you information about your immediate surroundings.
 * 
 * Lastly you can use "DataStore" to store and use data in subsequent game-loop calls.
 **/

function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
    // your code goes here.
} 
`;
const METADATA = {
    nextLevel: "/playground/4",
};
const getLevel = function (worldData) {
    return {
        grid: GRID,
        code: DEFAULT_CODE,
        libraries: getDefinitions(worldData),
        metadata: METADATA,
    };
};
exports.getLevel = getLevel;
