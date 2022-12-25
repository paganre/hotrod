import { Pedestrian, Point, World } from "../types";

export const checkEndCondition = function (
  world: World,
  loc: Point,
  gr: string[][]
): { ended: boolean; result: string; won: boolean } {
  if (world.metadata.type === "canvas") {
    if (world.done) {
      return {
        ended: true,
        result: world.error ? world.error : "Done!",
        won: world.error === "",
      };
    }
    return {
      ended: false,
      result: "",
      won: false,
    };
  }
  if (loc.x < 0 || loc.y < 0 || loc.x >= gr.length || loc.y >= gr[0].length) {
    return {
      ended: true,
      result: "Game Over. You are out of bounds.",
      won: false,
    };
  } else {
    const r = gr[loc.x][loc.y];
    if (r === "E") {
      return {
        ended: true,
        result: "You win!",
        won: true,
      };
    }
    if (r === "W") {
      return {
        ended: true,
        result: "Game Over. You hit a wall.",
        won: false,
      };
    }
  }
  if (
    !(
      world.previousLocation.x === world.location.x &&
      world.previousLocation.y === world.location.y
    )
  ) {
    // hot rod moved this turn
    const peds = world.pedestrians.filter(
      (p) => p.location.x === loc.x && p.location.y === loc.y
    );
    if (peds.length) {
      const targets = peds.filter((p) => p.target);
      if (targets.length === peds.length) {
        return {
          ended: true,
          result: "Nice! Caught the target!",
          won: true,
        };
      }
      return {
        ended: true,
        result: "Game Over. You hit a Pedestrian.",
        won: false,
      };
    }
  }
  return {
    ended: world.metadata.executeOnce ? true : false,
    result: world.metadata.executeOnce ? "Can't reach it!" : "",
    won: false,
  };
};

export const simulateWorld = function (world: World) {
  for (const ped of world.pedestrians) {
    switch (ped.direction) {
      case "down":
        if (ped.location.x < world.grid.length - 1) {
          ped.location.x += 1;
        }
        break;
      case "up":
        if (ped.location.x > 0) {
          ped.location.x -= 1;
        }
        break;
      case "left":
        if (ped.location.y > 0) {
          ped.location.y -= 1;
        }
        break;
      case "right":
        if (ped.location.y < world.grid[0].length - 1) {
          ped.location.y += 1;
        }
        break;
    }
    const dirs = [
      "up",
      "down",
      "left",
      "right",
      "static",
    ] as Pedestrian["direction"][];
    if (ped.moves && ped.moves.length > 0 && ped.moveIndex !== undefined) {
      ped.direction = ped.moves[ped.moveIndex];
      ped.moveIndex = (ped.moveIndex + 1) % ped.moves.length;
    } else {
      ped.direction = dirs[Math.floor(Math.random() * dirs.length)];
    }
  }
};
