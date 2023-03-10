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
const pedCount = 500;
const spy = randomIntInclusive(0, 29);
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
    Sensor: {
        isTargetClose: 10,
    },
    nextLevel: "/5",
};
exports.DEFAULT_CODE = `/**
* Let's stress test your algorithm to the previous question.
* 
* Spy is in the Times Square on New Year's eve.
* Rules of the game is exactly the same, but it is a bit more crowded.
**/

/**
 * Your Sensor is upgraded once more.
 * You can now highlight a Pedestrian to see them better on the map.
 * Use this once you think you have identified the Spy.
 **/
type Sensor = {
    highlightPedestrian: (index: number) => void // Highlights the Pedestrian
    isTargetClose: () => boolean;
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
