import dotenv from "dotenv";
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import md5 from "blueimp-md5";
import { getWorld, getWorldState, markLevelDone } from "./world";
import session from "express-session";
import { LevelDefinition } from "./types";
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

app.get("/api/:namespace/:id", async (req, res) => {
  const { namespace, id } = req.params;
  try {
    const worldState = await getWorldState(req.session.id);
    const lvl = require(`./levels/${namespace}/${id}`).getLevel(
      worldState
    ) as LevelDefinition;
    res.json(lvl);
  } catch (ex) {
    console.log({ ex });
    res.send(404);
  }
});

app.post("/api/:namespace/:id/done", async (req, res) => {
  const { namespace, id } = req.params;
  const { userCode } = req.body;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    if (lvl && !(lvl.METADATA && lvl.METADATA.type === "canvas")) {
      await markLevelDone(req.session.id, namespace, id, userCode);
    } else {
      res.send(201);
    }
  } catch (ex) {
    res.send(404);
  }
});

app.get("/api/:namespace/:id/input", async (req, res) => {
  const { namespace, id } = req.params;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    const INPUTS = await lvl.getInputs();
    if (INPUTS.length > 0) {
      res.json({ input: INPUTS[0] });
    } else {
      res.send(404);
    }
  } catch (ex) {
    res.send(404);
  }
});

app.post("/api/:namespace/:id/input", async (req, res) => {
  const { namespace, id } = req.params;
  const { data, index } = req.body;
  try {
    const lvl = require(`./levels/${namespace}/${id}`);
    const INPUTS = await lvl.getInputs();
    const OUTPUTS = await lvl.getOutputs();
    if (OUTPUTS && OUTPUTS.length >= index) {
      const output = OUTPUTS[index];
      // check correctness
      if (md5(output.join(",")) === data) {
        // correct!
        if (INPUTS.length > index + 1) {
          // return the next one
          res.json({ input: INPUTS[index + 1] });
        } else {
          // ended
          await markLevelDone(req.session.id, namespace, id, "");
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
