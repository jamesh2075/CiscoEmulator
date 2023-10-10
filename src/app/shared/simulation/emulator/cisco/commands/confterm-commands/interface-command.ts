import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { ICiscoDevice, ICiscoInterface } from '../../icisco-device';
import { CiscoTerminalContext, CiscoCommandContext, InterfaceSelector } from '../../cisco-terminal-command';
import { CiscoCommandParser } from '../../command-parser';
import { UtilityCommands } from "../utility-commands";
import { CiscoValidators } from "../../common/cisco-validators";
import { CiscoUtils } from "../../common/cisco-utils";
import { InterfaceInfo } from "../../common/cisco-interface-info";
import { PortController } from "../../controllers/port-controller";
import { CiscoDevice } from "../../cisco-device";
import { CiscoInterface } from "../../cisco-interface";
import { CommandConstants } from "../../common/cisco-constants";
import { plainToClass } from "class-transformer";
import { CiscoTerminal } from '../../cisco-terminal';


export class InterfaceCommands {


    static Interface(cmdContext: CiscoCommandContext, cmdState: CommandState, isShowParameter?: boolean) {
        let interfaceSelector = undefined;
        for (let index = 0; index < cmdState.command.parameters.length; index++) {
            let param = cmdState.command.parameters[index];
        }

        let interfaceInfo = cmdState.properties['interfaceInfo'];
        if (interfaceInfo) {
            let hasRange = cmdState.properties['range'] !== undefined;
            if (!hasRange && interfaceInfo.isRange) {
                cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                cmdState.stopProcessing = true
            } else {
                interfaceSelector = {
                    name: interfaceInfo.type,
                    range: interfaceInfo.numberToken
                }
                if (interfaceInfo.longName.toLowerCase() === 'port-channel') {
                    let channelGroupId: number = interfaceInfo.port;
                    PortController.CreatePortChannel(cmdContext, cmdState, channelGroupId);
                } else {
                    let interfaces: ICiscoInterface[];
                    if (interfaceSelector && Object.keys(interfaceSelector).length > 0) {
                        let device = cmdContext.device as ICiscoDevice;
                        interfaces = device.getInterfaces(interfaceSelector);
                    }
                    if (!interfaces) {
                        cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                        cmdState.stopProcessing = true
                    }
                }
            }
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true
        }
        cmdState.ChangeContextProperty('interfaceSelector', interfaceSelector);
        return cmdState;
    }

    static GigabitEthernetRange(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let interfaceInfo = undefined;
        let interfaceId = cmdState.command.token;
        if (cmdState.properties['range']) {
            interfaceId += cmdState.properties['range'];
        } else {
            interfaceInfo = InterfaceInfo.getInterfaceInfo(interfaceId);
            if(interfaceInfo.inputTokenNumber) {
                cmdState.properties['range'] = interfaceInfo.inputTokenNumber;
            }
        }

        // if (cmdState.properties['range'])
        //     //TODO: Is this ever set?
        //     interfaceId += cmdState.properties['range'];
        // else {
        //TODO: A: int range gi1/1, gi1/3 -> interfaceId = gi1/1,gi1/3 DOES NOT VALIDATE
        //TODO: B: int range gi1/1,gi1/3 -> interfaceId = gi1/1,gi1/3 DOES NOT VALIDATE
        //TODO: C: int range gi1/1 -> interfaceId = gi1/1 VALIDATES
        //TODO: D: int range gi1/1-2 -> interfacidId = gi1/1-2 VALIDATES
        let index = 0;
        while (cmdState.command.parameters[index]) {
            interfaceId += cmdState.command.parameters[index];
            ++index;
            // }
        }

        //TODO: A: At this point if there is a comma this will not validate
        //TODO: Ensure that this stll works with new interface
        interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
        if (interfaceInfo.isValid === false) {
            cmdState.output = interfaceInfo.error;
            cmdState.stopProcessing = true;
            if(cmdState.properties['range'] !== undefined) {
                let token = interfaceInfo.inputToken;
                if(token.indexOf('-') === token.length - 1) {
                    cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
                }
            }
        }
        else {
            cmdState.properties['interfaceInfo'] = interfaceInfo;
            cmdState.properties['number'] = interfaceInfo.numberToken;
        }

        return cmdState;
    }

    static GigabitEtherenetParser(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let interfaceId = cmdState.command.token;
        if (cmdState.properties.number) {
            interfaceId += cmdState.properties.number;
        }
        //TODO: Ensure that this still works with new interface
        let interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
        if (interfaceInfo.isValid === false) {
            cmdState.output = interfaceInfo.error;
            cmdState.stopProcessing = true;
        }
        else {
            cmdState.properties['interfaceInfo'] = interfaceInfo;
            cmdState.properties['number'] = interfaceInfo.numberToken;
        }
    }

    static GigabitEthernetAcceptor(token: string): boolean {
        //TOOD: Replace with validateInterfaceId
        // let interfaceInfo = InterfaceInfo.getInterfaceInfo(token);
        // if(interfaceInfo.type && interfaceInfo.type.toLowerCase() == 'gigabitethernet' ) {
        //     return true;
        // }
        // return false;

        let match = token.match(/^([^\d]+)(\d.*)?/); //match on gi1/0-1 gi2/3
        if (match) {
            let text = match[1];
            return 'gigabitethernet'.toLowerCase().startsWith(text.toLowerCase());
        }
        return false;
    }

    static InterfaceRangeNumbers(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let token = cmdState.command.token + '';
        let index = 0;
        while (cmdState.command.parameters[index]) {
            token += cmdState.command.parameters[index];
            ++index;
        }
        let range = InterfaceCommands.EtherentRangeParser(token);
        if (range.success === true)
            cmdState.properties['range'] = token;
        else {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }
    }

    static InterfaceNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //TODO: Use InterfaceInfo - remove EthernetRangeParser
        let token = cmdState.command.token;
        let range = InterfaceCommands.EtherentRangeParser(token);
        if (range.success === true)
            cmdState.properties['number'] = token;
        else {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }
    }

    static PortChannelCommand(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['interfaceType'] = cmdState.command.command.name;
        let interfaceId = cmdState.command.token;
        if (cmdState.properties.number) {
            interfaceId += cmdState.properties.number;
        }
        //TODO: Ensure that this still works with new interface
        let interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
        if (interfaceInfo.isValid === false) {
            cmdState.output = interfaceInfo.error;
            cmdState.stopProcessing = true;
        }
        else {
            cmdState.properties['interfaceInfo'] = interfaceInfo;
            cmdState.properties['number'] = interfaceInfo.numberToken;
        }
    };

    static PortChannelNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //if it got here, it's because it was accepted by the parser
        let token = cmdState.command.token;
        if (Number(token) === 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
        } else {
            cmdState.properties['number'] = token;
        }
    }

    static LoopbackCommand(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['interfaceType'] = cmdState.command.command.name;
        let interfaceId = cmdState.command.token;
        if (cmdState.properties.number) {
            interfaceId += cmdState.properties.number;
        }
        //TODO: Ensure that this still works with new interface
        let interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
        if (interfaceInfo.isValid === false) {
            cmdState.output = interfaceInfo.error;
            cmdState.stopProcessing = true;
        }
        else {
            cmdState.properties['interfaceInfo'] = interfaceInfo;
            cmdState.properties['number'] = interfaceInfo.numberToken;
        }
    };

    static LoopbackNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //if it got here, it's because it was accepted by the parser
        let token = cmdState.command.token;
        cmdState.properties['number'] = token;
    }

    static GERangeAcceptor(token: string): boolean {
        let match = token.match(/^(\d+)\/(\d+)(-(\d+))?/);
        if (match) {
            return true;
        }
        return false;
    }

    static PortChannelAcceptor(token: string): boolean {
        let match = token.match(/p(.*\d)?/i);
        if (match) {
            return true;
        }
        return false;
    }

    static LoopbackAcceptor(token: string): boolean {
        let match = token.match(/l(.*\d)?/i);
        if (match) {
            return true;
        }
        return false;
    }

    private static EtherentRangeParser(token: string) {
        //TODO: Use interfaceInfo
        // [0-3]/[0-2]-[1-3] , [0-3]/[0-2]-[1-3] , [0-3]/[0-2]-[1-3] , [0-3]/[0-2]-[1-3]
        let match = token.match(/^(\d+)\/(\d+)(-(\d+))?(,(\d+)\/(\d+)(-(\d+))?)*/);
        if (match) {
            return {
                success: true,
                slot: parseInt(match[1]),
                rangestart: parseInt(match[2]),
                rangeend: parseInt(match[3])
            };
        } else {
            return { success: false };
        }
    }

}

let interfaceNumberCommand: TerminalCommand = {
    name: '<0-9>',
    description: 'GigabitEthernet interface number',
    handler: InterfaceCommands.InterfaceNumber,
    validator: InterfaceCommands.GERangeAcceptor
};

let interfaceRange: TerminalCommand = {
    name: 'Interface Range',
    description: 'interface range command',
    handler: InterfaceCommands.InterfaceRangeNumbers,
    validator: InterfaceCommands.GERangeAcceptor
};


export let interfaceRangeCommand: TerminalCommand = {
    name: 'range', description: 'interface range command',
    parameters: [
        // TODO: parameter - (interface range)
        //'rangeName'
    ],
    children: [
        // TODO: this first child needs a handler to deal with no-space commands
        {
            name: 'GigabitEthernet', description: 'GigabitEthernet IEEE 802.3Z',
            children: [interfaceRange],
            handler: InterfaceCommands.GigabitEthernetRange,
            validator: InterfaceCommands.GigabitEthernetAcceptor
        },
        { name: 'Tunnel', description: 'Tunnel interface' },
        { name: 'Loopback', description: 'Loopback interface' },
        { name: 'Port-channel', description: 'Ethernet Channel of interfaces' },
        { name: 'Vlan', description: 'Catalyst Vlans' },
        { name: 'macro', description: 'macro keyword' },
        { name: 'create', description: 'create keyword' },
    ],
    handler: UtilityCommands.NoopCommandHandler
};

export let interfaceCommand: TerminalCommand = {
    name: 'interface',
    description: 'Select an interface to configure',
    parameters: [],
    children: [
        interfaceRangeCommand,
        {
            name: 'GigabitEthernet', description: 'GigabitEthernet IEEE 802.3z',
            children: [interfaceNumberCommand],
            handler: InterfaceCommands.GigabitEtherenetParser,
            validator: InterfaceCommands.GigabitEthernetAcceptor
        },
        { name: 'Tunnel', description: 'Tunnel interface' },
        {
            name: 'Loopback',
            description: 'Loopback interface',
            // children: [
            //     {
            //         name: '<0-2147483647>', description: '<0-2147483647> Loopback interface number',
            //         handler: InterfaceCommands.LoopbackNumber,
            //         validator: (token: string): boolean => CiscoValidators.validateRange(token, 1, 2147483647)
            //     }],
            // handler: InterfaceCommands.LoopbackCommand,
            // validator: InterfaceCommands.LoopbackAcceptor
        },
        {
            name: 'Port-channel',
            description: 'Ethernet Channel of interfaces',
            children: [
                {
                    name: '<1-64>', description: 'Port-channel interface number',
                    handler: InterfaceCommands.PortChannelNumber,
                    validator: (token: string): boolean => CiscoValidators.validateRange(token, 0, 64)
                }],
            handler: InterfaceCommands.PortChannelCommand,
            validator: InterfaceCommands.PortChannelAcceptor
        },
    ],
    handler: InterfaceCommands.Interface
};
