import { TerminalCommand } from '../../interfaces/terminal-command';
import { CommandState } from '../../interfaces/command-state';
import { CiscoTerminalContext, CiscoCommandContext } from '../cisco-terminal-command';
import { showCommand } from './show-commands/show-command';
import { NoCommands } from './no-commands';
import { unsupportedEnableCommands } from './enabled-commands-unsupported';
import { NotSupportedCommand } from './notsupported';
import { CommandConstants } from '../common/cisco-constants';

export class EnabledCommands {

    static ConfigureTerminal(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.ChangeContextProperty('confTerminal', true);

        cmdState.output = 'Enter configuration commands, one per line.  End with CNTL/Z.';
        cmdState.stopProcessing = true;  // TODO: we need a better way than 'stop processing';
        return cmdState;
    }

    static Disable(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.ChangeContextProperty('enabled', false);
    }

    static Exit(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters[0]) {
            cmdState.stopProcessing = true;
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return;
        }
        cmdState.ChangeContextProperty('enabled', false);
    }

    static Logout(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        cmdState.ChangeContextProperty('enabled', false);
    }

    static Vtp(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: No
        // convert each output state change to default/no value
        // throw new Error('Not Implemented');
        cmdState.output = '% Incomplete Command';
        return cmdState;
    }
    static End(cmdContext: CiscoCommandContext, cmdState: CommandState) {
            cmdState.stopProcessing = true;
            cmdState.output = `Translating 'end'  \n% Unknown command or computer name, or unable to find computer address`;
            return;
    }
}

const configureCommand: TerminalCommand = {
    name: 'configure',
    description: 'Enter configuration mode',
    children: [
        { name: 'confirm', description: 'Confirm replacement of running-config with a new config file' },
        { name: 'memory', description: 'Configure from NV memory' },
        { name: 'network', description: 'Configure from a TFTP network host' },
        { name: 'overwrite-network', description: 'Overwrite NV memory from TFTP network host' },
        { name: 'replace', description: 'Replace the running-config with a new config file' },
        { name: 'revert', description: 'Parameters for reverting the configuration' },
        { name: 'terminal', description: 'Configure from the terminal', handler: EnabledCommands.ConfigureTerminal }
    ]
};

const disableCommand: TerminalCommand = {
    name: 'disable',
    description: 'Turn off privileged commands',
    handler: EnabledCommands.Disable
};

export let exitCommand: TerminalCommand = {
    name: 'exit',
    description: 'Exit from the Exec',
    handler: EnabledCommands.Exit
};

const logoutCommand: TerminalCommand = {
    name: 'logout',
    description: 'Exit from the Exec',
    handler: EnabledCommands.Logout
};

const vtpCommand: TerminalCommand = {
    name: 'vtp',
    description: 'Ignores VLAN updates from other switches',
    parameters: [
        // '(mode or ...)': {},
        // '(transparent or ...)': {}
    ],
    handler: EnabledCommands.Vtp
};
const endCommand: TerminalCommand = {
    name: 'end',
    description: 'Exit from configure mode',
    handler: EnabledCommands.End
};

export let enabledCommands: TerminalCommand[] = [

    ...unsupportedEnableCommands,
    configureCommand,
    disableCommand,
    exitCommand,
    vtpCommand,
    logoutCommand,
    showCommand,
    endCommand,

    { name: 'logout', description: 'Exit from the EXEC', handler: EnabledCommands.Exit },
];
