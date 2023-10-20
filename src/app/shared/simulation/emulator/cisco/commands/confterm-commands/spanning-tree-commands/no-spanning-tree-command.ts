import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../../../cisco-terminal-command';
import { CommandConstants } from '../../../common/cisco-constants';
import { spanningTreeDefaultModel, UtilityModel } from './spanning-tree-command';
import { CiscoFormatters } from '../../../common/cisco-formatters';
import { spanningUnsupoortedCommands } from './spanning-tree-command';

export class NoSpanningTree {

    static validateCommand(cmdContext: CiscoCommandContext, cmdState: CommandState, value: string) {

        let isValid = true;
        if (cmdState.command.parameters && cmdState.command.parameters[0] && cmdState.command.parameters[0].length > 0) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            isValid = false;
        } else if (value === undefined) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            isValid = false;
        }

        return isValid;
    }

    static NoSpanningTreeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (NoSpanningTree.validateCommand(cmdContext, cmdState, cmdState.properties['value'])) {
            const selector: string[] = cmdState.properties['selector'] || [];
            // todo: validate that there is a value in the properties
            selector.unshift('spanningtree');
            cmdState.ChangeProperty(selector, cmdState.properties['value']);
            console.log(cmdState.properties['selector'], cmdState.properties['value']);

        }

        cmdState.stopProcessing = true;
        return cmdState;
    }

    static noSpanningTreeModeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['value'] = 'pvst';
        cmdState.properties['selector'] = ['mode'];
        return cmdState;

    }

    static edgeBdpuDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = false;
        return cmdState;
    }

    static edgeDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = false;
        return cmdState;
    }

    static normalDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = false;
        return cmdState;
    }

    static networkDefaultHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'] = [`${cmdState.command.command.name}`];
        cmdState.properties['value'] = false;
        return cmdState;
    }

    static noBpduGuardHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['selector'] = [];
        }
        cmdState.properties['selector'].unshift('bpduguard');
    }

    static noBpduFilterHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['selector'] = [];
        }
        cmdState.properties['selector'].unshift('bpdufilter');

    }

    static noEdgeHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['selector'] = [];
        }
        cmdState.properties['selector'].unshift('edge');
    }

    static noNetworkHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['selector'] = [];
        }
        cmdState.properties['selector'].unshift('network');
    }

    static noNormalHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['value'] === undefined) {
            cmdState.properties['selector'] = [];
        }
        cmdState.properties['selector'].unshift('normal');
    }

    static noPortFastHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['selector'].unshift('portfast');
        if (!NoSpanningTree.validateCommand(cmdContext, cmdState, cmdState.properties['value'])) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND;
            cmdState.stopProcessing = true;
            return cmdState;
        }


        // Do other functionality here if command is accepted.

        return cmdState;

    }

    static noVlanRootHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        return cmdState;
    }

    static noVlanPriorityHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.properties['priorityMode'] = 'priority';
        return cmdState;
    }

    static noVlanNumberHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.properties['vLanNumber'] === undefined) {
            cmdState.properties['vLanNumber'] = '';
        }
        cmdState.properties['vLanNumber'] = cmdState.command.token + cmdState.properties['vLanNumber'];
        cmdState.properties['value'] = cmdState.properties['vLanNumber'];

        return cmdState;

    }
    static noSpanningTreeVlanHandler(cmdContext: CiscoCommandContext, cmdState: CommandState) {

        if (cmdState.properties['vLanNumber']) {
            const validVlans = CiscoFormatters.formatRange(cmdState.properties['vLanNumber']);
            if (cmdState.properties['priorityMode']) {
                UtilityModel.updateVlanPriority(cmdContext.device.model.vlans,
                    validVlans, cmdContext.device.property(['spanningtree', 'defaultPriority']));
            } else {
                UtilityModel.updateVlanSpanningTreeProp(cmdContext.device.model.vlans, validVlans, false);
            }
        }

        cmdState.stopProcessing = true;
        return cmdState;

    }

}

const noSpanningTreeMode: TerminalCommand = {
    name: 'mode',
    description: 'Spanning tree operating mode',
    handler: NoSpanningTree.noSpanningTreeModeHandler
};

const noBpdufilterCommand: TerminalCommand = {
    name: 'bpdufilter',
    description: 'Enable portfast edge bpdu filter on this switch',
    children: [
        {
            name: 'default',
            description: 'Enable bdpu filter by default on all portfast edge ports',
            handler: NoSpanningTree.edgeBdpuDefaultHandler
        }
    ],
    handler: NoSpanningTree.noBpduFilterHandler
};

const noBpduguardCommand: TerminalCommand = {
    name: 'bpduguard',
    description: 'Enable portfast edge bpdu guard on this switch',
    children: [
        {
            name: 'default',
            description: 'Enable bpdu guard by default on all portfast edge ports',
            handler: NoSpanningTree.edgeBdpuDefaultHandler
        }
    ],
    handler: NoSpanningTree.noBpduGuardHandler
};

const noEdgeCommand: TerminalCommand = {
    name: 'edge',
    description: 'Spanning tree portfast edge options',
    children: [noBpdufilterCommand, noBpduguardCommand,
        {
            name: 'default',
            description: 'Enable portfast edge by default on all access ports',
            handler: NoSpanningTree.edgeDefaultHandler
        }
    ],
    handler: NoSpanningTree.noEdgeHandler
};

const noNetworkCommand: TerminalCommand = {
    name: 'network',
    description: 'Spanning tree portfast network options',
    children: [
        {
            name: 'default',
            description: 'Enable portfast network by default on all ports',
            handler: NoSpanningTree.networkDefaultHandler
        }
    ],
    handler: NoSpanningTree.noNetworkHandler
};

const noNormalCommand: TerminalCommand = {
    name: 'normal',
    description: 'Spanning tree portfast normal options',
    children: [
        {
            name: 'default',
            description: 'Enable normal behavior by default on all ports',
            handler: NoSpanningTree.normalDefaultHandler
        }
    ],
    handler: NoSpanningTree.noNormalHandler
};

const noPortFastCommand: TerminalCommand = {
    name: 'portfast',
    description: 'Spanning tree portfast options',
    children: [noEdgeCommand, noNetworkCommand, noNormalCommand],
    handler: NoSpanningTree.noPortFastHandler
};

const noVlanPriority: TerminalCommand = {
    name: 'priority',
    description: 'Set the bridge priority for the spanning tree',
    handler: NoSpanningTree.noVlanPriorityHandler
};

const noSpanningTreeRoot: TerminalCommand = {
    name: 'root',
    description: 'Configure switch as root',
    handler: NoSpanningTree.noVlanRootHandler
};

const noVlanNumber: TerminalCommand = {
    name: 'WORD',
    description: 'vlan range, example: 1,3-5,7,9-11',
    children: [noVlanPriority, noSpanningTreeRoot,
        { name: '<cr>', description: '' },
        { name: 'forward-time', description: 'Set the forward delay for the spanning tree' },
        { name: 'hello-time', description: 'Set the hello interval for the spanning tree' },
        { name: 'max-age', description: 'Set the max age interval for the spanning tree' },
    ],
    handler: NoSpanningTree.noVlanNumberHandler,
    validator: function () { return true; }
};

const noSpanningTreeVlan: TerminalCommand = {
    name: 'vlan',
    description: 'VLAN Switch Spanning Tree',
    children: [noVlanNumber],
    handler: NoSpanningTree.noSpanningTreeVlanHandler
};

export let noSpanningTreeCommand: TerminalCommand = {
    name: 'spanning-tree',
    description: 'Spanning Tree Subsystem',
    parameters: [],
    handler: NoSpanningTree.NoSpanningTreeHandler,
    children: [noSpanningTreeMode, noSpanningTreeVlan, noPortFastCommand, ...spanningUnsupoortedCommands],
};
