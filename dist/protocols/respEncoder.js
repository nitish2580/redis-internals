"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSimpleString = encodeSimpleString;
exports.encodeBulkString = encodeBulkString;
exports.encodeError = encodeError;
function encodeSimpleString(value) {
    return `+${value}\r\n`;
}
function encodeBulkString(value) {
    if (value === null) {
        return '$-1\r\n';
    }
    return `$${Buffer.byteLength(value, 'utf8')}\r\n${value}\r\n`;
}
function encodeError(message) {
    return `-ERR ${message}\r\n`;
}
