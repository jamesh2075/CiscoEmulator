import { ICiscoDevice, ICiscoInterface } from './icisco-device';
import { ICiscoCommandActions } from './cisco-command-actions';

// TODO: Doesn't belong here
export interface InterfaceSelector {
    name: string; // the type being selected (if a range) or the full name of the interface
                  //  eg: 'GigabitEthernet' or 'GigabitEthernet0/1' or 'GigabitEthernet 0/1'
    range?: string; // the numerical range to include, eg: '0/0-2'
}

export interface CiscoCommandContext {
    enabled: boolean;
    confTerminal: boolean;
    confInterface: boolean;

    interfaceSelector?: InterfaceSelector;

    actions?: ICiscoCommandActions;
    device?: ICiscoDevice;
    interfaces?: ICiscoInterface[];
}

export class CiscoTerminalContext {
    enabled: boolean;
    confTerminal: boolean;
    confInterface: boolean;
    confVlan: boolean;

    interfaceSelector?: InterfaceSelector;
}

