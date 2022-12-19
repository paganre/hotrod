"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA = exports.DEFAULT_CODE = exports.GRID = void 0;
exports.GRID = [
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
exports.DEFAULT_CODE = `/**
 * Wow, you did it. Let's do it again.
 * But this time let's introduce the "Game Loop".
 * 
 * First of all, notice that your function's name is
 * "gameLoop" and not "main".
 * 
 * You are now coding what you want HotRod to do in a single turn.
 * The function "gameLoop" will be called until an end condition is reached.
 **/

/**
 * Direction is now rate-limited (https://en.wikipedia.org/wiki/Rate_limiting).
 * You can only call it once inside the gameLoop.
 * So you can only move the HotRod once per turn.
 * If you call it more than once, only the first call will be executed.
 **/
type Direction = {
    up: () => void // Move HotRod one square up
    left: () => void // Move HotRod one square left
    down: () => void // Move HotRod one square down
    right: () => void // Move HotRod one square right
} 

// Let's go!
function gameLoop(direction: Direction) {
    // your code goes here.
}
`;
exports.METADATA = {
    nextLevel: "/playground/3",
};
