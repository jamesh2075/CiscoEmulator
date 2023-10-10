import { ICiscoInterface } from '../../icisco-device';
import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../../cisco-terminal-command';
import { CiscoCommandParser } from "../../command-parser";
import { CommandConstants } from '../../common/cisco-constants';
import { CiscoFormatters } from '../../common/cisco-formatters';
import { CiscoValidators } from "../../common/cisco-validators";
import { IVlan, Vlan } from "../../model/vlan.model";
import { Interface } from "../../model/interface.model";
import { Device } from "../../model/device.model";
import { GigabitEthernet } from "../../model/gigabitethernet.model";
import { Port } from "../../model/port.model";

//TODO: Read all these properties from default model
export let switchportDefaultDataModel = {
    switchport: {
        adminMode: 'dynamic auto',
        opMode: '??? (10)',
        adminTrunkEncapsulation: 'negotiate',
        opTrunkEncapsulation: '??? (0)',
        trunkNegotiation: 'On',
        accessVlan: 0,
        trunkVlan: 0,
        adminVlanTag: 'enabled',
        voiceVlan: 'none',
        adminPrivateVlan: {
            host: 'none',
            mapping: 'none',
            trunkVlan: 'none',
            trunkVlanTag: 'enabled',
            trunkEncapsulation: 'dot1q'
        },
        opPrivateVlan: 'none',
        trunkingVlans: 'All'
    },
    defaultVlan: 1,
    defaultMode: 'dynamic auto',
    defaultEncapsulation: 'dot1q',
    defaultnativeVlan: 1,
    defaultVoiceVlan: 'none',
    defaulttrunkingVlans: 'ALL'

};

class Switchport {
    static switchportHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let selector: string[] = cmdState.properties['selector'] || [];
        let value = cmdState.properties['value'];

        selector.unshift('switchport');

        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return cmdState;
        }

        if (value) {
            cmdState.ChangeProperty(selector, value);
            let interfaces: ICiscoInterface[] = cmdContext.interfaces;
            interfaces.forEach((element) => {
                element.setProperty("switchportMode", "Enabled");
            });
        }
        return cmdState;

    }

    static switchportNonegotiateHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        cmdState.properties['value'] = 'Off';
        cmdState.properties['selector'] = ['trunkNegotiation'];

        return cmdState;
    }

    static switchportModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //TODO: check to see if selector prop already exists
        //  if so, unshift 'mode' onto it
        if (cmdState.properties['modeValue']) {
            let currentEncapsulation: string;
            // get trunk encapsulation from current interface context		
            for (let portInterface of cmdContext.interfaces) {
                currentEncapsulation = portInterface.property(['switchport', 'adminPrivateVlan', 'trunkEncapsulation']);
            }
            if (currentEncapsulation === 'negotiate' && cmdState.properties['modeValue'] === 'trunk') {
                cmdState.output = CommandConstants.ERROR_MESSAGES.REJECTED_MODE_COMMAND;
                cmdState.stopProcessing = true;
                return cmdState;
            }
            cmdState.properties['selector'] = ['adminMode'];
        } else if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
        }

        return cmdState;

    }

    static switchportVoiceHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['vlanNumber']) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        let allowedVlans: any[] = CiscoFormatters.formatRange(cmdState.properties['vlanNumber']);
        if (allowedVlans && allowedVlans.length === 1) {
            let isNewVlan = SwitchportUtility.switchportAddVlan(cmdContext.device.model.vlans, cmdState.properties['vlanNumber']);
            cmdState.properties['selector'] = ['voiceVlan'];
            cmdState.properties['value'] = cmdState.properties['vlanNumber'];
            if (isNewVlan) // Display message if creating a new Vlan
                cmdState.output = `% Voice VLAN does not exist. Creating vlan ${cmdState.properties['vlanNumber']}`;
        }

        return cmdState;
    }

    static valueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let value = (cmdState.command.command.name === 'access') ? 'static access' : cmdState.command.command.name;
        cmdState.properties['modeValue'] = value;
        cmdState.properties['value'] = value;
    }
    static privateVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.output = CommandConstants.ERROR_MESSAGES.UNSUPPORTED_COMMAND;
        cmdState.stopProcessing = true;
    }
    static switchportAccessHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //TODO: check to see if selector prop already exists
        //  if so, unshift 'mode' onto it
        if (cmdState.properties['vlanNumber']) {
            let allowedVlans: any[] = CiscoFormatters.formatRange(cmdState.properties['vlanNumber']);
            if (allowedVlans && allowedVlans.length === 1) {
                let accessVlan = SwitchportUtility.switchportAddVlan(cmdContext.device.model.vlans, cmdState.properties['vlanNumber']);
                cmdState.DispatchEvent(CommandConstants.EVENTS.CONNECT_TO_VLAN, cmdState.properties);
                cmdState.properties['selector'] = ['accessVlan'];
                cmdState.properties['value'] = parseInt(cmdState.properties['vlanNumber']);
            }
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
        }

        return cmdState;
    }

    static vlanNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = cmdState.command.token;
        cmdState.properties['vlanNumber'] = cmdState.command.token;
        return cmdState;
    }

    static voiceVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let value = cmdState.properties['value'];
        if (value) {
            if (value === '1002' || value === '1003' || value === '1004' || value === '1005') { // TODO: Move this range to a common place
                cmdState.output = `% Warning: port will be inactive in non-ethernet VLAN
Command rejected: Voice Vlan cannot be configured on this interface \n`;
                cmdState.stopProcessing = true;
            }
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }

        return cmdState;

    }

    static nativeVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let value = cmdState.properties['value'];
        if (!value) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }

        cmdState.properties['selector'] = ['trunkVlan'];
        cmdState.properties['value'] = parseInt(cmdState.properties['vlanNumber']);

        return cmdState;

    }

    static allowedVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let value = cmdState.properties['value'];
        if (!value) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }

        return cmdState;

    }

    static accessVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let value = cmdState.properties['value'];
        if (value) {
            if (value === '1002' || value === '1003' || value === '1004' || value === '1005') { // TODO: Move this range to a common place
                cmdState.output = `%Default VLAN ${value} may not be deleted.\n`;
                cmdState.stopProcessing = true;
            }
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
        }

        return cmdState;

    }
    static trunkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = cmdState.command.command.name;
    }

    static encapsulationHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value']) {
            let currentMode: string;
            // get trunk encapsulation from current interface context		
            for (let portInterface of cmdContext.interfaces) {
                currentMode = portInterface.property(['switchport', 'adminMode']);
            }
            if (currentMode === 'trunk' && cmdState.properties['value'] === 'negotiate') {
                cmdState.output = CommandConstants.ERROR_MESSAGES.REJECTED_ENCAPSULATION_COMMAND;
                cmdState.stopProcessing = true;
                return cmdState;
            }
        }
        cmdState.properties['encapsulation'] = ['encapsulation'];
        cmdState.properties['selector'] = ['adminPrivateVlan', 'trunkEncapsulation'];
        return cmdState;
    }

    static switchportTrunkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //TODO: check to see if selector prop already exists
        //  if so, unshift 'trunk' onto it
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        } else if (!cmdState.properties['value']) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
            return cmdState;
        }

        return cmdState;
    }

    static allowedHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let currentAllowedVlan = '';
        if (!cmdState.properties['vlanNumber']) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
            return cmdState;
        } else if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }

        for (let portInterface of cmdContext.interfaces) {
            currentAllowedVlan = portInterface.property(['switchport', 'trunkingVlans']);
        }

        cmdState.properties['selector'] = ['trunkingVlans'];
        let currentallowedRange = (currentAllowedVlan === 'ALL') ? '1-4094' : currentAllowedVlan;
        if (cmdState.properties['vlanNumber'] && cmdState.properties['vlanMode']) {
            switch (cmdState.properties['vlanMode']) {
                case 'remove':
                    cmdState.properties['value'] = CiscoFormatters.removeValuestoRange(currentallowedRange, cmdState.properties['vlanNumber']);
                    break;
                case 'except':
                    let allowedVlans = CiscoFormatters.formatRange(cmdState.properties['vlanNumber']);
                    SwitchportUtility.disableTrunkForVlan(cmdContext.device.model.vlans, allowedVlans);
                    cmdState.properties['value'] = Vlan.getTrunkingVlans(cmdContext.device.model.vlans, allowedVlans);
                    break;
                case 'add':
                    cmdState.properties['value'] = CiscoFormatters.addValuestoRange(currentallowedRange, cmdState.properties['vlanNumber']);
                    break;
                default:
                    SwitchportUtility.EnableTrunkForVlan(cmdContext.device.model.vlans, CiscoFormatters.formatRange(cmdState.properties['vlanNumber']));
                    cmdState.properties['value'] = cmdState.properties['vlanNumber'];
                    break;
            }
        }

        if (cmdState.properties['vlanNumber'] && cmdState.properties['value'] === 'all') {
            cmdState.properties['value'] = 'ALL';
        }

        return cmdState;
    }

    static nativeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['vlanNumber']) {
            let allowedVlans: any[] = CiscoFormatters.formatRange(cmdState.properties['vlanNumber']);
            if (allowedVlans && allowedVlans.length === 1) {
                cmdState.properties['native'] = ['native'];
                cmdState.properties['value'] = cmdState.properties['vlanNumber'];
            }
        } else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
        }

        return cmdState;
    }

    static vlanModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let vlanMode = cmdState.command.command.name;
        let vlanNumber = cmdState.properties['value'];
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['value'] = cmdState.command.command.name;
            cmdState.properties['vlanNumber'] = cmdState.command.command.name;
        }
        else {
            cmdState.properties['vlanMode'] = cmdState.command.command.name;
            cmdState.properties['value'] = `${vlanMode} ${vlanNumber}`;
        }
    }

    static dynamicValueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = cmdState.command.command.name;
    }

    static dynamicModeValueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value']) {
            cmdState.properties['modeValue'] = 'dynamic ' + cmdState.properties['value'];
            cmdState.properties['value'] = 'dynamic ' + cmdState.properties['value'];
        }
        else {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
        }

        return cmdState;
    }

}


export class SwitchportUtility {

    // set trunking disabled for an interface when we execute a except command
    static disableTrunkForVlan(vlans: IVlan[], vlanValues: any[]) {
        if (vlans && vlans.length > 0)
            vlans.forEach(function (vlanObj: IVlan) {
                if (vlanValues.indexOf(vlanObj.id) > -1)
                    vlanObj.trunkingEnabled = false;
                else
                    vlanObj.trunkingEnabled = true;
            })
    }

    // enable trunk mode for vlans
    static EnableTrunkForVlan(vlans: IVlan[], vlanValues: any[]) {
        if (vlans && vlans.length > 0)
            for (let vlanObj of vlans) {
                if (vlanValues.indexOf(vlanObj.id) > -1)
                    vlanObj.trunkingEnabled = true;
            }
    }

    // create a new vlan if it doesn't exist  // TODO: Move this code to controller
    //Add interfaces into the vlan ports list
    static switchportAddVlan(vlans: IVlan[], vlanNo: string) {
        let accessVlan: any, isNewVlan = false;
        if (vlans && vlans.length > 0) {
            for (let vlanObj of vlans) {
                if (vlanNo && vlanObj.id === parseInt(vlanNo))
                    accessVlan = vlanObj;
            }
        }
        if (!accessVlan) {
            Vlan.addVlans(vlans, [parseInt(vlanNo)]);
            isNewVlan = true;
        }
        return isNewVlan;
    }

}

let accessVlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'Set VLAN when interface is in access mode',
    handler: Switchport.vlanNumber,
    validator: (function (token: string) {
        //TODO: Vlan Range from [1- 4094]. Right now it only supports a single number
        // between 1 and 4094. But it should support a range of numbers, such as 1-3.
        return CiscoValidators.validateRange(token.trim(), CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};

let voiceVlanNumber: TerminalCommand = {
    name: '<1-4094>',
    description: 'Vlan for voice traffic',
    handler: Switchport.vlanNumber,
    validator: (function (token: string) {
        //TODO: Vlan Range from [1- 4094]. Right now it only supports a single number
        // between 1 and 4094. But it should support a range of numbers, such as 1-3.
        return CiscoValidators.validateRange(token.trim(), CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};

let nativeVlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'VLAN ID of the native VLAN when this port is in trunking mode',
    handler: Switchport.vlanNumber,
    validator: (function (token: string) {
        return CiscoValidators.validateRange(token.trim(), CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};

let disallowedVlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'VLAN IDs of disallowed VLANS when this port is in trunking mode',
    handler: Switchport.vlanNumber,
    validator: (function (token: string) {
        //TODO: Vlan Range from [1- 4094]. Right now it only supports a single number
        // between 1 and 4094. But it should support a range of numbers, such as 1-3.
        return CiscoValidators.validateRange(token.trim(), CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};

let allowedVlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'VLANs IDs of the allowed VLANs when this port is in trunking mode',
    handler: Switchport.vlanNumber,
    validator: (function (token: string) {
        //TODO: Vlan Range from [1- 4094]. Right now it only supports a single number
        // between 1 and 4094. But it should support a range of numbers, such as 1-3.
        return CiscoValidators.validateRange(token.trim(), CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};

let voiceVlan: TerminalCommand = {
    name: 'vlan',
    description: 'Vlan for voice traffic',
    handler: Switchport.voiceVlanHandler,
    children: [voiceVlanNumber,
        { name: 'dot1p', description: 'Priority tagged on PVID' },
        { name: 'name', description: 'Set VLAN when interface is in access mode' },
        { name: 'none', description: "Don't tell telephone about voice vlan" },
        { name: 'untagged', description: 'Untagged on PVID' }],
};

let allowedVlanCommand: TerminalCommand = {
    name: 'vlan',
    description: 'Set allowed VLANs when interface is in trunking mode',
    handler: Switchport.allowedVlanHandler,
    children: [allowedVlanNumber,
        { name: 'except', description: 'all VLANs except the following', handler: Switchport.vlanModeHandler, children: [disallowedVlanNumber] },
        { name: 'add', description: 'add VLANs to the current list', handler: Switchport.vlanModeHandler, children: [allowedVlanNumber] },
        { name: 'remove', description: 'remove VLANs from the current list', handler: Switchport.vlanModeHandler, children: [disallowedVlanNumber] },
        { name: 'all', description: 'all VLANs', handler: Switchport.vlanModeHandler },
        { name: 'none', description: 'no VLANs', handler: Switchport.vlanModeHandler }],
};

let allowed: TerminalCommand = {
    name: 'allowed',
    description: 'Set allowed VLAN characteristics when interface is in trunking mode',
    handler: Switchport.allowedHandler,
    children: [allowedVlanCommand]
};

let accessVlanCommand: TerminalCommand = {
    name: 'Vlan',
    description: 'Set VLAN when interface is in access mode',
    handler: Switchport.accessVlanHandler,
    children: [accessVlanNumber]
};

let switchportAccess: TerminalCommand = {
    name: 'access',
    aliases: ['a'],
    description: 'Set access mode characteristics of the interface',
    children: [accessVlanCommand],
    handler: Switchport.switchportAccessHandler
};
let encapsulation: TerminalCommand = {
    name: 'encapsulation',
    description: 'Set trunking encapsulation when interface is in trunking mode',
    handler: Switchport.encapsulationHandler,
    children: [{
        name: 'dot1q',
        description: 'Interface uses only 802.1q trunking encapsulation when trunking',
        handler: Switchport.trunkHandler
    },
    {
        name: 'isl',
        description: 'Interface uses only ISL trunking encapsulation when trunking',
        handler: Switchport.trunkHandler
    },
    {
        name: 'negotiate',
        description: 'Device will negotiate trunking encapsulation with peer on interface',
        handler: Switchport.trunkHandler
    }
    ]
};

let switchportVoice: TerminalCommand = {
    name: 'voice',
    description: 'Voice appliance attributes',
    children: [voiceVlan],
    handler: Switchport.switchportVoiceHandler
};

let nativeVlanCommand: TerminalCommand = {
    name: 'vlan',
    description: 'Set native VLAN when interface is in trunking mode',
    handler: Switchport.nativeVlanHandler,
    children: [nativeVlanNumber]
};

let nativeCommand: TerminalCommand = {
    name: 'native',
    description: 'Set trunking native characteristics when interface is in trunking mode',
    children: [nativeVlanCommand],
    handler: Switchport.nativeHandler
};

let switchportTrunk: TerminalCommand = {
    name: 'trunk',
    description: 'Set trunking characteristics of the interface',
    children: [
        encapsulation, allowed, nativeCommand,
        { name: 'pruning', description: 'Set pruning VLAN characteristics when interface is in trunking mode' }
    ],
    handler: Switchport.switchportTrunkHandler
};

let switchportMode: TerminalCommand = {
    name: 'mode',
    description: 'Set trunking mode of the interface',
    children: [
        { name: 'access', description: 'Set trunking mode to ACCESS unconditionally', handler: Switchport.valueHandler },
        { name: 'trunk', description: 'Set trunking mode to TRUNK unconditionally', handler: Switchport.valueHandler },
        { name: 'dot1q-tunnel', description: 'set trunking mode to TUNNEL unconditionally', handler: Switchport.valueHandler },
        { name: 'private-vlan', description: 'Set private-vlan mode', handler: Switchport.privateVlanHandler },
        {
            name: 'dynamic',
            description: 'Set trunking mode to dynamically negotiate access or trunk mode',
            children: [
                { name: 'auto', description: 'Set trunking mode dynamic negotiation parameter to AUTO', handler: Switchport.dynamicValueHandler },
                { name: 'desirable', description: 'Set trunking mode dynamic negotiation parameter to DESIRABLE', handler: Switchport.dynamicValueHandler },
            ],
            handler: Switchport.dynamicModeValueHandler
        },
    ],
    handler: Switchport.switchportModeHandler
};

let switchportNonegotiate: TerminalCommand = {
    name: 'nonegotiate',
    description: 'Device will not engage in negotiation protocol on this interface',
    handler: Switchport.switchportNonegotiateHandler
};
let unSupportedCommands = [
    { name: 'autostate', description: 'Include or exclude this port from vlan link up calculation' },
    { name: 'dot1q', description: 'Set interface dot1q properties' },
    { name: 'host', description: 'Set port host' },
    { name: 'protected', description: 'Configure an interface to be a protected port' }
];

export let switchportCommand: TerminalCommand = {
    name: 'switchport',
    description: 'Set switching mode characteristics',
    children: [switchportNonegotiate, switchportMode,
        switchportAccess, switchportTrunk, switchportVoice, ...unSupportedCommands],

    handler: Switchport.switchportHandler
};

