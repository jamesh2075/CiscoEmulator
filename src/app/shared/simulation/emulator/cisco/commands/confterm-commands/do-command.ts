import {TerminalCommand} from '../../../interfaces/terminal-command';
import {CommandState} from '../../../interfaces/command-state';
import {CiscoTerminalContext, CiscoCommandContext, InterfaceSelector} from '../../cisco-terminal-command';
import {CiscoCommandParser} from '../../command-parser';
import {showCommand} from './../../commands/show-commands/show-command';
import { CommandConstants } from '../../common/cisco-constants';

export class DoCommands {
    static doHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        return cmdState;
    }
}


export let doCommand: TerminalCommand = {
    name: 'do',
    description: 'To run exec commands in config mode',
    children: [
        showCommand
    ],
    handler: DoCommands.doHandler,
    noHelp: true
};


