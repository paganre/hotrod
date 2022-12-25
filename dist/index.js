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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../client/build")));
app.get("/api/playground/:id", (req, res) => {
    const { id } = req.params;
    try {
        const lvl = require(`./levels/playground/${id}`);
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
app.get("/api/:id", (req, res) => {
    const { id } = req.params;
    try {
        const lvl = require(`./levels/${id}`);
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
app.get("/api/:id/input", (req, res) => {
    const { id } = req.params;
    try {
        const lvl = require(`./levels/${id}`);
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
app.post("/api/:id/input", (req, res) => {
    const { id } = req.params;
    const { data, index } = req.body;
    try {
        const lvl = require(`./levels/${id}`);
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
