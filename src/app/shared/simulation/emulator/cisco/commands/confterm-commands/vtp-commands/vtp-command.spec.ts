import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../../../interfaces/terminal-command';
import { CommandState } from '../../../../interfaces/command-state';
import { StateContainer } from '../../../../emulator-state';
import { CiscoCommandParser } from '../../../command-parser';
import { CiscoCommandContext } from '../../../cisco-terminal-command';
import { NotSupportedCommand } from '../../notsupported';
import { vtpCommand } from './vtp-command';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../../command-tester';
import { CommandConstants } from '../../../common/cisco-constants';


export function main() {

    const testCases: CommandTestCase[] = [
        {
            commands: 'vtp',
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: ' vtp mode',
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: ['vtp mode transparent', 'vtp m t'],
            model: { 'vtp': { 'mode': 'transparent' } },
            output: 'Setting device to VTP transparent mode for VLANS'
        }, {
            commands: ['vtp mode server', 'vtp m s'],
            model: { 'vtp': { 'mode': 'server' } },
            output: 'Setting device to VTP server mode for VLANS'
        }, {
            commands: ['vtp mode client', 'vtp m c'],
            model: { 'vtp': { 'mode': 'client' } },
            output: 'Setting device to VTP client mode for VLANS'
        }

    ];

    const excludedCases: CommandTestCase[] = [{
        commands: ['vtp z t',
            'vtp m y',
            'vtp m t x',
            'vtp 1 1'],
        model: {},
        output: 'Invalid input detected'
    },
    ];

    xdescribe('[vtp] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, vtpCommand);
    });

    describe('vtp', () => {
        CommandTester.RunTestCases(testCases, vtpCommand);
    });
}
