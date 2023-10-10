import { ICiscoInterface } from './../../icisco-device';
import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { PortController } from '../../controllers/port-controller';
import { NotSupportedCommand } from '../notsupported';
import { CiscoValidators } from "../../common/cisco-validators"
import { CommandConstants } from "../../common/cisco-constants";
import { Interface } from "../../model/interface.model";
import { Port } from "../../model/port.model";
import { GigabitEthernet } from "../../model/gigabitethernet.model";
import { CiscoFormatters } from "../../common/cisco-formatters";

import { ShowChannelGroupItem } from "../channel-group-command";


class ShowEtherChannel {

    static showEtherchannel(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let result: string = '';
        let interfacesData = cmdContext.device.property('interfaces');

        //Common part. This text will be shown always when "show ethernet" is executed
        result = '\t\tChannel-group listing:\n';
        result += '\t\t---------------------\n';

        // Group: {channelGroupNumber}
        // ----------
        // Group state = L2
        // Ports: {numberInterfacesInPo}   Maxports = 4
        // Port-channels: 1 Max Port-channels = 4
        // Protocol:    {existInPo}
        // Minimum Links: 0
        let groups = new Array();
        let groupCount = 0;
        let groupNumber = 0;
        let totalPorts = new Array();
        let ports = 0;
        for (let c = 0; c < interfacesData.length; ++c) {
            let interfaceChannelGroup = interfacesData[c]['channelGroup'];
            if (interfaceChannelGroup) {
                let id = interfaceChannelGroup.id;
                if (id) {
                    if (groupNumber !== id) {
                        let cg = new ShowChannelGroupItem();
                        cg.id = id;
                        cg.mode = interfaceChannelGroup.mode;
                        cg.protocol = interfaceChannelGroup.protocol;
                        groups[groupCount] = cg;
                        ports = 0;
                        totalPorts[id] = 0;
                        groupNumber = id;
                        groupCount++;
                    }
                    if (groupNumber === id) {
                        ports = totalPorts[id];
                        ports++;
                        totalPorts[id] = ports++;
                    }
                }
            }
        }
        for (let g = 0; g < groups.length; g++) {
            result += '\n';
            result += `Group: ${groups[g].id} \n`;
            result += `----------  \n`;
            result += `Group state = L2  \n`;
            result += `Ports: ${totalPorts[groups[g].id]}   Maxports = 4  \n`;
            result += `Port-channels: 1 Max Port-channels = 4  \n`;
            result += `Protocol:   ${groups[g].protocol}  \n`;
            result += `Minimum Links: 0  \n`;
            result += `\n`;
        }
        result += '\n\n';

        cmdState.output = result;
        cmdState.stopProcessing = true;
        return cmdState;
    }

    static showEtherchannelSummary(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let result = '';

        let portInterfaces: ICiscoInterface[] = PortController.getPortInterfaces(cmdContext.device.getInterfaces()) || [];

        result += `Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      N - not in use, no aggregation
        f - failed to allocate aggregator

        M - not in use, minimum links not met
        m - not in use, port not aggregated due to minimum links not met
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port

        A - formed by Auto LAG`;

        result += `Number of channel-groups in use: ${portInterfaces.length}
        Number of aggregators:           ${portInterfaces.length}

Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------------------------- \n`;

        for (let portInterface of portInterfaces) {
            let memberInterfaces = PortController.getMemberInterfaces(cmdContext.device.getInterfaces(), portInterface.property('id'))
            result += `${portInterfaces.indexOf(portInterface)}      ${portInterface.property('name')}${(portInterface.property('etherflag'))}`;
            if (memberInterfaces && memberInterfaces.length > 0)
                for (let memberInterface of memberInterfaces) {
                    result += `       ${memberInterface.property('name')}${(portInterface.property('etherflag'))}`;
                }
            result += `\n`;
        }

        cmdState.output = result;
        cmdState.stopProcessing = true;

        return cmdState;
    }

}

let showEtherchannelSummaryCommand: TerminalCommand = {
    name: 'summary',
    description: 'One-line summary per channel-group',
    children: [],
    handler: ShowEtherChannel.showEtherchannelSummary,
    validator: () => {
        return true;
    }
}


export let showEtherchannelCommand: TerminalCommand = {
    name: 'etherchannel',
    description: 'EtherChannel information',
    children: [
        {
            name: 'auto',
            description: 'Displays summary of auto formed etherchannel',
            handler: NotSupportedCommand.NotSupported
        },
        { name: 'detail', description: 'Detail information', handler: NotSupportedCommand.NotSupported },
        {
            name: 'load-balance',
            description: 'Load-balance/frame-distribution scheme among ports in port-channel',
            handler: NotSupportedCommand.NotSupported
        },
        { name: 'port', description: 'Port information', handler: NotSupportedCommand.NotSupported },
        { name: 'port-channel', description: 'Port-channel information', handler: NotSupportedCommand.NotSupported },
        { name: 'protocol', description: 'protocol enabled', handler: NotSupportedCommand.NotSupported },
        showEtherchannelSummaryCommand
    ],
    handler: ShowEtherChannel.showEtherchannel
}