﻿
import { ICiscoDevice, ICiscoInterface } from './icisco-device';
import { IEmulatedTerminal, CommandResult, CommandResultCode } from '../interfaces/iemulated-terminal';
import { TerminalCommand } from '../interfaces/terminal-command';
import { CommandState } from '../interfaces/command-state';
import { CiscoDevice } from './cisco-device';
import { CiscoTerminalContext, CiscoCommandContext, InterfaceSelector } from './cisco-terminal-command';
import { ParsedCommands, ParsedCommand, ParseCommandResult } from '../interfaces/parsed-command';
import { CiscoCommandParser } from './command-parser';
import { StateContainer } from '../emulator-state';
import { NotSupportedCommand } from './commands/notsupported';
import { EventDispatcher } from 'event-dispatch';
import { CiscoFormatters } from './common/cisco-formatters';
import { CommandConstants } from './common/cisco-constants';
import { CiscoHelp } from './cisco-help';
import { CiscoCommandActions, ICiscoCommandActions } from './cisco-command-actions';

interface ICommandHandler {
    invoke(terminalContext: CiscoTerminalContext, cmdContext: CommandState): CommandState;
}

export class CiscoTerminal implements IEmulatedTerminal {
    private terminalContext: CiscoTerminalContext;
    private eventDispatcher: EventDispatcher = new EventDispatcher();
    private actions: ICiscoCommandActions;

    constructor(protected device: CiscoDevice) {
        // create the initial context
      this.terminalContext = new CiscoTerminalContext();
      this.actions = new CiscoCommandActions(device);
    }

    getPrompt(): string {
        return this.buildPrompt(this.getContext());
    }

    invoke(commandLine: string): CommandResult {
        try {
            const commands = this.getContextCommands();
            const parsed = CiscoCommandParser.Parse(commandLine, commands);
            console.log('CiscoCommandParser.Parse = ' + JSON.stringify(parsed));

            switch (parsed.parseResult) {
                case ParseCommandResult.Success: {
                    // invoke the command
                    return this.InternalInvoke(parsed);
                }
                case ParseCommandResult.Ambiguous: {
                    const output = `% Ambiguous command '${commandLine}'`;
                    // for (let cmd of parsed.ambiguous) {
                    //   output += cmd.name + '\n';
                    // }
                    return {
                        resultCode: CommandResultCode.Ambiguous,
                        output: output
                    };
                }
                case ParseCommandResult.Invalid: {
                    return {
                        resultCode: CommandResultCode.Error,
                        output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT,
                    };
                }
                case ParseCommandResult.Unknown: {
                    return {
                        resultCode: CommandResultCode.Unknown,
                        output: `% Unknown command or computer name, or unable to find computer address`
                    };
                }
                case ParseCommandResult.NoCommand:
                default: {
                    return {
                        resultCode: CommandResultCode.NoCommand,
                        output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
                    };
                }
            }
        } catch (Error) {
            console.log(Error.message);
            console.log(Error.stack);
            return {
                resultCode: CommandResultCode.Error,
                output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT,
                newCommandLine: commandLine,
            };
        }
    }

    complete(commandLine: string): CommandResult {
        const commands = this.getContextCommands();
        return CiscoHelp.AutoComplete(commandLine, commands);
    }

    query(commandLine: string): CommandResult {
        const index = commandLine.indexOf('?');
        const allcommands = this.getContextCommands();
        if (index === 0 || commandLine[index - 1] === ' ') {
            commandLine = commandLine.replace(/ ?\?/, '').trim();
            return CiscoHelp.QueryWithSpace(commandLine, allcommands);
        } else {
            commandLine = commandLine.replace(/ ?\?/, '').trim();
            return CiscoHelp.QueryWithoutSpace(commandLine, allcommands);
        }
    }

    private buildPrompt(context: CiscoTerminalContext): string {
        const result = this.device.name;
        // TODO: if (context.confInterfaceRange) return result + '(config-if-range)#';
        if (context.interfaceSelector && context.interfaceSelector.range) {
            if (-1 < context.interfaceSelector.range.indexOf('-')   // TODO: find a better way to resolve this ugly hack
                || -1 < context.interfaceSelector.range.indexOf(',')) {
                return result + '(config-if-range)#';
            } else {
                return result + '(config-if)#';
            }
        }
        if (context.confVlan) {
            return result + '(config-vlan)#';
        }
        if (context.confTerminal) {
            return result + '(config)#';
        }
        if (context.enabled) {
            return result + '#';
        }
        // TODO: turn this into a stack
        return result + '>';
    }

    private getContext(): CiscoTerminalContext {
        return this.terminalContext;
    }

    private getContextCommands(): TerminalCommand[] {
        return this.device.getCommands(this.getContext());
    }

    private createCommandContext(): CiscoCommandContext {
      const context = this.getContext();
      const result = {
        ...this.terminalContext,
        actions: this.actions,
        device: this.device
      } as CiscoCommandContext;
      if (context.confInterface) {
        result.interfaces = this.device.getInterfaces(context.interfaceSelector);
      }
      return result;
    }

    private applyModelChanges(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const changes = cmdState.changes.concat();
        cmdState.changes.length = 0;
        for (const change of changes) {
            if (this.terminalContext.confInterface) {
                // use device.getInterfaces instead of cmdContext.interfaces so we have access to the class members
                const interfaces = this.device.getInterfaces(this.getContext().interfaceSelector);
                for (const target of interfaces) {
                    target.setProperty(change.selector, change.value);
                }
            } else {
                // TODO: make sure this property gets set at the terminal level (in conf t)
                this.device.setProperty(change.selector, change.value);
            }
        }
    }

    private applyActions(cmdContext: CiscoCommandContext, cmdState: CommandState): string {
      let output = '';
      for (const action of cmdState.actions) {
        const thisOutput = action.do(action.model);
        if (thisOutput) {
          output += thisOutput;
        }
      }
      return output;
    }

    /**
     * Handles individual changes to terminal context properties
     * @param selector
     * @param value
     */
    private setContextProperty(selector: string | string[], value: any) {
        const context = this.terminalContext;
        const state = new StateContainer(context);
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        switch (selector[0]) {
            case 'interfaceSelector':
                // a value of null or undefined means we are no longer in interface config mode
                if (!value) {
                    context.confInterface = false;
                } else {
                    context.confInterface = true;
                }
                state.setProperty(selector, value);
                break;
            default: {
                state.setProperty(selector, value);
                break;
            }
        }
    }

    private applyContextChanges(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const contextChanges = cmdState.contextChanges.concat();
        cmdState.contextChanges.length = 0;
        for (const change of contextChanges) {
            this.setContextProperty(change.selector, change.value);
        }
    }

    private dispatchEvents(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const events = cmdState.events.concat();
        cmdState.events.length = 0;
        for (const event of events) {
            const data = event.data || {};
            data.cmdContext = cmdContext;
            data.cmdState = cmdState;
            this.eventDispatcher.dispatch(event.name, data);
        }
    }

    private InternalInvoke(parsed: ParsedCommands): CommandResult {
        const cmdContext = this.createCommandContext();
        const cmdState = new CommandState();
        for (let index = parsed.commands.length - 1; index >= 0; index--) {
            const command = parsed.commands[index].command;
            let handler = command ? command.handler : undefined;
            if (handler === undefined) {
                handler = NotSupportedCommand.NotSupported;
            }
            if (handler) {
                cmdState.command = parsed.commands[index];
                handler(cmdContext, cmdState);
                if (cmdState.stopProcessing) {
                    break;
                }
            }
        }
        this.applyModelChanges(cmdContext, cmdState);
        const actionOutput = this.applyActions(cmdContext, cmdState);
        this.applyContextChanges(cmdContext, cmdState);
        this.dispatchEvents(cmdContext, cmdState);

        return {
            resultCode: CommandResultCode.Success,
            output: cmdState.output + actionOutput
        };
    }

}

