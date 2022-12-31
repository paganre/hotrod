"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = void 0;
const direction_1 = __importDefault(require("../../apis/direction"));
const GRID = [
    ["W", "W", "W", "W", "W", "W", "W", "W", "W"],
    ["W", " ", " ", " ", "E", " ", " ", " ", " "],
    ["W", " ", " ", " ", " ", " ", " ", " ", " "],
    ["W", " ", " ", " ", " ", " ", " ", " ", " "],
    ["W", " ", " ", " ", " ", " ", " ", " ", " "],
    ["W", " ", " ", " ", " ", " ", " ", " ", " "],
    ["W", " ", " ", " ", " ", " ", " ", " ", " "],
    ["W", " ", " ", " ", "S", " ", " ", " ", " "],
    ["W", "W", "W", "W", "W", "W", "W", "W", "W"],
];
const DEFINITIONS = [direction_1.default];
const DEFAULT_CODE = `/**
* Welcome to HotRod.
* An exciting adventure in Typescript that will blow your mind.
* These are the playground levels, where you will learn the very basics.
**/

/**
 * Goal is to get to the green tile.
 * Be careful: avoid the gray tiles and do not go out of bounds.
 * You need to use the input \`Direction\` API.
 * Hover over it to see its definition and how to use it!
 **/
function main(direction: Direction) {
    // your code goes here.
}
`;
const METADATA = {
    executeOnce: true,
    nextLevel: "/playground/2",
    rateLimitOverrides: {
        direction: 0,
    },
};
const getLevel = function (worldData) {
    return {
        grid: GRID,
        code: DEFAULT_CODE,
        libraries: DEFINITIONS,
        metadata: METADATA,
    };
};
exports.getLevel = getLevel;
