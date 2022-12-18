import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import ts from "typescript";
import "./App.css";

type Point = {
  x: number;
  y: number;
};

type Direction = {
  up: () => void;
  left: () => void;
  down: () => void;
  right: () => void;
};

type GPS = {
  getLocation: () => Point; // Gets your hot-rod's location
  getTarget: () => Point; // Gets your target location, if any
  getBounds: () => {
    x: number; // Maximum x value
    y: number; // Maximum y value
  };
};

type Pedestrian = {
  location: Point;
  direction: "up" | "down" | "left" | "right" | "static";
};

type Sensor = {
  getRoads: () => Point[]; // Returns a list of available roads around you
  getPedestrians: () => Pedestrian[]; // Returns a list of pedestrians around you
};

type DataStore = {
  has(key: string): boolean;
  get(key: string): string;
  set(key: string, value: string): void;
}; // You can use it to store and use data

interface SimulationProps {
  grid: string[][];
  pedestrians: Pedestrian[];
  location: Point;
}

function Simulation(props: SimulationProps) {
  function renderCell(cell: string, j: number, i: number) {
    const hasPed =
      props.pedestrians.filter((p) => p.location.x === i && p.location.y === j)
        .length > 0;
    return (
      <div className={`cell cell-${cell}`} key={j}>
        {props.location.x === i && props.location.y === j && (
          <div className="hot-rod" />
        )}
        {hasPed && <div className="pedestrian" />}
      </div>
    );
  }
  function renderRow(row: string[], index: number) {
    const cells = row.map((row, j) => renderCell(row, j, index));
    return (
      <div className="row" key={index}>
        {cells}
      </div>
    );
  }
  function renderGrid() {
    const rows = props.grid.map(renderRow);
    return <div className="hot-rod-grid">{rows}</div>;
  }

  return (
    <div className="hot-rod-simulation">
      <div className="section-title">Simulation</div>
      {props.grid.length > 0 && renderGrid()}
    </div>
  );
}

interface CodeEditorProps {
  simulating: boolean;
  result: string;
  runCode: (code: string) => void;
}

function CodeEditor(props: CodeEditorProps) {
  let defaultCode = localStorage.getItem(getApiPath());
  if (!defaultCode) {
    defaultCode = `type Point = {
  x: number
  y: number
}

type Direction = {
    up: () => void
    left: () => void
    down: () => void
    right: () => void
}

type GPS = {
  getLocation: () => Point // Gets your hot-rod's location
  getTarget: () => Point // Gets your target location, if any 
  getBounds: () => {
    x: number; // Maximum x value
    y: number; // Maximum y value
  };
}

type Pedestrian = {
  location: Point;
  direction: "up" | "down" | "left" | "right" | "static";
};

type Sensor = {
  getRoads: () => Point[] // Returns a list of available roads around you
  getPedestrians: () => Pedestrian[]; // Returns a list of pedestrians around you
}

// You can use this to store and use data in subsequent game-loop calls. 
// You will need to handle the serialization and deserialization of data.
type DataStore = {
  has(key: string): boolean; // returns if the key is in the data store
  get(key: string): string | undefined; // returns the value of the key if it exists
  set(key: string, value: string): void; // sets the value for the key
}; 

function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: DataStore) {
  // your code here!
}
`;
  }
  const [code, setCode] = useState(defaultCode);
  return (
    <div className="hot-rod-code-editor">
      <div style={{ display: "flex" }}>
        <div className="section-title">Editor</div>
        {props.simulating ? (
          <div style={{ marginLeft: 10 }}>Running...</div>
        ) : (
          <button
            style={{ marginLeft: 10 }}
            className="run-code"
            onClick={() => {
              props.runCode(code);
            }}
          >
            Run
          </button>
        )}
        {props.result && <div style={{ marginLeft: 10 }}>{props.result}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: 20 }}>
          <Editor
            height="90vh"
            defaultLanguage="typescript"
            defaultValue={defaultCode}
            onChange={(val) => {
              if (val) {
                setCode(val);
              }
            }}
            line={16}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
}

const checkEndCondition = function (
  loc: Point,
  gr: string[][]
): { ended: boolean; result: string } {
  if (loc.x < 0 || loc.y < 0 || loc.x >= gr.length || loc.y >= gr[0].length) {
    return {
      ended: true,
      result: "out of bounds",
    };
  } else {
    const r = gr[loc.x][loc.y];
    if (r === "E") {
      return {
        ended: true,
        result: "won",
      };
    }
    if (r === "W") {
      return {
        ended: true,
        result: "lost",
      };
    }
  }
  if (
    !(
      WORLD.previousLocation.x === WORLD.location.x &&
      WORLD.previousLocation.y === WORLD.location.y
    )
  ) {
    // hot rod moved this turn
    const hasPed =
      WORLD.pedestrians.filter(
        (p) => p.location.x === loc.x && p.location.y === loc.y
      ).length > 0;
    if (hasPed) {
      console.log({ prev: WORLD.previousLocation, curr: WORLD.location });
      return {
        ended: true,
        result: "lost - hit a pedestrian!",
      };
    }
  }
  return {
    ended: false,
    result: "",
  };
};

type KeyValue = { [key: string]: string };

const WORLD = {
  location: { x: 0, y: 0 } as Point,
  previousLocation: { x: 0, y: 0 } as Point,
  target: { x: 0, y: 0 } as Point,
  pedestrians: [] as Pedestrian[],
  grid: [] as string[][],
  data: {} as KeyValue,
};

const simulateWorld = function () {
  for (const ped of WORLD.pedestrians) {
    switch (ped.direction) {
      case "down":
        if (ped.location.x < WORLD.grid.length - 1) {
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
        if (ped.location.y < WORLD.grid[0].length - 1) {
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
    ped.direction = dirs[Math.floor(Math.random() * dirs.length)];
  }
};

const getApiPath = function (): string {
  return `/api${window.location.pathname}`;
};

function App() {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<string>("");
  const [location, setLocation] = React.useState<Point>({ x: 0, y: 0 });
  const [target, setTarget] = React.useState<Point>({ x: 0, y: 0 });
  const [userCode, setUserCode] = React.useState("");
  const [pedestrians, setPedestrians] = React.useState<Pedestrian[]>([]);

  React.useEffect(() => {
    fetch(getApiPath())
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.grid.length; i++) {
          const row = data.grid[i];
          for (let j = 0; j < row.length; j++) {
            if (row[j] === "S") {
              setLocation({ x: i, y: j });
              WORLD.location = { x: i, y: j };
              WORLD.previousLocation = { x: i, y: j };
            }
            if (row[j] === "E") {
              setTarget({ x: i, y: j });
              WORLD.target = { x: i, y: j };
            }
            if (row[j] === "P") {
              WORLD.pedestrians.push({
                location: {
                  x: i,
                  y: j,
                },
                direction: "static",
              });
              row[j] = ".";
            }
          }
        }
        setGrid(data.grid);
        setPedestrians(WORLD.pedestrians);
        WORLD.grid = data.grid;
      });
  }, []);

  const gps: GPS = {
    getLocation: function () {
      return WORLD.location;
    },
    getTarget: function () {
      return WORLD.target;
    },
    getBounds: function () {
      return {
        x: WORLD.grid.length - 1,
        y: WORLD.grid[0].length - 1,
      };
    },
  };

  const direction: Direction = {
    up: function () {
      WORLD.location.x = WORLD.location.x - 1;
    },
    down: function () {
      WORLD.location.x = WORLD.location.x + 1;
    },
    right: function () {
      WORLD.location.y = WORLD.location.y + 1;
    },
    left: function () {
      WORLD.location.y = WORLD.location.y - 1;
    },
  };

  const sensor: Sensor = {
    getRoads: function () {
      const out = [];
      const possibilities = [
        { x: WORLD.location.x - 1, y: WORLD.location.y },
        { x: WORLD.location.x + 1, y: WORLD.location.y },
        { x: WORLD.location.x, y: WORLD.location.y - 1 },
        { x: WORLD.location.x, y: WORLD.location.y + 1 },
      ];
      for (const p of possibilities) {
        if (
          p.x >= 0 &&
          p.x < WORLD.grid.length &&
          p.y >= 0 &&
          p.y < WORLD.grid[0].length &&
          WORLD.grid[p.x][p.y] !== "W"
        ) {
          out.push(p);
        }
      }
      return out;
    },
    getPedestrians: function () {
      return WORLD.pedestrians; // filter these folks a bit
    },
  };

  const dataStore: DataStore = {
    has(key: string): boolean {
      const value = WORLD.data[key];
      return value !== undefined;
    },
    get(key: string) {
      return WORLD.data[key];
    },
    set(key: string, value: string) {
      WORLD.data[key] = value;
    },
  };

  const gameLoop = async function (
    userCode: (
      direction: Direction,
      gps: GPS,
      sensor: Sensor,
      data: DataStore
    ) => void
  ) {
    WORLD.previousLocation = { x: WORLD.location.x, y: WORLD.location.y }; // update previous location before running user code
    userCode(direction, gps, sensor, dataStore); // run user code
    simulateWorld();
    setPedestrians(WORLD.pedestrians);
    setLocation({ x: WORLD.location.x, y: WORLD.location.y });
  };

  React.useEffect(() => {
    if (!userCode || !simulating) {
      return;
    }
    // check if the game has ended
    const { ended, result } = checkEndCondition(location, grid);
    if (!ended) {
      const userFunc: (
        direction: Direction,
        gps: GPS,
        sensor: Sensor,
        data: DataStore
      ) => void = eval(userCode);
      // if not continue execution
      setTimeout(() => {
        gameLoop(userFunc);
      }, 100);
    } else {
      // reset the game
      setSimulating(false);
      setResult(result);
    }
  }, [location]);

  React.useEffect(() => {
    if (!userCode) {
      return;
    }
    const userFunc: (
      direction: Direction,
      gps: GPS,
      sensor: Sensor,
      data: DataStore
    ) => void = eval(userCode);
    setSimulating(true);
    gameLoop(userFunc);
  }, [userCode]);

  const startSimulation = function (code: string) {
    // save to local storage
    localStorage.setItem(getApiPath(), code);
    const exec = `${code}
    gameLoop`;
    let userCode = ts.transpile(exec);
    setUserCode(userCode);
  };

  return (
    <div className="hot-rod-app">
      <Simulation pedestrians={pedestrians} location={location} grid={grid} />
      <CodeEditor
        runCode={startSimulation}
        simulating={simulating}
        result={result}
      />
    </div>
  );
}

export default App;
