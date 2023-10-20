import {TerminalCommand} from './terminal-command';
import {ICommandParameter} from './terminal-parameter';

export enum ParseCommandResult {
    Unknown = 0,
    Success,
    NoCommand,
    Ambiguous,
    Invalid
}

export class ParsedCommand {
    command?: TerminalCommand;
    rawParameters?: string[] = [];
    commandParams?: ICommandParameter[];
    parameters?: any = {};
    token?: string;
    properties?: any = {};
}

export class ParsedCommands {
    parseResult: ParseCommandResult = ParseCommandResult.Unknown;
    commands: ParsedCommand[] = [];
    commandParams: ICommandParameter[] = [];
    ambiguous?: TerminalCommand[]; // if a command token did not unambiguously match a command
}
