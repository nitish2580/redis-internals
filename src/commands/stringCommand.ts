import { KeySpace } from '../core/keySpace';
import { RedisCommandError } from '../core/errors';
import { createStringObject, StringRedisObject } from '../core/redisObject';
import { encodeBulkString, encodeSimpleString } from '../protocols/respEncoder';

export class StringCommandHandler {
  constructor(private readonly keySpace: KeySpace) {}

  set(args: string[]): string {
    if (args.length !== 2 && args.length !== 4) {
      throw new RedisCommandError('wrong number of arguments for SET');
    }

    const [key, value, option, optionValue] = args;

    if (args.length === 2) {
      this.keySpace.set(key, createStringObject(value));
      this.keySpace.persist(key);
      return encodeSimpleString('OK');
    }

    const ttlMs = this.parseTtl(option, optionValue);
    this.keySpace.setWithExpiry(key, createStringObject(value), ttlMs);
    return encodeSimpleString('OK');
  }

  get(args: string[]): string {
    if (args.length !== 1) {
      throw new RedisCommandError('wrong number of arguments for GET');
    }

    const value = this.keySpace.get(args[0]);

    if (value === null) {
      return encodeBulkString(null);
    }

    if (value.type !== 'string') {
      throw new RedisCommandError(
        'WRONGTYPE Operation against a key holding the wrong kind of value',
      );
    }

    return encodeBulkString((value as StringRedisObject).value);
  }

  private parseTtl(option?: string, rawTtl?: string): number {
    if (option === undefined || rawTtl === undefined) {
      throw new RedisCommandError('syntax error');
    }

    const ttl = Number.parseInt(rawTtl, 10);

    if (!Number.isFinite(ttl) || ttl <= 0) {
      throw new RedisCommandError('invalid expire time in SET');
    }

    switch (option.toUpperCase()) {
      case 'EX':
        return ttl * 1000;
      case 'PX':
        return ttl;
      default:
        throw new RedisCommandError('syntax error');
    }
  }
}
