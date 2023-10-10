import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../cisco-terminal-command';
import { ipCommand } from './ip-command';
import { showCommand } from './show-commands/show-command';
import { channelGroupCommand, noChannelGroupModeCommand } from './channel-group-command';
import { switchportCommand } from './confinterface-commands/switchport-command';
import { ShutdownCommand } from "./confinterface-commands/shutdown-command";
import { channelProtocol, noChannelProtocol } from './confinterface-commands/channel-protocol-command';
import { doCommand } from "./confterm-commands/do-command";
import { interfaceCommand } from "./confterm-commands/interface-command";
import { noSwitchportCommand } from './confinterface-commands/no-switchport-command';
import { noSpanningTreeCommand } from "./confterm-commands/spanning-tree-commands/no-spanning-tree-command";
import { unsupportedConfInterfaceCommands } from "./confinterface-commands-unsupported";
import { NointerfaceCommand } from "./confterm-commands/no-interface-command";

class ConfigureInterfaceCommands {

    static Tunnel(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: tunnel
        throw new Error('Not Implemented');
    }

    static TunnelAddress(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: tunnel address
        throw new Error('Not Implemented');
    }

    static KeepAlive(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: keepalive
        throw new Error('Not Implemented');
    }

    static ShutDown(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: shutdown
        throw new Error('Not Implemented');
    }

    static Exit(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.ChangeContextProperty('interfaceSelector', undefined);
    }


    static Do(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: Do
        throw new Error('Not Implemented');
    }

    static No(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: No
        // convert each output state change to default/no value
        //CHECK to see is NO Command is vlan:
        let cmd: any[] = cmdState.command.parameters;
        if (cmd[0] === 'vlan' && /^\d+$/.test(cmd[1])) {
            cmdState.stopProcessing = true;
            cmdState.output = '%Default VLAN ' + cmd[1] + ' may not be deleted.';
            return cmdState;
        }
        throw new Error('Not Implemented');
    }

    static Vtp(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: No
        // convert each output state change to default/no value
        //throw new Error('Not Implemented');
        cmdState.output = '% Incomplete Command';
        return cmdState;
    }
    //static End(cmdContext: CiscoCommandContext, cmdState: CommandState) {
    // if(cmdState.parameters[0]) {
    //   cmdState.stopProcessing = true;
    // cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
    //}
    //cmdState.ChangeContextProperty('confTerminal', false);
    //}
    static End(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.ChangeContextProperty('interfaceSelector', undefined);
        cmdState.ChangeContextProperty('confTerminal', false);
        cmdState.stopProcessing = true;
    }

}

let exitCommand: TerminalCommand = {
    name: 'exit',
    description: 'Exit from the Exec',
    handler: ConfigureInterfaceCommands.Exit
};

let tunnel: TerminalCommand = {
    name: 'tunnel',
    description: 'Tunnel interface',
    children: [{
        name: 'address',
        description: 'Tunnel interface number',
        parameters: [
            // '(ip address)': {},
            // '(subnet mask)': {}
        ], handler: ConfigureInterfaceCommands.TunnelAddress
    }],
    parameters: [
        // (source or destination) then (ip address or hostname)
        // (key) then (number 0-4294967295)
        // (mode) then
        // (aurp or cayman or dvmrp or eon or gre or ipip or ipsec or iptalk or ipv6 or ipv6ip or mpls or nos or rbscp or udp)
        // (gre) then (ip or ipv6 or multipoint)
    ],
    handler: ConfigureInterfaceCommands.Tunnel
};

let keepalive: TerminalCommand = {
    name: 'keepalive',
    description: 'Enable keepalive',
    handler: ConfigureInterfaceCommands.KeepAlive
};

let shutdown: TerminalCommand = {
    name: 'shutdown',
    description: 'Shitdown the selected interface',
    handler: ConfigureInterfaceCommands.ShutDown
};

// TODO: vtp 
// TODO: spanning-tree

// vvv-- Used by scoring --vvv
// TODO: channel-protocol
// ^^^-- Used by scoring --^^^

let negatableCommands: TerminalCommand[] = [
    noChannelGroupModeCommand,
    ipCommand,
    tunnel,
    keepalive,
    noChannelProtocol,
    ShutdownCommand.noShutdown,
    noSwitchportCommand,
    noSpanningTreeCommand,
    NointerfaceCommand
];
let noCommand: TerminalCommand = {
    name: 'no',
    description: 'Negate a command or set its defaults',
    children: negatableCommands,
    handler: ConfigureInterfaceCommands.No
};

let vtpCommand: TerminalCommand = {
    name: 'vtp',
    description: 'Ignores VLAN updates from other switches',
    parameters: [
        // '(mode or ...)': {},
        // '(transparent or ...)': {}
    ],
    handler: ConfigureInterfaceCommands.Vtp
};
let endCommand: TerminalCommand = {
    name: 'end',
    description: 'Exit from configure mode',
    handler: ConfigureInterfaceCommands.End
};
export let configureInterfaceCommands: TerminalCommand[] = [
    channelGroupCommand,
    channelProtocol,
    ipCommand,
    interfaceCommand, //this command is legal in this context.
    tunnel,
    switchportCommand,
    keepalive,
    ShutdownCommand.shutdownCommand,
    noCommand,
    exitCommand,
    vtpCommand,
    doCommand,
    endCommand,
    ...unsupportedConfInterfaceCommands
];
