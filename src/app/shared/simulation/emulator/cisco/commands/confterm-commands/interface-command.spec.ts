import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../../interfaces/terminal-command';
import { CommandState } from '../../../interfaces/command-state';
import { StateContainer } from '../../../emulator-state';
import { CiscoCommandParser } from '../../command-parser';
import { CiscoCommandContext } from '../../cisco-terminal-command';
import { interfaceCommand, interfaceRangeCommand } from './interface-command';
import { CommandConstants } from '../../common/cisco-constants';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../command-tester';


export function main() {

    const interfaceCases: CommandTestCase[] = [
        {
            commands: [
                'int p1',
                'int p 1',
                'interface po1',
                'interface po 1',
                'interface port-channel1',
                'interface port-channel 1'
            ],
            contextModel: { interfaceSelector: { name: 'Port-channel', range: '1' } },
            output: 'Creating a port-channel interface Port-channel 1'
        },
        {
            commands: [
                'interface gigabitethernet1/0',
                'interface gigabitethernet 1/0',
                'interface gi1/0',
                'interface gi 1/0',
                'interface g1/0',
                'interface g 1/0',
                'interface r g1/0',
            ],
            contextModel: { interfaceSelector: { name: 'GigabitEthernet', range: '1/0' } }
        },
        {
            commands: [
                'int gigabitethernet',
                'int gi',
                'int g',
                'int gigabitethernet1',
                'int gi1',
                'int g1',
                'int gigabitethernet 1',
                'int gi 1',
                'int g 1',

                'int port-channel',
                'int po',
                'int p',
                'int port-channel0',
                'int po0',
                'int p0',
                'int port-channel 0',
                'int po 0',
                'int p 0',
            ],
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: [
                'interface gigabitethernet 1/0-1',
                'interface gigabitethernet1/0-1',
                'interface gi 1/0-1',
                'interface gi/0-1',
                'interface g 1/0-1',
                'interface g/0-1',
                'interface gigabitethernet 1/0-1',
                'interface gigabitethernet1/0-1',
                'interface gi 1/0-1',
                'interface gi/0-1',
                'interface g 1/0-1',
                'interface g/0-1',
                'int gigabitethernet 1/0-1',
                'int gigabitethernet1/0-1',
                'int gi 1/0-1',
                'int gi/0-1',
                'int g 1/0-1',
                'int g/0-1',


                'interface gigabitethernet 1/0-1/1',
                'interface gigabitethernet1/0-1/1',
                'interface gi 1/0-1/1',
                'interface gi1/0-1/1',
                'interface g 1/0-1/1',
                'interface g1/0-1/1',


                'int gigabitethernet 1/0-1/1',
                'int gigabitethernet1/0-1/1',
                'int gi 1/0-1/1',
                'int gi1/0-1/1',
                'int g 1/0-1/1',
                'int g1/0-1/1',


            ],
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }

    ];

    const excludedBaseCases: CommandTestCase[] =
    [
        // TODO: Add excluded cases
        {
        commands: [
                'int loopback',
                'int lo',
                'int l',
                'int loopback1',
                'int lo1',
                'int l1',
                'int loopback 1',
                'int lo 1',
                'int l 1',

                'int gigabitethernet1/ 0-1/1',
                'int gigabitethernet1/ 0-1/1',
                'int gi 1/ 0-1/1',
                'int gi1/ 0-1/1',
                'int g 1/ 0-1/1',
                'int g1/ 0-1/1',

                'interface gigabitethernet1/ 0',
                'int gigabitethernet1/ 0',
                'interfacegi1/ 0',
                'int gi1/ 0',
                'interface g1/ 0',
                'int g1/ 0',


            ],
        model: {},
        output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT

        },
    ];

    const excludedRangeCases: CommandTestCase[] =
    [
        {
        commands: [
                'interface range g/0-1',
                'interface r g/0-1',
                'int r g/0-1',


                'interface range gigabitethernet1/ 0',
                'interface r gigabitethernet1/ 0',
                'interface ra gigabitethernet1/ 0',
                'int range gigabitethernet1/ 0',
                'int ra gigabitethernet1/ 0',
                'int r gigabitethernet1/ 0',
                'interface range gi1/ 0',
                'interface r gi1/ 0',
                'interface ra gi1/ 0',
                'int range gi1/ 0',
                'int ra gi1/ 0',
                'int r gi1/ 0',
                'interface range g1/ 0',
                'interface r g1/ 0',
                'interface ra g1/ 0',
                'int range g1/ 0',
                'int ra g1/ 0',
                'int r g1/ 0',

                'interface range gigabitethernet1/ 0-',
                'interface r gigabitethernet1/ 0-',
                'interface ra gigabitethernet1/ 0-',
                'int range gigabitethernet1/ 0-',
                'int ra gigabitethernet1/ 0-',
                'int r gigabitethernet1/ 0-',
                'interface range gi1/ 0-',
                'interface r gi1/ 0-',
                'interface ra gi1/ 0-',
                'int range gi1/ 0-',
                'int ra gi1/ 0-',
                'int r gi1/ 0-',
                'interface range g1/ 0-',
                'interface r g1/ 0-',
                'interface ra g1/ 0-',
                'int range g1/ 0-',
                'int ra g1/ 0-',
                'int r g1/ 0-',


                'interface range gigabitethernet1/ 0-1',
                'interface r gigabitethernet1/ 0-1',
                'interface ra gigabitethernet1/ 0-1',
                'int range gigabitethernet1/ 0-1',
                'int ra gigabitethernet1/ 0-1',
                'int r gigabitethernet1/ 0-1',
                'interface range gi1/ 0-1',
                'interface r gi1/ 0-1',
                'interface ra gi1/ 0-1',
                'int range gi1/ 0-1',
                'int ra gi1/ 0-1',
                'int r gi1/ 0-1',
                'interface range g1/ 0-1',
                'interface r g1/ 0-1',
                'interface ra g1/ 0-1',
                'int range g1/ 0-1',
                'int ra g1/ 0-1',
                'int r g1/ 0-1',

                'int r g1/ 0',
                'int r g1/ 0-',
                'int r g1/ 0-1',
            ],
        model: {},
        output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT

        },
        {
        commands: [
                'interface range',
                'interface r',
                'interface ra',
                'int range',
                'int ra',
                'int r',
            ],
        model: {},
        output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND

        },

    ];
    const interfaceRangeCases: CommandTestCase[] = [
        {
            commands: [
                'interface range gigabitethernet 1/0-1',
                'interface range gigabitethernet1/0-1',
                'interface range gi 1/0-1',
                'interface range g 1/0-1',
                'interface r gigabitethernet 1/0-1',
                'interface r gigabitethernet1/0-1',
                'interface r gi 1/0-1',
                'interface r g 1/0-1',
                'int r gigabitethernet 1/0-1',
                'int r gigabitethernet1/0-1',
                'int r gi 1/0-1',
                'int r g 1/0-1',


            ],
            contextModel: { interfaceSelector: { name: 'GigabitEthernet', range: '1/0-1' } },
        },
        {
            commands: [
                'interface range gigabitethernet1/1',
                'interface r gigabitethernet1/1',
                'interface ra gigabitethernet1/1',
                'int range gigabitethernet1/1',
                'int ra gigabitethernet1/1',
                'int r gigabitethernet1/1',
                'interface range gi1/1',
                'interface r gi1/1',
                'interface ra gi1/1',
                'int range gi1/1',
                'int ra gi1/1',
                'int r gi1/1',
                'interface range g1/1',
                'interface r g1/1',
                'interface ra g1/1',
                'int range g1/1',
                'int ra g1/1',
                'int r g1/1',

            ],
            contextModel: { interfaceSelector: { name: 'GigabitEthernet', range: '1/1' } },
        },
        {
            commands: [

                'interface range gigabitethernet',
                'interface r gigabitethernet',
                'interface ra gigabitethernet',
                'int range gigabitethernet',
                'int ra gigabitethernet',
                'int r gigabitethernet',
                'interface range gi',
                'interface r gi',
                'interface ra gi',
                'int range gi',
                'int ra gi',
                'int r gi',
                'interface range g',
                'interface r g',
                'interface ra g',
                'int range g',
                'int ra g',
                'int r g',

                'interface range gigabitethernet1',
                'interface r gigabitethernet1',
                'interface ra gigabitethernet1',
                'int range gigabitethernet1',
                'int ra gigabitethernet1',
                'int r gigabitethernet1',
                'interface range gi1',
                'interface r gi1',
                'interface ra gi1',
                'int range gi1',
                'int ra gi1',
                'int r gi1',
                'interface range g1',
                'interface r g1',
                'interface ra g1',
                'int range g1',
                'int ra g1',
                'int r g1',

                'interface range gigabitethernet1/',
                'interface r gigabitethernet1/',
                'interface ra gigabitethernet1/',
                'int range gigabitethernet1/',
                'int ra gigabitethernet1/',
                'int r gigabitethernet1/',
                'interface range gi1/',
                'interface r gi1/',
                'interface ra gi1/',
                'int range gi1/',
                'int ra gi1/',
                'int r gi1/',
                'interface range g1/',
                'interface r g1/',
                'interface ra g1/',
                'int range g1/',
                'int ra g1/',
                'int r g1/',

                'interface range gigabitethernet1/1-',
                'interface r gigabitethernet1/1-',
                'interface ra gigabitethernet1/1-',
                'int range gigabitethernet1/1-',
                'int ra gigabitethernet1/1-',
                'int r gigabitethernet1/1-',
                'interface range gi1/1-',
                'interface r gi1/1-',
                'interface ra gi1/1-',
                'int range gi1/1-',
                'int ra gi1/1-',
                'int r gi1/1-',
                'interface range g1/1-',
                'interface r g1/1-',
                'interface ra g1/1-',
                'int range g1/1-',
                'int ra g1/1-',
                'int r g1/1-',



            ],
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: [
                'interface range gi/0-1',
                'interface r gi/0-1',
                'int r gi/0-1',
            ],
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }
    ];

    const testCases: CommandTestCase[] = [
        ...interfaceCases,
        ...interfaceRangeCases
    ];

    const excludedCases: CommandTestCase[] = [
        ...excludedBaseCases,
        ...excludedRangeCases
    ];

    xdescribe('[interface] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, interfaceCommand);
    });

    describe('interface', () => {
        CommandTester.RunTestCases(testCases, interfaceCommand);
    });
}

