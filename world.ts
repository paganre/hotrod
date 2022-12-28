import { getBlob, getLevelKey, getWorldKey } from "./redis";

type Point = {
  x: number;
  y: number;
};

type Level = {
  location: Point;
  title?: string;
  style?: { [key: string]: string };
  target?: string;
  metadataKey?: string;
  flickerIndex?: number;
  flickeringChars?: string[];
};

type LevelMetadata = {
  description: string; // markdown text
};

function createRect(
  topLeft: Point,
  bottomRight: Point,
  title?: string,
  defaultStyle?: Level["style"]
): Level[] {
  const levels: Level[] = [];
  for (let x = topLeft.x; x < bottomRight.x + 1; x++) {
    for (let y = topLeft.y; y < bottomRight.y + 1; y++) {
      let style: Level["style"] = {
        ...{
          border: "1px solid white",
        },
        ...defaultStyle,
      };
      if (x === topLeft.x) {
        style.borderTop = "1px solid white";
      } else if (x === bottomRight.x) {
        style.borderBottom = "1px solid white";
      }
      if (y === topLeft.y) {
        style.borderLeft = "1px solid white";
      } else if (y === bottomRight.y) {
        style.borderRight = "1px solid white";
      }
      if (title && x == bottomRight.x && y == topLeft.y) {
        levels.push({
          title,
          location: { x, y },
          style: {
            ...style,
          },
          metadataKey: title,
        });
      } else {
        levels.push({
          location: { x, y },
          style,
          metadataKey: title,
        });
      }
    }
  }
  return levels;
}

function addPoints(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}

function toKey(point: Point): string {
  return `${point.x},${point.y}`;
}

function getFillerLevels(
  currentLevels: Level[],
  style?: Level["style"]
): Level[] {
  const levels: Level[] = [];
  const currentLevelsSet = new Set(
    currentLevels.map((level) => level.location).map(toKey)
  );
  const neighbors = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];
  for (const level of currentLevels) {
    for (const neighbor of neighbors) {
      const p = addPoints(level.location, neighbor);
      if (!currentLevelsSet.has(toKey(p))) {
        levels.push({
          location: p,
          title: ["#", "@", "%", "$"][Math.floor(Math.random() * 4)],
          style: {
            border: "none",
            ...style,
          },
        });
        currentLevelsSet.add(toKey(p));
      }
    }
  }
  return levels;
}

function getFlickeringChain(
  p1: Point,
  p2: Point,
  flickeringChars: string[],
  flickerIndex: number,
  style?: Level["style"]
): Level[] {
  const levels: Level[] = [];

  for (let x = p1.x; x <= p2.x; x++) {
    for (let y = p1.y; y <= p2.y; y++) {
      levels.push(
        getFlickeringBlock(
          {
            x,
            y,
          },
          flickeringChars,
          flickerIndex - levels.length,
          style
        )
      );
    }
  }
  return levels;
}

function getFlickeringBlock(
  location: Point,
  flickeringChars: string[],
  flickerIndex: number,
  style?: Level["style"]
): Level {
  return {
    location,
    style,
    flickerIndex,
    flickeringChars,
  };
}

export type WorldState = {
  sessionId: string;
  done: string[];
  code: { [key: string]: string };
};

export async function getWorld(sessionId: string): Promise<{
  levels: Level[];
  metadata: Record<string, LevelMetadata>;
}> {
  let worldData = await getBlob<Omit<WorldState, "code">>(
    getWorldKey(sessionId)
  );
  if (worldData === undefined) {
    worldData = {
      sessionId,
      done: [],
    };
  }

  const playgroundContainer = createRect({ x: 5, y: 6 }, { x: 7, y: 11 }, "P", {
    background: "rgba(0,0,0,0.05)",
    fontWeight: "bold",
  });
  let playgroundDone: boolean = true;
  const playgroundLevels = [1, 2, 3, 4].map((level, index) => {
    const location: Point = { x: 6, y: 7 + index };
    const done: boolean | undefined = worldData?.done.includes(
      getLevelKey("playground", level.toString())
    );
    if (!done) {
      playgroundDone = false;
    }
    return {
      location,
      title: done ? "✓" : level.toString(),
      target: `/playground/${level}`,
      style: {
        fontWeight: "bold",
        background: done ? "green" : "white",
        color: done ? "white" : "black",
        borderColor: done ? "darkgreen" : "gray",
        zIndex: done ? "1" : "0",
      },
      metadataKey: `P${level}`,
    } as Level;
  });

  let firstContainer: Level[] = [];
  let firstLevels: Level[] = [];
  let sensorContainer: Level[] = [];
  let sensorLevels: Level[] = [];

  if (playgroundDone) {
    firstContainer = createRect({ x: 6, y: 13 }, { x: 9, y: 16 }, "1", {
      fontWeight: "bold",
      background: "rgba(0,0,0,0.05)",
    });
    let firstLevelsDone: boolean = false;
    firstLevels = [1, 2, 3, 4].map((level, index) => {
      const done: boolean | undefined = worldData?.done.includes(
        getLevelKey("1", level.toString())
      );
      if (!done) {
        firstLevelsDone = false;
      }
      const location: Point = {
        x: 7 + Math.floor(index / 2),
        y: 14 + (index % 2),
      };
      return {
        location,
        title: level.toString(),
        target: `/1/${level}`,
        style: {
          fontWeight: "bold",
          background: "white",
        },
      } as Level;
    });

    if (firstLevelsDone) {
      sensorContainer = createRect({ x: 20, y: 9 }, { x: 21, y: 11 }, "S", {
        fontWeight: "bold",
        background: "rgba(0,0,0,0.05)",
      });

      sensorLevels = [1, 2, 3].map((level, index) => {
        const location: Point = {
          x: 20,
          y: 9 + index,
        };
        return {
          location,
          title: ["📡", "📟", "🎛️"][index],
          target: `/S/${level}`,
          style: {
            fontWeight: "bold",
            background: "white",
            border: "1px solid gray",
          },
        } as Level;
      });
    }
  }

  let levels = [
    ...playgroundContainer,
    ...playgroundLevels,
    ...firstContainer,
    ...firstLevels,
  ];

  levels = levels.concat(
    getFillerLevels(levels, { color: "rgb(50,50,50)", fontSize: "14px" })
  );
  levels = levels.concat(sensorContainer);
  levels = levels.concat(sensorLevels);
  levels = levels.concat(
    getFillerLevels(levels, { color: "rgb(150,150,150)", fontSize: "12px" })
  );
  levels = levels.concat(
    getFillerLevels(levels, { color: "rgb(200,200,200)", fontSize: "10px" })
  );

  const metadata: Record<string, LevelMetadata> = {
    P: {
      description: `

### Playground
These are the \`Playground\` levels which gets you familiar with the game a little bit.
None of these should be difficult.
`,
    },
    P1: {
      description: `
      
### P1. Go up
      
First ever level to give you a glimpse of the \`Direction\` API.
`,
    },
    P2: {
      description: `
      
### P2. Game loop
      
Introducing the game loop and the rate limits for the \`Direction\` API.
`,
    },
    P3: {
      description: `
      
### P3. Simple Maze
      
Now use more APIs including \`Sensor\`, \`GPS\` and \`DataStore\` to come up with a simple traversal algorithm.
`,
    },
    P4: {
      description: `
      
### P4. Pedestrians
      
Introducing \`Pedestrian\`s and how not to run over them using your \`Sensor\`.
  `,
    },
    1: {
      description: `

### Pedestrians and Spies
There are spies amongst \`Pedestrian\`s and you have to catch them without hurting any of the peds.

This requires us to be either extremely lucky, or use your \`Sensor\` API in clever ways.
`,
    },
    S: {
      description: `

### Upgrade Your Sensor
You have unlocked some levels to upgrade your \`Sensor\` API.

These will require you to work on your \`Sensor\` directly and will have different problem types.
`,
    },
  };

  levels = levels.concat(
    getFlickeringChain(
      { x: 15, y: 15 },
      { x: 20, y: 15 },
      [
        ".",
        ",",
        "c",
        "ç",
        "ç",
        "@",
        "$",
        "#",
        "%",
        "#",
        "$",
        "@",
        "ç",
        "ç",
        "c",
        ".",
        ",",
      ],
      0,
      {
        border: "1px solid white",
        fontSize: "10px",
        color: "#666",
      }
    )
  );

  levels = levels.concat(
    getFlickeringChain(
      { x: 2, y: 2 },
      { x: 10, y: 2 },
      [
        ".",
        ",",
        "c",
        "ç",
        "ç",
        "@",
        "$",
        "#",
        "%",
        "#",
        "$",
        "@",
        "ç",
        "ç",
        "c",
        ".",
        ",",
      ],
      -100,
      {
        border: "1px solid white",
        fontSize: "10px",
        color: "#666",
      }
    )
  );

  levels = levels.concat(
    getFlickeringChain(
      { x: 25, y: 4 },
      { x: 25, y: 13 },
      [
        ".",
        ",",
        "c",
        "ç",
        "ç",
        "@",
        "$",
        "#",
        "%",
        "#",
        "$",
        "@",
        "ç",
        "ç",
        "c",
        ".",
        ",",
      ],
      -150,
      {
        border: "1px solid white",
        fontSize: "10px",
        color: "#666",
      }
    )
  );

  levels = levels.concat(
    getFlickeringChain(
      { x: 7, y: 24 },
      { x: 7, y: 32 },
      [
        ".",
        ",",
        "c",
        "ç",
        "ç",
        "@",
        "$",
        "#",
        "%",
        "#",
        "$",
        "@",
        "ç",
        "ç",
        "c",
        ".",
        ",",
      ],
      -200,
      {
        border: "1px solid white",
        fontSize: "10px",
        color: "#666",
      }
    )
  );

  levels = levels.concat(
    getFlickeringChain(
      { x: 12, y: 28 },
      { x: 13, y: 36 },
      [
        ".",
        ",",
        "c",
        "ç",
        "ç",
        "@",
        "$",
        "#",
        "%",
        "#",
        "$",
        "@",
        "ç",
        "ç",
        "c",
        ".",
        ",",
      ],
      -230,
      {
        border: "1px solid white",
        fontSize: "10px",
        color: "#666",
      }
    )
  );

  return { levels, metadata };
}
