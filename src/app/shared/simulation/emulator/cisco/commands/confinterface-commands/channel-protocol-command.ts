import {TerminalCommand} from '../../../interfaces/terminal-command';
import {CiscoCommandContext} from '../../cisco-terminal-command';
import {CommandState} from '../../../interfaces/command-state';

class ChannelProtocolCommand {

    static Handler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        // To enable Port Aggretation Control Protocol (PAgP) or Link Aggregation Control Protocol (LACP) on an interface
        // to manage channeling, use thechannel-protocol command in interface configuration mode. Use the no form of this
        // command to deselect the protocol.
        //     channel-protocol { lacp | pagp }
        //     no channel-protocol
        // Syntax Description
        //     lacp    Specifies LACP to manage channeling.
        //     pagp    Specifies PAgP to manage channeling.
        // Command Default
        //     pagp

        const selector: string[] = ['channel-group', 'protocol'];
        cmdState.ChangeProperty(selector, cmdState.properties['value']);
    }

    static ValueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = cmdState.command.command.name;
    }

    static NoHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const selector: string[] = ['channel-group', 'protocol'];
        cmdState.ChangeProperty(selector, 'PAgP');
    }
}

export let noChannelProtocol: TerminalCommand = {
    name: 'channel-protocol',
    description: 'Select the channel protocol (LACP, PAgP)',
    children: [],
    handler: ChannelProtocolCommand.NoHandler
};

export let channelProtocol: TerminalCommand = {
    name: 'channel-protocol',
    description: 'Select the channel protocol (LACP, PAgP)',
    children: [
        {
            name: 'lacp',
            description: 'Prepare interface for LACP protocol',
            handler: ChannelProtocolCommand.ValueHandler
        },
        {name: 'pagp', description: 'Prepare interface for PAgP protocol', handler: ChannelProtocolCommand.ValueHandler}
    ],
    handler: ChannelProtocolCommand.Handler
};
