import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../cisco-terminal-command';
import { NotSupportedCommand } from './notsupported';
import { showCommand } from './../commands/show-commands/show-command';
import { doCommand } from '../commands/confterm-commands/do-command';
import { unsupportedDeviceCommands } from "./device-commands-unsupported";
import { CommandConstants } from "../common/cisco-constants";

class DeviceCommands {
    static Enable(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return cmdState;
        }
        cmdState.ChangeContextProperty('enabled', true);
        return cmdState;
    }
}

let enableCommand: TerminalCommand = {
    name: 'enable',
    description: 'Turn on privileged commands',
    handler: DeviceCommands.Enable
};


let pingCommand: TerminalCommand = {
    name: 'ping',
    description: 'Send echo messages',
    parameters: [
        //'(word)': {}
    ],

    children: [
        { name: 'apollo', description: 'Apollo echo', handler: undefined },
        { name: 'appletalk', description: 'Appletalk echo', handler: undefined },
        { name: 'clns', description: 'CLNS echo', handler: undefined },
        { name: 'decnet', description: 'decnet echo', handler: undefined },
        { name: 'ethernet', description: 'ethernet echo', handler: undefined },
        { name: 'ip', description: 'IP echo', handler: undefined },
        { name: 'ipv6', description: 'IPv6 echo', handler: undefined },
        { name: 'mpls', description: 'mpls echo', handler: undefined },
        { name: 'srb', description: 'srb echo', handler: undefined },
        { name: 'tag', description: 'Tag encapsulated IP echo', handler: undefined },
        { name: 'vines', description: 'Vines echo', handler: undefined },
        { name: 'xns', description: 'XNS echo', handler: undefined }
    ],
    handler: NotSupportedCommand.NotImplemented
};

let accessEnable: TerminalCommand = {
    name: 'access-enable',
    description: 'Create a temporary Access-List entry',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
let accessPing: TerminalCommand = {
    name: 'access-ping',
    description: 'Send echo messages',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};


export let deviceCommands: TerminalCommand[] = [
    enableCommand,
    pingCommand,
    showCommand,
    doCommand,
    ...unsupportedDeviceCommands    //NOTE: if you add support for a command, make sure to take it out of the unsupported list.
];
