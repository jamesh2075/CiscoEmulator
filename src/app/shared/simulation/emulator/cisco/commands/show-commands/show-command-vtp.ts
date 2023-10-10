import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { NotSupportedCommand } from '../notsupported';
import { showCommand } from './show-command';
import { CommandConstants } from "../../common/cisco-constants";

class ShowCommandVtp {

    static ShowVtp(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        cmdState.stopProcessing = true;
        return cmdState;
    }

    //This command is affected by 'vtp mode [transparent|server|client]' command
    static ShowVtpStatus(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let result: string = '';
        //get vtp configuration
        let data = cmdContext.device.property('vtp');
        let mode = data.mode;
        //Capitalize the vtp modemode
        mode = mode[0].toUpperCase() + mode.substring(1);
        let domain: string = cmdContext.device.property(['vtp', 'domain']);
        let deviceId: string = cmdContext.device.property('address');
        let ip = "0.0.0.0"
        let interfaces = cmdContext.device.property('interfaces');
        for (let i = 0; i < interfaces.length; ++i) {
            let vtpConfig = cmdContext.device.property('vtpConfig');
            if (interfaces[i].name === vtpConfig) {
                let ipValue = interfaces[i].ipv4;
                if (ipValue) {
                    ip = ipValue;
                }
            }
        }

        let vlans = cmdContext.device.property('vlans');
        let totalVlans = 0;
        let maxVlan = 0;
        for (let i = 0; i < vlans.length; ++i) {
            totalVlans++;
            if (vlans[i].id > maxVlan) {
                maxVlan = vlans[i].id;
            }
        }
        // VTP Version capable             : 1 to 3
        // VTP version running             : 1
        // VTP Domain Name                 : ACME
        // VTP Pruning Mode                : Disabled
        // VTP Traps Generation            : Disabled
        // Device ID                       : fa16.3e13.1a33
        // Configuration last modified by 0.0.0.0 at 0-0-00 00:00:00


        // Feature VLAN:
        // --------------
        // VTP Operating Mode                : Transparent
        // Maximum VLANs supported locally   : 1005
        // Number of existing VLANs          : 8
        // Configuration Revision            : 0
        // MD5 digest                        : 0x3A 0x2E 0x09 0x89 0xBA 0xB9 0x7C 0x99
        //                                     0xAA 0x68 0x20 0x3E 0x08 0x76 0x1B 0x88

        result = 'VTP Version capable             : 1 to 3\n';
        result += 'VTP version running             : 1 \n';
        result += `VTP Domain Name                 : ${domain} \n`;
        result += 'VTP Pruning Mode                : Disabled \n';
        result += 'VTP Traps Generation            : Disabled  \n';
        result += `Device ID                       : ${deviceId} \n`;
        result += 'Configuration last modified by 0.0.0.0 at 0-0-00 00:00:00 \n\n';
        //result += `Local updater ID is ${ip} on interface Gi0/0 (first layer3 interface found) \n\n`; // Fix for Bug 759

        result += 'Feature VLAN:  \n';
        result += '--------------\n';
        result += `VTP Operating Mode                : ${mode} \n`;
        result += `Maximum VLANs supported locally   : ${maxVlan} \n`;
        result += `Number of existing VLANs          : ${totalVlans} \n`;
        result += 'Configuration Revision            : 0  \n';
        result += 'MD5 digest                        : 0x3A 0x2E 0x09 0x89 0xBA 0xB9 0x7C 0x99 \n';
        result += '                                    0xAA 0x68 0x20 0x3E 0x08 0x76 0x1B 0x88 \n';

        cmdState.output = result;
        cmdState.stopProcessing = true;
        return cmdState;
    }

}


let vtpStatusCommand: TerminalCommand = {
    name: "status",
    description: 'VTP domain status',
    parameters: [],
    handler: ShowCommandVtp.ShowVtpStatus
};


export let showVtpCommand: TerminalCommand = {
    name: 'vtp',
    description: 'VTP information',
    parameters: [],
    children: [
        { name: 'counters', description: 'VTP statistics', handler: NotSupportedCommand.NotSupported },
        { name: 'devices', description: 'VTP3 domain device information', handler: NotSupportedCommand.NotSupported },
        {
            name: 'interface',
            description: 'VTP interface status and configuration',
            handler: NotSupportedCommand.NotSupported
        },
        { name: 'password', description: 'VTP password', handler: NotSupportedCommand.NotSupported },
        vtpStatusCommand
    ],
    handler: ShowCommandVtp.ShowVtp
};
