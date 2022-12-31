"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGPS = void 0;
const gpsFunctionDocs = {
    getBounds: `\`gps.getBounds()\` returns the grid's bounds as a \`Point\`. \`x\` will be the maximum row and \`y\` will be the maximum column.`,
    getLocation: `\`gps.getLocation()\` returns your **HotRod**'s location as a \`Point\` on the grid.`,
};
const gpsFunctionSigns = {
    getBounds: `getBounds: () => Point;`,
    getLocation: `getLocation: () => Point;`,
};
const getGPS = function (gpsFunctions) {
    const definition = [
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
exports.getGPS = getGPS;
