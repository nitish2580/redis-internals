"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPParser = void 0;
class RESPParser {
    constructor() {
        this.buffer = '';
    }
    push(chunk) {
        this.buffer += chunk;
        const commands = [];
        while (this.buffer.length > 0) {
            const result = this.parseArray(this.buffer);
            if (result === null) {
                break;
            }
            commands.push(result.value);
            this.buffer = this.buffer.slice(result.bytesRead);
        }
        return commands;
    }
    parseArray(input) {
        if (!input.startsWith('*')) {
            throw new Error('Expected RESP array');
        }
        const headerEnd = input.indexOf('\r\n');
        if (headerEnd === -1) {
            return null;
        }
        const itemCount = Number.parseInt(input.slice(1, headerEnd), 10);
        if (Number.isNaN(itemCount) || itemCount < 0) {
            throw new Error('Invalid RESP array length');
        }
        let offset = headerEnd + 2;
        const items = [];
        for (let i = 0; i < itemCount; i += 1) {
            const parsedBulkString = this.parseBulkString(input, offset);
            if (parsedBulkString === null) {
                return null;
            }
            items.push(parsedBulkString.value);
            offset += parsedBulkString.bytesRead;
        }
        return { value: items, bytesRead: offset };
    }
    parseBulkString(input, startIndex) {
        if (input[startIndex] !== '$') {
            throw new Error('Expected RESP bulk string');
        }
        const lengthEnd = input.indexOf('\r\n', startIndex);
        if (lengthEnd === -1) {
            return null;
        }
        const length = Number.parseInt(input.slice(startIndex + 1, lengthEnd), 10);
        if (Number.isNaN(length) || length < 0) {
            throw new Error('Invalid RESP bulk string length');
        }
        const valueStart = lengthEnd + 2;
        const valueEnd = valueStart + length;
        const terminatorEnd = valueEnd + 2;
        if (input.length < terminatorEnd) {
            return null;
        }
        if (input.slice(valueEnd, terminatorEnd) !== '\r\n') {
            throw new Error('Malformed RESP bulk string');
        }
        return {
            value: input.slice(valueStart, valueEnd),
            bytesRead: terminatorEnd - startIndex,
        };
    }
}
exports.RESPParser = RESPParser;
