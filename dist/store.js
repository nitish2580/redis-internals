"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStore = void 0;
class RedisStore {
    constructor() {
        this.data = new Map();
    }
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key) ?? null;
    }
}
exports.RedisStore = RedisStore;
