import DataStore from "../../apis/datastore";
import { getDirection } from "../../apis/direction";
import { getGPS } from "../../apis/gps";
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
  ["W", "W", " ", " ", " ", "W", "W", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", "W", "E", " ", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
  ["W", "W", " ", "W", " ", "W", " ", " ", " ", " "],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
  ["W", "W", " ", "W", " ", " ", " ", "W", "W", "W"],
  ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
];

const getDefinitions = function (
  worldData: Omit<WorldState, "code">
): LibraryDefinition[] {
  return [
    getDirection(1),
    getGPS(["getLocation"]),
    getSensor(worldData),
    DataStore,
    Point,
  ];
};

const DEFAULT_CODE: string = `/**
 * Alright, let's get serious. 
 * Now let's do a maze that is a little bit more complicated.
 * First, let's define some essentials.
**/

/**
 * First one is the "Point", which corresponds to a point on the grid.
 * "x" is the row and "y" is the column. 
 * As you go down "x" increases and as you go right "y" increases.
 **/

/**
 * Now, on top of the Direction, let's define a few more APIs you can use.
 * 
 * GPS gives information about the world.
 * You can get your location on the grid using it.
 * 
 * Sensor API gives you information about your immediate surroundings.
 * 
 * Lastly you can use "DataStore" to store and use data in subsequent game-loop calls.
 **/

function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
    // your code goes here.
} 
`;

const METADATA: WorldMetadata = {
  nextLevel: "/playground/4",
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
