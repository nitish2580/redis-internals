"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
const respEncoder_1 = require("../protocols/respEncoder");
const respParser_1 = require("../protocols/respParser");
class ConnectionHandler {
    constructor(commandRegistry) {
        this.commandRegistry = commandRegistry;
    }
    attach(socket) {
        const parser = new respParser_1.RESPParser();
        socket.on('data', (data) => {
            try {
                const commands = parser.push(data.toString('utf8'));
                for (const command of commands) {
                    socket.write(this.commandRegistry.execute(command));
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'unknown parser error';
                socket.write((0, respEncoder_1.encodeError)(message));
            }
        });
    }
}
exports.ConnectionHandler = ConnectionHandler;
