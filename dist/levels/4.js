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
const pedCount = 30;
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
};
exports.DEFAULT_CODE = `/**
 * Alright! Let's shift gears and play capture the flag.
 * 
 * One of the Pedestrians here is not a real pedestrian, but a spy.
 * He stole the plans of your Sensor and now you need to retrieve it back.
 * 
 * Unfortunately, your sensor is not powerful enough to know which Pedestrian is the spy.
 * However, it is able to sense if the stolen plans are within 10 squares of you,
 * using Manhattan Distance (see "https://en.wikipedia.org/wiki/Taxicab_geometry").
 * 
 * Rules of the game:
 * [1] You need to catch the spy by running into their location.
 * [2] If you are static and the Spy enters your location, you do not win.
 * [3] If you run into any other Pedestrian you lose.
 * [4] If a Pedestrian runs into you while you are not moving, you do not lose.
 * 
 * Try to win at the shortest time possible!
 **/

/**
 * Your Sensor is ugpraded!
 **/
type Sensor = {
    isTargetClose: () => boolean; // Returns "true" if the spy is within 10 squares of you.
    getPedestrians: () => Pedestrian[]; // Returns the Pedestrians on the map.
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
