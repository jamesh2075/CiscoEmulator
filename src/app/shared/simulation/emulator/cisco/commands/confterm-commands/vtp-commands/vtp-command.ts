import { property } from './../../../model/utils/property';
import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { StateContainer } from '../../../../emulator-state';
import { CiscoCommandParser } from '../../../command-parser';
import { CiscoCommandContext } from '../../../cisco-terminal-command';
import { CommandConstants } from "../../../common/cisco-constants";

let vtpDataModel = {
    vtp: {
        mode: {}
    }
};

export class VtpCommands {


    static vtpHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let selector: string[] = cmdState.properties['selector'] || [];
        selector.unshift('vtp');
        //todo: validate that there is a value in the properties
        let value = cmdState.properties['value'];

        if (value) {
            cmdState.output = `Setting device to VTP ${value} mode for VLANS`;
            cmdState.ChangeProperty(selector, value);
        }
        else
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
        return cmdState;

    }

    static vtpModeValueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        if (cmdState.command.command.name === 'transparent') {
            let mode: string = cmdContext.device.property('mode');
            if (mode === 'transparent') {
                cmdState.output = "Device mode already VTP Transparent for VLANS.";
                cmdState.stopProcessing = true;
                return;
            }
        } //else let normal handling continue
        cmdState.properties['value'] = cmdState.command.command.name;
    }

    static vtpModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = ['mode'];
    }


}

let vtpMode: TerminalCommand = {
    name: 'mode',
    description: 'Configure VTP device mode',
    children: [
        { name: 'client', description: 'setting the device to client mode', handler: VtpCommands.vtpModeValueHandler },
        { name: 'off', description: 'setting the device to off mode', handler: VtpCommands.vtpModeValueHandler },
        { name: 'server', description: 'setting the device to client mode', handler: VtpCommands.vtpModeValueHandler },
        {
            name: 'transparent',
            description: 'Setting device to VTP Transparent mode for VLANS.',
            handler: VtpCommands.vtpModeValueHandler
        }
    ],
    handler: VtpCommands.vtpModeHandler

};


export let vtpCommand: TerminalCommand = {
    name: 'vtp',
    description: 'Ignores VLAN updates from other switches',
    children: [{ name: 'domain', description: 'Set the name of the VTP administrative domain.' },
    { name: 'file', description: 'Configure IFS filesystem file where VTP configuration is stored.' },
    { name: 'interface', description: 'Configure interface as the preferred source for the VTP IP updater address' },
        vtpMode,
    { name: 'password', description: 'Set the password for the VTP administrative domain' },
    { name: 'pruning', description: '  Set the administrative domain to permit pruning' },
    { name: 'version', description: ' Set the administrative domain to VTP version' }
    ],
    handler: VtpCommands.vtpHandler
};

export class NoVtpCommands {
    static NoVtpHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.stopProcessing = true;
        let vtpStatus: string = 'Server';
        let result: string = '';

        let vtp = cmdContext.device.model['vtp'];

        if (cmdState.command.token === 'mode' && /^\d+$/.test(cmdState.command.parameters[0])) {
            result = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            //return cmdState;           
        }
        else if (vtp.mode === vtpStatus) {

            result = 'Device mode already VTP server for VLAN feature\n';
            result += 'Resetting device to VTP SERVER mode.';
        }
        else {
            result = 'Resetting device to VTP SERVER mode.';
            cmdState.ChangeProperty(['vtp', 'mode'], vtpStatus);
        }

        cmdState.output = result;
    }
}

export let noVtpCommand: TerminalCommand = {
    name: 'mode',
    description: 'Resetting device to VTP SERVER mode.',
    parameters: [],
    handler: NoVtpCommands.NoVtpHandler,
    children: [
        { name: 'client', description: 'setting the device to client mode', handler: NoVtpCommands.NoVtpHandler },
        { name: 'off', description: 'setting the device to off mode', handler: NoVtpCommands.NoVtpHandler },
        { name: 'server', description: 'setting the device to client mode', handler: NoVtpCommands.NoVtpHandler },
        { name: 'transparent', description: 'Setting device to VTP Transparent mode for VLANS.', handler: NoVtpCommands.NoVtpHandler }
    ]
}
