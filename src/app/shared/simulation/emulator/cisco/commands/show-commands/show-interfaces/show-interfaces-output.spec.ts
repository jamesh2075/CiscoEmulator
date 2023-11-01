import {Observable} from 'rxjs/Observable';
import {TerminalCommand} from '../../../../interfaces/terminal-command';
import {CommandState} from '../../../../interfaces/command-state';
import {StateContainer} from '../../../../emulator-state';
import {CiscoCommandParser} from '../../../command-parser';
import {CiscoCommandContext} from '../../../cisco-terminal-command';
import {NotSupportedCommand} from '../../notsupported';
import {showInterfacesCommand} from './show-interfaces';
import {CommandTester, CommandTestCase, CommandTestCaseResult} from '../../command-tester';

//export function main() {

    const testCases: CommandTestCase[] = [];

    const excludedCases: CommandTestCase[] = [
        {
            commands: ['show', 's'],
            model: {},
            output: '% Type "show ?" for a list of subcommands'
        },
        {
            commands: ['show interfaces', 'sh int'],
            model: {'show': 'interfaces'},
        },
        {
            commands: 'sh in',
            model: {},
            output: '% Ambiguous command: "sh in"'
        },
        {
            commands: 's interfaces',
            model: {'show': 'interfaces'}
        }
    ];

    xdescribe('[show interfaces] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, showInterfacesCommand);
    });

    describe('show interfaces', () => {
        CommandTester.RunTestCases(testCases, showInterfacesCommand);
    });
//}
