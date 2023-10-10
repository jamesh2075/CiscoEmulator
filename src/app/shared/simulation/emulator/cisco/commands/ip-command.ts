import {TerminalCommand} from '../../interfaces/terminal-command';
import {CommandState} from '../../interfaces/command-state';
import {CiscoTerminalContext, CiscoCommandContext} from '../cisco-terminal-command';

class IpCommand {
    static Ip(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: ip
        throw new Error('Not Implemented');
        //return cmdState;
    }

    static IpAddress(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        // TODO: ip address
        throw new Error('Not Implemented');
        //return cmdState;
    }
}

export let ipCommand: TerminalCommand = {
    name: 'ip',
    description: 'Interface Internet Protocol config commands',
    children: [{name: 'address', description: null, handler: IpCommand.IpAddress}],
    handler: IpCommand.Ip
};

