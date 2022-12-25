import dotenv from "dotenv";
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import md5 from "blueimp-md5";

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

app.get("/api/:id/input", (req, res) => {
  const { id } = req.params;
  try {
    const lvl = require(`./levels/${id}`);
    if (lvl.INPUTS && lvl.INPUTS.length > 0) {
      res.json({ input: lvl.INPUTS[0] });
    } else {
      res.send(404);
    }
  } catch (ex) {
    res.send(404);
  }
});

app.post("/api/:id/input", (req, res) => {
  const { id } = req.params;
  const { data, index } = req.body;
  try {
    const lvl = require(`./levels/${id}`);
    if (lvl.OUTPUTS && lvl.OUTPUTS.length >= index) {
      const output = lvl.OUTPUTS[index];
      // check correctness
      if (md5(output.join(",")) === data) {
        // correct!
        if (lvl.INPUTS.length > index + 1) {
          // return the next one
          res.json({ input: lvl.INPUTS[index + 1] });
        } else {
          // ended
          res.json({ done: true });
        }
      } else {
        res.json({ error: `Incorrect response for input frame ${index + 1}` });
      }
    } else {
      res.send(404);
    }
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
