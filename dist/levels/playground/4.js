"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = void 0;
const datastore_1 = __importDefault(require("../../apis/datastore"));
const direction_1 = require("../../apis/direction");
const gps_1 = require("../../apis/gps");
const pedestrian_1 = __importDefault(require("../../apis/pedestrian"));
const point_1 = __importDefault(require("../../apis/point"));
const sensor_1 = require("../../apis/sensor");
const GRID = [
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
const getDefinitions = function (worldData) {
    return [
        (0, direction_1.getDirection)(1),
        (0, gps_1.getGPS)(["getBounds", "getLocation"]),
        (0, sensor_1.getSensor)(worldData),
        datastore_1.default,
        point_1.default,
        pedestrian_1.default,
    ];
};
const DEFAULT_CODE = `/** 
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

/**
 * New rules to the game:
 * [1] If you move and end up in a Point with a Pedestrian, you lose the game.
 * [2] If you do not move, you do not lose even if the Pedestrian runs into you.
 * [3] You can exchange positions on the board with a Pedestrian if you move at the same time.
 * [4] More than one Pedestrian can be in the same Point.
 **/

/**
 * Now, your Sensor is upgraded for no cost! 
 * It gives you all of the Pedestrians on the map by the new "getPedestrians" function.
 * Check the Sensor docs by hovering over it.
 **/

/**
 * In addition, your GPS now will give you the world's bounds by the new "getBounds" function.
 * Check the GPS docs by hovering over it.
 **/

// Can you get to the green tile without running into the Pedestrian?
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // Let's go - Sensor and GPS is upgraded
}
`;
const METADATA = {
    nextLevel: "/world",
    pedMoves: {
        "1": ["right", "right", "right", "right", "left", "left", "left", "left"],
        "2": ["left", "left", "right", "right"],
    },
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
