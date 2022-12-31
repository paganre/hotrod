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
exports.getLevel = exports.DEFAULT_CODE = exports.METADATA = void 0;
const datastore_1 = __importDefault(require("../../apis/datastore"));
const direction_1 = require("../../apis/direction");
const gps_1 = require("../../apis/gps");
const pedestrian_1 = __importDefault(require("../../apis/pedestrian"));
const sensor_1 = require("../../apis/sensor");
const p = __importStar(require("../../apis/point"));
const levelHelpers_1 = require("../../helpers/levelHelpers");
const getGrid = function (worldData) {
    const width = 30;
    const height = 30;
    const start = (0, levelHelpers_1.randomPoint)(width, height);
    const pedCount = 500;
    const spy = (0, levelHelpers_1.randomIntInclusive)(0, 499);
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
exports.METADATA = {
    Sensor: {
        isTargetClose: 10,
    },
    nextLevel: "/world",
};
exports.DEFAULT_CODE = `/**
* Let's stress test your algorithm to the previous question.
* 
* Spy is in the Times Square on New Year's eve.
* Rules of the game is exactly the same, but it is a bit more crowded.
**/
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // Let's go
}
`;
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
        nextLevel: "/world",
    };
};
const getLevel = function (worldData) {
    return {
        grid: getGrid(worldData),
        code: exports.DEFAULT_CODE,
        libraries: getLibraries(worldData),
        metadata: getMetadata(worldData),
    };
};
exports.getLevel = getLevel;
