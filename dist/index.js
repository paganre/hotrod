"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const redis_1 = require("./redis");
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
app.get("/worldData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { levels, metadata } = yield (0, world_1.getWorld)(req.session.id);
    res.json({
        levels,
        metadata,
    });
}));
app.get("/api/:namespace/:id", (req, res) => {
    const { namespace, id } = req.params;
    try {
        const lvl = require(`./levels/${namespace}/${id}`);
        res.json({
            grid: lvl.GRID,
            code: lvl.DEFAULT_CODE,
            metadata: lvl.METADATA ? lvl.METADATA : {},
        });
    }
    catch (ex) {
        res.send(404);
    }
});
app.post("/api/:namespace/:id/done", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { namespace, id } = req.params;
    const { userCode } = req.body;
    console.log(userCode);
    try {
        const lvl = require(`./levels/${namespace}/${id}`);
        if (lvl) {
            const key = (0, redis_1.getWorldKey)(req.session.id);
            const levelKey = (0, redis_1.getLevelKey)(namespace, id);
            let worldState = yield (0, redis_1.getBlob)(key);
            if (worldState === undefined) {
                worldState = {
                    sessionId: req.session.id,
                    done: [levelKey],
                    code: {
                        levelKey: userCode,
                    },
                };
            }
            else {
                if (!worldState.done.includes(levelKey)) {
                    worldState.done.push(levelKey);
                }
                worldState.code[levelKey] = userCode;
            }
            yield (0, redis_1.setBlob)(key, worldState);
        }
    }
    catch (ex) {
        res.send(404);
    }
}));
app.get("/api/:namespace/:id/input", (req, res) => {
    const { namespace, id } = req.params;
    try {
        const lvl = require(`./levels/${namespace}/${id}`);
        if (lvl.INPUTS && lvl.INPUTS.length > 0) {
            res.json({ input: lvl.INPUTS[0] });
        }
        else {
            res.send(404);
        }
    }
    catch (ex) {
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
            if ((0, blueimp_md5_1.default)(output.join(",")) === data) {
                // correct!
                if (lvl.INPUTS.length > index + 1) {
                    // return the next one
                    res.json({ input: lvl.INPUTS[index + 1] });
                }
                else {
                    // ended
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
