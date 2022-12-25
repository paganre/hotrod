export const GRID: string[][] = [];
export const METADATA = {
  type: "canvas",
  input: "/input/5",
};

export const INPUTS: number[][][] = [];

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

export const OUTPUTS: number[][][] = [];
for (let k = 0; k < INPUTS.length; k++) {
  const output: number[][] = [];
  for (let i = 0; i < 100; i++) {
    const row: number[] = [];
    output.push(row);
    for (let j = 0; j < 100; j++) {
      row.push(INPUTS[k][i][j]);
    }
  }
  OUTPUTS.push(output);
}

export const DEFAULT_CODE: string = `/**
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
