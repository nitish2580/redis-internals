"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCommandError = void 0;
class RedisCommandError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RedisCommandError';
    }
}
exports.RedisCommandError = RedisCommandError;
