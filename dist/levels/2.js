"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODE = exports.METADATA = exports.GRID = void 0;
function randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function toKey(point) {
    return `${point.x},${point.y}`;
}
const width = 30;
const height = 30;
function randomPoint() {
    return {
        x: randomIntInclusive(0, width - 1),
        y: randomIntInclusive(0, height - 1),
    };
}
const start = randomPoint();
const pedCount = 1;
const spy = 0;
const exists = new Set([toKey(start)]);
for (let i = 0; i < pedCount; i++) {
    while (true) {
        const p = randomPoint();
        if (!exists.has(toKey(p))) {
            exists.add(toKey(p));
            break;
        }
    }
}
exports.GRID = [];
let c = 0;
for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
        if (exists.has(toKey({ x: i, y: j }))) {
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
    exports.GRID.push(row);
}
exports.GRID[start.x][start.y] = "S";
exports.METADATA = {
    nextLevel: "/3",
};
exports.DEFAULT_CODE = `/**
 * Alright! Let's shift gears and play capture the flag.
 * Right now, the Pedestrian is the target and we want to catch them.
 * 
 * Rules of the game:
 * [1] You have to catch the target by moving into the same Point.
 * [2] If you do not move and they mvoe into the same Point as you, you do not win.
 * [3] You lose if you move out of bounds.
 * 
 * Try to win with the least number of moves as possible!
 **/

type Sensor = {
    getPedestrians: () => Pedestrian[]
    getRoads: () => Point[] 
}
type GPS = {
    getBounds: () => Point
    getLocation: () => Point
}

type DataStore = {
    has(key: string): boolean
    get(key: string): string | undefined
    set(key: string, value: string): void
};

type Direction = {
    up: () => void 
    left: () => void
    down: () => void 
    right: () => void
}

type Pedestrian = {
    location: Point;
    direction: "up" | "down" | "left" | "right" | "static";
};

type Point = {
    x: number
    y: number
}
  
// Game loop: your code goes here!
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {

}
`;
