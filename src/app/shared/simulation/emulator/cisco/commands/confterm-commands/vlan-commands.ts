/// <reference types="mustache" />
import { TerminalCommand } from "../../../interfaces/terminal-command";
import { CiscoCommandContext } from "../../cisco-terminal-command";
import { CommandState } from "../../../interfaces/command-state";
import { CommandConstants } from "../../common/cisco-constants";
import { CiscoFormatters } from "../../common/cisco-formatters";
import { CiscoValidators } from "../../common/cisco-validators";
import {IVlan} from "../../model/vlan.model";

let templates: any = {};

templates.description = 'Vlan commands';
templates.vlanBadList = 'Command rejected: Bad VLAN list - character #{{pos}} (EOL) delimits ending Vlan id ({{endId}}) of vlan-range, which is not larger than the starting Vlan id({{startId}}).';

templates.vlanHelp = `WORD           ISL VLAN IDs 1-4094
  access-log     Configure VACL logging
  access-map     Create vlan access-map or enter vlan access-map command mode
  accounting     VLAN accounting configuration
  configuration  vlan feature configuration mode
  filter         Apply a VLAN Map
  group          Create a vlan group
  internal       internal VLAN`;

export class VlanCommands {

    protected static idCommand: TerminalCommand = {
        name: "WORD",
        description: 'ISL VLAN IDs 1-4094',
        parameters: [],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            try {
                cmdState.properties['vlanIds'] = CiscoFormatters.formatRange(cmdState.command.token);
            } catch (e) {
                switch (e.message) {
                    case CommandConstants.ERROR_MESSAGES.BAD_LIST: {
                        // cmdState.output = Mustache.render()
                        break;
                    }
                    default: {
                        cmdState.output = e.message;
                    }
                }
                cmdState.stopProcessing = true;
            }

            return cmdState;
        },
        validator: (function (token: string) {
            return CiscoValidators.validateRange(token, CommandConstants.VLAN.min, CommandConstants.VLAN.max);
        })
    };

    static confTermVlanCommand: TerminalCommand = {
        name: "vlan",
        description: templates.description,
        parameters: [],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            let vlanIds: string[] = cmdState.properties['vlanIds'];
            cmdState.DispatchEvent(CommandConstants.EVENTS.ADD_VLANS, {
                vlanIds: vlanIds
            });
            return cmdState;
        },
        children: [
            VlanCommands.idCommand,
            { name: 'access-log', description: `Configure VACL logging` },
            { name: 'access-map', description: `Create vlan access-map or enter vlan access-map command mode` },
            { name: 'accounting', description: `VLAN accounting configuration` },
            { name: 'brief', description: `VTP all VLAN status in brief` },
            { name: 'configuration', description: `vlan feature configuration mode` },
            { name: 'filter', description: `Apply a VLAN Map` },
            { name: 'group', description: `Create a vlan group` },
            { name: 'internal', description: `internal VLAN` },
        ],
    };

    static noConfTermVlanCommand: TerminalCommand = {
        name: "vlan",
        description: templates.description,
        parameters: [],
        handler: (cmdContext: CiscoCommandContext, cmdState: CommandState) => {
            let vlanIds: string[] = cmdState.properties['vlanIds'];
            let vID = vlanIds[0];
            let result: string = '';
            if (vID === '1002' || vID === '1003' || vID === '1004' || vID === '1005' || vID === '1006') {
                result = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
                cmdState.output = result;
            } else if(vID.toString() === '1') {
                cmdState.output = '% Default VLAN 1 may not be deleted.';
            } else {
                let vlans = cmdContext.device.model.vlans;

                for (let n = 0; n < vlanIds.length; n++) {
                    let vlanId: number = Number(vlanIds[n]);
                    for (let i = vlans.length - 1; i >= 0; i--) {
                        let vlan: IVlan = vlans[i];
                        if (vlan.id === vlanId) {
                            vlans.splice(i, 1);
                        }
                    }
                }
            }

            cmdState.stopProcessing = true;
            return cmdState;
        },
        children: [
            VlanCommands.idCommand,
            { name: 'access-log', description: `Configure VACL logging` },
            { name: 'access-map', description: `Create vlan access-map or enter vlan access-map command mode` },
            { name: 'accounting', description: `VLAN accounting configuration` },
            { name: 'brief', description: `VTP all VLAN status in brief` },
            { name: 'configuration', description: `vlan feature configuration mode` },
            { name: 'filter', description: `Apply a VLAN Map` },
            { name: 'group', description: `Create a vlan group` },
            { name: 'internal', description: `internal VLAN` },
        ]
    };
}
