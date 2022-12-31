"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedestrian = void 0;
exports.Pedestrian = {
    definition: [
        `/**
    * A \`Pedestrian\' is a live object on the grid positioned at a \'location\`, which is a \`Point\`.
    * \`Pedestrian\`s have a \`direction\`, which shows you where they are headed in the next \`gameLoop\` turn.
    * If they are \`static\`, they will stay at the same \`location\`.
    * Otherwise they _try_ to move one square towards the \`direction\`.
    * They can go to any square (including gray ones) but they can't go out of bounds.
    * After they move, they might change the direction for the next turn.
    * Some \`Pedestrian\`s will move in patterns and some will move randomly.
    **/
   type Pedestrian = {
       location: Point;
       direction: "up" | "down" | "left" | "right" | "static";
   };`,
    ].join("\n"),
    filepath: "inmemory://model/common/Pedestrian.d.ts",
};
exports.default = exports.Pedestrian;
