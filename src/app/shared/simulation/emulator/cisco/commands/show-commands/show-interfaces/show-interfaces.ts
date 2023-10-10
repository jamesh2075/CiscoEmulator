import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { StateContainer } from '../../../../emulator-state';
import { CiscoCommandParser } from '../../../command-parser';
import { CiscoCommandContext, CiscoTerminalContext } from '../../../cisco-terminal-command';
import { BuildInterfacesDataOutput } from './show-interfaces-output';
import { BuildOutput as InterfacesStatusOutput } from './show-interfaces-status-output';
import { DescriptionOutput } from './show-interfaces-description-output';
import { InterfacesTrunkOutput } from './show-interfaces-trunk-output';
import { CommandConstants } from "../../../common/cisco-constants";
import { InterfaceInfo } from "../../../common/cisco-interface-info";
import { InterfaceCommands } from "./../../confterm-commands/interface-command";
import { BuildInterfacesSwitchportOutput } from "./show-interfaces-switchport/show-switchport-output";
import { NotSupportedCommand } from '../../../commands/notsupported';
import { unsupportedShowInterfacesCommands } from "../show-interfaces/show-interfaces-commands-unsupported";


class ShowInterfacesCommands {


    static statusHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //let interfaces = cmdState.getProperty(['interfaces']);
        cmdState.output = InterfacesStatusOutput.getInterfaceStatusOutput(cmdContext.device.model.interfaces);
        cmdState.stopProcessing = true;
        return cmdState;
    }

    static showTrunkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //let interfaces = cmdState.getProperty(['interfaces']);
        cmdState.output = InterfacesTrunkOutput.getInterfacesTrunkOutput(cmdContext.device.model.interfaces, cmdContext.device.model.vlans);
        cmdState.stopProcessing = true;
        return cmdState;
    }

    static descriptionHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //let interfaces = cmdState.getProperty(['interfaces']);
        cmdState.output = DescriptionOutput.getInterfacesDescriptionOutput(cmdContext.device.model.interfaces);
        cmdState.stopProcessing = true;
        return cmdState;
    }

    static showInterfaceSwitchportHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        cmdState.properties["switchportInterface"] = 'switchport';
        return cmdState;
    }
    static GERangeAcceptor(token: string): boolean {
        let match = token.match(/^(\d+)\/(\d+)(-(\d+))?/);
        if (match) {
            return true;
        }
        return false;
    }

    static PortChannelAcceptor(token: string): boolean {
        let match = token.match(/p(.*\d)?/);
        if (match) {
            return true;
        }
        return false;
    }

    static portNumberHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['portNumber'] = cmdState.command.token;
        return cmdState;
    }

    static showInterfacesHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        let outputInterfaces: any[] = [];
        let interfaceInfo = undefined;
        let hasPortNumber = cmdState.properties['portNumber'];
        let hasParameters = Object.keys(cmdState.command.parameters) && Object.keys(cmdState.command.parameters).length > 0;
        if (hasPortNumber || hasParameters) {
            let interfaceId = undefined;
            if (hasParameters) {
                interfaceId = cmdState.command.parameters[0];
                interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
                if (interfaceInfo.isValid === false) {
                    if (cmdState.command.parameters[1]) {
                        interfaceId = cmdState.command.parameters[0] + cmdState.command.parameters[1];
                        interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
                    }
                }
            } else if (hasPortNumber) {
                interfaceId = cmdState.command.token + cmdState.properties['portNumber'];
            }
            interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
            if (interfaceInfo.isValid === true) {
                let interfaceList = cmdContext.device.model.interfaces;
                for (let i = 0; i < interfaceList.length; i++) {
                    let port = interfaceList[i];
                    if (port.name.toLowerCase() === interfaceInfo.fullName.toLowerCase()) {
                        outputInterfaces.push(port);
                    }
                }
            }
            else {
                cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            }
        }
        else {
            outputInterfaces = cmdContext.device.model.interfaces;
        }
        if (outputInterfaces.length > 0) {
            cmdState.output = (cmdState.properties["switchportInterface"]) ? BuildInterfacesSwitchportOutput.buildSwitchportInterfacesOutput(outputInterfaces, cmdContext.device.model.vlans)
                : BuildInterfacesDataOutput.getOutput(outputInterfaces);
        }
        else {
            if (interfaceInfo && interfaceInfo.isValid) {
                cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            } else {
                cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            }
        }

        cmdState.stopProcessing = true;
        return cmdState;
    }

}
let interfacesTrunk: TerminalCommand = {
    name: 'trunk',
    description: 'Show interface trunk information',
    handler: ShowInterfacesCommands.showTrunkHandler

};

let interfacesStatus: TerminalCommand = {
    name: 'status',
    description: 'Show interface line status',
    handler: ShowInterfacesCommands.statusHandler

};

let interfacesDescription: TerminalCommand = {
    name: 'description',
    description: 'Show interface description',
    handler: ShowInterfacesCommands.descriptionHandler

};

let switchportCommand: TerminalCommand = {
    name: 'switchport',
    description: 'Show interface switchport information',
    children: [
        { name: '|', description: 'Output modifiers' },
        { name: '<cr>', description: '' }
    ],

    handler: ShowInterfacesCommands.showInterfaceSwitchportHandler

};

let gigabitEthernet: TerminalCommand = {
    name: 'gigabitEthernet',
    description: 'Gigabit Ethernet IEEE 802.3z',
    children: [
        {
            name: '<0-64>',
            description: 'GigabitEthernet interface number',
            children: [switchportCommand],
            validator: ShowInterfacesCommands.GERangeAcceptor,
            handler: ShowInterfacesCommands.portNumberHandler

        }],
    handler: ShowInterfacesCommands.showInterfacesHandler

};

let portChannel: TerminalCommand = {
    name: 'port-channel',
    description: 'Ethernet Channel of interfaces',
    children: [
        {
            name: '<0-4095>',
            description: 'Port-channel interface number',
            children: [switchportCommand],
            validator: ShowInterfacesCommands.PortChannelAcceptor,
            handler: ShowInterfacesCommands.portNumberHandler

        }],
    handler: ShowInterfacesCommands.showInterfacesHandler

};
/**
 * 
 */export let showInterfacesCommand: TerminalCommand =
    {
        name: 'interfaces',
        description: 'Interface status and configuration',
        children: [
            ...unsupportedShowInterfacesCommands, interfacesStatus, interfacesTrunk, interfacesDescription,
            switchportCommand, gigabitEthernet, portChannel
        ],

        handler: ShowInterfacesCommands.showInterfacesHandler
    };
