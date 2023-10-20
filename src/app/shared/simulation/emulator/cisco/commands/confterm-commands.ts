import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../cisco-terminal-command';
import { NotSupportedCommand } from './notsupported';
import { CiscoCommandParser } from '../command-parser';
import { interfaceCommand, interfaceRangeCommand } from './confterm-commands/interface-command';
import { vtpCommand } from '../commands/confterm-commands/vtp-commands/vtp-command';
import { spanningTreeCommand } from './confterm-commands/spanning-tree-commands/spanning-tree-command';
import { VlanCommands } from './confterm-commands/vlan-commands';
import { NoCommands } from '../commands/no-commands';
import { doCommand } from './confterm-commands/do-command';
import { unsupportedConftermCommands } from './confterm-commands-unsupported';
import { CommandConstants } from '../common/cisco-constants';

class ConfigureTerminalCommands {

    static Exit(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.parameters[0]) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }
        cmdState.ChangeContextProperty('confTerminal', false);
    }

    static AccessList(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: access-list
        throw new Error('Not Implemented');
        // return cmdState;
    }

    static Ip(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: ip
        throw new Error('Not Implemented');
        // return cmdState;
    }
    static End(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.parameters[0]) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }
        cmdState.ChangeContextProperty('confTerminal', false);
    }
    static Shell(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return cmdState;
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
        }
        return cmdState;
    }
}

// ********** Configure Terminal
const accessList: TerminalCommand = {
    name: 'access-list', description: 'Add an access list entry',
    children: [
        // TODO: 'source'
        // TODO: 'destination'
    ],
    parameters: [
        // '(number or "compiled" or "dynamic-extended" or "rate-limit")': {},
        // '("deny" or "dynamic" or "permit" or "remark")': {},
        // '(number 0-255 or "ahp" or "eigrp" or "esp" or "gre" or "icmp" or "igmp" or "ip" or "ipinip" or "nos" or
        //      "object-group" or "ospf" or "pcp" or "pim" or "sctp" or "tcp" or "udp")': {},
        // '(ip address or "any" or "host" or "object-group")': {}
        // // TODO: 'access-list 100 permit gre host 4.4.4.4 host 3.3.3.3'
        // // TODO: 'access-list 100 permit gre host 4.4.4.4 3.3.3.3 0.0.0.0'
        // // TODO: 'access-list 100 permit gre 4.4.4.4 0.0.0.0 3.3.3.3 0.0.0.0'
        // // TODO: 'access-list 100 permit gre 4.4.4.4 0.0.0.0 host 3.3.3.3'
    ],
    handler: ConfigureTerminalCommands.AccessList
};

const ipGlobalCommand: TerminalCommand = {
    name: 'ip',
    description: 'Global IP configuration subcommands',
    handler: ConfigureTerminalCommands.Ip
};

const exitCommand: TerminalCommand = {
    name: 'exit',
    description: 'Exit from the Exec',
    handler: ConfigureTerminalCommands.Exit
};

const connectCommand: TerminalCommand = {
    name: 'connect',
    description: 'cross-connect two interfaces',
    parameters: [],
    handler: NotSupportedCommand.NotSupported
};
const endCommand: TerminalCommand = {
    name: 'end',
    description: 'Exit from configure mode',
    handler: ConfigureTerminalCommands.End
};
const shellCommand: TerminalCommand = {
    name: 'shell',
    aliases: ['sh'],
    description: 'Configure shell command',
    children: [
        { name: 'init', description: 'Initialisation options' },
        { name: 'map', description: 'Map event trigger to function' },
        { name: 'processing ', description: 'Enable shell processing' },
        { name: 'trigger ', description: 'Set shell trigger configuration' }
    ],
    handler: ConfigureTerminalCommands.Shell
};

export let configureTerminalCommands: TerminalCommand[] = [
    interfaceCommand,
    // current matching logic doesn't favor an exact match, so 'interface' ambiguously matches interface & interfaceRange
    // interfaceRangeCommand,
    accessList,
    ipGlobalCommand,
    exitCommand,
    vtpCommand,
    connectCommand,
    spanningTreeCommand,
    VlanCommands.confTermVlanCommand,
    NoCommands.NoConfTermCommand,
    doCommand,
    endCommand,
    shellCommand,
    ...unsupportedConftermCommands
    // NOTE TO DEVELOPERS: if you add another command, make sure to remove it from the unsupported commands list
];
