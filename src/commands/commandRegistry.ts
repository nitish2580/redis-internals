import { KeySpace } from '../core/keySpace';
import { RedisCommandError } from '../core/errors';
import { encodeBulkString, encodeSimpleString } from '../protocols/respEncoder';
import { StringCommandHandler } from './stringCommand';

type CommandExecutor = (args: string[]) => string;

export class CommandRegistry {
  private readonly stringCommands: StringCommandHandler;
  private readonly commands = new Map<string, CommandExecutor>();

  constructor(keySpace: KeySpace) {
    this.stringCommands = new StringCommandHandler(keySpace);
    this.registerDefaults();
  }

  execute(commandParts: string[]): string {
    if (commandParts.length === 0) {
      throw new RedisCommandError('empty command');
    }

    const [rawCommand, ...args] = commandParts;
    const executor = this.commands.get(rawCommand.toUpperCase());

    if (executor === undefined) {
      throw new RedisCommandError(`unknown command '${rawCommand}'`);
    }

    return executor(args);
  }

  private registerDefaults(): void {
    this.commands.set('PING', (args) => this.handlePing(args));
    this.commands.set('ECHO', (args) => this.handleEcho(args));
    this.commands.set('SET', (args) => this.stringCommands.set(args));
    this.commands.set('GET', (args) => this.stringCommands.get(args));
  }

  private handlePing(args: string[]): string {
    if (args.length === 0) {
      return encodeSimpleString('PONG');
    }

    if (args.length !== 1) {
      throw new RedisCommandError('wrong number of arguments for PING');
    }

    return encodeBulkString(args[0]);
  }

  private handleEcho(args: string[]): string {
    if (args.length !== 1) {
      throw new RedisCommandError('wrong number of arguments for ECHO');
    }

    return encodeBulkString(args[0]);
  }
}
