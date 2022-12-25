import { useEffect } from "react";

export interface CanvasSimulationProps {
  canvas: number[][];
}

function isHTMLCanvasElement(el: HTMLElement): el is HTMLCanvasElement {
  return el.tagName.toLowerCase() === "canvas";
}

function CanvasSimulation(props: CanvasSimulationProps) {
  useEffect(() => {
    var canvas = document.getElementById("hot-rod-canvas");
    if (canvas && isHTMLCanvasElement(canvas)) {
      var ctx = canvas.getContext("2d");
      if (ctx) {
        const dpi = window.devicePixelRatio;
        ctx.scale(dpi, dpi);
        canvas.width = 6 * props.canvas.length;
        canvas.height = 6 * props.canvas.length;
        canvas.style.width = `${(6 * props.canvas.length) / 2}px`;
        canvas.style.height = `${(6 * props.canvas.length) / 2}px`;
      }
    }
  });
  useEffect(() => {
    var canvas = document.getElementById("hot-rod-canvas");
    if (canvas && isHTMLCanvasElement(canvas)) {
      var ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < props.canvas.length; i++) {
          for (let j = 0; j < props.canvas[0].length; j++) {
            ctx.fillStyle = `rgb(${props.canvas[i][j]},${props.canvas[i][j]},${props.canvas[i][j]})`;
            ctx.fillRect(i * 6, j * 6, 6, 6);
          }
        }
      }
    }
  }, [props.canvas]);

  function renderCanvas() {
    return (
      <div className="hot-rod-grid">
        <canvas
          id="hot-rod-canvas"
          width={props.canvas.length}
          height={props.canvas[0].length}
        />
      </div>
    );
  }

  return (
    <div className="hot-rod-simulation">
      <div className="section-title">Simulation</div>
      {props.canvas.length > 0 && renderCanvas()}
    </div>
  );
}

export default CanvasSimulation;
