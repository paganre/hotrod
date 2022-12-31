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
const datastore_1 = __importDefault(require("../../apis/datastore"));
const input_1 = __importDefault(require("../../apis/input"));
const point_1 = __importDefault(require("../../apis/point"));
const printer_1 = __importDefault(require("../../apis/printer"));
const levelHelpers_1 = require("../../helpers/levelHelpers");
const INPUTS = [];
const OUTPUTS = [];
const METADATA = {
    type: "canvas",
    nextLevel: "/world",
};
const MAX_NUM = 10001;
const FIBO = [1n, 1n];
while (FIBO.length < MAX_NUM) {
    FIBO.push(FIBO[FIBO.length - 1] + FIBO[FIBO.length - 2]);
}
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
                row.push((0, levelHelpers_1.randomIntInclusive)(1, MAX_NUM - 1));
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
                row.push(Number(FIBO[inputs[k][i][j]] % 255n));
            }
        }
        OUTPUTS.push(output);
    }
    return OUTPUTS;
};
exports.getOutputs = getOutputs;
const DEFAULT_CODE = `/**==================================== Your Prize ==================================== 
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
const getLevel = function (worldData) {
    return {
        grid: [],
        code: DEFAULT_CODE,
        libraries: [point_1.default, printer_1.default, input_1.default, datastore_1.default],
        metadata: METADATA,
    };
};
exports.getLevel = getLevel;
