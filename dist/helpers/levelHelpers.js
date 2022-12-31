"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPoint = exports.toKey = exports.randomIntInclusive = void 0;
function randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomIntInclusive = randomIntInclusive;
function toKey(point) {
    return `${point.x},${point.y}`;
}
exports.toKey = toKey;
function randomPoint(width, height) {
    return {
        x: randomIntInclusive(0, width - 1),
        y: randomIntInclusive(0, height - 1),
    };
}
exports.randomPoint = randomPoint;
