# Build Redis Yourself

This project is a tiny Redis-compatible server written in TypeScript so you can learn Redis by rebuilding its core ideas.

## What this version can do

- Accept TCP connections on port `6379`
- Parse RESP array commands such as `PING`, `ECHO`, `SET`, and `GET`
- Store typed Redis objects in an in-memory keyspace
- Track expiry metadata separately from value storage
- Reply using Redis-style RESP responses

## How to run it

```bash
npm run build
npm start
```

In another terminal:

```bash
redis-cli ping
redis-cli echo hello
redis-cli set name nitish
redis-cli get name
```

If port `6379` is busy, run your server on another port:

```bash
PORT=6380 npm start
redis-cli -p 6380 ping
```

If you just want a quick correctness check without opening a socket:

```bash
npm test
```

## How to study the code

Read the files in this order:

1. `src/index.ts` - process entry point
2. `src/server/index.ts` - server wiring
3. `src/server/connectionHandler.ts` - per-connection request flow
4. `src/protocols/respParser.ts` - how Redis commands are framed on the wire
5. `src/protocols/respEncoder.ts` - how responses are serialized back to the client
6. `src/core/keySpace.ts` - the top-level keyspace
7. `src/core/expiryManager.ts` - expiry metadata and cleanup
8. `src/core/redisObject.ts` - typed Redis value objects
9. `src/commands/commandRegistry.ts` - command dispatch
10. `src/commands/stringCommand.ts` - string-specific behavior

## Good next steps

- Add `DEL`
- Add `INCR`
- Add active background expiry scanning
- Support multiple commands in one TCP packet
- Add `HashValue` and `HSET`/`HGET`
- Write tests for parser edge cases
