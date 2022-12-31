"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStore = void 0;
exports.DataStore = {
    definition: [
        `/**
    * You can use \`DataStore\` API to store and use data in subsequent \`gameLoop\` calls. 
    * You will need to handle the serialization and deserialization of data,
    * as it only accepts and returns strings.
    * 
    * - \`data.has("key")\` returns if the key is in the data store.
    * - \`data.get("key")\`  returns the value of the key if it exists, otherwise \`undefined\`.
    * - \`data.set("key", "value")\` sets the value for the key.
    * 
    * \`DataStore\` API has no rate-limits.
    * ### Example usage to store data:
    * 
    * \`\`\`
    * const seenPoints = ["1,1", "2,2"]
    * data.set("seenPoints", JSON.stringify(seenPoints))
    * \`\`\`
    * 
    * ### Example usage to retrieve data:
    * 
    * \`\`\`
    * let lastPoint: Point = {x: 0, y: 0}
    * if (data.has("lastPoint")) {
    *    lastPoint = JSON.parse(data.get("lastPoint")) as Point
    * }
    * \`\`\`
    **/
   type DataStore = {
       has(key: string): boolean
       get(key: string): string | undefined
       set(key: string, value: string): void
   };`,
    ].join("\n"),
    filepath: "inmemory://model/common/DataStore.d.ts",
};
exports.default = exports.DataStore;
