import { Observable } from 'rxjs/Observable';
import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { StateContainer } from '../../emulator-state';
import { CiscoCommandParser } from '../command-parser';
import { CiscoCommandContext } from '../cisco-terminal-command';
import { channelGroupCommand } from './channel-group-command';
import { NotSupportedCommand } from './notsupported';
import { CommandConstants } from '../common/cisco-constants';
import { CommandTester, CommandTestCase, CommandTestCaseResult } from './command-tester';
import { noChannelGroupModeCommand, ChannelGroupCommand } from './channel-group-command';

export function main() {

    const testCases: CommandTestCase[] = [{
        // minimum value correct
        commands: 'channel-group   1    mode active',
        model: { 'channelGroup': { id: 1, mode: ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_ACTIVE,
                                    protocol: ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_LACP } }
    }, {
        commands: 'channel-group 2 mode desirable',
        model: { 'channelGroup': { id: 2, mode: ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_DESIRABLE,
                                    protocol: ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_PAgP } }
    }, {
        commands: 'channel-group 2 mode auto',
        model: { 'channelGroup': { id: 2, mode: ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_AUTO,
                                    protocol: ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_PAgP } }
    }, {
        // maximum value correct
        commands: 'channel-group 255 mode active',
        model: { 'channelGroup': { id: 255, mode: ChannelGroupCommand.STRINGS.CHANNEL_GROUP_MODE_ACTIVE,
                                    protocol: ChannelGroupCommand.STRINGS.CHANNEL_PROTOCOL_LACP } }
    },
    {
        commands: ['channel-group 256 mode active', // more than maximum value
            'channel-group 0 mode active',  // less than minimum value
            'channel-group 0 mode ative',  // typo
            'channel-group 2 mode desireable'
        ],
        output: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
    }];

    // Written to handle no channel-group test cases
    // TODO: Write test which are passing
    const notestCases: CommandTestCase[] = [{
        // minimum value correct
        commands: 'no channel-group',
        model: {},
        output: '% Incomplete command'
    }, {
        commands: 'no channel-group mode active',
        model: {},
        output: '% Incomplete command'
    }, {
        commands: 'no channel-group 1 mode',
        model: {},
        output: '% Incomplete command'
    }];



    const excludedCases = [{
        // incomplete command
        commands: 'channel-group 0 mode',
        output: CommandConstants.ERROR_MESSAGES.INCOMPLETE_COMMAND
    }];

    xdescribe('[channel-group] (under development, known to fail)', () => {
        CommandTester.RunTestCases(excludedCases, channelGroupCommand);
    });

    describe('channel-group', () => {
        CommandTester.RunTestCases(testCases, channelGroupCommand);
    });


    // Invoke no channel-group test cases
    xdescribe('[no channel-group] (under development)', () => {
        CommandTester.RunTestCases(notestCases, noChannelGroupModeCommand);
    });
}
