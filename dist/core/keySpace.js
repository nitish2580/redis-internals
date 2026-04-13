"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySpace = void 0;
const expiryManager_1 = require("./expiryManager");
class KeySpace {
    constructor(expiryManager = new expiryManager_1.ExpiryManager()) {
        this.expiryManager = expiryManager;
        this.data = new Map();
    }
    get(key) {
        this.evictIfExpired(key);
        return this.data.get(key) ?? null;
    }
    set(key, value) {
        this.data.set(key, value);
    }
    setWithExpiry(key, value, ttlMs) {
        this.data.set(key, value);
        this.expiryManager.setExpiryAt(key, Date.now() + ttlMs);
    }
    delete(key) {
        this.expiryManager.clearExpiry(key);
        return this.data.delete(key);
    }
    persist(key) {
        const existing = this.data.get(key);
        if (existing === undefined) {
            return false;
        }
        this.expiryManager.clearExpiry(key);
        return true;
    }
    sweepExpiredKeys() {
        const expiredKeys = this.expiryManager.getExpiredKeys();
        for (const key of expiredKeys) {
            this.delete(key);
        }
        return expiredKeys.length;
    }
    evictIfExpired(key) {
        if (this.expiryManager.isExpired(key)) {
            this.delete(key);
        }
    }
}
exports.KeySpace = KeySpace;
