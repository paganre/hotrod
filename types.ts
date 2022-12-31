export type Grid = string[][];

export type LibraryDefinition = {
  definition: string;
  filepath: string;
};

export type Point = {
  x: number;
  y: number;
};

export type Level = {
  location: Point;
  title?: string;
  style?: { [key: string]: string };
  target?: string;
  metadataKey?: string;
  flickerIndex?: number;
  flickeringChars?: string[];
};

export type LevelMetadata = {
  description: string; // markdown text
};

export type Pedestrian = {
  location: Point;
  direction: "up" | "down" | "left" | "right" | "static";
  target?: boolean;
  moves?: Pedestrian["direction"][];
  moveIndex?: number;
  highlighted?: boolean;
};

export type WorldMetadata = {
  nextLevel: string;
  Sensor?: {
    isTargetClose?: number;
  };
  rateLimitOverrides?: {
    direction?: number;
  };
  executeOnce?: boolean;
  pedMoves?: {
    [key: string]: Pedestrian["direction"][];
  };
  type?: "grid" | "canvas";
};

export type LevelDefinition = {
  grid: Grid;
  code: string;
  libraries: LibraryDefinition[];
  metadata: WorldMetadata;
};
