import { LibraryDefinition } from "../types";
import { isLevelDone, WorldNamespace, WorldState } from "../world";

const ALL_SENSOR_FUNCTIONS = [
  "getRoads",
  "getPedestrians",
  "isTargetClose",
  "highlightPedestrian",
] as const;
export type SensorFunction = typeof ALL_SENSOR_FUNCTIONS[number];

type SensorFunctionDoc = { [F in SensorFunction]: string };
type SensorFunctionSign = { [F in SensorFunction]: string };
type SensorFunctionRequirement = {
  [F in SensorFunction]:
    | { namespace: WorldNamespace; level: number }
    | undefined;
};

const sensorFunctionDocs: SensorFunctionDoc = {
  highlightPedestrian: `\`sensor.highlightPedestrian(3)\` highlights the 3rd Pedestrian in the grid, making them larger than others and purple color.`,
  isTargetClose: `\`sensor.isTargetClose()\` returns \`true\` if a spy is within 10 squares of you, using [Manhattan Distance](https://en.wikipedia.org/wiki/Taxicab_geometry).`,
  getRoads: `\`sensor.getRoads()\` returns a list of available roads immediately around you, in the 4 squares you can move (up, down, left, right).`,
  getPedestrians: `\`sensor.getPedestrians()\` returns all of the \`Pedestrian\`s on the grid. This function returns the \`Pedestrian\`s in the same order at every call.`,
};

const sensorFunctionSigns: SensorFunctionSign = {
  highlightPedestrian: `highlightPedestrian(index: number) => void`,
  isTargetClose: `isTargetClose: () => boolean`,
  getRoads: `getRoads: () => Point[]`,
  getPedestrians: `getPedestrians: () => Pedestrian[]`,
};

const sensorFunctionRequirements: SensorFunctionRequirement = {
  highlightPedestrian: {
    namespace: "S",
    level: 2,
  },
  isTargetClose: {
    namespace: "S",
    level: 1,
  },
  getRoads: undefined,
  getPedestrians: undefined,
};

export const getSensor = function (
  worldData: Omit<WorldState, "code">
): LibraryDefinition {
  const definition: string[] = [
    `
/**
 * \`Sensor API\` gives you information about your immediate surroundings.
 * It is one of the most crucial APIs **HotRod** has and will get more and more powerful as you advance.
 * 
`,
  ];
  const availableSensorFunctions = ALL_SENSOR_FUNCTIONS.filter((f) => {
    const requirement = sensorFunctionRequirements[f];
    if (!requirement) {
      return true;
    }
    return isLevelDone(worldData, requirement.namespace, requirement.level);
  });
  // add function documents
  for (const f of availableSensorFunctions) {
    definition.push(` * - ${sensorFunctionDocs[f]}`);
  }
  definition.push(` **/`);
  // add function signatures
  definition.push(`type Sensor = {`);
  for (const f of availableSensorFunctions) {
    definition.push(`    ${sensorFunctionSigns[f]}`);
  }
  definition.push(`}`);
  return {
    definition: definition.join("\n"),
    filepath: "inmemory://model/common/Sensor.d.ts",
  };
};
