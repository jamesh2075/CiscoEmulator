
import { CommandConstants } from '../common/cisco-constants';
import { exitCommand } from './enabled-commands';
import { CommandTester, CommandTestCase } from './command-tester';


export function main() {

    let exitCases: CommandTestCase[] = [
        {
            commands: [
                'exit',
                'ex',
            ],
            contextModel: { enabled: false },
            context: CommandTester.createCommandContext(undefined, true, false, false)
        },
        {
            commands: [
                'exit garble',
            ],
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT,
            contextModel: {},
            context: CommandTester.createCommandContext(undefined, true, false, false)
        },
    ];


    // xdescribe('[] (under development, known to fail)', () => {
    //     CommandTester.RunTestCases(excludedCases, );
    // });

    describe('exit', () => {
        CommandTester.RunTestCases(exitCases, exitCommand);
    });
}

