import { LibraryDefinition } from "../types";

export const Direction: LibraryDefinition = {
  definition: [
    `/**
        * \`Direction\` API is how you control **HotRod**.
        * Which is (you guessed it) the red dot on the Simulator.
        * 
        * - \`direction.up()\` will move HotRod one square up
        * - \`direction.left()\` will move HotRod one square left
        * - \`direction.down()\` will move HotRod one square down
        * - \`direction.right()\` will move HotRod one square right
        * 
        **/
       type Direction = {
           up: () => void 
           left: () => void
           down: () => void
           right: () => void
       } `,
  ].join("\n"),
  filepath: "inmemory://model/common/Direction.d.ts",
};

export const getDirection = function (rateLimit: number): LibraryDefinition {
  return {
    definition: [
      `/**
        * \`Direction\` API is how you control **HotRod**.
        * Which is (you guessed it) the red dot on the Simulator.
        * 
        * - \`direction.up()\` will move **HotRod** one square up
        * - \`direction.left()\` will move **HotRod** one square left
        * - \`direction.down()\` will move **HotRod** one square down
        * - \`direction.right()\` will move **HotRod** one square right
        * 
        * \`Direction\` API is now **[rate-limited](https://en.wikipedia.org/wiki/Rate_limiting)**.
        * You can only call it ${rateLimit} time${
        rateLimit > 1 ? "s" : ""
      } inside the \`gameLoop\`.
        * So you can only move the **HotRod** ${rateLimit} time${
        rateLimit > 1 ? "s" : ""
      } per turn.
        * If you call it more than ${rateLimit} time${
        rateLimit > 1 ? "s" : ""
      }, only the first ${rateLimit} call${
        rateLimit > 1 ? "s" : ""
      } will be executed.
        * 
        **/
       type Direction = {
           up: () => void 
           left: () => void
           down: () => void
           right: () => void
       } `,
    ].join("\n"),
    filepath: "inmemory://model/common/Direction.d.ts",
  };
};

export default Direction;
