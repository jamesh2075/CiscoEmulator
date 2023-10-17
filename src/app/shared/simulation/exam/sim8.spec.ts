import {Observable} from 'rxjs/Observable';
import {SimulationFactory} from '../simulation.factory';
import {sim8} from './sim8';

export function main() {

    const preludeCommands = [
        'enable',
        'configure terminal',
        'show run'
        // 'do show etherchannel summary' 'do sh eth s'
    ];

    // commands considered to have been pre-entered when the simulation starts
    // spoke2: enable
    //    prompt: terminator changes from '>' to '#'
    // spoke2: configure terminal
    //    out: Enter configuration commangds, one per line.  End with CNTL/Z.
    //    prompt: changes to 'SPOKE2(config)#'
    // spoke2: do sh ip int br
    //    out: (interface listing)
    // spoke2: interface tunnel10
    //    prompt: changes to 'SPOKE2(config-if)#'
    // other: enable
    // other: configure terminal
    // other: interface --

    const verifications = {
        'tunnel 10 exists': {},
        'tunnel 10 down': {}
    };

    const tasks = {
        'Task A': {
            anyOrder: true,
            commands: [
                {
                    device: 'spoke2',
                    interface: 'tunnel10',
                    command: 'ip address 192.168.10.1 255.255.255.252',
                    outputExpected: '' // no output
                }, {
                    device: 'spoke2',
                    command: ['tunnel source Loopback0', 'tunnel source 3.3.3.3'],
                    outputExpected: ''
                }, {
                    device: 'spoke2',
                    command: 'tunnel destination 4.4.4.4',
                    outputExpected: undefined
                }, {
                    device: 'spoke2',
                    command: 'keepalive 15 2',
                    outputExpected: undefined
                }, {
                    device: 'other',
                    command: 'ip address 192.168.10.2 255.255.255.252',
                    outputExpected: ''
                }, {
                    device: 'other',
                    command: ['tunnel source Loopback0', 'tunnel source 4.4.4.4'],
                    outputExpected: ''
                }, {
                    device: 'other',
                    command: 'tunnel destination 3.3.3.3',
                    outputExpected: undefined
                }, {
                    device: 'other',
                    command: 'keepalive 15 2',
                    outputExpected: undefined
                }]
        },
        'Task B': {
            commands: [
                {
                    device: 'spoke2',
                    command: [
                        'access-list 100 permit gre host 4.4.4.4 host 3.3.3.3',
                        'access-list 100 permit 47 host 4.4.4.4 host 3.3.3.3',
                        'access-list 100 permit gre host 4.4.4.4 3.3.3.3 0.0.0.0',
                        'access-list 100 permit 47 host 4.4.4.4 3.3.3.3 0.0.0.0',
                        'access-list 100 permit gre 4.4.4.4 0.0.0.0 3.3.3.3 0.0.0.0',
                        'access-list 100 permit 47 4.4.4.4 0.0.0.0 3.3.3.3 0.0.0.0',
                        'access-list 100 permit gre 4.4.4.4 0.0.0.0 host 3.3.3.3',
                        'access-list 100 permit 47 4.4.4.4 0.0.0.0 host 3.3.3.3'
                    ],
                    outputExpected: ''
                }]
        },
        'Task C': {
            anyOrder: true,
            commands: [
                {
                    device: 'spoke1',
                    command: 'tunnel key 1',
                    outputExpected: ''
                }, {
                    device: 'spoke2',
                    command: 'tunnel key 1',
                    outputExpected: ''
                }]
        },
        'Task D': {
            anyOrder: false,
            commands: [
                {
                    device: 'spoke1',
                    command: 'no tunnel destination',
                    outputExpected: ''
                }, {
                    device: 'spoke1',
                    command: 'tunnel mode gre multipoint',
                    outputExpected: ''
                }, {
                    device: 'spoke2',
                    command: 'no tunnel destination',
                    outputExpected: ''
                }, {
                    device: 'spoke2',
                    command: 'tunnel mode gre multipoint',
                    outputExpected: ''
                }
            ]
        }
    };

    describe('Sim 8', () => {

        beforeEach(() => {
        });

        // TODO: This needs to use models now
        xit('SimulationFactory loads the simulation', () => {
            const simulation = SimulationFactory.load(sim8);
            expect(simulation.devices.length).toEqual(5);
        });

        const taskLabel = 'Task A';
        xit(taskLabel, () => {
            const simulation = SimulationFactory.load(sim8);

            const task = tasks['Task A'];
            expect(task).not.toBeNull();

            for (const command of task.commands) {
                const device = simulation.getDevice(command.device);
                expect(device).not.toBeNull();
                const commandHandler = device.getDefaultTerminal();
                expect(commandHandler).not.toBeNull();

                let commandLine: string;
                if (Array.isArray(command.command)) {
                    commandLine = command.command[0];
                } else {
                    commandLine = command.command;
                }
                const commandResult = commandHandler.invoke(commandLine);
                console.log(taskLabel + ': ' + command.device + '> ' + commandLine + '\r\n' +
                    'result code: ' + commandResult.resultCode + '\r\n' +
                    commandResult.output + '\r\n-------\r\n');

                // TODO: Check the command result
            }
        });

    });
}
