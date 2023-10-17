import { CommandTestCase, CommandTester } from '../command-tester';
import { noSwitchportCommand } from './no-switchport-command';
import { switchportDefaultDataModel } from './switchport-command';

export function main() {
    const testCases: CommandTestCase[] = [
        {
            commands: 'no sw acc vlan',
            model: { 'switchport': { 'accessVlan': switchportDefaultDataModel.defaultVlan } }

        },
        {
            commands: ['no sw trunk allowed vlan 40', 'no sw tru allow vlan remove 40'],
            model: { 'switchport': { 'trunkingVlans': switchportDefaultDataModel.defaulttrunkingVlans } }

        }
    ];

    // TODO : Move this tests to active
    xdescribe('no switchport', () => {
        CommandTester.RunTestCases(testCases, noSwitchportCommand);
    });
}
