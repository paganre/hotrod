import DataStore from "../../apis/datastore";
import { getDirection } from "../../apis/direction";
import { getGPS } from "../../apis/gps";
import Pedestrian from "../../apis/pedestrian";
import Point from "../../apis/point";
import { getSensor } from "../../apis/sensor";
import {
  Grid,
  LevelDefinition,
  LibraryDefinition,
  WorldMetadata,
} from "../../types";
import { WorldState } from "../../world";

const GRID: Grid = [
  ["W", "W", "P", "P", "P", "W", "W", "W", "W", "W"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "W"],
  ["W", "W", "P", "W", "P", "W", "W", "E", "P", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
  ["W", "W", "P", "W", "P", "W", "P", "P", "P", "P"],
  ["W", "W", "P", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
  ["W", "W", " ", "W", "P", "P", "P", "W", "W", "W"],
  ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
];

const getDefinitions = function (
  worldData: Omit<WorldState, "code">
): LibraryDefinition[] {
  return [
    getDirection(1),
    getGPS(["getBounds", "getLocation"]),
    getSensor(worldData),
    DataStore,
    Point,
    Pedestrian,
  ];
};

const DEFAULT_CODE: string = `/**
 * Alright!
 * You are finally graduated. 
 * Let's put your previous code into some chaotic test!
 * Rules are the same, but Pedestrians are now moving randomly.
 *
 * TIP: Don't forget to take bounds into account via "gps.getBounds()".
 * If a Pedestrian wants to move but they will be out of bounds, 
 * they will end up staying in the same location.
 **/

// Get to green tile without killing anyone 💀
function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
    // Let's go
}
`;

const METADATA: WorldMetadata = {
  nextLevel: "/1/2",
};

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: GRID,
    code: DEFAULT_CODE,
    libraries: getDefinitions(worldData),
    metadata: METADATA,
  };
};
