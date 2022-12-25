import { Pedestrian, Point } from "./types";

export interface SimulationProps {
  grid: string[][];
  pedestrians: Pedestrian[];
  location: Point;
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

export default Simulation;
