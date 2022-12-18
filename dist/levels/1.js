"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODE = exports.GRID = void 0;
exports.GRID = [
    ["W", "W", "E", "W", "W"],
    ["W", "W", " ", "W", "W"],
    ["W", "W", " ", "W", "W"],
    ["W", "W", " ", "W", "W"],
    ["W", "W", "S", "W", "W"],
];
exports.DEFAULT_CODE = `/**
 * Your first mission is to get to the green square.
 * If you end up in dark squares, you lose.
 * You only have a single API you can use for this level, let's define it.
 **/

/**
 * Direction is how you control your hot-rod
 * It is pretty simple, but do not end up in dark squares or you lose!
 **/
type Direction = {
    up: () => void // Move hot-rod one square up
    left: () => void // Move hot-rod one square left
    down: () => void // Move hot-rod one square down
    right: () => void // Move hot-rod one square right
} 

// Let's go!
function gameLoop(direction: Direction) {
    // your code goes here. this will be executed at turn by turn.
}


`;
