import {CommandTester, CommandTestCase, CommandTestCaseResult} from '../command-tester';
import {channelProtocol} from './channel-protocol-command';

export function main() {

    const testCases: CommandTestCase[] = [
        {
            commands: 'channel-protocol lacp',
            model: {'channel-group': {'protocol': 'lacp'}}
        }, {
            commands: 'channel-protocol pagp',
            model: {'channel-group': {'protocol': 'pagp'}}
        }
    ];

    const excludedCases: CommandTestCase[] = [];

    const noCases: CommandTestCase[] = [];

    const exludedNoCases: CommandTestCase[] = [
        {
            commands: 'no channel-protocol',
            model: {'channel-group': {'protocol': 'pagp'}}
        }
    ];


    xdescribe('[channel-protocol] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, channelProtocol);
    });

    describe('channel-protocol', () => {
        CommandTester.RunTestCases(testCases, channelProtocol);
    });

    xdescribe('[no channel-protocol] (under development, known to fail)', () => {
        CommandTester.RunTestCases(exludedNoCases, channelProtocol);
    });

    describe('no channel-protocol', () => {
        CommandTester.RunTestCases(noCases, channelProtocol);
    });

}
