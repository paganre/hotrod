import Editor from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ts, { isConstructorDeclaration } from "typescript";
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
};

type Sensor = {
  getRoads: () => Point[]; // Returns a list of available roads around you
};

type Data = any; // You can use it to store and use data

interface SimulationProps {
  grid: string[][];
  location: Point;
}

function Simulation(props: SimulationProps) {
  function renderCell(cell: string, j: number, i: number) {
    return (
      <div className={`cell cell-${cell}`} key={j}>
        {props.location.x === i && props.location.y === j && (
          <div className="hot-rod" />
        )}
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
  const defaultCode: string = `type Point = {
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
}
type Sensor = {
  getRoads: () => Point[] // Returns a list of available roads around you
}

type Data = any; // You can use it to store and use data

function gameLoop(direction: Direction, gps: GPS, sensor: Sensor, data: Data) {
  // your code here!
}
`;
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
  return {
    ended: false,
    result: "",
  };
};

const WORLD = {
  location: { x: 0, y: 0 } as Point,
  target: { x: 0, y: 0 } as Point,
  grid: [] as string[][],
  data: {} as Data,
};

function App() {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<string>("");
  const [location, setLocation] = React.useState<Point>({ x: 0, y: 0 });
  const [target, setTarget] = React.useState<Point>({ x: 0, y: 0 });
  const [userCode, setUserCode] = React.useState("");

  React.useEffect(() => {
    fetch(`/api${window.location.pathname}`)
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.grid.length; i++) {
          const row = data.grid[i];
          for (let j = 0; j < row.length; j++) {
            if (row[j] === "S") {
              setLocation({ x: i, y: j });
              WORLD.location = { x: i, y: j };
            }
            if (row[j] === "E") {
              setTarget({ x: i, y: j });
              WORLD.target = { x: i, y: j };
            }
          }
        }
        setGrid(data.grid);
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
  };

  const gameLoop = async function (
    userCode: (
      direction: Direction,
      gps: GPS,
      sensor: Sensor,
      data: Data
    ) => void
  ) {
    userCode(direction, gps, sensor, WORLD.data); // run user code
    WORLD.data = JSON.parse(JSON.stringify(WORLD.data));
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
        data: Data
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
      data: Data
    ) => void = eval(userCode);
    setSimulating(true);
    gameLoop(userFunc);
  }, [userCode]);

  const startSimulation = function (code: string) {
    const exec = `${code}
    gameLoop`;
    let userCode = ts.transpile(exec);
    setUserCode(userCode);
  };

  return (
    <div className="hot-rod-app">
      <Simulation location={location} grid={grid} />
      <CodeEditor
        runCode={startSimulation}
        simulating={simulating}
        result={result}
      />
    </div>
  );
}

export default App;
