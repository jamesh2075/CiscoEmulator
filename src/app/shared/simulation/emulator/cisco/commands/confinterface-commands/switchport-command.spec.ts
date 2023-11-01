import { CommandConstants } from '../../common/cisco-constants';
import { switchportCommand } from './switchport-command';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from '../command-tester';

//export function main() {


    // switchport base commands

    const switchportCases: CommandTestCase[] = [
        {
            commands: ['switchport', 'sw'],
            model: {},
            output: ''
        }
    ];

    // switchport nonegotiate test cases

    const switchportNonegotiateCases: CommandTestCase[] = [
        {
            commands: ['switchport nonegotiate', 'sw n'],
            model: { 'switchport': { 'trunkNegotiation': 'Off' } }
        },
        {
            commands: ['switchport nonegotiate test', 'sw n t'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }
    ];
    // switchport mode test cases

    const switchportModeCases: CommandTestCase[] = [
        {
            commands: ['switchport mode', 'sw m'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: ['switchport mode 1', 'sw m 1'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        },
        {
            commands: ['switchport mode test', 'sw m te'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        },
        {
            commands: ['switchport mode access', 'sw m ac', 'sw mode a'],
            model: { 'switchport': { 'adminMode': 'static access' } },
        },
        {
            commands: ['switchport mode dynamic', 'sw m dy'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: ['switchport mode dynamic auto', 'sw m dy a', 'sw m dy auto'],
            model: { 'switchport': { 'adminMode': 'dynamic auto' } }
        },
        {
            commands: ['switchport mode dynamic desirable', 'sw m dy d', 'sw m dy desir'],
            model: { 'switchport': { 'adminMode': 'dynamic desirable' } }
        },
        {
            commands: ['switchport mode dot1q-tunnel', 'sw mode do', 'switchport m dot1', 'sw m do'],
            model: { 'switchport': { 'adminMode': 'dot1q-tunnel' } }
        },
        {
            commands: [
                'switchport mode private-vlan',
                'sw m pr',
                'switchport mode private-vlan host',
                'switchport mode private-vlan promiscuous',
                'sw m pr ho'
            ],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.UNSUPPORTED_COMMAND
        }
    ];

    // switchport access test cases

    const switchportAccessCases: CommandTestCase[] = [
        {
            commands: ['switchport access', 'sw ac', 'sw a'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        {
            commands: ['switchport access vlan', 'sw a vlan'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
        /*{
            commands: ['switchport access vlan 10', 'sw a v 10'],
            model: { 'switchport': { 'accessVlan': '10' } }
        },*/
    ];

    // switchport trunk allowed test cases

    const switchportTrunkAllowedCases: CommandTestCase[] = [
        {
            commands: ['switchport trunk allowed', 'sw t a', 'sw t allowed'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        }, {
            commands: [
                'switchport trunk allowed vlan all',
                'sw t a v al',
                'sw t al vl al',
                'sw t allowed v all',
                'sw trunk a v all'
            ],
            model: { 'switchport': { 'trunkingVlans': 'ALL' } }
        }, {
            // Failure case for invalid in trunk
            commands: ['sw t 0x v e 40'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        },
    ];

    // switchport trunk native test cases

    const switchportTrunkNativeCases: CommandTestCase[] = [
        {
            commands: ['switchport trunk allowed', 'sw t a', 'sw t allowed'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        }
    ];

    // switchport trunk encapsulation test cases
    const switchportTrunkEncapsulationCases: CommandTestCase[] = [
        {
            commands: ['switchport trunk encapsulation dot1q', 'sw t e dot1Q', 'sw t en d'],
            model: { 'switchport': { adminPrivateVlan: { 'trunkEncapsulation': 'dot1q' } } }
        },
        {
            commands: ['switchport trunk encapsulation isl', 'sw t e i', 'sw trunk e i'],
            model: { 'switchport': { 'adminPrivateVlan': { 'trunkEncapsulation': 'isl' } } }
        }, {
            commands: [
                'switchport trunk encapsulation negotiate', 'sw t e n', 'sw trunk e ne'],
            model: { 'switchport': { 'adminPrivateVlan': { 'trunkEncapsulation': 'negotiate' } } }
        }];

    // switchport trunk test cases

    const switchportTrunkCases: CommandTestCase[] = [
        {
            commands: ['switchport trunk', 'sw t', 'sw tr encapsulation'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },

        ...switchportTrunkAllowedCases,
        ...switchportTrunkNativeCases,
        ...switchportTrunkEncapsulationCases
    ];

    // switchport voice test cases

    const switchportVoiceCases: CommandTestCase[] = [
        {
            commands: ['switchport voice', 'sw v'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        },
    ];


    const testCases: CommandTestCase[] = [
        ...switchportCases,
        ...switchportModeCases,
        ...switchportNonegotiateCases,
        ...switchportAccessCases,
        ...switchportTrunkCases,
        ...switchportVoiceCases
    ];



    const excludedCases: CommandTestCase[] = [
        {
            commands: ['switchport access vlan 10',
                'sw ac v 10',
                'sw access v 10',
                'sw a v 10',
                'sw a vlan 10',
                'sw ac vlan 10'],
            model: { 'switchport': { 'access': 'vlan 10' } }
        }, {
            commands: ['switchport mode trunk', 'sw m t', 'sw m trunk'],
            model: { 'switchport': { 'adminMode': 'trunk' } }
        }, {
            commands: ['switchport access vlan 1',
                'sw ac v 1',
                'sw access v 1',
                'sw a v 1',
                'sw a vlan 1',
                'sw ac vlan 1'],
            model: { 'switchport': { 'access': 'vlan 1' } }
        }, {
            commands: ['switchport access vlan 4094',
                'sw ac v 4094',
                'sw access v 4094',
                'sw a v 4094',
                'sw a vlan 4094',
                'sw ac vlan 4094'],
            model: { 'switchport': { 'access': 'vlan 4094' } }
        }, {
            commands: ['switchport access vlan 1002',
                'sw ac v 1002',
                'sw access v 1002',
                'sw a v 1002',
                'sw a vlan 1002',
                'sw ac vlan 1002'],
            model: {},
            output: '% Warning: port will be inactive in non-ethernet VLAN'
        }, {
            commands: ['switchport access vlan 1003',
                'sw ac v 1003',
                'sw access v 1003',
                'sw a v 1003',
                'sw a vlan 1003',
                'sw ac vlan 1003'],
            model: {},
            output: '% Warning: port will be inactive in non-ethernet VLAN'
        }, {
            commands: ['switchport access vlan 1004',
                'sw ac v 1004',
                'sw access v 1004',
                'sw a v 1004',
                'sw a vlan 1004',
                'sw ac vlan 1004'],
            model: {},
            output: '% Warning: port will be inactive in non-ethernet VLAN'
        }, {
            commands: ['switchport access vlan 1005',
                'sw ac v 1005',
                'sw access v 1005',
                'sw a v 1005',
                'sw a vlan 1005',
                'sw ac vlan 1005'],
            model: {},
            output: '% Warning: port will be inactive in non-ethernet VLAN'
        }, {
            commands: ['switchport access vlan 40',
                'sw ac v 40',
                'sw access v 40',
                'sw a v 40',
                'sw a vlan 40',
                'sw ac vlan 40'],
            model: {},
            output: '% Access VLAN does not exist. Creating vlan 40'  // This output only display's when vlan 40 is not already exist.
        }, {
            commands: ['sw ac 1',
                'sw ac 1 1',
                'sw a v 4095',
                'sw a v 1-100',
                'sw a v 1-5000',
                'sw ac vl 4095',
                'sw a v 10 20',
                'sw a v 0',
                'sw a 01'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            commands: ['switchport access vlan 0', 'sw ac vlan 0'],
            model: {},
            output: 'Vlan has Range [1..4094]'
        }, {
            commands: ['switchport access vlan 4095', 'sw ac vlan 4095'],
            model: {},
            output: 'Vlan has Range [1..4094]'
        }, {
            // Test case for child command acceptance
            commands: ['switchport trunk', 'switchport trunk encapsulation'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        }, {
            // Test case for child command acceptance
            commands: ['switchport access vlan', 'sw a v'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        }, {
            // Failure case for invalid in trunk
            commands: ['sw 0x a v e 40',
                'sw t 0x v e 40',
                'sw t a 0x e 40',
                'sw t a v 0x 40'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            commands: 'sw 1 1',
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            // Failure case for abbreviation in trunk
            commands: [
                'sw 0x e d',
                'sw t y d',
                'sw t e z',
                'sw 1 1 1'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            // Test case for acceptance of value
            commands: ['switchport trunk allowed vlan except 40',
                'sw t a v e 40',
                'sw t al v ex 40'],
            model: { 'switchport': { 'trunk': 'allowed vlan except 40' } }
        }, {
            // Test case for no value
            commands: ['switchport trunk allowed vlan except', 'sw t a v e'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
        }, {
            // Test case for type checking
            commands: 'sw 1 1 1 1',
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            // Test case for no parameter
            commands: 'sw t a v e 0x',
            model: {},
            output: 'Command rejected: Bad VLAN list'
        }, {
            // Failure case for invalid in trunk
            commands: ['sw 0 a v e 40',
                'sw t a x e 40',
                'sw t a v x 40'],
            model: {},
            output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        }, {
            commands: [
                'switchport access vlan 50',
                'sw ac v 50',
                'sw ac vl 50',
                'sw access v 50',
                'sw ac vlan 50'
            ],
            model: { 'switchport': { 'accessVlan': '50' } }
        }, {
            commands: [
                'switchport trunk allowed vlan all',
                'sw t a v al',
                'sw t al vl al',
                'sw t allowed v all',
                'sw trunk a v all'
            ],
            model: { 'switchport': { 'trunkingVlans': 'ALL' } }
        }, {
            commands: [
                'switchport trunk allowed vlan add 50',
                'sw t a v ad 50',
                'sw trunk al v ad 50',
                'sw t allowed v ad 50',
            ],
            model: { 'switchport': { 'trunkingVlans': '50' } }
        }, {
            // Test case for acceptance of value
            commands: ['switchport trunk allowed vlan except 40',
                'sw t a v e 40',
                'sw t al v ex 40'],
            model: { 'switchport': { 'trunkingVlans': '1-39,41-4094' } }
        },
        {
            commands: [
                'switchport trunk allowed vlan add 10,20,30',
                'sw t a v a 10,20,30',
                'sw trunk al v ad 10,20,30',
                'sw t allowed v add 10,20,30'
            ],
            model: { 'switchport': { 'trunkingVlans': '10,20,30' } }
        },
        {
            commands: [
                'switchport trunk allowed vlan remove 30',
                'sw t a v r 1002',
                'sw trunk al v re 1002',
                'sw t allowed v r 1002'
            ],
            model: { 'switchport': { 'trunkingVlans': '10,20' } }
        }, {
            commands: [
                'switchport trunk allowed vlan add 1',
                'sw t a v ad 1',
                'sw trunk al v ad 1',
                'sw t allowed v ad 1',
                'sw t a v ad 1',
            ],
            model: { 'switchport': { 'trunkingVlans': '1' } }
        }, {
            commands: [
                'switchport trunk allowed vlan add 1002',
                'sw t a v ad 1002',
                'sw trunk al v ad 1002',
                'sw t allowed v ad 1002',
                'sw t a v ad 1002',
            ],
            model: { 'switchport': { 'trunkingVlans': '1002' } }
        }, {
            commands: [
                'switchport trunk allowed vlan add 4094',
                'sw t a v ad 4094',
                'sw trunk al v ad 4094',
                'sw t allowed v ad 4094',
                'sw t a v ad 4094'
            ],
            model: { 'switchport': { 'trunkingVlans': '4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan except 40',
                'sw t a v e 40',
                'sw trunk al v ex 40',
                'sw t allowed v e 40'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-39,41-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan except 20',
                'sw t a v e 20',
                'sw trunk al v ex 20',
                'sw t allowed v e 20'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-19,21-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan remove 20',
                'sw t a v r 20',
                'sw trunk al v re 20',
                'sw t allowed v r 20'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-19,21-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan except 1',
                'sw t a v e 1',
                'sw trunk al v ex 1',
                'sw t allowed v e 1'
            ],
            model: { 'switchport': { 'trunkingVlans': '2-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan remove 1',
                'sw t a v r 1',
                'sw trunk al v re 1',
                'sw t allowed v r 1'
            ],
            model: { 'switchport': { 'trunkingVlans': '2-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan remove 40',
                'sw t a v r 50',
                'sw trunk al v re 50',
                'sw t allowed v remove 50'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-39,41-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan except 1002',
                'sw t a v e 1002',
                'sw trunk al v ex 1002',
                'sw t allowed v e 1002'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-1001,1003-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan remove 1002',
                'sw t a v r 1002',
                'sw trunk al v re 1002',
                'sw t allowed v r 1002'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-1001,1003-4094' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 1-4000',
                'sw t a v 1-4000',
                'sw trunk al v 1-4000',
                'sw t allowed v 1-4000'
            ],
            model: { 'switchport': { 'trunkingVlans': '1-4000' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 3000',
                'sw t a v 3000',
                'sw trunk al v 3000',
                'sw t allowed v 3000'
            ],
            model: { 'switchport': { 'trunkingVlans': '3000' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 1002',
                'sw t a v 1002',
                'sw trunk al v 1002',
                'sw t allowed v 1002'
            ],
            model: { 'switchport': { 'trunkingVlans': '1002' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 20',
                'sw t a v 20',
                'sw trunk al v 20',
                'sw t allowed v 20'
            ],
            model: { 'switchport': { 'trunkingVlans': '20' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 60',
                'sw t a v 60',
                'sw trunk al v 60',
                'sw t allowed v 60'
            ],
            model: { 'switchport': { 'trunkingVlans': '60' } }
        }, {
            commands: [
                'switchport trunk allowed vlan 1005',
                'sw t a v 1005',
                'sw trunk al v 1005',
                'sw t allowed v 1005'
            ],
            model: { 'switchport': { 'trunkingVlans': '1005' } }
        }, {
            commands: [
                'switchport voice vlan 70',
                'sw v v 70',
                'sw vo v 70',
                'sw v vl 70'
            ],
            model: { 'switchport': { 'voiceVlan': '70' } }
        }, {
            commands: [
                'switchport trunk native vlan 1002',
                'sw t n v 1002',
                'sw trunk na v 1002',
                'sw t native v 1002'
            ],
            model: { 'switchport': { 'trunkVlan': '1002' } }
        }, {
            commands: [
                'switchport trunk native vlan 1',           // valid  Only if the vlan is already created
                'sw t n v 1',
                'sw trunk na v 1',
                'sw t native v 1'
            ],
            model: { 'switchport': { 'trunkVlan': '1' } }
        }, {
            commands: [
                'switchport trunk native vlan 20',
                'sw t n v 20',
                'sw trunk na v 20',
                'sw t native v 20'
            ],
            model: { 'switchport': { 'trunkVlan': '20' } }
        }, {
            commands: [
                'switchport trunk native vlan 60',      // valid  Only if the vlan is already created
                'sw t n v 60',
                'sw trunk na v 60',
                'sw t native v 60'
            ],
            model: { 'switchport': { 'trunkVlan': '60' } }
        },
        {
            commands: [
                'switchport trunk pruning vlan 60',      // valid  Only if the vlan is already created
                'sw t p v 60',
                'sw trunk pr v 60',
                'sw t pruning v 60'
            ],
            model: { 'switchport': { 'trunkVlan': '60' } }
        }, {
            commands: [
                'switchport trunk pruning vlan 40',      // valid  Only if the vlan is already created
                'sw t p v 40',
                'sw trunk pr v 40',
                'sw t pruning v 40'
            ],
            model: { 'switchport': { 'trunkVlan': '40' } }
        }, {
            commands: [
                'switchport trunk pruning vlan 2',      // valid  Only if the vlan is already created
                'sw t p v 2',
                'sw trunk pr v 2',
                'sw t pruning v 2'
            ],
            model: { 'switchport': { 'trunkVlan': '2' } }
        }, {
            commands: [
                'switchport trunk allowed vlan none',      // valid  Only if the vlan is already created
                'sw t a v n',
                'sw trunk al v no',
                'sw t allowed v n'
            ],
            model: { 'switchport': { 'trunkVlan': 'none' } }
        },

    ];

    const todoCases: CommandTestCase[] = [

        // Not a valid test - would test parsing of the command relative to sibling commands, not this command
        // {
        //     commands: 's',
        //     model: {},
        //     output: 'Ambiguous commamd'
        // },
        {
            commands: ['switchport', 'sw'],
            model: {}
        }
    ];

    xdescribe('[switchport] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, switchportCommand);
    });

    describe('switchport', () => {
        CommandTester.RunTestCases(testCases, switchportCommand);
    });

//}
