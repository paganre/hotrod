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
function getBlob(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const value = yield redis.get(key);
        if (!value) {
            return;
        }
        return JSON.parse(value);
    });
}
exports.getBlob = getBlob;
function setBlob(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        return redis.set(key, JSON.stringify(value));
    });
}
exports.setBlob = setBlob;
