"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringCommandHandler = void 0;
const errors_1 = require("../core/errors");
const redisObject_1 = require("../core/redisObject");
const respEncoder_1 = require("../protocols/respEncoder");
class StringCommandHandler {
    constructor(keySpace) {
        this.keySpace = keySpace;
    }
    set(args) {
        if (args.length !== 2 && args.length !== 4) {
            throw new errors_1.RedisCommandError('wrong number of arguments for SET');
        }
        const [key, value, option, optionValue] = args;
        if (args.length === 2) {
            this.keySpace.set(key, (0, redisObject_1.createStringObject)(value));
            this.keySpace.persist(key);
            return (0, respEncoder_1.encodeSimpleString)('OK');
        }
        const ttlMs = this.parseTtl(option, optionValue);
        this.keySpace.setWithExpiry(key, (0, redisObject_1.createStringObject)(value), ttlMs);
        return (0, respEncoder_1.encodeSimpleString)('OK');
    }
    get(args) {
        if (args.length !== 1) {
            throw new errors_1.RedisCommandError('wrong number of arguments for GET');
        }
        const value = this.keySpace.get(args[0]);
        if (value === null) {
            return (0, respEncoder_1.encodeBulkString)(null);
        }
        if (value.type !== 'string') {
            throw new errors_1.RedisCommandError('WRONGTYPE Operation against a key holding the wrong kind of value');
        }
        return (0, respEncoder_1.encodeBulkString)(value.value);
    }
    parseTtl(option, rawTtl) {
        if (option === undefined || rawTtl === undefined) {
            throw new errors_1.RedisCommandError('syntax error');
        }
        const ttl = Number.parseInt(rawTtl, 10);
        if (!Number.isFinite(ttl) || ttl <= 0) {
            throw new errors_1.RedisCommandError('invalid expire time in SET');
        }
        switch (option.toUpperCase()) {
            case 'EX':
                return ttl * 1000;
            case 'PX':
                return ttl;
            default:
                throw new errors_1.RedisCommandError('syntax error');
        }
    }
}
exports.StringCommandHandler = StringCommandHandler;
