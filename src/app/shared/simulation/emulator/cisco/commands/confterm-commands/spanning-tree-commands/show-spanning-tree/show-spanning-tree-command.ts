import { CiscoFormatters } from '../../../../common/cisco-formatters';
import { TerminalCommand } from '../../../../../interfaces/terminal-command';
import { CommandState } from '../../../../../interfaces/command-state';
import { CiscoCommandContext } from '../../../../cisco-terminal-command';
import { NotSupportedCommand } from "../../../notsupported";
import { BuildSpanningTreeOutput } from './spanning-tree-output';
import { CommandConstants } from '../../../../common/cisco-constants';
import { CiscoValidators } from "../../../../common/cisco-validators";
import { spanningTreeDefaultModel } from './../../spanning-tree-commands/spanning-tree-command';
/* TODO: 1. Use mustache for making it clean
 2. Add a unit test fille
 3. Fix problem with mst mode
 */
class ShowSpanningTreeCommand {

    static ShowSpanningTreehandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let mode = cmdContext.device.property(['spanningtree', 'mode']), vlans = [];

        if (cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            let parameter = cmdState.command.parameters[0];
            if (CiscoValidators.isNumber(parameter)) {
                let isValid = CiscoValidators.validateRange(parameter, CommandConstants.SPANNINGBRIDGE.min, CommandConstants.SPANNINGBRIDGE.max);
                cmdState.output = (isValid) ? `Spanning tree instance(s) for bridge ${parameter} does not exist` : `Error: Invalid list: Character delimits a number which is out of the range (1...255).`;
            } else {
                cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            }
        }
        else {

            // filter vlans based on vlan number  ex:- show spanning-tree vlan 40
            if (cmdState.properties['vlanNumber']) {
                let isValid = CiscoValidators.validateNumberInArray(cmdState.properties['vlanNumber'], ['1002', '1003', '1004', '1005']);
                if (isValid) {
                    cmdState.output = `Spanning tree instance(s) for vlan ${cmdState.properties['vlanNumber']} does not exist.`;
                    cmdState.stopProcessing = true;
                    return cmdState;
                }
                let validVlans = CiscoFormatters.formatRange(cmdState.properties['vlanNumber']);
                vlans = ShowSpanningTreeUtilityModel.getVlanById(cmdContext.device.model.vlans, validVlans);
            }
            else {
                vlans = cmdContext.device.model.vlans;
            }
            if (vlans && vlans.length > 0) {
                let spanningTreeInfo = Object.assign({  // TODO: need to change this to deep clone
                    mode: mode || spanningTreeDefaultModel.defaultMode,
                    vlans, //In es6 it's equal to vans:vlans,
                    address: cmdContext.device.model.address || 'fa16.3e36.0fb1',  // TODO: send mac address as dynamic based on device
                    ports: cmdContext.device.model.interfaces
                });
                cmdState.output = BuildSpanningTreeOutput.getShowSpanningTreeOutput(spanningTreeInfo);
            }
            else if (cmdState.properties['vlanNumber']) {
                cmdState.output = `Spanning tree instance(s) for vlan ${cmdState.properties['vlanNumber']} does not exist`;
            }
        }
        cmdState.stopProcessing = true;
        return cmdState;
    }


    static ShowSpanningTreeVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['vlanNumber'] === undefined) {
            cmdState.output = '% Command rejected: Bad instance list: A number is out of range (1..4094)';
            cmdState.stopProcessing = true;
        }
        return cmdState;
    }

    static ShowSpanningTreeVlanNumberHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let tok: string = cmdState.command.token;
        if (tok.match('-') || tok.match(',')) {
            cmdState.output = 'Spanning tree instance(s) for vlan ' + tok + ' does not exist.';
            cmdState.stopProcessing = true;
        }
        else {
            cmdState.properties['vlanNumber'] = cmdState.command.token;
        }
        return cmdState;
    }

    static ShowSpanningTreeBridgeNumberHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.output = `Spanning tree instance(s) for bridge ${cmdState.command.token} does not exist.`;
        cmdState.stopProcessing = true;
        return cmdState;
    }

}

export class ShowSpanningTreeUtilityModel {
    static getVlanById(vlans: any[], vlanNos: any) {
        let resultVlans = [];
        for (let vlan of vlans) {
            if (vlanNos.indexOf(vlan.id) > -1) {
                resultVlans.push(vlan);
            }
        }
        return resultVlans;
    }
}

let vlanNumber: TerminalCommand = {
    name: 'integer',
    description: 'vlan range, example: 1,3-5,7,9-11',
    handler: ShowSpanningTreeCommand.ShowSpanningTreeVlanNumberHandler,
    validator: (function (token: string) {
        return CiscoValidators.validateRange(token, CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};


let spanningBridgeNumber: TerminalCommand = {
    name: 'bridge',
    description: 'Status and configuration of this bridge',
    handler: ShowSpanningTreeCommand.ShowSpanningTreeBridgeNumberHandler,
    validator: (function (token: string) {
        return CiscoValidators.validateRange(token, CommandConstants.SPANNINGBRIDGE.min, CommandConstants.SPANNINGBRIDGE.max);
    })
};


let showspanningTreeVlanCommand: TerminalCommand = {
    name: 'vlan',
    description: 'VLAN Switch Spanning Trees',
    children: [
        vlanNumber
    ],
    handler: ShowSpanningTreeCommand.ShowSpanningTreeVlanHandler
};

export let showspanningTreeCommand: TerminalCommand = {
    name: 'spanning-tree',
    description: 'Spanning tree topology',
    children: [
        showspanningTreeVlanCommand
    ],
    handler: ShowSpanningTreeCommand.ShowSpanningTreehandler
};

