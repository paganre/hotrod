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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODE = exports.getOutputs = exports.getInputs = exports.METADATA = exports.OUTPUTS = exports.INPUTS = exports.GRID = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.GRID = [];
exports.INPUTS = [];
exports.OUTPUTS = [];
exports.METADATA = {
    type: "canvas",
};
const getInputs = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.INPUTS.length > 0) {
            return exports.INPUTS;
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
            exports.INPUTS.push(input);
        }
        yield fs.readFile(path.join(__dirname, "./last_frame.json"), "utf8", (error, json) => {
            if (error) {
                console.log(error);
                return;
            }
            try {
                const frame = JSON.parse(json);
                exports.INPUTS.push(frame);
            }
            catch (error) {
                console.log(error);
            }
        });
        return exports.INPUTS;
    });
};
exports.getInputs = getInputs;
const getOutputs = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.OUTPUTS.length > 0) {
            return exports.OUTPUTS;
        }
        const inputs = yield (0, exports.getInputs)();
        for (let k = 0; k < inputs.length; k++) {
            const output = [];
            for (let i = 0; i < 100; i++) {
                const row = [];
                output.push(row);
                for (let j = 0; j < 100; j++) {
                    row.push(inputs[k][i][j]);
                }
            }
            exports.OUTPUTS.push(output);
        }
        return exports.OUTPUTS;
    });
};
exports.getOutputs = getOutputs;
exports.DEFAULT_CODE = `/**
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
