import { TerminalCommand } from "../../../interfaces/terminal-command";
import { CiscoCommandContext } from "../../cisco-terminal-command";
import { CommandState } from "../../../interfaces/command-state";
import { CiscoFormatters } from "../../common/cisco-formatters";
import { CiscoUtils } from "../../common/cisco-utils";
import { CommandConstants } from "../../common/cisco-constants";
import { ICiscoInterface } from "../../icisco-device";

export class ShutdownCommand {
    static noShutdown: TerminalCommand = {
        name: 'shutdown',
        description: '<cr>',
        handler: ShutdownCommand.NoShutdown
    };

    static shutdownCommand: TerminalCommand = {
        name: 'shutdown',
        description: 'Shutdown the selected interface',
        handler: ShutdownCommand.shutdown
    };

    static shutdown(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        if (cmdState.command.parameters[0]) {
            cmdState.output = CommandConstants.ERROR_MESSAGES.INVALID_INPUT;
            return;
        }

        //Invoke an action to verify status across connections
        let interfaces = cmdContext.interfaces as unknown as ICiscoInterface[];
        if (cmdContext.actions != undefined)
            cmdState.addAction(cmdContext.actions.shutdown({ interfaces: interfaces }));
        cmdState.stopProcessing = true;
    }

    static NoShutdown(cmdContext: CiscoCommandContext, cmdState: CommandState) {
        let interfaces = cmdContext.interfaces as unknown as ICiscoInterface[];
        if (cmdContext.actions != undefined)
            cmdState.addAction(cmdContext.actions.noShutdown({ interfaces: interfaces }));
        cmdState.stopProcessing = true;

    }
}