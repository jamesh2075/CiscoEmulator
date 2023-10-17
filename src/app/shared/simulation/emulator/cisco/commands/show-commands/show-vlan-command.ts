import { Mustache } from "mustache"
import { TerminalCommand } from "../../../interfaces/terminal-command";
import { CiscoCommandContext } from "../../cisco-terminal-command";
import { CommandState } from "../../../interfaces/command-state";
import { CiscoFormatters } from "../../common/cisco-formatters";
import { CiscoValidators } from "../../common/cisco-validators";
import { CiscoUtils } from "../../common/cisco-utils";
import { IVlan, Vlan } from "../../model/vlan.model";
import { Device } from "../../model/device.model";
import { GigabitEthernet } from "../../model/gigabitethernet.model";

export class ShowVlanCommand {
    static ShowVlan(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.stopProcessing = true;

        let device = cmdContext.device.model as Device;
        let vlans: IVlan[] = cmdContext.device.model.vlans; //.sort((a, b) => a.id - b.id);
        let sortVlans: any = vlans.sort((a, b) => a.id - b.id);
        let result = '';
        result = 'VLAN Name                             Status    Ports \n';
        result += `---- -------------------------------- --------- ------------------------------- \n`;
        for (let n = 0; n <= sortVlans.length - 1; n++) {
            let sortVlan: IVlan = sortVlans[n];
            result += CiscoFormatters.paddingRight(String(sortVlan.id), ' ', 5);
            result += CiscoFormatters.paddingRight(String(sortVlan.name), ' ', 33);
            result += CiscoFormatters.paddingRight(String(sortVlan.status), ' ', 10);
            let filteredPorts: string[] = sortVlan.ports.filter((name: string) => {
                let gi = device.findGigabitEthernet(name);
                if (gi.trunkEnabled) {
                    return false;
                }
                return true;
            });

            let strPort: string = String(filteredPorts);

            if (strPort.length > 30) {
                let str: any = CiscoUtils.parsePorts(strPort);
                result += str;
            }
            else {
                strPort = strPort.replace(/,/g, ', ');
                result += CiscoFormatters.paddingRight(strPort, ' ', 31);
            }
            result += '\n';
        }

        result += '\n';
        result += `VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode Trans1 Trans2 \n`;
        result += `---- ----- ---------- ----- ------ ------ -------- ---- -------- ------ ------ \n`;
        for (let n = 0; n <= vlans.length - 1; n++) {
            result += CiscoFormatters.paddingRight(String(vlans[n].id), ' ', 4);
            result += ' ';
            result += CiscoFormatters.paddingRight(String(vlans[n].type), ' ', 5);
            result += ' ';
            result += CiscoFormatters.paddingRight(String(vlans[n].SAID), ' ', 10);
            result += ' ';
            let vMTU: string = (vlans[n].MTU.length === 0) ? "1500" : vlans[n].MTU;
            result += CiscoFormatters.paddingRight(vMTU, ' ', 5);
            result += ' ';
            let vParent: string = (vlans[n].Parent.length === 0) ? "-" : vlans[n].Parent;
            result += CiscoFormatters.paddingRight(vParent, ' ', 6);
            result += ' ';
            let vRingNo: string = String(vlans[n].RingNo);
            vRingNo = (vRingNo === "0") ? "-" : String(vlans[n].RingNo);
            result += CiscoFormatters.paddingRight(vRingNo, ' ', 6);
            result += ' ';
            let vBridgeNo: string = String(vlans[n].BridgeNo);
            vBridgeNo = (vBridgeNo === '0') ? "-" : String(vlans[n].BridgeNo);
            result += CiscoFormatters.paddingRight(vBridgeNo, ' ', 8);
            result += ' ';
            let vStp: any = (vlans[n].Stp.length === 0) ? "-" : vlans[n].Stp;
            result += CiscoFormatters.paddingRight(String(vStp), ' ', 4);
            result += ' ';
            let vBrdgMode: any = (vlans[n].BrdgMode.length === 0) ? "-" : vlans[n].BrdgMode;
            result += CiscoFormatters.paddingRight(String(vBrdgMode), ' ', 8);
            result += ' ';
            let vTrans1: any = (vlans[n].Trans1.length === 0) ? "0" : vlans[n].Trans1;
            result += CiscoFormatters.paddingRight(String(vTrans1), ' ', 6);
            result += ' ';
            let vTrans2: any = (vlans[n].Trans2.length === 0) ? "0" : vlans[n].Trans2;
            result += CiscoFormatters.paddingRight(String(vTrans2), ' ', 6);
            result += '\n';
        }
        result += '\n';
        result += `Primary Secondary Type              Ports \n`;
        result += `------- --------- ----------------- ------------------------------------------ \n`;
        result += '\n\n';
        cmdState.output = result;
        return cmdState;
    }

    static ShowVlanRange(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let result: string = '';
        cmdState.stopProcessing = true;

        if (cmdState.command.token.replace(/[-,\s\d]/g, '')) {
            result = 'Command rejected: Bad VLAN list - character #1 is a non-numeric\n';
            result += 'character (\'' + cmdState.command.token + '\').\n';
            result += 'Invalid vlan list.'
        }
        else if (!CiscoValidators.validateRange(cmdState.command.token, 1, 4094)) { // if not in valid range
            result = 'Command rejected: Bad VLAN list (EOL) delimits a VLAN\n';
            result += 'number which is out of the range 1..4094.\n';
            result += 'Invalid vlan list.';
        }
        else { // we are good to go
            let vlans: IVlan[] = cmdContext.device.model.vlans;
            let vlanIds: number[] = CiscoFormatters.formatRange(cmdState.command.token);
            let invalidVlanIds: number[] = Vlan.getInvalidVlanIds(vlans, vlanIds);
            if (vlanIds.length === invalidVlanIds.length) { // show vlan id 12,15
                result = 'VLAN id ' + invalidVlanIds.toString() + ' not found in current VLAN database';
            } else {
                let validVlanIds: number[] = Vlan.getValidVlanIds(vlans, vlanIds);
                result = 'VLAN Name                             Status    Ports \n';
                result += `---- -------------------------------- --------- ------------------------------- \n`;

                for (let vlanId of validVlanIds) {
                    let vlan: IVlan = Vlan.getVlan(vlans, vlanId);
                    result += CiscoFormatters.paddingRight(String(vlan.id), ' ', 5);
                    result += CiscoFormatters.paddingRight(String(vlan.name), ' ', 33);
                    result += CiscoFormatters.paddingRight(String(vlan.status), ' ', 9);
                    result += CiscoFormatters.paddingRight(String(vlan.ports), ' ', 31);
                    result += '\n';
                }

                result += '\n';
                result += `VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode Trans1 Trans2 \n`;
                result += `---- ----- ---------- ----- ------ ------ -------- ---- -------- ------ ------ \n`;

                for (let vlanId of validVlanIds) {
                    let vlan: IVlan = Vlan.getVlan(vlans, vlanId);
                    result += CiscoFormatters.paddingRight(String(vlan.id), ' ', 4);
                    result += ' ';
                    result += CiscoFormatters.paddingRight(String(vlan.type), ' ', 5);
                    result += ' ';
                    result += CiscoFormatters.paddingRight(String(vlan.SAID), ' ', 10);
                    result += ' ';
                    let vMTU: string = (vlan.MTU.length === 0) ? "1500" : vlan.MTU;
                    result += CiscoFormatters.paddingRight(vMTU, ' ', 5);
                    result += ' ';
                    let vParent: string = (vlan.Parent.length === 0) ? "-" : vlan.Parent;
                    result += CiscoFormatters.paddingRight(vParent, ' ', 6);
                    result += ' ';
                    let vRingNo: string = String(vlan.RingNo);
                    vRingNo = (vRingNo === "0") ? "-" : String(vlan.RingNo);
                    result += CiscoFormatters.paddingRight(vRingNo, ' ', 6);
                    result += ' ';
                    let vBridgeNo: string = String(vlan.BridgeNo);
                    vBridgeNo = (vBridgeNo === '0') ? "-" : String(vlan.BridgeNo);
                    result += CiscoFormatters.paddingRight(vBridgeNo, ' ', 8);
                    result += ' ';
                    let vStp: any = (vlan.Stp.length === 0) ? "-" : vlan.Stp;
                    result += CiscoFormatters.paddingRight(String(vStp), ' ', 4);
                    result += ' ';
                    let vBrdgMode: any = (vlan.BrdgMode.length === 0) ? "-" : vlan.BrdgMode;
                    result += CiscoFormatters.paddingRight(String(vBrdgMode), ' ', 8);
                    result += ' ';
                    let vTrans1: any = (vlan.Trans1.length === 0) ? "0" : vlan.Trans1;
                    result += CiscoFormatters.paddingRight(String(vTrans1), ' ', 6);
                    result += ' ';
                    let vTrans2: any = (vlan.Trans2.length === 0) ? "0" : vlan.Trans2;
                    result += CiscoFormatters.paddingRight(String(vTrans2), ' ', 6);
                    result += '\n';
                    // result += CiscoFormatters.paddingRight(String(vlan.id), ' ', 5);
                    // result += CiscoFormatters.paddingRight(String(vlan.type), ' ', 6);
                    // result += CiscoFormatters.paddingRight(String(vlan.SAID), ' ', 11);
                    // result += CiscoFormatters.paddingRight(String(vlan.MTU), ' ', 6);
                    // result += CiscoFormatters.paddingRight(String(vlan.Parent), ' ', 7);
                    // result += CiscoFormatters.paddingRight(String(vlan.RingNo), ' ', 7);
                    // result += CiscoFormatters.paddingRight(String(vlan.BridgeNo), ' ', 9);
                    // result += CiscoFormatters.paddingRight(String(vlan.Stp), ' ', 5);
                    // result += CiscoFormatters.paddingRight(String(vlan.BrdgMode), ' ', 9);
                    // result += CiscoFormatters.paddingRight(String(vlan.Trans1), ' ', 7);
                    // result += CiscoFormatters.paddingRight(String(vlan.Trans2), ' ', 7);
                    // result += '\n';
                }

                result += '\n';
                result += `Primary Secondary Type              Ports \n`;
                result += `------- --------- ----------------- ------------------------------------------ \n`;
                result += '\n\n';
            }
        }

        cmdState.output = result;
        return cmdState;
    }

}

let showVlansRange: TerminalCommand = {
    name: 'integer',
    description: 'VLAN range of integers',
    handler: ShowVlanCommand.ShowVlanRange,
    validator: () => {
        return true;
    }
};

let showVlanById: TerminalCommand = {
    name: 'id',
    description: 'VTP VLAN status',
    parameters: [],
    children: [
        showVlansRange
    ],
    validator: () => {
        return true;
    }
};

export let showVlan: TerminalCommand = {
    name: 'vlan',
    description: 'VTP VLAN status',
    parameters: [],
    children: [
        showVlanById,
        { name: 'access-log', description: 'VACL Logging' },
        { name: 'access-map', description: 'Vlan access-map' },
        { name: 'brief', description: 'VTP all VLAN status in brief' },
        { name: 'filter', description: 'VLAN filter informatio' },
        { name: 'group', description: 'VLAN group(s) information' },
        { name: 'ifindex', description: 'SNMP ifIndex' },
        { name: 'internal', description: 'VLAN internal usage' },
        { name: 'mtu', description: 'VLAN MTU information' },
        { name: 'name', description: 'VTP VLAN status by VLAN name' },
        { name: 'private-vlan', description: 'Private VLAN information' },
        { name: 'summary', description: 'VLAN summary information' },
        { name: '|', description: 'Output modifiers' }
    ],
    handler: ShowVlanCommand.ShowVlan
};
