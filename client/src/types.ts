export type Point = {
  x: number;
  y: number;
};

export type Direction = {
  up: () => void;
  left: () => void;
  down: () => void;
  right: () => void;
};

export type GPS = {
  getLocation: () => Point; // Gets your hot-rod's location
  getTarget: () => Point; // Gets your target location, if any
  getBounds: () => {
    x: number; // Maximum x value
    y: number; // Maximum y value
  };
};

export type Pedestrian = {
  location: Point;
  direction: "up" | "down" | "left" | "right" | "static";
  target?: boolean;
  moves?: Pedestrian["direction"][];
  moveIndex?: number;
  highlighted?: boolean;
};

export type Sensor = {
  highlightPedestrian: (index: number) => void; // Highlights the Pedestrian purple
  isTargetClose: () => boolean; // Returns "true" if the target is close.
  getRoads: () => Point[]; // Returns a list of available roads around you
  getPedestrians: () => Pedestrian[]; // Returns a list of pedestrians around you
};

export type DataStore = {
  has(key: string): boolean;
  get(key: string): string;
  set(key: string, value: string): void;
}; // You can use it to store and use data

export type Printer = {
  print(location: Point, paint: number): void;
};

export type Input = {
  getFrame(): Promise<number[][]>;
};

export type Result = {
  result: string;
  won: boolean;
};

export type KeyValue = { [key: string]: string };

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

export type World = {
  metadata: WorldMetadata;
  location: Point;
  previousLocation: Point;
  target: Point;
  pedestrians: Pedestrian[];
  grid: string[][];
  original_grid: World["grid"];
  data: KeyValue;
  rateLimits: {
    direction: number;
  };
  apiUsed: {
    direction: number;
  };
  canvas: number[][];
  frame: number;
  error: string;
  done: boolean;
};
