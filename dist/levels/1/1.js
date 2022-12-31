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
 * Alright!
 * You are finally graduated. 
 * Let's put your previous code into some chaotic test!
 * Rules are the same, but Pedestrians are now moving randomly.
 *
 * TIP: Don't forget to take bounds into account via "gps.getBounds()".
 * If a Pedestrian wants to move but they will be out of bounds, 
 * they will end up staying in the same location.
 **/

// Get to green tile without killing anyone 💀
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
    // Let's go
}
`;
const METADATA = {
    nextLevel: "/1/2",
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
