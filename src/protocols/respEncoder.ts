export function encodeSimpleString(value: string): string {
  return `+${value}\r\n`;
}

export function encodeBulkString(value: string | null): string {
  if (value === null) {
    return '$-1\r\n';
  }

  return `$${Buffer.byteLength(value, 'utf8')}\r\n${value}\r\n`;
}

export function encodeError(message: string): string {
  return `-ERR ${message}\r\n`;
}
