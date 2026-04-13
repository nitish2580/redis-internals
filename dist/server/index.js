"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisServer = createRedisServer;
const net_1 = __importDefault(require("net"));
const commandRegistry_1 = require("../commands/commandRegistry");
const keySpace_1 = require("../core/keySpace");
const connectionHandler_1 = require("./connectionHandler");
function createRedisServer() {
    const keySpace = new keySpace_1.KeySpace();
    const commandRegistry = new commandRegistry_1.CommandRegistry(keySpace);
    const connectionHandler = new connectionHandler_1.ConnectionHandler(commandRegistry);
    return net_1.default.createServer((socket) => {
        console.log('Client connected');
        connectionHandler.attach(socket);
        socket.on('end', () => {
            console.log('Client disconnected');
        });
    });
}
