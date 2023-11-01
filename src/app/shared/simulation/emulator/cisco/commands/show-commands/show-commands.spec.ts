import {Observable} from 'rxjs/Observable';
import {TerminalCommand} from '../../../interfaces/terminal-command';
import {CommandState} from '../../../interfaces/command-state';
import {StateContainer} from '../../../emulator-state';
import {CiscoCommandParser} from '../../command-parser';
import {CiscoCommandContext} from '../../cisco-terminal-command';
import {NotSupportedCommand} from '../notsupported';
import {showCommand} from './show-command';
import {CommandTester, CommandTestCase, CommandTestCaseResult} from '../command-tester';

//export function main() {

    const testCases: CommandTestCase[] = [];

    const excludedCases: CommandTestCase[] = [{
        commands: 'show',
        model: {},
        output: 'I got this from my data undefined'
    }, {
        commands: 'show ether',
        model: {},
        output: `% Ambiguous command 'show ether'.`
    }, {
        commands: 'show eht',
        model: {},
        output: '%Invalid input detected'
    }, {
        commands: 'show etherchannel detail',
        model: {},
        output: 'This command is not supported.'
    }, {
        commands: 'show etherchannel po',
        model: {},
        output: `% Ambiguous command 'show etherchannel po'`
    }, {
        commands: 'show etherchannel som',
        model: {},
        output: `% Ambiguous command 'show etherchannel po'`
    }, {
        commands: 'show vtp',
        model: {},
        output: '% Incomplete command'
    }, {
        commands: 'show vt status',
        model: {},
        output: `% Ambiguous command 'show vt status'.`
    }, {
        commands: 'show vt xxx',
        model: {},
        output: '% Invalid input detected'
    }];

    xdescribe('[show] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, showCommand);
    });

    describe('show', () => {
        CommandTester.RunTestCases(testCases, showCommand);
    });
//}
