import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../cisco-terminal-command';
import { EventDispatcher } from 'event-dispatch';
import { CommandConstants } from '../common/cisco-constants';
import { CiscoValidators } from '../common/cisco-validators';
import { CiscoUtils } from '../common/cisco-utils';

// channel-group (0-255) mode (active|auto|desirable|on|passive)
// let ChannelGroupModel = {
//   ‘channel-group’ : “(0-255) mode (active|auto|desirable|on|passive)”
// };

export interface IShowChannelGroupItem {
    id: number;
    mode: string;
    protocol: string;
    portChannel: string;
    portChannelStatus: string;
}

export interface IShowPortItem {
    port: string;
    status: string;
}

export class ShowChannelGroupItem implements IShowChannelGroupItem {
    id: number = undefined;
    mode: string = undefined;
    protocol: string = undefined;
    portChannel: string = undefined;
    portChannelStatus: string = undefined;
}

export class ShowPortItem implements IShowPortItem {
    port: undefined;
    status: undefined;
}


const eventDispatcher = new EventDispatcher();
export class ChannelGroupCommand {
    static STRINGS = {
        CHANNEL_GROUP_MODE_ACTIVE: 'active',
        CHANNEL_GROUP_MODE_AUTO: 'auto',
        CHANNEL_GROUP_MODE_DESIRABLE: 'desirable',
        CHANNEL_PROTOCOL_LACP: 'LACP',
        CHANNEL_PROTOCOL_PAgP: 'PAgP',
    };

    static ChannelGroup(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const groupNumber = cmdState.properties['groupNumber'];
        const value = cmdState.properties['groupMode'];
        const interfaces = cmdState.properties['interfaces'];
        if (!groupNumber || !value) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return cmdState;
        }
        let valid = true;
        let message = '';
        for (let i = 0; i < cmdContext.interfaces.length; ++i) {
            const interfaceName = cmdContext.interfaces[i].property('name');
            const shortInterfaceName = cmdContext.interfaces[i].property('shortName');
            const vrfPort = CiscoUtils.getVrfPort();
            if (vrfPort.fullName.toLowerCase() === interfaceName.toLowerCase()) {
                valid = false;
                message = CommandConstants.ERROR_MESSAGES.VRF_PORT;
                break;
            }

            // Jim Eason's Code to remove the interface from the vlans
            const vlans: any[] = cmdContext.device.model.vlans;
            for (const vlan of vlans){
                const vPorts: any[] = vlan.ports;
                const vlanID = vlans.indexOf(vlan);
                for (const port of vPorts)
                {
                    if (port === shortInterfaceName) {
                        const index = vPorts.indexOf(port);
                        cmdContext.device.model.vlans[vlanID].ports.splice(index, 1);
                    }
                }
            }





        }

        if (valid === true) {
            // TODO: Validate the groupNumber is a valid number
            // ((object['channel-group'])[groupNumber]).property = value;
            // let selector = ['channel-group', groupNumber, 'mode'];
            const selector = ['channelGroup'];
            const channelGroup: any = {
                id: Number(groupNumber),
                mode: value,
                protocol: undefined
            };
            const groupMode = cmdState.properties['groupMode'];
            if (groupMode === ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_ACTIVE) {
                channelGroup.protocol = ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_LACP;
            } else if (groupMode === ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_AUTO
                || groupMode === ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_DESIRABLE) {
                channelGroup.protocol = ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_PAgP;
            }
            // value = `${groupNumber} mode ${value}`;
            cmdState.ChangeProperty(selector, channelGroup);
            // additional information from documentation online:
            // mode        Specifies the EtherChannel mode of the interface.
            // active      Enables Link Aggregation Control Protocol (LACP) unconditionally.
            // on          Enables EtherChannel only.
            // auto        Places a port into a passive negotiating state in which the port responds to Port
            //             Aggregation Protocol (PAgP) packets that it receives but does not initiate PAgP packet negotiation.
            // non-silent  (Optional) Used with the auto or desirable mode when traffic is expected from the other device.
            // desirable   Places a port into an active negotiating state in which the port initiates negotiations
            //             with other ports by sending PAgP packets.
            // passive     Enables LACP only when an LACP device is detected.

            // let selector2:string[] = cmdState.getProperty('interfaces');
            // selector2.unshift('Port-channel1');
            // //todo: validate that there is a value in the properties
            // let value2 = '';

            // cmdState.ChangeProperty(selector2, value2);


            // cmdState.ChangeProperty(['interfaces'],`Portchannel${groupNumber}`);

            cmdState.DispatchEvent(CommandConstants.EVENTS.CHANNEL_GROUP_CHANGED, { channelGroup: channelGroup });
        } else {
            cmdState.output = message;
            cmdState.stopProcessing = true;
        }
        return cmdState;

    }

    static ChannelGroupNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['groupNumber'] = cmdState.command.token;
        if (!CiscoValidators.validateRange(cmdState.command.token,
            CommandConstants.ETHERCHANNEL.min, CommandConstants.ETHERCHANNEL.max)) {

            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
        }

        return cmdState;
    }

    static ModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.parameters[0]) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }
        return cmdState;
    }

    static ChannelGroupModeParam(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['groupMode'] = cmdState.command.command.name;
    }
}
const channelGroupMode: TerminalCommand = {
    name: 'mode',
    description: 'Etherchannel Mode of the interface',
    children: [
        { name: 'active', description: 'Enable LACP unconditionally',
                handler: ChannelGroupCommand.ChannelGroupModeParam },
        { name: 'auto', description: 'Enable PAgP only if a PAgP device is detected',
                handler: ChannelGroupCommand.ChannelGroupModeParam },
        { name: 'desirable', description: 'Enable PAgP unconditionally',
                handler: ChannelGroupCommand.ChannelGroupModeParam },
        { name: 'on', description: 'Enable Etherchannel only',
                handler: ChannelGroupCommand.ChannelGroupModeParam },
        { name: 'passive', description: 'Enable LACP only if a LACP device is detected',
                handler: ChannelGroupCommand.ChannelGroupModeParam }
    ],
    handler: ChannelGroupCommand.ModeHandler,
    notTerminalFlag: true
};


const channelGroupNumber: TerminalCommand = {
    name: '<1-255>',
    description: 'Channel group number ',
    children: [
        channelGroupMode
    ],
    handler: ChannelGroupCommand.ChannelGroupNumber,
    validator: (function (token: string) {
        return CiscoValidators.isNumber(token);
    }),
    notTerminalFlag: true
};


// channel-group 234 mode active
export let channelGroupCommand: TerminalCommand = {
    name: 'channel-group',
    description: 'Etherchannel/port bundling configuration',
    children: [
        channelGroupNumber,
        { name: 'auto', description: 'Enable LACP auto on this interface' },
    ],
    parameters: [

        // '(channel group number)': {},
        // '(mode or ...)': {},
        // '(active or ...)': {}
    ],
    handler: ChannelGroupCommand.ChannelGroup,
    notTerminalFlag: true
};

export class NoChannelGroupCommands {
    static NoChannelGroupHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.stopProcessing = true;
        const groupNumber = cmdState.properties['groupNumber'];
        const value = cmdState.properties['groupMode'];
        if (!groupNumber ? value : !value) { // XOR Case for number and value to handle outputs as per VIRL
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
            return cmdState;
        }

        const selector = ['channelGroup'];
        cmdState.ChangeProperty(selector, null);
        return cmdState;
        // cmdState.DispatchEvent(CommandConstants.EVENTS.CHANNEL_GROUP_CHANGED, { channelGroup: channelGroup });
    }
}

export let noChannelGroupModeCommand: TerminalCommand = {
    name: 'channel-group',
    description: 'Etherchannel Mode of the interface',
    parameters: [],
    handler: NoChannelGroupCommands.NoChannelGroupHandler,
    children: [
        channelGroupNumber,
        { name: 'auto', description: `Enable LACP auto on this interface` }
    ]
};


// export let noChannelGroupCommand: TerminalCommand = {
//   name: 'channel-group',
//   description: '',
//   parameters: [],
//   handler: NoChannelGroupCommands.NoChannelGroupHandler,
//   children: [
//     {name: 'mode', description: null, handler: NoChannelGroupCommands.NoChannelGroupHandler}
//   ]
// }

// export class NoChannelProtocolCommands {
//   static NoChannelGroupHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
//     cmdState.stopProcessing = true;
//     let groupNumber = cmdState.properties['groupNumber'];
//     let value = cmdState.properties['groupMode'];
//     //let result: string = '';
//     let selector = ['channelGroup'];
//     let channelGroup: any = {
//       id: Number(groupNumber),
//       mode: value,
//     };

//     let interfaces: any [] = cmdContext.interfaces;
//       for (let i = interfaces.length - 1; i >= 0; i--) {
//         let g: any = interfaces[i];
//         //if (g.model.id === groupId) {
//           cmdState.ChangeProperty(selector, null);
//         //}
//       }
//     //cmdState.output = result;
//   }
// }

// export let noChannelProtocolCommand: TerminalCommand = {
//   name: 'channel-protocol',
//   description: '',
//   parameters: [],
//   handler: NoChannelProtocolCommands.NoChannelGroupHandler,
//   children: [
//     {name: 'mode', description: null, handler: NoChannelProtocolCommands.NoChannelGroupHandler}
//   ]
// }
