"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const blueimp_md5_1 = __importDefault(require("blueimp-md5"));
const world_1 = require("./world");
const express_session_1 = __importDefault(require("express-session"));
let RedisStore = require("connect-redis")(express_session_1.default);
const Redis = require("ioredis");
let redisClient = new Redis();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../client/build")));
app.set("trust proxy", 1); // trust first proxy
app.use((0, express_session_1.default)({
    store: new RedisStore({ client: redisClient }),
    secret: "\xad\t\xd87k\xc4\x83<\xcd\x95C&\xcdr\xe2I\xa8D\x93\x1b4\x1a*?}hl\x8b\xc5\xb9",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.get("/worldData", async (req, res) => {
    const { levels, metadata } = await (0, world_1.getWorld)(req.session.id);
    res.json({
        levels,
        metadata,
    });
});
app.get("/api/:namespace/:id", async (req, res) => {
    const { namespace, id } = req.params;
    try {
        const worldState = await (0, world_1.getWorldState)(req.session.id);
        const lvl = require(`./levels/${namespace}/${id}`).getLevel(worldState);
        res.json(lvl);
    }
    catch (ex) {
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
            await (0, world_1.markLevelDone)(req.session.id, namespace, id, userCode);
        }
        else {
            res.send(201);
        }
    }
    catch (ex) {
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
        }
        else {
            res.send(404);
        }
    }
    catch (ex) {
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
            if ((0, blueimp_md5_1.default)(output.join(",")) === data) {
                // correct!
                if (INPUTS.length > index + 1) {
                    // return the next one
                    res.json({ input: INPUTS[index + 1] });
                }
                else {
                    // ended
                    await (0, world_1.markLevelDone)(req.session.id, namespace, id, "");
                    res.json({ done: true });
                }
            }
            else {
                res.json({ error: `Incorrect response for input frame ${index + 1}` });
            }
        }
        else {
            res.send(404);
        }
    }
    catch (ex) {
        res.send(404);
    }
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../client/build", "index.html"));
});
