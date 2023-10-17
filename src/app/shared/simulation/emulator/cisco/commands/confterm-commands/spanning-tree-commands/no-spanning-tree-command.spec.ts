import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { StateContainer } from '../../../../emulator-state';
import { CiscoCommandContext } from '../../../cisco-terminal-command';
import { CiscoCommandParser } from '../../../command-parser';
import { CommandConstants } from '../../../common/cisco-constants';
import { NotSupportedCommand } from '../../notsupported';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../../command-tester';
import { noSpanningTreeCommand } from './no-spanning-tree-command';


export function main() {

    const testCases: CommandTestCase[] = [
        {
            commands: 'no spanning-tree',
            model: {},
            output: ''
        },

    ];

    const excludedCases: CommandTestCase[] = [
        {
            commands: ['no spanning-tree mode', 'no sp mo'],
            model: { 'spanningtree': { 'mode': 'pvst' } }
        },
        {
            commands: 'no spanning-tree vlan 10 priority 0',
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
    ];

    xdescribe('[no spanning-tree] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, noSpanningTreeCommand);
    });

    describe('no spanning-tree', () => {
        CommandTester.RunTestCases(testCases, noSpanningTreeCommand);
    });
}
