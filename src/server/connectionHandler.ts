import net from 'net';
import { CommandRegistry } from '../commands/commandRegistry';
import { encodeError } from '../protocols/respEncoder';
import { RESPParser } from '../protocols/respParser';

export class ConnectionHandler {
  constructor(private readonly commandRegistry: CommandRegistry) {}

  attach(socket: net.Socket): void {
    const parser = new RESPParser();

    socket.on('data', (data) => {
      try {
        const commands = parser.push(data.toString('utf8'));

        for (const command of commands) {
          socket.write(this.commandRegistry.execute(command));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown parser error';
        socket.write(encodeError(message));
      }
    });
  }
}
