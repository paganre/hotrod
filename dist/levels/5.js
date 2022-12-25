"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODE = exports.OUTPUTS = exports.INPUTS = exports.METADATA = exports.GRID = void 0;
exports.GRID = [];
exports.METADATA = {
    type: "canvas",
    input: "/input/5",
};
exports.INPUTS = [];
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
exports.OUTPUTS = [];
for (let k = 0; k < exports.INPUTS.length; k++) {
    const output = [];
    for (let i = 0; i < 100; i++) {
        const row = [];
        output.push(row);
        for (let j = 0; j < 100; j++) {
            row.push(exports.INPUTS[k][i][j]);
        }
    }
    exports.OUTPUTS.push(output);
}
exports.DEFAULT_CODE = `/**
* Painting class
**/

type Point = {
    x: number
    y: number
}

type Printer = {
    print(location: Point, paint: number): void;
}

type Input = {
    getFrame(): Promise<number[][]>
}

type DataStore = {
    has(key: string): boolean
    get(key: string): string | undefined
    set(key: string, value: string): void
};
    
// Game loop: your code goes here!
async function gameLoop(input: Input, printer: Printer, data: DataStore) {

}
`;
