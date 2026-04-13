"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiryManager = void 0;
class ExpiryManager {
    constructor() {
        this.expiresAt = new Map();
    }
    setExpiryAt(key, timestampMs) {
        this.expiresAt.set(key, timestampMs);
    }
    clearExpiry(key) {
        this.expiresAt.delete(key);
    }
    isExpired(key, now = Date.now()) {
        const expiresAt = this.expiresAt.get(key);
        return expiresAt !== undefined && now >= expiresAt;
    }
    getExpiredKeys(now = Date.now()) {
        const expiredKeys = [];
        for (const [key, expiresAt] of this.expiresAt.entries()) {
            if (now >= expiresAt) {
                expiredKeys.push(key);
            }
        }
        return expiredKeys;
    }
}
exports.ExpiryManager = ExpiryManager;
