export type RedisObjectType = 'string' | 'hash' | 'list' | 'set' | 'zset';

export interface RedisObject<TValue> {
  readonly type: RedisObjectType;
  value: TValue;
}

export interface StringRedisObject extends RedisObject<string> {
  readonly type: 'string';
}

export function createStringObject(value: string): StringRedisObject {
  return {
    type: 'string',
    value,
  };
}
