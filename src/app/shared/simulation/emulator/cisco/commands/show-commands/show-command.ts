﻿import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { NotSupportedCommand } from '../notsupported';
import { showVlan } from './show-vlan-command';
import { showInterfacesCommand } from './show-interfaces/show-interfaces';
import { showspanningTreeCommand } from '../../commands/confterm-commands/spanning-tree-commands/show-spanning-tree/show-spanning-tree-command';
import { showVtpCommand } from './show-command-vtp';
import { ShowRunningCommand } from './show-running-command';
import { ShowIpCommand } from './show-ip-command';
import { ShowChannelGroupItem } from '../channel-group-command';
import { ShowPortItem } from '../channel-group-command';
import { CiscoValidators } from '../../common/cisco-validators';
import { CommandConstants } from '../../common/cisco-constants';
import { Interface } from '../../model/interface.model';
import { Port } from '../../model/port.model';
import { GigabitEthernet } from '../../model/gigabitethernet.model';
import { CiscoFormatters } from '../../common/cisco-formatters';
import { showEtherchannelCommand } from './show-etherchannel';
import { unsupportedShowCommands } from './show-unsupported-commands';

class ShowCommand {
    static Show(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // let data: string = cmdContext.device ? cmdContext.device.property(['vlan', 'internal', 'allocation', 'policy']) : '';
        // data = cmdContext.device?.property(['interfaces', 'GigabitEthernet1/0', 'channel-group']);//,'1','mode']);
        cmdState.output = `% Type 'show' for a list of subcommands`;
        cmdState.stopProcessing = true;
        // throw new Error('Not Implemented');
        return cmdState;
    }

    static ShowInterface(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let result = '';
        const data: any = [];
        if (cmdContext.device === undefined) {
            return;
        }
        cmdContext.device.property('interfaces');

        for (let i = 0; i < data.length; ++i) {
            let output = `! interface name ${data[i].name}\n`;
            if (data[i]['channel-group']) {
                output += `! channel-group ${data[i]['channel-group']}\n`;
            }
            output += `!\n`;
            result += output;
        }

        cmdState.output = result;
        cmdState.stopProcessing = true;
        return cmdState;
    }
}

export let showCommand: TerminalCommand = {
    name: 'show',
    description: 'Show running system information',
    children: [
        showEtherchannelCommand,
        showspanningTreeCommand,
        ShowRunningCommand.command,
        ShowIpCommand.command,
        showInterfacesCommand,
        showVtpCommand,
        showVlan,
        ...unsupportedShowCommands
    ],
    handler: ShowCommand.Show
};

