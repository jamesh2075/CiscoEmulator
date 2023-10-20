import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext, InterfaceSelector } from '../../cisco-terminal-command';
import { CiscoCommandParser } from '../../command-parser';
import { UtilityCommands } from '../utility-commands';
import { CiscoValidators } from '../../common/cisco-validators';
import { CiscoUtils } from '../../common/cisco-utils';
import { PortController } from '../../controllers/port-controller';
import { CiscoDevice } from '../../cisco-device';
import { CommandConstants } from '../../common/cisco-constants';
import { plainToClass } from 'class-transformer';
import { InterfaceInfo } from '../../common/cisco-interface-info';


export class NoInterfaceCommands {

    static NoInterfaceHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // if it got here, it's because it was accepted by the parser
        const token = cmdState.command.token;
        cmdState.properties['number'] = token;
    }

    static NoPortChannelNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // if it got here, it's because it was accepted by the parser
        if (cmdState.command.token) {
            cmdState.properties['portChannelNumber'] = parseInt(cmdState.command.token, 10);
        }
        const token = cmdState.command.token;
        // if(Number(token) === 0) {
        // cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
        // cmdState.stopProcessing = true;
        //  } else {
        // cmdState.properties['number'] = token;

        //
    }


    static NoPortChannelHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let interfaceId = cmdState.command.token;
        if (cmdState.properties.portChannelNumber) {
            interfaceId += cmdState.properties.portChannelNumber;
        }

        const interfaceInfo = InterfaceInfo.validateInterfaceId(interfaceId);
        if (interfaceInfo.isValid === false) {
            cmdState.output = interfaceInfo.error;
            cmdState.stopProcessing = true;
        }


        const portChannelValue = Number(cmdState.properties['portChannelNumber']);
        cmdState.DispatchEvent(CommandConstants.EVENTS.NO_PORT_CHANNEL, { portChannelValue: interfaceInfo['port'] });
        cmdState.stopProcessing = true;
        return cmdState;

    }

    static NoPortChannelAcceptor(token: string): boolean {
        // TODO: Switch to validateInterfaceId
        // int range gi1/0, gi1/2: token = 'range'
        // int range gi1/1: token = range
        const match = token.match(/p(.*\d)?/);
        if (match) {
            return true;
        }
        return true;
    }

}



const interfaceRange: TerminalCommand = {
    name: 'Interface Range',
    description: 'interface range command'
};

export let interfaceRangeCommand: TerminalCommand = {
    name: 'range', description: 'interface range command',
    parameters: [
        // TODO: parameter - (interface range)
        // 'rangeName'
    ],
    children: [
        // TODO: this first child needs a handler to deal with no-space commands
        {
            name: 'GigabitEthernet', description: 'GigabitEthernet IEEE 802.3Z',
            children: [interfaceRange]
        },
        { name: 'Tunnel', description: 'Tunnel interface' },
        { name: 'Loopback', description: 'Loopback interface' },
        { name: 'Port-channel', description: 'Ethernet Channel of interfaces' },
        { name: 'Vlan', description: 'Catalyst Vlans' },
        { name: 'macro', description: 'macro keyword' },
        { name: 'create', description: 'create keyword' },
    ]
};

export let NointerfaceCommand: TerminalCommand = {
    name: 'interface',
    description: 'Select an interface to configure',
    parameters: [],
    children: [
        interfaceRangeCommand,
        {
            name: 'GigabitEthernet', description: 'GigabitEthernet IEEE 802.3z',
        },
        { name: 'Tunnel', description: 'Tunnel interface' },
        { name: 'Loopback', description: 'Loopback interface' },
        {
            name: 'Port-channel',
            description: 'Ethernet Channel of interfaces',
            children: [
                {
                    name: '<1-64>', description: 'Port-channel interface number',
                    handler: NoInterfaceCommands.NoPortChannelNumber,
                    validator: (token: string): boolean => CiscoValidators.validateRange(token, 0, 64)
                }],
            handler: NoInterfaceCommands.NoPortChannelHandler,
            validator: NoInterfaceCommands.NoPortChannelAcceptor
        },
    ],
    handler: NoInterfaceCommands.NoInterfaceHandler
};


