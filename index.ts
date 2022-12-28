import dotenv from "dotenv";
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import md5 from "blueimp-md5";
import { getWorld, WorldState } from "./world";
import session from "express-session";
import { getBlob, getLevelKey, getWorldKey, setBlob } from "./redis";
let RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");
let redisClient = new Redis();

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret:
      "\xad\t\xd87k\xc4\x83<\xcd\x95C&\xcdr\xe2I\xa8D\x93\x1b4\x1a*?}hl\x8b\xc5\xb9",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/worldData", async (req, res) => {
  const { levels, metadata } = await getWorld(req.session.id);
  res.json({
    levels,
    metadata,
  });
});

app.get("/api/:namespace/:id", (req, res) => {
  const { namespace, id } = req.params;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    res.json({
      grid: lvl.GRID,
      code: lvl.DEFAULT_CODE,
      metadata: lvl.METADATA ? lvl.METADATA : {},
    });
  } catch (ex) {
    res.send(404);
  }
});

app.post("/api/:namespace/:id/done", async (req, res) => {
  const { namespace, id } = req.params;
  const { userCode } = req.body;
  console.log(userCode);
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    if (lvl) {
      const key = getWorldKey(req.session.id);
      const levelKey = getLevelKey(namespace, id);
      let worldState = await getBlob<WorldState>(key);
      if (worldState === undefined) {
        worldState = {
          sessionId: req.session.id,
          done: [levelKey],
          code: {
            levelKey: userCode as string,
          },
        };
      } else {
        if (!worldState.done.includes(levelKey)) {
          worldState.done.push(levelKey);
        }
        worldState.code[levelKey] = userCode;
      }
      await setBlob<WorldState>(key, worldState);
    }
  } catch (ex) {
    res.send(404);
  }
});

app.get("/api/:namespace/:id/input", (req, res) => {
  const { namespace, id } = req.params;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    if (lvl.INPUTS && lvl.INPUTS.length > 0) {
      res.json({ input: lvl.INPUTS[0] });
    } else {
      res.send(404);
    }
  } catch (ex) {
    res.send(404);
  }
});

app.post("/api/:namespace/:id/input", (req, res) => {
  const { namespace, id } = req.params;
  const { data, index } = req.body;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
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
