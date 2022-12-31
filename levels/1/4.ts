import DataStore from "../../apis/datastore";
import { getDirection } from "../../apis/direction";
import { getGPS } from "../../apis/gps";
import Pedestrian from "../../apis/pedestrian";
import { getSensor } from "../../apis/sensor";
import * as p from "../../apis/point";
import {
  Grid,
  LevelDefinition,
  LibraryDefinition,
  Point,
  WorldMetadata,
} from "../../types";
import { isLevelDone, WorldState } from "../../world";
import {
  randomPoint,
  randomIntInclusive,
  toKey,
} from "../../helpers/levelHelpers";

const getGrid = function (worldData: Omit<WorldState, "code">): Grid {
  const width = 30;
  const height = 30;
  const start: Point = randomPoint(width, height);
  const pedCount = 500;
  const spy = randomIntInclusive(0, 499);
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

export const METADATA = {
  Sensor: {
    isTargetClose: 10,
  },
  nextLevel: "/world",
};

export const DEFAULT_CODE: string = `/**
* Let's stress test your algorithm to the previous question.
* 
* Spy is in the Times Square on New Year's eve.
* Rules of the game is exactly the same, but it is a bit more crowded.
**/
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // Let's go
}
`;

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
    nextLevel: "/world",
  };
};

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: getGrid(worldData),
    code: DEFAULT_CODE,
    libraries: getLibraries(worldData),
    metadata: getMetadata(worldData),
  };
};
