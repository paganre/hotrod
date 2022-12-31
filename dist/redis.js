"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlob = exports.getBlob = exports.getWorldKey = exports.getLevelKey = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
function getLevelKey(namespace, id) {
    return `level:${namespace}:${id}`;
}
exports.getLevelKey = getLevelKey;
function getWorldKey(sessionId) {
    return `world:${sessionId}`;
}
exports.getWorldKey = getWorldKey;
async function getBlob(key) {
    const value = await redis.get(key);
    if (!value) {
        return;
    }
    return JSON.parse(value);
}
exports.getBlob = getBlob;
async function setBlob(key, value) {
    return redis.set(key, JSON.stringify(value));
}
exports.setBlob = setBlob;
