import DataStore from "../../apis/datastore";
import { getDirection } from "../../apis/direction";
import { getGPS } from "../../apis/gps";
import Pedestrian from "../../apis/pedestrian";
import * as p from "../../apis/point";
import { getSensor } from "../../apis/sensor";
import { randomPoint, toKey } from "../../helpers/levelHelpers";
import {
  Grid,
  LevelDefinition,
  LibraryDefinition,
  Point,
  WorldMetadata,
} from "../../types";
import { WorldState } from "../../world";

const getGrid = function (): Grid {
  const width = 30;
  const height = 30;
  const start: Point = randomPoint(width, height);
  const pedCount = 1;
  const spy = 0;
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

  const GRID: string[][] = [];
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

const METADATA: WorldMetadata = {
  nextLevel: "/1/3",
};

const getDefinitions = function (
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

const DEFAULT_CODE: string = `/**
 * Alright! Let's shift gears and play capture the flag 🏁
 * Right now, the Pedestrian is the target and we want to catch them.
 * 
 * Rules of the game:
 * [1] You have to catch the target by moving into the same Point.
 * [2] If you do not move and they mvoe into the same Point as you, you do not win.
 * [3] You lose if you move out of bounds.
 * 
 * Try to win with the least number of moves as possible!
 **/
  
// Game loop: your code goes here!
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // Let's go!
}
`;

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: getGrid(),
    code: DEFAULT_CODE,
    libraries: getDefinitions(worldData),
    metadata: METADATA,
  };
};
