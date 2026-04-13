"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRegistry = void 0;
const errors_1 = require("../core/errors");
const respEncoder_1 = require("../protocols/respEncoder");
const stringCommand_1 = require("./stringCommand");
class CommandRegistry {
    constructor(keySpace) {
        this.commands = new Map();
        this.stringCommands = new stringCommand_1.StringCommandHandler(keySpace);
        this.registerDefaults();
    }
    execute(commandParts) {
        if (commandParts.length === 0) {
            throw new errors_1.RedisCommandError('empty command');
        }
        const [rawCommand, ...args] = commandParts;
        const executor = this.commands.get(rawCommand.toUpperCase());
        if (executor === undefined) {
            throw new errors_1.RedisCommandError(`unknown command '${rawCommand}'`);
        }
        return executor(args);
    }
    registerDefaults() {
        this.commands.set('PING', (args) => this.handlePing(args));
        this.commands.set('ECHO', (args) => this.handleEcho(args));
        this.commands.set('SET', (args) => this.stringCommands.set(args));
        this.commands.set('GET', (args) => this.stringCommands.get(args));
    }
    handlePing(args) {
        if (args.length === 0) {
            return (0, respEncoder_1.encodeSimpleString)('PONG');
        }
        if (args.length !== 1) {
            throw new errors_1.RedisCommandError('wrong number of arguments for PING');
        }
        return (0, respEncoder_1.encodeBulkString)(args[0]);
    }
    handleEcho(args) {
        if (args.length !== 1) {
            throw new errors_1.RedisCommandError('wrong number of arguments for ECHO');
        }
        return (0, respEncoder_1.encodeBulkString)(args[0]);
    }
}
exports.CommandRegistry = CommandRegistry;
