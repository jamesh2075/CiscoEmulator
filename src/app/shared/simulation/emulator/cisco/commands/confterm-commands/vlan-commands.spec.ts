import { VlanCommands } from './vlan-commands';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../command-tester';
import { NoCommands } from '../no-commands';

// export interface CommandTestCase {
//     commands: string | string[];
//     result?: any;
//     output?: string | string[];
// }

//export function main() {

    const testCases: CommandTestCase[] = [];
    const noTestCases: CommandTestCase[] = [{
        commands: 'no vlan 1',
        model: {},
        output: '% Default VLAN 1 may not be deleted.',
        context: CommandTester.createCommandContext(undefined, true, true, false)
    }];

    const excludedCases: CommandTestCase[] = [{
        // minimum value correct
        commands: 'vlan 222',
        model: { 'vlans': { id: 222, mode: 'active' } }
    },
    {
        commands: ['vlan 5000'],
        model: {},
        output: 'Command rejected: Bad VLAN list - character #5 (EOL) delimits a VLAN number which is out of the range 1..4094.'
    }, {
        commands: ['vlan'],
        model: {},
        output: '% Incomplete command.'
    }, {
        commands: ['vlan 1002'],
        model: {},
        output: '% Invalid input detected at \'^\' marker.'
    }];

    xdescribe('[vlan] ()', () => {
        CommandTester.RunTestCases(excludedCases, VlanCommands.confTermVlanCommand);
    });

    describe('vlan', () => {
        CommandTester.RunTestCases(testCases, VlanCommands.confTermVlanCommand);
    });
    describe('no vlan', () => {
        CommandTester.RunTestCases(noTestCases, NoCommands.NoConfTermCommand);
    });
//}
