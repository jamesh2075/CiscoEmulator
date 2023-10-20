import {IEmulatedDevice} from './iemulated-device';

export enum CommandResultCode {
    Success = 0,
    Ambiguous,
    NoCommand,
    Unknown,
    Error
}

export class CommandResult {
    resultCode: CommandResultCode;
    output: string;
    newCommandLine? = '';
}

export interface IEmulatedTerminal {
    getPrompt(): string;
    // TODO: getMode(): CommandMode;
    invoke(commandLine: string): CommandResult;
    complete(commandLine: string): CommandResult;
    query(commandLine: string): CommandResult;
}
