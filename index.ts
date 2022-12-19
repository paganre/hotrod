import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api/playground/:id", (req, res) => {
  const { id } = req.params;
  try {
    const lvl = require(`./levels/playground/${id}`);
    res.json({
      grid: lvl.GRID,
      code: lvl.DEFAULT_CODE,
      metadata: lvl.METADATA ? lvl.METADATA : {},
    });
  } catch (ex) {
    res.send(404);
  }
});

app.get("/api/:id", (req, res) => {
  const { id } = req.params;
  try {
    const lvl = require(`./levels/${id}`);
    res.json({
      grid: lvl.GRID,
      code: lvl.DEFAULT_CODE,
      metadata: lvl.METADATA ? lvl.METADATA : {},
    });
  } catch (ex) {
    res.send(404);
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
