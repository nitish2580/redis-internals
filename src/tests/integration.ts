import assert from 'node:assert/strict';
import { CommandRegistry } from '../commands/commandRegistry';
import { KeySpace } from '../core/keySpace';
import { RESPParser } from '../protocols/respParser';

async function main(): Promise<void> {
  const parser = new RESPParser();
  const handler = new CommandRegistry(new KeySpace());

  const input =
    '*1\r\n$4\r\nPING\r\n' +
    '*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n' +
    '*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$6\r\nnitish\r\n' +
    '*2\r\n$3\r\nGET\r\n$4\r\nname\r\n' +
    '*2\r\n$3\r\nGET\r\n$4\r\nmiss\r\n' +
    '*5\r\n$3\r\nSET\r\n$4\r\ntemp\r\n$5\r\nvalue\r\n$2\r\nPX\r\n$2\r\n10\r\n';

  const commands = parser.push(input);

  assert.deepEqual(commands, [
    ['PING'],
    ['ECHO', 'hello'],
    ['SET', 'name', 'nitish'],
    ['GET', 'name'],
    ['GET', 'miss'],
    ['SET', 'temp', 'value', 'PX', '10'],
  ]);

  const replies = commands.map((command) => handler.execute(command));

  assert.deepEqual(replies, [
    '+PONG\r\n',
    '$5\r\nhello\r\n',
    '+OK\r\n',
    '$6\r\nnitish\r\n',
    '$-1\r\n',
    '+OK\r\n',
  ]);

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(handler.execute(['GET', 'temp']), '$-1\r\n');

  console.log('Integration test passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
