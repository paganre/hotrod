import DataStore from "../../apis/datastore";
import { getDirection } from "../../apis/direction";
import { getGPS } from "../../apis/gps";
import Pedestrian from "../../apis/pedestrian";
import { getSensor } from "../../apis/sensor";
import * as p from "../../apis/point";
import {
  randomIntInclusive,
  randomPoint,
  toKey,
} from "../../helpers/levelHelpers";
import {
  Grid,
  LevelDefinition,
  LibraryDefinition,
  Point,
  WorldMetadata,
} from "../../types";
import { isLevelDone, WorldState } from "../../world";

const getGrid = function (worldData: Omit<WorldState, "code">): Grid {
  const width = 30;
  const height = 30;
  const start: Point = randomPoint(width, height);
  const pedCount = 30;
  const spy = randomIntInclusive(0, 29);
  const exists = new Set([toKey(start)]);
  for (let i = 0; i < pedCount; i++) {
    while (true) {
      const p = randomPoint(width, height);
      if (!exists.has(toKey(p))) {
        exists.add(toKey(p));
        break;
      }
    }
  }

  const GRID: Grid = [];
  let c = 0;
  for (let i = 0; i < height; i++) {
    const row: string[] = [];
    for (let j = 0; j < width; j++) {
      if (exists.has(toKey({ x: i, y: j }))) {
        if (i == start.x && j == start.y) {
          row.push("S");
        } else {
          if (c === spy) {
            row.push("PX");
          } else {
            row.push("P");
          }
          c += 1;
        }
      } else {
        row.push(" ");
      }
    }
    GRID.push(row);
  }
  GRID[start.x][start.y] = "S";
  return GRID;
};

const getDefaultCode = function (worldData: Omit<WorldState, "code">): string {
  const code: string[] = [
    `/** 
 * Ok, let's make it a bit more interesting now.
 * One of the Pedestrians here is not a real pedestrian, but a Spy.
 * He stole the plans of your Sensor and now you need to retrieve it back.
 **/`,
  ];
  if (isLevelDone(worldData, "S", 1)) {
    code.push(`
/** 
 * Fortunately, your Sensor is upgraded! 
 * But it is still not enough to know which Pedestrian is the spy.
 * However, it is able to sense if the stolen plans are within 10 squares of you,
 * using Manhattan Distance (see "https://en.wikipedia.org/wiki/Taxicab_geometry").
 * Check out Sensor API docs again!
 **/
`);
  } else {
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

const getLibraries = function (
  worldData: Omit<WorldState, "code">
): LibraryDefinition[] {
  return [
    getDirection(1),
    getGPS(["getBounds", "getLocation"]),
    getSensor(worldData),
    DataStore,
    p.Point,
    Pedestrian,
  ];
};

const getMetadata = function (
  worldData: Omit<WorldState, "code">
): WorldMetadata {
  return {
    Sensor: {
      isTargetClose: 10,
    },
    nextLevel: "/1/4",
  };
};

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: getGrid(worldData),
    code: getDefaultCode(worldData),
    libraries: getLibraries(worldData),
    metadata: getMetadata(worldData),
  };
};
