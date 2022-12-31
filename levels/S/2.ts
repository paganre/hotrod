import * as fs from "fs";
import * as path from "path";
import DataStore from "../../apis/datastore";
import Input from "../../apis/input";
import Point from "../../apis/point";
import Printer from "../../apis/printer";
import { randomIntInclusive } from "../../helpers/levelHelpers";
import { LevelDefinition, WorldMetadata } from "../../types";
import { WorldState } from "../../world";

const INPUTS: number[][][] = [];
const OUTPUTS: number[][][] = [];
const METADATA: WorldMetadata = {
  type: "canvas",
  nextLevel: "/world",
};

const MAX_NUM = 10001;
const FIBO = [1n, 1n];
while (FIBO.length < MAX_NUM) {
  FIBO.push(FIBO[FIBO.length - 1] + FIBO[FIBO.length - 2]);
}

export const getInputs = async function (): Promise<number[][][]> {
  if (INPUTS.length > 0) {
    return INPUTS;
  }
  for (let i = 0; i < 10; i++) {
    const input: number[][] = [];
    for (let i = 0; i < 100; i++) {
      const row: number[] = [];
      input.push(row);
      for (let j = 0; j < 100; j++) {
        row.push(randomIntInclusive(1, MAX_NUM - 1));
      }
    }
    INPUTS.push(input);
  }
  await fs.readFile(
    path.join(__dirname, "./last_frame.json"),
    "utf8",
    (error, json) => {
      if (error) {
        console.log(error);
        return;
      }
      try {
        const frame = JSON.parse(json) as number[][];
        INPUTS.push(frame);
      } catch (error) {
        console.log(error);
      }
    }
  );
  return INPUTS;
};

export const getOutputs = async function (): Promise<number[][][]> {
  if (OUTPUTS.length > 0) {
    return OUTPUTS;
  }
  const inputs = await getInputs();
  for (let k = 0; k < inputs.length; k++) {
    const output: number[][] = [];
    for (let i = 0; i < 100; i++) {
      const row: number[] = [];
      output.push(row);
      for (let j = 0; j < 100; j++) {
        row.push(Number(FIBO[inputs[k][i][j]] % 255n));
      }
    }
    OUTPUTS.push(output);
  }
  return OUTPUTS;
};

const DEFAULT_CODE: string = `/**==================================== Your Prize ==================================== 
 * 
 * After you complete this level your Sensor will be upgraded to highlight Pedestrians.
 * 
 * "sensor.highlightPedestrian(3)" highlights the 3rd Pedestrian in the grid, 
 * making them larger than others and purple color.
 * 
 **====================================================================================**/

/**
 * In this level, you are going to map the input frame to printer output once again.
 * But this time there is some processing necessary.
 * Your output frame should be:
 * 
 * output[i][j] = fibonacci(input[i][j]) % 255
 * 
 * where 
 * fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)
 * and 
 * fibonacci(0) = fibonacci(1) = 1
 **/
async function gameLoop(input: Input, printer: Printer, data: DataStore) {
  // Let's go!
}
`;

export const getLevel = function (
  worldData: Omit<WorldState, "code">
): LevelDefinition {
  return {
    grid: [],
    code: DEFAULT_CODE,
    libraries: [Point, Printer, Input, DataStore],
    metadata: METADATA,
  };
};
