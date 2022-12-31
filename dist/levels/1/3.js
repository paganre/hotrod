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
const sensor_1 = require("../../apis/sensor");
const p = __importStar(require("../../apis/point"));
const levelHelpers_1 = require("../../helpers/levelHelpers");
const world_1 = require("../../world");
const getGrid = function (worldData) {
    const width = 30;
    const height = 30;
    const start = (0, levelHelpers_1.randomPoint)(width, height);
    const pedCount = 30;
    const spy = (0, levelHelpers_1.randomIntInclusive)(0, 29);
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
const getDefaultCode = function (worldData) {
    const code = [
        `/** 
 * Ok, let's make it a bit more interesting now.
 * One of the Pedestrians here is not a real pedestrian, but a Spy.
 * He stole the plans of your Sensor and now you need to retrieve it back.
 **/`,
    ];
    if ((0, world_1.isLevelDone)(worldData, "S", 1)) {
        code.push(`
/** 
 * Fortunately, your Sensor is upgraded! 
 * But it is still not enough to know which Pedestrian is the spy.
 * However, it is able to sense if the stolen plans are within 10 squares of you,
 * using Manhattan Distance (see "https://en.wikipedia.org/wiki/Taxicab_geometry").
 * Check out Sensor API docs again!
 **/
`);
    }
    else {
        code.push(`
/** 
 * You have no way to know which one is the Spy. 
 * You might want to go back to the World and see if you can upgrade your Sensor first.
 **/
`);
    }
    code.push(`/**
 * Rules of the game:
 * [1] You need to catch the Spy by running into their location.
 * [2] If you don't move and the Spy enters your location, you do not win.
 * [3] If you run into any other Pedestrian you lose.
 * [4] If a Pedestrian runs into you while you are not moving, you do not lose.
 * [5] If you are out of bounds, you lose.
 * 
 * Try to win at the shortest time possible!
 **/
  
// Game loop: your code goes here!
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {

}
`);
    return code.join("\n");
};
const getLibraries = function (worldData) {
    return [
        (0, direction_1.getDirection)(1),
        (0, gps_1.getGPS)(["getBounds", "getLocation"]),
        (0, sensor_1.getSensor)(worldData),
        datastore_1.default,
        p.Point,
        pedestrian_1.default,
    ];
};
const getMetadata = function (worldData) {
    return {
        Sensor: {
            isTargetClose: 10,
        },
        nextLevel: "/1/4",
    };
};
const getLevel = function (worldData) {
    return {
        grid: getGrid(worldData),
        code: getDefaultCode(worldData),
        libraries: getLibraries(worldData),
        metadata: getMetadata(worldData),
    };
};
exports.getLevel = getLevel;
