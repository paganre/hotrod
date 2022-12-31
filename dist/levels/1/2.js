"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = void 0;
const datastore_1 = __importDefault(require("../../apis/datastore"));
const direction_1 = require("../../apis/direction");
const gps_1 = require("../../apis/gps");
const pedestrian_1 = __importDefault(require("../../apis/pedestrian"));
const p = __importStar(require("../../apis/point"));
const sensor_1 = require("../../apis/sensor");
const levelHelpers_1 = require("../../helpers/levelHelpers");
const getGrid = function () {
    const width = 30;
    const height = 30;
    const start = (0, levelHelpers_1.randomPoint)(width, height);
    const pedCount = 1;
    const spy = 0;
    const exists = new Set([(0, levelHelpers_1.toKey)(start)]);
    for (let i = 0; i < pedCount; i++) {
        while (true) {
            const p = (0, levelHelpers_1.randomPoint)(width, height);
            if (!exists.has((0, levelHelpers_1.toKey)(p))) {
                exists.add((0, levelHelpers_1.toKey)(p));
                break;
            }
        }
    }
    const GRID = [];
    let c = 0;
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            if (exists.has((0, levelHelpers_1.toKey)({ x: i, y: j }))) {
                if (i == start.x && j == start.y) {
                    row.push("S");
                }
                else {
                    if (c === spy) {
                        row.push("PX");
                    }
                    else {
                        row.push("P");
                    }
                    c += 1;
                }
            }
            else {
                row.push(" ");
            }
        }
        GRID.push(row);
    }
    GRID[start.x][start.y] = "S";
    return GRID;
};
const METADATA = {
    nextLevel: "/1/3",
};
const getDefinitions = function (worldData) {
    return [
        (0, direction_1.getDirection)(1),
        (0, gps_1.getGPS)(["getBounds", "getLocation"]),
        (0, sensor_1.getSensor)(worldData),
        datastore_1.default,
        p.Point,
        pedestrian_1.default,
    ];
};
const DEFAULT_CODE = `/**
 * Alright! Let's shift gears and play capture the flag 🏁
 * Right now, the Pedestrian is the target and we want to catch them.
 * 
 * Rules of the game:
 * [1] You have to catch the target by moving into the same Point.
 * [2] If you do not move and they mvoe into the same Point as you, you do not win.
 * [3] You lose if you move out of bounds.
 * 
 * Try to win with the least number of moves as possible!
 **/
  
// Game loop: your code goes here!
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // Let's go!
}
`;
const getLevel = function (worldData) {
    return {
        grid: getGrid(),
        code: DEFAULT_CODE,
        libraries: getDefinitions(worldData),
        metadata: METADATA,
    };
};
exports.getLevel = getLevel;
