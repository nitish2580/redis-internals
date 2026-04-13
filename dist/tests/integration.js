"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const commandRegistry_1 = require("../commands/commandRegistry");
const keySpace_1 = require("../core/keySpace");
const respParser_1 = require("../protocols/respParser");
async function main() {
    const parser = new respParser_1.RESPParser();
    const handler = new commandRegistry_1.CommandRegistry(new keySpace_1.KeySpace());
    const input = '*1\r\n$4\r\nPING\r\n' +
        '*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n' +
        '*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$6\r\nnitish\r\n' +
        '*2\r\n$3\r\nGET\r\n$4\r\nname\r\n' +
        '*2\r\n$3\r\nGET\r\n$4\r\nmiss\r\n' +
        '*5\r\n$3\r\nSET\r\n$4\r\ntemp\r\n$5\r\nvalue\r\n$2\r\nPX\r\n$2\r\n10\r\n';
    const commands = parser.push(input);
    strict_1.default.deepEqual(commands, [
        ['PING'],
        ['ECHO', 'hello'],
        ['SET', 'name', 'nitish'],
        ['GET', 'name'],
        ['GET', 'miss'],
        ['SET', 'temp', 'value', 'PX', '10'],
    ]);
    const replies = commands.map((command) => handler.execute(command));
    strict_1.default.deepEqual(replies, [
        '+PONG\r\n',
        '$5\r\nhello\r\n',
        '+OK\r\n',
        '$6\r\nnitish\r\n',
        '$-1\r\n',
        '+OK\r\n',
    ]);
    await new Promise((resolve) => setTimeout(resolve, 20));
    strict_1.default.equal(handler.execute(['GET', 'temp']), '$-1\r\n');
    console.log('Integration test passed');
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
