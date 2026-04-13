import net from 'net';
import { CommandRegistry } from '../commands/commandRegistry';
import { KeySpace } from '../core/keySpace';
import { ConnectionHandler } from './connectionHandler';

export function createRedisServer(): net.Server {
  const keySpace = new KeySpace();
  const commandRegistry = new CommandRegistry(keySpace);
  const connectionHandler = new ConnectionHandler(commandRegistry);

  return net.createServer((socket) => {
    console.log('Client connected');
    connectionHandler.attach(socket);
 
    socket.on('end', () => {
      console.log('Client disconnected');
    });
  });
}
