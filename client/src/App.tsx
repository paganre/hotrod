import React from "react";
import ts from "typescript";
import "./App.css";
import CanvasSimulation from "./CanvasSimulation";
import CodeEditor from "./CodeEditor";
import {
  canvasHash,
  getApiDonePath,
  getApiInputPath,
  getApiPath,
} from "./helpers/apiHelpers";
import { manhattanDistance } from "./helpers/pointHelpers";
import { getRouteType, reroute, RouteType } from "./helpers/routeHelpers";
import { checkEndCondition, simulateWorld } from "./helpers/simulationHelpers";
import Simulation from "./Simulation";
import {
  DataStore,
  Direction,
  GPS,
  Input,
  KeyValue,
  Pedestrian,
  Point,
  Printer,
  Result,
  Sensor,
  World,
  WorldMetadata,
} from "./types";
import WorldApp from "./WorldApp";

const WORLD: World = {
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
  canvas: [],
  frame: 0,
  error: "",
  done: false,
};

function App() {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [canvas, setCanvas] = React.useState<number[][]>([]);
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<Result>();
  const [location, setLocation] = React.useState<Point>({ x: 0, y: 0 });
  const [target, setTarget] = React.useState<Point>({ x: 0, y: 0 });
  const [route, setRoute] = React.useState<RouteType>();
  const [userCode, setUserCode] = React.useState("");
  const [defaultCode, setDefaultCode] = React.useState("");
  const [pedestrians, setPedestrians] = React.useState<Pedestrian[]>([]);

  React.useEffect(() => {
    const rerouted = reroute();
    if (!rerouted) {
      const routeType = getRouteType();
      setRoute(routeType);
    }
  }, []);

  React.useEffect(() => {
    if (route === "level") {
      localStorage.setItem("lastRoute", "level");
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
    } else if (route === "world") {
      localStorage.setItem("lastRoute", "world");
    }
  }, [route]);

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

  const input: Input = {
    getFrame(): Promise<number[][]> {
      if (WORLD.frame === 0) {
        return fetch(getApiInputPath())
          .then((res) => res.json())
          .then((data) => {
            WORLD.frame += 1;
            return data.input as number[][];
          });
      } else {
        return fetch(getApiInputPath(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: WORLD.frame - 1,
            data: canvasHash(WORLD.canvas),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data["done"]) {
              WORLD.done = true;
              if (data["error"]) {
                WORLD.error = data["error"];
              }
              return [];
            } else if (data["error"]) {
              WORLD.done = true;
              WORLD.error = data["error"];
              return [];
            } else {
              WORLD.frame += 1;
              return data.input as number[][];
            }
          });
      }
    },
  };

  const printer: Printer = {
    print(location: Point, paint: number): void {
      if (
        WORLD.canvas &&
        WORLD.canvas.length > 0 &&
        location.x < WORLD.canvas.length &&
        location.x >= 0 &&
        location.y < WORLD.canvas[0].length &&
        location.y >= 0
      ) {
        WORLD.canvas[location.x][location.y] = Math.max(
          Math.min(paint, 255),
          0
        );
      }
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
        console.log({ e });
        setResult({ result: `Code error`, won: false });
      }
    }
    simulateWorld(WORLD);
    setPedestrians(WORLD.pedestrians);
    setLocation({ x: WORLD.location.x, y: WORLD.location.y });
  };

  const gameLoopCanvas = async function (
    userCode: (input: Input, printer: Printer, data: DataStore) => void
  ) {
    try {
      await userCode(input, printer, dataStore); // run user code
    } catch (e) {
      setSimulating(false);
      if (e instanceof SyntaxError || e instanceof ReferenceError) {
        setResult({ result: `Code error - ${e.message}`, won: false });
      } else {
        console.log({ e });
        setResult({ result: `Code error`, won: false });
      }
    }
    simulateWorld(WORLD);
    setCanvas(JSON.parse(JSON.stringify(WORLD.canvas)));
  };

  React.useEffect(() => {
    if (!userCode || !simulating) {
      return;
    }
    // check if the game has ended
    const { ended, result, won } = checkEndCondition(WORLD, location, grid);
    if (won) {
      // send done data to server
      fetch(getApiDonePath(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCode }),
      });
    }
    if (!ended) {
      const userFunc = eval(userCode);
      // if not continue execution
      if (WORLD.metadata.type === "canvas") {
        requestAnimationFrame(() => {
          gameLoopCanvas(userFunc);
        });
      } else {
        setTimeout(() => {
          gameLoop(userFunc);
        }, 100);
      }
    } else {
      if (WORLD.metadata.type === "canvas") {
        setCanvas(JSON.parse(JSON.stringify(WORLD.canvas)));
      }
      // end the game
      setSimulating(false);
      setResult({ result, won });
    }
  }, [location, canvas]);

  React.useEffect(() => {
    if (!userCode || !simulating) {
      return;
    }
    try {
      const userFunc = eval(userCode);
      if (WORLD.metadata.type === "canvas") {
        gameLoopCanvas(userFunc);
      } else {
        gameLoop(userFunc);
      }
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
    WORLD.canvas = [];
    WORLD.frame = 0;
    WORLD.error = "";
    WORLD.done = false;
    let canvas = [];
    for (let i = 0; i < 100; i++) {
      let row: number[] = [];
      for (let j = 0; j < 100; j++) {
        if (i === 0 || j === 0 || i === 99 || j === 99) {
          row.push(0);
        } else {
          row.push(255);
        }
      }
      canvas.push(row);
    }
    WORLD.canvas = canvas;
    setCanvas(canvas);
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
      {route === "level" && WORLD.metadata.type !== "canvas" && (
        <Simulation pedestrians={pedestrians} location={location} grid={grid} />
      )}
      {route === "level" && WORLD.metadata.type === "canvas" && (
        <CanvasSimulation canvas={canvas} />
      )}
      {route === "level" && (
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
      )}
      {route === "world" && <WorldApp />}
    </div>
  );
}

export default App;
