import { createRedisServer } from './server/index';

const port = Number.parseInt(process.env.PORT ?? '6379', 10);
const host = process.env.HOST ?? '127.0.0.1';
const server = createRedisServer();

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
