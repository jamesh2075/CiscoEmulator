import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../../../cisco-terminal-command';
import { NotSupportedCommand } from "../../notsupported";
import { CiscoCommandParser } from "../../../command-parser";
import { CommandConstants } from '../../../common/cisco-constants';
import { CiscoFormatters } from '../../../common/cisco-formatters';
import { CiscoValidators } from "../../../common/cisco-validators";

export let spanningTreeDefaultModel = {
    defaultMode: 'pvst'
}

export class SpanningTreeCommandMessages {
    static invalidVlanPriorityMessage: string = '% Bridge Priority must be in increments of 4096.\n'
    + '% Allowed values are:\n'
    + '0\t4096\t8192\t12288\t16384\t20480\t24576\t28672\n'
    + '32768\t36864\t40960\t45056\t49152\t53248\t57344\t61440\n';

    static invalidVlanMessage: string = '% Command rejected: Bad instance list: A number is out of range (1..4094)';
    static incompleteCommand: string = '% Incomplete command.';
    static invalidCommand: string = '% Invalid input detected';
    static outputMessage: string = ' %Warning: this command enables portfast by default on all interfaces. You should now disable portfast explicitly on switched ports leading to hubs, switches and bridges as they may create temporary bridging loops.';
}

class SpanningTreeCommands {
    static SpanningTree(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let selector: string[] = cmdState.properties['selector'] || [];
        selector.unshift('spanningtree');

        let value = cmdState.properties['value'];

        //Check for priority number and add it to value.
        if (cmdState.properties['vlanPriorityNumber'])
            value += ` priority ${cmdState.properties['vlanPriorityNumber']}`;

        if (cmdState.properties['vlanRoot'])
            value += ` root ${cmdState.properties['vlanRoot']}`;

        if (cmdState.properties['vLanNumber']) {
            let validVlans = CiscoFormatters.formatRange(cmdState.properties['vLanNumber']);
            UtilityModel.updateVlanSpanningTreeProp(cmdContext.device.model.vlans, validVlans, true);
            if (cmdState.properties['vlanPriorityNumber'])
                UtilityModel.updateVlanPriority(cmdContext.device.model.vlans, validVlans, cmdState.properties['vlanPriorityNumber']);
        }

        if (cmdState.properties['isValid'] === false) {
            cmdState.output = cmdState.properties['validationMessage'];
        }
        else if (value) {
            if (cmdState.properties['portfast']) {
                SpanningTreeCommands.setDefaults(cmdState);
            }
            cmdState.ChangeProperty(selector, value);
        }
        else {
            cmdState.output = "% Incomplete command."; // Written to handle command spanning-tree or spanning-tree vlan ( Just typing command without mentioning the value or ?)
        }


        return cmdState;
    }

    static setDefaults(cmdState: CommandState) {
        let portfastselectors = [
            { selector: ['spanningtree', 'portfast', 'edge', 'default'] },
            { selector: ['spanningtree', 'portfast', 'normal', 'default'] },
            { selector: ['spanningtree', 'portfast', 'network', 'default'] }
        ];
        for (let portfastselector of portfastselectors) {
            cmdState.ChangeProperty(portfastselector.selector, false);
        }
    }

    static ModeParam(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        cmdState.properties['value'] = cmdState.command.command.name;
        return cmdState;
    }

    static ModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        cmdState.properties['selector'] = ['mode'];
        return cmdState;
    }

    static vlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = ['vlan'];
        if (!cmdState.properties['vLanNumber']) {
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.invalidVlanMessage;
        }

        return cmdState;
    }

    static VlanNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['vLanNumber'] === undefined) {
            cmdState.properties['vLanNumber'] = '';
        }
        cmdState.properties['vLanNumber'] = cmdState.command.token + cmdState.properties['vLanNumber'];
        cmdState.properties['value'] = cmdState.properties['vLanNumber'];

        return cmdState;
    }

    static vlanPriorityHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        cmdState.properties['priorityMode'] = 'priority';
        if (cmdState.properties['vlanPriorityNumber'] === undefined) {
            cmdState.properties['isValid'] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.invalidCommand;
        }

        return cmdState;
    }

    static VlanPriorityNumber(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let isValid = CiscoValidators.validateNumberInArray(parseInt(cmdState.command.token.trim()), CommandConstants.PRIORITY.rangeValues);
        if (!isValid) {
            cmdState.output = SpanningTreeCommandMessages.invalidVlanPriorityMessage;
            cmdState.stopProcessing = true;
            return cmdState;
        }
        cmdState.properties['vlanPriorityNumber'] = cmdState.command.token;
        return cmdState;
    }

    static VlanRootHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //cmdState.properties['selector'] = cmdState.command.command.name;
        if (!cmdState.properties['vlanRoot']) {
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.invalidCommand;
        }
        return cmdState;
    }

    static VlanRootValueHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['vlanRoot'] = cmdState.command.command.name;

        return cmdState;
    }

    static edgeDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        //cmdState.properties['value'] = cmdState.command.command.name;
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = true;
        cmdState.output = SpanningTreeCommandMessages.outputMessage;
        return cmdState;
    }
    static edgeChildDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.command.name === 'default') {
            cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
            cmdState.properties['value'] = true;
        }
        else {
            cmdState.output = SpanningTreeCommandMessages.invalidCommand;
            cmdState.stopProcessing = true;
        }
        return cmdState;
    }

    static edgeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.outputMessage;
        }
        cmdState.properties['selector'].unshift('edge');
        return cmdState;
    }

    static networkDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = true;
        return cmdState;
    }

    static normalDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = true;
        return cmdState;
    }

    static PortFastDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = true;
        return cmdState;
    }

    static bpduguardHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.incompleteCommand;
        }
        cmdState.properties['selector'].unshift('bpduguard');
        return cmdState;
    }

    static bpdufilterHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.incompleteCommand;
        }
        cmdState.properties['selector'].unshift('bpdufilter');
        return cmdState;
    }

    static normalHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.incompleteCommand;
        }
        cmdState.properties['selector'].unshift('normal');
        return cmdState;
    }

    static networkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.incompleteCommand;
        }
        cmdState.properties['selector'].unshift('network');
        return cmdState;
    }

    static PortFastHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (!cmdState.properties['value']) {
            cmdState.properties['selector'] = [];
            cmdState.properties["isValid"] = false;
            cmdState.properties['validationMessage'] = SpanningTreeCommandMessages.incompleteCommand;
        }
        cmdState.properties['portfast'] = 'portfast';
        cmdState.properties['selector'].unshift('portfast');
        return cmdState;
    }
}


export class UtilityModel {
    // updates vlan priority no
    static updateVlanPriority(vlans: any[], vlanNos: any, priorityNo: any) {
        for (let vlan of vlans) {
            if (vlanNos.indexOf(vlan.id) > -1) {
                vlan.priority = priorityNo;
            }
        }
    }

    static updateVlanSpanningTreeProp(vlans: any[], vlanNos: any, isEnable: boolean) {
        for (let vlan of vlans) {
            if (vlanNos.indexOf(vlan.id) > -1) {
                vlan.spanningEnabled = isEnable;
            }
        }
    }

}


// Mode command under spanning-tree mode
let modeCommand: TerminalCommand = {
    name: 'mode',
    description: 'Spanning tree operating mode',
    children: [
        { name: 'mst', description: 'Multiple spanning tree mode', handler: SpanningTreeCommands.ModeParam },
        { name: 'pvst', description: 'Per-Vlan spanning tree mode', handler: SpanningTreeCommands.ModeParam },
        { name: 'rapid-pvst', description: 'Per-Vlan rapid spanning tree mode', handler: SpanningTreeCommands.ModeParam }
    ],
    handler: SpanningTreeCommands.ModeHandler
};

let bpdufilterCommand: TerminalCommand = {
    name: 'bpdufilter',
    description: 'Enable portfast edge bpdu filter on this switch',
    children: [
        {
            name: 'default',
            description: 'Enable portfast network by default on all ports',
            handler: SpanningTreeCommands.edgeChildDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.bpdufilterHandler
};

let bpduguardCommand: TerminalCommand = {
    name: 'bpduguard',
    description: 'Enable portfast edge bpdu guard on this switch',
    children: [
        {
            name: 'default',
            description: 'Enable portfast network by default on all ports',
            handler: SpanningTreeCommands.edgeChildDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.bpduguardHandler
};

let edgeCommand: TerminalCommand = {
    name: 'edge',
    description: 'Spanning tree portfast edge options',
    children: [bpdufilterCommand, bpduguardCommand,
        {
            name: 'default',
            description: 'Enable portfast edge by default on all access ports',
            handler: SpanningTreeCommands.edgeDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.edgeHandler
};

let networkCommand: TerminalCommand = {
    name: 'network',
    description: 'Spanning tree portfast network options',
    children: [
        {
            name: 'default',
            description: 'Enable portfast network by default on all ports',
            handler: SpanningTreeCommands.networkDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.networkHandler
};

let normalCommand: TerminalCommand = {
    name: 'normal',
    description: 'Spanning tree portfast normal options',
    children: [
        {
            name: 'default',
            description: 'Enable normal behavior by default on all ports',
            handler: SpanningTreeCommands.normalDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.normalHandler
};

let portFastCommand: TerminalCommand = {
    name: 'portfast',
    description: 'Spanning tree portfast options',
    children: [edgeCommand, networkCommand, normalCommand,
        {
            name: 'default',
            description: 'Enable portfast edge by default on all access ports',
            handler: SpanningTreeCommands.PortFastDefaultHandler
        }
    ],
    handler: SpanningTreeCommands.PortFastHandler
};

let vlanPriorityNumber: TerminalCommand = {
    name: '<0-61440>',
    description: 'bridge priority in increments of 4096',
    handler: SpanningTreeCommands.VlanPriorityNumber,
    validator: (function (token: string) {
        return (/^\d+$/.test(token));
    })
};

let vlanPriority: TerminalCommand = {
    name: 'priority',
    description: 'Set the bridge priority for the spanning tree',
    children: [
        vlanPriorityNumber
    ],
    handler: SpanningTreeCommands.vlanPriorityHandler
};

let root: TerminalCommand = {
    name: 'root',
    description: 'Configure switch as root',
    children: [
        {
            name: 'primary',
            description: 'Configure this switch as primary root for this spanning tree',
            handler: SpanningTreeCommands.VlanRootValueHandler
        },
        {
            name: 'secondary',
            description: 'Configure switch as secondary root',
            handler: SpanningTreeCommands.VlanRootValueHandler
        }
    ],
    handler: SpanningTreeCommands.VlanRootHandler
};

let vlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'vlan range, example: 1,3-5,7,9-11',
    children: [
        { name: 'forward-time', description: 'Set the forward delay for the spanning tree' },
        { name: 'hello-time', description: 'Set the hello interval for the spanning tree' },
        { name: 'max-age', description: 'Set the max age interval for the spanning tree' },
        vlanPriority,
        root,
    ],
    handler: SpanningTreeCommands.VlanNumber,
    validator: (function (token: string) {
        return CiscoValidators.validateRange(token, CommandConstants.VLAN.min, CommandConstants.VLAN.max);
    })
};


let vlanCommand: TerminalCommand = {
    name: 'VLAN',
    description: 'VLAN Switch Spanning Tree',
    children: [
        vlanNumber
    ],
    parameters: [],
    handler: SpanningTreeCommands.vlanHandler
};


//List of unsupported commands. Remove from this list when a command is supported.
export let spanningUnsupoortedCommands = [
    { name: 'backbonefast', description: 'Enable BackboneFast Feature' },
    { name: 'bridge', description: 'STP Bridge Assurance parameters' },
    { name: 'etherchannel', description: 'Spanning tree etherchannel specific configuration' },
    { name: 'extend', description: 'Spanning Tree 802.1t extensions' },
    { name: 'logging', description: 'Enable Spanning tree logging' },
    { name: 'loopguard', description: 'Spanning tree loopguard options' },
    { name: 'mst', description: 'Multiple spanning tree configuration' },
    { name: 'pathcost', description: 'Spanning tree pathcost options' },
    { name: 'transmit', description: 'STP transmit parameters' },
    { name: 'uplinkfast', description: 'Enable UplinkFast Feature' }
];


// Spanning tree and its children with supported and unsupported commands
export let spanningTreeCommand: TerminalCommand = {
    name: 'spanning-tree',
    description: 'Spanning Tree Subsystem',
    parameters: [],
    children: [
        modeCommand,
        vlanCommand,
        portFastCommand,
        ...spanningUnsupoortedCommands
    ],
    handler: SpanningTreeCommands.SpanningTree
};
