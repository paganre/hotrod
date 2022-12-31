"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevel = exports.getOutputs = exports.getInputs = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const input_1 = __importDefault(require("../../apis/input"));
const point_1 = __importDefault(require("../../apis/point"));
const printer_1 = __importDefault(require("../../apis/printer"));
const INPUTS = [];
const OUTPUTS = [];
const METADATA = {
    type: "canvas",
    nextLevel: "/world",
};
const getInputs = async function () {
    if (INPUTS.length > 0) {
        return INPUTS;
    }
    for (let i = 0; i < 10; i++) {
        const input = [];
        for (let i = 0; i < 100; i++) {
            const row = [];
            input.push(row);
            for (let j = 0; j < 100; j++) {
                if (Math.random() > 0.5) {
                    row.push(255);
                }
                else {
                    row.push(0);
                }
            }
        }
        INPUTS.push(input);
    }
    await fs.readFile(path.join(__dirname, "./last_frame.json"), "utf8", (error, json) => {
        if (error) {
            console.log(error);
            return;
        }
        try {
            const frame = JSON.parse(json);
            INPUTS.push(frame);
        }
        catch (error) {
            console.log(error);
        }
    });
    return INPUTS;
};
exports.getInputs = getInputs;
const getOutputs = async function () {
    if (OUTPUTS.length > 0) {
        return OUTPUTS;
    }
    const inputs = await (0, exports.getInputs)();
    for (let k = 0; k < inputs.length; k++) {
        const output = [];
        for (let i = 0; i < 100; i++) {
            const row = [];
            output.push(row);
            for (let j = 0; j < 100; j++) {
                row.push(inputs[k][i][j]);
            }
        }
        OUTPUTS.push(output);
    }
    return OUTPUTS;
};
exports.getOutputs = getOutputs;
const DEFAULT_CODE = `/**==================================== Your Prize ==================================== 
 * 
 * After you complete this level your Sensor will be upgraded to detect targets.
 * 
 * "sensor.isTargetClose()" returns "true" if a spy is within 10 squares of you,
 * using [Manhattan Distance](https://en.wikipedia.org/wiki/Taxicab_geometry).
 * 
 **====================================================================================**/

/**
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
 * Once all the inputs are processed your level will be completed.
  **/

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

/**
 * Printer API is used to put pixel values on the computer terminal.
 * 
 * example usage:
 * const location: Point = {x: 10, y: 5};
 * printer.print(location, 125);
 **/
    
// Notice the game loop function signature now contains the word 'async'.
// This is because you will need to call the async Input API.
async function gameLoop(input: Input, printer: Printer) {
  // Game loop: your code goes here!
}
`;
const getLevel = function (worldData) {
    return {
        grid: [],
        code: DEFAULT_CODE,
        libraries: [point_1.default, printer_1.default, input_1.default],
        metadata: METADATA,
    };
};
exports.getLevel = getLevel;
