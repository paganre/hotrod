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
  target?: boolean;
  moves?: Pedestrian["direction"][];
  moveIndex?: number;
  highlighted?: boolean;
};

type Sensor = {
  highlightPedestrian: (index: number) => void; // Highlights the Pedestrian purple
  isTargetClose: () => boolean; // Returns "true" if the target is close.
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

function manhattanDistance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function Simulation(props: SimulationProps) {
  function renderCell(cell: string, j: number, i: number) {
    const peds = props.pedestrians.filter(
      (p) => p.location.x === i && p.location.y === j
    );
    const pedClass =
      peds.filter((p) => p.highlighted).length > 0
        ? "pedestrian pedestrian-highlighted"
        : "pedestrian";
    return (
      <div className={`cell cell-${cell}`} key={j}>
        {props.location.x === i && props.location.y === j && (
          <div className="hot-rod" />
        )}
        {peds.length > 0 && <div className={pedClass} />}
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
  defaultCode: string;
  simulating: boolean;
  result?: Result;
  runCode: (code: string) => void;
  reset: () => void;
  nextLevel: () => void;
}

type Result = {
  result: string;
  won: boolean;
};

function CodeEditor(props: CodeEditorProps) {
  let defaultCode = props.defaultCode;
  React.useEffect(() => {
    let defaultCode = localStorage.getItem(getApiPath());
    if (!defaultCode) {
      defaultCode = props.defaultCode;
    }
  }, [props.defaultCode]);
  const [code, setCode] = useState(defaultCode);
  return (
    <div className="hot-rod-code-editor">
      <div style={{ display: "flex" }}>
        <div className="section-title">Editor</div>
        {props.simulating ? (
          <div style={{ marginLeft: 10 }}>Running...</div>
        ) : (
          !props.result?.result && (
            <button
              style={{ marginLeft: 10 }}
              className="run-code"
              onClick={() => {
                props.runCode(code);
              }}
            >
              Run
            </button>
          )
        )}
        {!props.simulating && props.result?.result && (
          <button
            style={{ marginLeft: 10 }}
            className="run-code"
            onClick={() => {
              props.reset();
            }}
          >
            Restart
          </button>
        )}
        {!props.simulating && (
          <button
            className="reset-code"
            onClick={() => {
              setCode(props.defaultCode);
            }}
          >
            Reset Code
          </button>
        )}
        {props.result && (
          <div style={{ marginLeft: 10 }}>{props.result.result}</div>
        )}
        {props.result?.won && (
          <button
            style={{ marginLeft: 10 }}
            className="next-level"
            onClick={() => {
              props.nextLevel();
            }}
          >
            Next Level
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: 20 }}>
          <Editor
            height="90vh"
            defaultLanguage="typescript"
            defaultValue={defaultCode}
            value={code}
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
): { ended: boolean; result: string; won: boolean } {
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
      WORLD.previousLocation.x === WORLD.location.x &&
      WORLD.previousLocation.y === WORLD.location.y
    )
  ) {
    // hot rod moved this turn
    const peds = WORLD.pedestrians.filter(
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
    ended: WORLD.metadata.executeOnce ? true : false,
    result: WORLD.metadata.executeOnce ? "Can't reach it!" : "",
    won: false,
  };
};

type KeyValue = { [key: string]: string };

type WorldMetadata = {
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
};

const WORLD = {
  metadata: {} as WorldMetadata,
  location: { x: 0, y: 0 } as Point,
  previousLocation: { x: 0, y: 0 } as Point,
  target: { x: 0, y: 0 } as Point,
  pedestrians: [] as Pedestrian[],
  grid: [] as string[][],
  original_grid: [] as string[][],
  data: {} as KeyValue,
  rateLimits: {
    direction: 1,
  },
  apiUsed: {
    direction: 0,
  },
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
    if (ped.moves && ped.moves.length > 0 && ped.moveIndex !== undefined) {
      ped.direction = ped.moves[ped.moveIndex];
      ped.moveIndex = (ped.moveIndex + 1) % ped.moves.length;
    } else {
      ped.direction = dirs[Math.floor(Math.random() * dirs.length)];
    }
  }
};

const isCurrentQuestionLater = function (
  currentQuestion: string,
  lastQuestion: string
): boolean {
  if (lastQuestion === "playground") {
    return true;
  }
  const currentlyInPlayground = currentQuestion.startsWith("playground/");
  const lastlyInPlayground = lastQuestion.startsWith("playground/");
  if (currentlyInPlayground && lastlyInPlayground) {
    return (
      parseInt(currentQuestion.split("/")[1]) >
      parseInt(lastQuestion.split("/")[1])
    );
  } else if (currentlyInPlayground && !lastlyInPlayground) {
    return false;
  } else if (!currentlyInPlayground && lastlyInPlayground) {
    return true;
  } else {
    try {
      return parseInt(currentQuestion) > parseInt(lastQuestion);
    } catch (error) {
      return true;
    }
  }
};

const getApiPath = function (): string {
  const lastQuestion = localStorage.getItem("lastQuestion") || "playground/1";
  if (window.location.pathname === "/") {
    window.location.pathname = `/${lastQuestion}`;
  } else {
    const currentQuestion = window.location.pathname
      .split("/")
      .splice(1)
      .join("/");
    if (isCurrentQuestionLater(currentQuestion, lastQuestion)) {
      // update last question
      localStorage.setItem("lastQuestion", currentQuestion);
    }
  }
  return `/api${window.location.pathname}`;
};

function App() {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<Result>();
  const [location, setLocation] = React.useState<Point>({ x: 0, y: 0 });
  const [target, setTarget] = React.useState<Point>({ x: 0, y: 0 });
  const [userCode, setUserCode] = React.useState("");
  const [defaultCode, setDefaultCode] = React.useState("");
  const [pedestrians, setPedestrians] = React.useState<Pedestrian[]>([]);

  React.useEffect(() => {
    fetch(getApiPath())
      .then((res) => res.json())
      .then((data) => {
        WORLD.metadata = data.metadata;
        if (WORLD.metadata.rateLimitOverrides?.direction !== undefined) {
          WORLD.rateLimits.direction =
            WORLD.metadata.rateLimitOverrides.direction;
        }
        WORLD.original_grid = JSON.parse(JSON.stringify(data.grid));
        setDefaultCode(data.code);
        resetWithGrid(JSON.parse(JSON.stringify(WORLD.original_grid)));
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
      if (
        WORLD.rateLimits.direction &&
        WORLD.apiUsed.direction === WORLD.rateLimits.direction
      ) {
        console.log(
          `You can use direction only ${WORLD.rateLimits.direction} time${
            WORLD.rateLimits.direction > 1 ? "s" : ""
          } per turn.`
        );
        return;
      }
      WORLD.apiUsed.direction += 1;
      WORLD.location.x = WORLD.location.x - 1;
    },
    down: function () {
      if (
        WORLD.rateLimits.direction &&
        WORLD.apiUsed.direction === WORLD.rateLimits.direction
      ) {
        console.log(
          `You can use direction only ${WORLD.rateLimits.direction} time${
            WORLD.rateLimits.direction > 1 ? "s" : ""
          } per turn.`
        );
        return;
      }
      WORLD.apiUsed.direction += 1;
      WORLD.location.x = WORLD.location.x + 1;
    },
    right: function () {
      if (
        WORLD.rateLimits.direction &&
        WORLD.apiUsed.direction === WORLD.rateLimits.direction
      ) {
        console.log(
          `You can use direction only ${WORLD.rateLimits.direction} time${
            WORLD.rateLimits.direction > 1 ? "s" : ""
          } per turn.`
        );
        return;
      }
      WORLD.apiUsed.direction += 1;
      WORLD.location.y = WORLD.location.y + 1;
    },
    left: function () {
      if (
        WORLD.rateLimits.direction &&
        WORLD.apiUsed.direction === WORLD.rateLimits.direction
      ) {
        console.log(
          `You can use direction only ${WORLD.rateLimits.direction} time${
            WORLD.rateLimits.direction > 1 ? "s" : ""
          } per turn.`
        );
        return;
      }
      WORLD.apiUsed.direction += 1;
      WORLD.location.y = WORLD.location.y - 1;
    },
  };

  const sensor: Sensor = {
    highlightPedestrian: function (index: number) {
      WORLD.pedestrians[index].highlighted = true;
    },
    isTargetClose: function () {
      if (WORLD.metadata.Sensor?.isTargetClose) {
        const coverage = WORLD.metadata.Sensor.isTargetClose;
        const spy = WORLD.pedestrians.find((p) => p.target);
        if (spy) {
          const distance = manhattanDistance(spy.location, WORLD.location);
          return distance <= coverage;
        }
        throw Error("Your target is not set");
      }
      throw Error("Your sensor does not implement this function");
    },
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
      return WORLD.pedestrians.map((p) => {
        const ped = JSON.parse(JSON.stringify(p)) as Pedestrian;
        ped.target = undefined;
        ped.moveIndex = undefined;
        ped.moves = undefined;
        return ped;
      }); // filter these folks a bit
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
    WORLD.apiUsed.direction = 0;
    try {
      userCode(direction, gps, sensor, dataStore); // run user code
    } catch (e) {
      setSimulating(false);
      if (e instanceof SyntaxError || e instanceof ReferenceError) {
        setResult({ result: `Code error - ${e.message}`, won: false });
      } else {
        setResult({ result: `Code error`, won: false });
      }
    }
    simulateWorld();
    setPedestrians(WORLD.pedestrians);
    setLocation({ x: WORLD.location.x, y: WORLD.location.y });
  };

  React.useEffect(() => {
    if (!userCode || !simulating) {
      return;
    }
    // check if the game has ended
    const { ended, result, won } = checkEndCondition(location, grid);
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
      // end the game
      setSimulating(false);
      setResult({ result, won });
    }
  }, [location]);

  React.useEffect(() => {
    if (!userCode || !simulating) {
      return;
    }
    try {
      const userFunc: (
        direction: Direction,
        gps: GPS,
        sensor: Sensor,
        data: DataStore
      ) => void = eval(userCode);
      gameLoop(userFunc);
    } catch (e) {
      setSimulating(false);
      if (e instanceof SyntaxError || e instanceof ReferenceError) {
        setResult({ result: `Code error - ${e.message}`, won: false });
      } else {
        setResult({ result: `Code error`, won: false });
      }
    }
  }, [userCode, simulating]);

  const startSimulation = function (code: string) {
    // save to local storage
    localStorage.setItem(getApiPath(), code);
    const exec = `${code}
    ${WORLD.metadata.executeOnce ? "main" : "gameLoop"}`;
    let userCode = ts.transpile(exec);
    setSimulating(true);
    setUserCode(userCode);
  };

  const resetWithGrid = function (grid: string[][]) {
    WORLD.pedestrians = [];
    WORLD.data = {};
    WORLD.apiUsed.direction = 0;
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
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
        if (row[j].startsWith("P")) {
          const target = row[j] === "PX";
          let moves: Pedestrian["direction"][] = [];
          if (row[j].length > 0) {
            const pedKey = row[j].substr(1);
            if (WORLD.metadata.pedMoves && WORLD.metadata.pedMoves[pedKey]) {
              moves = WORLD.metadata.pedMoves[pedKey];
            }
          }
          WORLD.pedestrians.push({
            location: {
              x: i,
              y: j,
            },
            direction: "static",
            target,
            moves,
            moveIndex: 0,
          });
          row[j] = ".";
        }
      }
    }
    WORLD.grid = grid;
    setGrid(grid);
    setPedestrians(WORLD.pedestrians);
    setSimulating(false);
    setResult({ result: "", won: false });
  };

  const reset = function () {
    resetWithGrid(JSON.parse(JSON.stringify(WORLD.original_grid)));
  };

  return (
    <div className="hot-rod-app">
      <Simulation pedestrians={pedestrians} location={location} grid={grid} />
      <CodeEditor
        defaultCode={defaultCode}
        reset={reset}
        runCode={startSimulation}
        simulating={simulating}
        result={result}
        nextLevel={() => {
          window.location.pathname = WORLD.metadata.nextLevel;
        }}
      />
    </div>
  );
}

export default App;
