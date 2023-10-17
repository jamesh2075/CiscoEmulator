import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { ICiscoDevice, ICiscoInterface } from '../icisco-device';
import { NotSupportedCommand } from './notsupported';
import { CiscoCommandParser } from '../command-parser';
import { CiscoCommandContext } from '../cisco-terminal-command';
import { StateContainer } from '../../emulator-state';
import { CiscoDevice } from '../cisco-device';
import { plainToClass } from 'class-transformer';
import { AsArray } from '../../util';

import { CiscoAction, CiscoCommandAction } from '../cisco-command-actions';
import { MockCiscoCommandActions } from '../cisco-command-actions.mock';


// export type CommandContextFunction = () => CiscoCommandContext;
// export type ModelValidatorFunction = (model: any) => boolean;
// export type OutputValidatorFunction = (output: string | string[]) => boolean;
export interface CommandTestCase {
    // TODO: label?: string;

    /** Specifies a command context to use for this test case */
    context?: CiscoCommandContext;
    // TODO: context?: CommandContextFunction | CiscoCommandContext;

    // TODO: Rename to command (plural implies multiple commands, this is intended to represent a single command)
    commands: string | string[];

    model?: any;
    // TODO: model?: ModelValidatorFunction | any;

    actions?: Partial<CiscoCommandAction<any>> | Partial<CiscoCommandAction<any>>[];

    contextModel?: any;
    // TODO: contextModel?: ModelValidatorFunction | any;

    output?: string | string[];
    // output?: OutputValidatorFunction | string | string[];

    /** Set to true to process as a focused test */
    focus?: boolean;
}

export interface CommandTestCaseResult {
    cmdState: CommandState; // access to output through cmdState
    model: any;
    contextModel: any;
}

export class CommandTester {
    static RunTestCases(testCases: CommandTestCase[], target: TerminalCommand) {

        for (const item of testCases) {
            const commandLines = (Array.isArray(item.commands)) ? item.commands : [item.commands];
            for (const cmdLine of commandLines) {
                const action = () => {
                    const commandContext = item.context ? item.context : CommandTester.createCommandContext();
                    const result: CommandTestCaseResult = CommandTester.TestInvoke(commandContext, target, cmdLine);

                    // check any model changes
                    if (item.model) {
                        expect(JSON.stringify(result.model)).toEqual(JSON.stringify(item.model));
                    }

                    // check any actions
                    if (item.actions) {
                        const actions = AsArray(item.actions);
                        for (let i = 0; i < actions.length; i++) {
                            const expectedAction = actions[i];
                            const ciscoAction = result.cmdState.actions[i] as CiscoCommandAction<any>;
                            expect(ciscoAction.actionId).toEqual(expectedAction.actionId);
                            expect(JSON.stringify(ciscoAction.model)).toEqual(JSON.stringify(expectedAction.model));
                        }
                    }

                    // check any context changes
                    if (item.contextModel) {
                        expect(JSON.stringify(result.contextModel)).toEqual(JSON.stringify(item.contextModel));
                    }

                    // Check the output
                    const expectedOutput = item.output ? Array.isArray(item.output) ? item.output : [item.output] : [];
                    item.output = item.output ? item.output : '';
                    expect(JSON.stringify(result.cmdState.output)).toEqual(JSON.stringify(item.output));
                };
                if (item.focus) {
                    fit(cmdLine, action);
                } else {
                    it(cmdLine, action);
                }
            }
        }
    }

    static createCommandState(): CommandState {
        return new CommandState();
    }


    static createCommandContext(device?: CiscoDevice, enabled: boolean = true,
        confTerminal: boolean = true, confInterface: boolean = true): CiscoCommandContext {
        if (!device) {
            device = new CiscoDevice(
                {
                    name: 'Switch',
                    subtype: 'IOSv',
                    interfaces: [
                        { name: 'GigabitEthernet1/0' },
                        { name: 'GigabitEthernet1/1' }
                    ]
                }
            );
        }
        return {
            // default context
            enabled: enabled,
            confTerminal: confTerminal,
            confInterface: confInterface,
            interfaces: [],
            device: device,
            actions: new MockCiscoCommandActions
        };
    }

    static TestInvoke(context: CiscoCommandContext, target: TerminalCommand,
        commandLine: string): CommandTestCaseResult {

        const parsed = CiscoCommandParser.Parse(commandLine, [target]);

        const cmdState = CommandTester.createCommandState();
        // TODO: cmdState.parameters = parsed.parameters;
        for (let index = parsed.commands.length - 1; index >= 0; index--) {
            const command = parsed.commands[index].command;
            let handler = command.handler;
            if (handler === undefined) {
                handler = NotSupportedCommand.NotSupported;
            }
            if (handler) {
                cmdState.command = parsed.commands[index];
                handler(context, cmdState);
                if (cmdState.stopProcessing) {
                    break;
                }
            }
        }

        const result = { cmdState, model: {}, contextModel: {} };
        let state = new StateContainer(result.model);
        for (const stateChange of cmdState.changes) {
            state.setProperty(stateChange.selector, stateChange.value);
        }
        state = new StateContainer(result.contextModel);
        for (const stateChange of cmdState.contextChanges) {
            state.setProperty(stateChange.selector, stateChange.value);
        }

        return result;
    }
}
