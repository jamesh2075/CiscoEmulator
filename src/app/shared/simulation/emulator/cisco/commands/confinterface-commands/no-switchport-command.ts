import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../../cisco-terminal-command';
import { CiscoCommandParser } from '../../command-parser';
import { CommandConstants } from '../../common/cisco-constants';
import { CiscoValidators } from '../../common/cisco-validators';
import { switchportDefaultDataModel, SwitchportUtility } from './switchport-command';


export class NoSwitchport {

    static noSwitchportHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        const selector: string[] = cmdState.properties['selector'] || [];
        // todo: validate that there is a value in the properties
        const value = cmdState.properties['value'];
        if (selector && selector.length > 0) {
            selector.unshift('switchport');
            cmdState.ChangeProperty(selector, value);
        } else {
            // According to Rachelle and Justin, the 'no switchport' command without any parameters
            // should not be implemented.
            cmdState.output = CommandConstants.ERROR_MESSAGES.UNSUPPORTED_COMMAND;
        }
        // else { // When user types no switchport we should disable that interface for switchport and move it to L3 Mode.
        //     selector = ['switchportMode'];
        //     value = 'Disabled';
        // }

        cmdState.stopProcessing = true;
        return cmdState;
    }

    static noSwitchportNonegotiateHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = 'on';
        cmdState.properties['selector'] = ['trunkNegotiation'];
    }

    static noSwitchportModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        cmdState.properties['value'] = switchportDefaultDataModel.defaultMode;
        cmdState.properties['selector'] = ['adminMode'];

    }

    static noSwitchportVoiceHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = switchportDefaultDataModel.defaultVoiceVlan;
        cmdState.properties['selector'] = ['voiceVlan'];
    }

    // TODO: remove vlan from trunking disabled list
    static noSwitchportAccessHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // setting it to default vlan 1.
        cmdState.properties['vlanNumber'] = switchportDefaultDataModel.defaultVlan;
        cmdState.DispatchEvent(CommandConstants.EVENTS.CONNECT_TO_VLAN, cmdState.properties);
        cmdState.properties['selector'].unshift('access');
        return cmdState;
    }

    static noVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['vlan'] = 'vlan';

        return cmdState;
    }

    static noEncapsulationHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = switchportDefaultDataModel.defaultEncapsulation;
        cmdState.properties['selector'] = ['adminPrivateVlan', 'trunkEncapsulation'];

        return cmdState;
    }

    static noSwitchportTrunkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        return cmdState;
    }

    static noAllowedHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['vlan']) {
            cmdState.properties['value'] = switchportDefaultDataModel.defaulttrunkingVlans;
            cmdState.properties['selector'] = ['trunkingVlans'];
            SwitchportUtility.disableTrunkForVlan(cmdContext.device.model.vlans, null);
        }
        return cmdState;
    }

    static noNativeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = switchportDefaultDataModel.defaultnativeVlan;
        cmdState.properties['selector'] = ['trunkVlan'];
        return cmdState;
    }

}

const noNativeVlan: TerminalCommand = {
    name: 'vlan',
    description: 'Set native VLAN when interfaces is in trunking mode',
    handler: NoSwitchport.noVlanHandler
};

const noVlan: TerminalCommand = {
    name: 'vlan',
    description: null,
    handler: NoSwitchport.noVlanHandler
};

const noAllowed: TerminalCommand = {
    name: 'allowed',
    description: 'Set allowed VLAN characteristics when interface is in trunking mode',
    handler: NoSwitchport.noAllowedHandler,
    children: [noVlan]
};

const noSwitchportAccess: TerminalCommand = {
    name: 'access',
    description: 'Set access mode characteristics of the interface',
    children: [noVlan],
    handler: NoSwitchport.noSwitchportAccessHandler
};

const noEncapsulation: TerminalCommand = {
    name: 'encapsulation',
    description: 'Set trunking encapsulation when interface is in trunking mode',
    handler: NoSwitchport.noEncapsulationHandler
};

const noSwitchportVoice: TerminalCommand = {
    name: 'voice',
    description: 'Voice appliance attributes',
    children: [noVlan],
    handler: NoSwitchport.noSwitchportVoiceHandler
};

const noSwitchportNative: TerminalCommand = {
    name: 'native',
    description: 'Voice appliance attributes',
    children: [noNativeVlan],
    handler: NoSwitchport.noNativeHandler
};

const noSwitchportTrunk: TerminalCommand = {
    name: 'trunk',
    description: 'Set trunking characteristics of the interface',
    children: [noEncapsulation, noAllowed, noSwitchportNative],
    handler: NoSwitchport.noSwitchportTrunkHandler
};

const noSwitchportMode: TerminalCommand = {
    name: 'mode',
    description: 'Set trunking mode of the interface',
    handler: NoSwitchport.noSwitchportModeHandler
};

const noSwitchportNonegotiate: TerminalCommand = {
    name: 'nonegotiate',
    description: 'Device will not engage in negotiation protocol on this interface',
    handler: NoSwitchport.noSwitchportNonegotiateHandler
};

export let noSwitchportCommand: TerminalCommand = {
    name: 'switchport',
    description: 'Set switching mode characteristics',
    parameters: [],
    children: [noSwitchportNonegotiate, noSwitchportMode, noSwitchportAccess, noSwitchportTrunk, noSwitchportVoice],
    handler: NoSwitchport.noSwitchportHandler,
};
