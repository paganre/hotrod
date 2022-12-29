import * as fs from "fs";
import * as path from "path";

export const GRID: string[][] = [];
export const INPUTS: number[][][] = [];
export const OUTPUTS: number[][][] = [];
export const METADATA = {
  type: "canvas",
};

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
        if (Math.random() > 0.5) {
          row.push(255);
        } else {
          row.push(0);
        }
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
        row.push(inputs[k][i][j]);
      }
    }
    OUTPUTS.push(output);
  }
  return OUTPUTS;
};

export const DEFAULT_CODE: string = `/**
* Welcome to your first Sensor upgrade level!
* Your Sensor is an invaluable tool.
* As you solve these Sensor upgrade levels you will get access to new Sensor APIs.
*
* Some of the Sensor upgrades will be making your life easier and not absolutely necessary.
* However some of them are going to be necessary for solving certain levels.
* This level is one of those.
*
* Sensor levels will be of different types. You do not have your Hot Rod.
* You are now working with a computer terminal that is able to display very basic graphics.
* 
* You have access to only two APIs.
* First one is the Input API, which is rate-limited by 1 call per game loop execution.
* Input API will give you a frame input, which is a two-dimensional array of numbers.
* Each number is limited to the range [0, 255] corresponding to the grayscale pixel values.
* 
* Second one is the Printer API. It is not rate-limited.
* Printer API is used to put pixel values on your computer terminal.
*
* This is just an introductory level. 
* You need to print whatever you receive as your input frame exactly on the computer terminal.
* There is no processing necessary.
*
* After you complete this level, your Sensor will be upgraded to detect targets within a proximity.
**/

type Point = {
    x: number
    y: number
}

/**
 * Input is the first 'asynchronous' API that you receive.
 * It is used to receive your input frame for the puzzle and is rate-limited to 1 call per game loop.
 * Frame dimensions are exactly the same as your computer terminal dimensions.
 * 
 * example usage:
 * const frame: number[][] = await input.getFrame();
 * // frame.length -> number of rows on the terminal (maximum x value can be frame.length-1)
 * // frame[0].length -> number of columns on the terminal (maximum y value can be frame[0].length-1)
 * const pixelValue: number = frame[0][0] 
 * // pixelValue is a number between [0,255] and corresponds to top-left corner of the screen
 **/
type Input = {
    getFrame(): Promise<number[][]>
}

/**
 * Printer API is used to put pixel values on the computer terminal.
 * 
 * example usage:
 * const location: Point = {x: 10, y: 5};
 * printer.print(location, 125);
 * 
 * To print the whole screen, you will need to call priner.print for every pixel on the screen.
 * This will require you to loop through your input frame and print pixels for every location.
 **/
type Printer = {
    // location shows where you want to put the pixel on the computer terminal.
    // paint shows the grayscale pixel value and should be limited to [0, 255].
    print(location: Point, paint: number): void; 
}
    
// Notice the game loop function signature now contains the word 'async'.
// This is because you will need to call the async Input API.
async function gameLoop(input: Input, printer: Printer) {
  // Game loop: your code goes here!
}
`;
