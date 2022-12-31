import { LibraryDefinition } from "../types";

export type GPSFunction = "getLocation" | "getBounds";

type GPSFunctionDoc = { [F in GPSFunction]: string };
type GPSFunctionSign = { [F in GPSFunction]: string };

const gpsFunctionDocs: GPSFunctionDoc = {
  getBounds: `\`gps.getBounds()\` returns the grid's bounds as a \`Point\`. \`x\` will be the maximum row and \`y\` will be the maximum column.`,
  getLocation: `\`gps.getLocation()\` returns your **HotRod**'s location as a \`Point\` on the grid.`,
};
const gpsFunctionSigns: GPSFunctionSign = {
  getBounds: `getBounds: () => Point;`,
  getLocation: `getLocation: () => Point;`,
};

export const getGPS = function (
  gpsFunctions: GPSFunction[]
): LibraryDefinition {
  const definition: string[] = [
    `
/**
 * [\`GPS\`](https://en.wikipedia.org/wiki/Global_Positioning_System) API gives information about the world.
 *  
`,
  ];
  // add function documents
  for (const f of gpsFunctions) {
    definition.push(` * - ${gpsFunctionDocs[f]}`);
  }
  definition.push(` **/`);
  // add function signatures
  definition.push(`type GPS = {`);
  for (const f of gpsFunctions) {
    definition.push(`    ${gpsFunctionSigns[f]}`);
  }
  definition.push(`}`);
  return {
    definition: definition.join("\n"),
    filepath: "inmemory://model/common/GPS.d.ts",
  };
};
