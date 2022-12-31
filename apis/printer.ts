import { LibraryDefinition } from "../types";

export const Printer: LibraryDefinition = {
  definition: [
    `/**
    * Printer API is used to put pixel values on the computer terminal.
    * 
    * ### Example usage:
    * \`\`\`
    * const location: Point = {x: 10, y: 5};
    * printer.print(location, 125);
    * \`\`\`
    * To print the whole screen, you will need to call priner.print for every pixel on the screen.
    * This will require you to loop through your input frame and print pixels for every location.
    * 
    **/
    type Printer = {
        print(location: Point, paint: number): void; 
    }`,
  ].join("\n"),
  filepath: "inmemory://model/common/Printer.d.ts",
};
export default Printer;
