import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { StateContainer } from '../../../../emulator-state';
import { CiscoCommandParser } from '../../../command-parser';
import { CiscoCommandContext } from '../../../cisco-terminal-command';
import { NotSupportedCommand } from "../../notsupported";
import { spanningTreeCommand } from "./spanning-tree-command";
import { SpanningTreeCommandMessages } from "./spanning-tree-command";
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../../command-tester';


export function main() {

    let testCases: CommandTestCase[] = [
        {
            commands: 'spanning-tree',
            model: {},
            output: SpanningTreeCommandMessages.incompleteCommand
        },

        ///////////////////////
        // spanning-tree mode
        // Accepted Commands
        {
            commands: ['spanning-tree mode mst', 'sp mo m'],
            model: { 'spanningtree': { 'mode': 'mst' } }
        }, {
            commands: ['spanning-tree mode rapid-pvst', 'sp mo r'],
            model: { 'spanningtree': { 'mode': 'rapid-pvst' } }
        }, {
            commands: ['spanning-tree mode pvst', 'sp mo p'],
            model: { 'spanningtree': { 'mode': 'pvst' } }
        }, {
            commands: 'sp mo p',
            model: { 'spanningtree': { 'mode': 'pvst' } }
        },

        ///////////////////////
        // spanning-tree mode
        // Rejected Commands
        {
            commands: ['spanning-tree mode rast', 'sp mo 2', 'sp mo rapid pvst', 'sp mo rapid--pvst'],
            model: {},
            output: SpanningTreeCommandMessages.invalidCommand
        },

        ////////////////////
        // spanning-tree vlan
        // Rejected Commands
        {
            commands: ['spanning-tree vlan', 'sp v', 'spanning-tree vlan 547567567', 'sp v 547567567', 'spanning-tree vlan abc', 'sp v abc'],
            model: {},
            output: SpanningTreeCommandMessages.invalidVlanMessage
        },
        ////////////////////
        // spanning-tree portfast
        // Accepted Commands
        {
            commands: ['spanning-tree portfast default', 'spa po d'],
            model: { "spanningtree": { "portfast": { "edge": { "default": false }, "normal": { "default": false }, "network": { "default": false }, "default": true } } }
        },

        ////////////////////
        // spanning-tree portfast
        // Rejected Commands
        {
            commands: ['spanning-tree portfast test', 'sp po t'],
            model: {},
            output: SpanningTreeCommandMessages.incompleteCommand
        },
    ];

    let excludedCases: CommandTestCase[] = [
        //spanning-tree mode rejected commands
        {
            commands: 'sp m test',
            model: {},
            output: SpanningTreeCommandMessages.invalidCommand
        }, {
            commands: 'sp m pvsta',
            model: {},
            output: SpanningTreeCommandMessages.invalidCommand
        },
        {
            commands: ['spanning-tree vlan 10', 'sp v 10'],
            model: { 'spanningtree': { 'vlan': '10' } }
        }, {
            commands: ['spanning-tree vlan 15,17', 'sp v 15,17'],
            model: { 'spanningtree': { 'vlan': '15,17' } }
        }, {
            commands: ['spanning-tree vlan 12-24', 'sp v 12-24'],
            model: { 'spanningtree': { 'vlan': '12-24' } }
        }, {
            commands: ['spanning-tree vlan 1,3-5,22', 'sp v 1,3-5,22'],
            model: { 'spanningtree': { 'vlan': '1,3-5,22' } }
        }, {
            commands: [
                'spanning-tree vlan 15,40-50,99,23-26',
                'sp v 15,40-50,99,23-26',
                'spanning-tree vlan 15, 40-50, 99, 23-26',
                'sp v 15, 40-50, 99, 23-26'],
            model: { 'spanningtree': { 'vlan': '15,40-50,99,23-26' } }
        },
        ////////////////////
        // spanning-tree vlan priority
        // Accepted Commands
        {
            commands: ['spanning-tree vlan 10 priority 0', 'sp v 10 p 0'],
            model: { 'spanningtree': { 'vlan': '10 priority 0' } }
        },
        ////////////////////
        // spanning-tree vlan root
        // Accepted Commands
        {
            commands: ['spanning-tree vlan 10 root primary', 'sp v 10 r p'],
            model: { 'spanningtree': { 'vlan': '10 root primary' } }
        }, {
            commands: ['spanning-tree vlan 10 root secondary', 'sp v 10 r s'],
            model: { 'spanningtree': { 'vlan': '10 root secondary' } }
        },
        ////////////////////
        // spanning-tree vlan root
        // Rejected Commands
        {
            commands: ['spanning-tree vlan 10 root test', 'sp v 10 r t'],
            model: {},
            output: SpanningTreeCommandMessages.invalidCommand
        },
        ////////////////////
        // spanning-tree vlan priority
        // Rejected Commands
        {
            commands: ['spanning-tree vlan 10 priority 10000', 'sp v 10 p 10000'],
            model: {},
            output: SpanningTreeCommandMessages.invalidVlanPriorityMessage
        },

    ];

    xdescribe('[spanning-tree] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, spanningTreeCommand);
    });

    describe('spanning-tree', () => {
        CommandTester.RunTestCases(testCases, spanningTreeCommand);
    });
}
