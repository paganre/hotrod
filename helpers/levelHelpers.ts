import { Point } from "../types";

export function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function toKey(point: Point): string {
  return `${point.x},${point.y}`;
}

export function randomPoint(width: number, height: number) {
  return {
    x: randomIntInclusive(0, width - 1),
    y: randomIntInclusive(0, height - 1),
  };
}
