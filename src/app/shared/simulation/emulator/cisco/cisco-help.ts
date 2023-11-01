import { CommandResult, CommandResultCode } from '../interfaces/iemulated-terminal';
import { TerminalCommand } from '../interfaces/terminal-command';
import { CiscoCommandParser } from './command-parser';
import { ParseCommandResult } from '../interfaces/parsed-command';
import { CommandConstants } from './common/cisco-constants';
import { CiscoFormatters } from './common/cisco-formatters';

export class CiscoHelp {

    // removes commands that don't belong in help
    private static Filter(a: TerminalCommand): boolean {
        if (a.noHelp) {
            return false;
        }
        return true;
    }

    // sorts commands in the very specific Cisco Help way
    private static SortCommands(a: TerminalCommand, b: TerminalCommand): number {
        const result = 0; // default
        if (a.name.startsWith('<cr>')) {
            return 1;
        }
        if (b.name.startsWith('<cr>')) {
            return -1;
        }
        for (let index = 0; index < a.name.length; ++index) {
            if (b.name.length <= index) {
                return 1;
            }
            if (a.name.charCodeAt(index) !== b.name.charCodeAt(index)) {
                return a.name.charCodeAt(index) < b.name.charCodeAt(index) ? -1 : 1;
            }
        }
        if (a.name.length !== b.name.length) {
            return a.name.length < b.name.length ? -1 : 1;
        }
        return result;
    }
    static AutoComplete(commandLine: string, contextCommands: TerminalCommand[]): CommandResult {
        // return {
        //   resultCode: CommandResultCode.Success,
        //   output: 'Autocomplete\n' + commandLine
        // };
        const commands = contextCommands;
        const parsed = CiscoCommandParser.Parse(commandLine, commands);
        console.log('CiscoCommandParser.Parse = ' + JSON.stringify(parsed));

        switch (parsed.parseResult) {
            case ParseCommandResult.Success: {
                // tell the UI what it should put on the  command line
                let newcmdline = '';
                for (let index = 0; index < parsed.commands.length - 1; index++) {
                    newcmdline += parsed.commands[index].token + ' ';
                }
                // check to see if the token I'm parsing is a name or if it is an accepted string
                const last = parsed.commands[parsed.commands.length - 1];
                if (last.command.name.toLowerCase().startsWith(last.token.toLowerCase())) {
                    const temp = last.token + last.command.name.substring(last.token.length);
                    newcmdline += temp + ' ';
                } else {
                    newcmdline += last.token;
                }

                // check to see if there are parameters. If there are, just dump them on the command line
                let index = 0;
                while (last.parameters[index]) {
                    const space = newcmdline[newcmdline.length - 1] === ' ' ? '' : ' ';
                    newcmdline += space + last.parameters[index];
                    ++index;
                }

                return {
                    resultCode: CommandResultCode.Success,
                    output: '',
                    newCommandLine: newcmdline
                };
            }
            case ParseCommandResult.Ambiguous: {
                // almost the same as Success, but here I want to add ALL the parsed commands
                let newcmdline = '';
                for (let index = 0; index < parsed.commands.length; index++) {
                    newcmdline += parsed.commands[index].token + ' ';
                }
                // go through the ambiguous commands and make the command line
                //  and match as much as it unambiguously can
                const ambiguous = parsed.ambiguous.filter(CiscoHelp.Filter);
                let completed = ambiguous[0].name.toLowerCase();
                for (let aindex = 1; aindex < ambiguous.length; ++aindex) {
                    const command = ambiguous[aindex].name.toLowerCase();
                    let index = 0;
                    for (index = 0; index < completed.length
                        && index < command.length; ++index) {
                        if (command.charAt(index) !== completed.charAt(index)) {
                            completed = completed.substr(0, index);
                        }
                    }
                    completed = completed.substr(0, index); // if the command was shorter than what I had
                }
                newcmdline += completed;
                return {
                    resultCode: CommandResultCode.Success,
                    output: '',
                    newCommandLine: newcmdline
                };
            }
            case ParseCommandResult.Unknown:
            case ParseCommandResult.NoCommand:
            default: {
                return {
                    // this is counter-intuitive. We didn't find a single one, but we successfully determined what it wasn't.
                    resultCode: CommandResultCode.Success,
                    output: '',
                    newCommandLine: commandLine
                };
            }
        }

    }
    static QueryWithoutSpace(commandLine: string, contextCommands: TerminalCommand[]): CommandResult {
        // rules:
        // always 4 columns
        // column width is always 2 spaces longer than the largest name in that column
        // command line is what you typed before the ?
        // if no command matches, '% Unrecognized command'

        const allcommands = contextCommands;
        const parsed = CiscoCommandParser.Parse(commandLine, allcommands);
        console.log('CiscoCommandParser.Parse = ' + JSON.stringify(parsed));

        switch (parsed.parseResult) {
            case ParseCommandResult.Success:  //  Success and ambiguous are one and the same for this
            case ParseCommandResult.Ambiguous: {
                if (parsed.commands && 0 < parsed.commands.length
                    && parsed.commands[parsed.commands.length - 1].parameters
                    && 0 < parsed.commands[parsed.commands.length - 1].parameters.length) {
                    // the user entered in more stuff than she should have
                    return {
                        resultCode: CommandResultCode.Success,
                        output: CommandConstants.ERROR_MESSAGES.UNRECOGNIZED_COMMANDS,
                        newCommandLine: commandLine
                    };
                }
                let commands: TerminalCommand[] = parsed.ambiguous && 0 < parsed.ambiguous.length
                    ? parsed.ambiguous : [parsed.commands[parsed.commands.length - 1].command];
                commands = commands.filter(CiscoHelp.Filter).sort(CiscoHelp.SortCommands);
                const MAXCOLUMNS = 4;
                const columnCount = Math.min(MAXCOLUMNS, commands.length);
                const rowCount = Math.ceil(commands.length / MAXCOLUMNS); // I don't know if I need this

                // get the column widths
                // I'm cheating here by initializing it to 4 columns. 'Magic numbers' and all that...
                let columnWidths: number[] = [0, 0, 0, 0]; 
                for (let row = 0; row < rowCount; ++row) {
                    for (let column = 0; column + row * MAXCOLUMNS < commands.length && column < MAXCOLUMNS; ++column) {
                        const offset = row * MAXCOLUMNS;
                        columnWidths[column] = Math.max(commands[offset + column].name.length, columnWidths[column]);
                    }
                }
                let output = '';
                for (let row = 0; row < rowCount; ++row) {
                    for (let column = 0; column + row * MAXCOLUMNS < commands.length && column < MAXCOLUMNS; ++column) {
                        const offset = row * MAXCOLUMNS;
                        output += `${CiscoFormatters.padRightLength(commands[offset + column].name, ' ', columnWidths[column] + 2)}`;
                    }
                    output += '\n';
                }
                output = output.trim(); // this is cheating just at little bit, but I'm cheating all over the place
                return {
                    resultCode: CommandResultCode.Success,
                    output: output,
                    newCommandLine: commandLine // without the ?
                };
            }
            case ParseCommandResult.Unknown:
            case ParseCommandResult.NoCommand:
            default: {
                return {
                    resultCode: CommandResultCode.Success,  // this is counter-intuitive. The parser didn't find anything, but we successfully handled the request
                    output: CommandConstants.ERROR_MESSAGES.UNRECOGNIZED_COMMANDS,
                    newCommandLine: commandLine
                };
            }
        }
    }
    static QueryWithSpace(commandLine: string, contextCommands: TerminalCommand[]): CommandResult {
        // rules: any single line is never longer than 80 characters
        // the first column width = max-command width + 2
        // first column lef margin: 2 spaces

        const allcommands = contextCommands;
        const parsed = CiscoCommandParser.Parse(commandLine, allcommands);

        let commands: TerminalCommand[] = allcommands; // default
        let output = '';
        const MAXWIDTH = 80;

        if (commandLine.trim() !== '') {  // cheat if nothing on the command line
            switch (parsed.parseResult) {
                case ParseCommandResult.Success:
                    commands = parsed.commands[parsed.commands.length - 1].command.children;
                    // fall through to after switch
                    break;
                case ParseCommandResult.Ambiguous:
                    output = `% Ambiguous command '${commandLine}'`;
                    return {
                        resultCode: CommandResultCode.Success, // this is counter-intuitive. The parser didn't find anything, but we successfully handled the request
                        output: output,
                        newCommandLine: commandLine + ' '
                    };
                case ParseCommandResult.Unknown:
                case ParseCommandResult.NoCommand:
                default: {
                    return {
                        resultCode: CommandResultCode.Success,  // this is counter-intuitive. The parser didn't find anything, but we successfully handled the request
                        output: CommandConstants.ERROR_MESSAGES.UNRECOGNIZED_COMMANDS,
                        newCommandLine: commandLine + ' '
                    };
                }
            }
        }

        // go through all the childrens and find out their max length
        let maxLength = 0;
        if (commands) {
            commands = commands.filter(CiscoHelp.Filter).sort(CiscoHelp.SortCommands); // default comparison should sort uppercase first, then lowercase
            for (let index = 0; index < commands.length; ++index) {
                maxLength = Math.max(maxLength, commands[index].name.length);
            }
            maxLength += 4; // 2 for the left margin, 2 for the column separator
            for (let index = 0; index < commands.length; ++index) {
                if (0 < index) {
                    output += '\n';
                }
                output += CiscoFormatters.twoColumns(`  ${commands[index].name}`,
                    maxLength, commands[index].description, MAXWIDTH);
            }
        } else {
            output = '  <cr>';
        }
        console.log("HELLO " + output);
        return {
            resultCode: CommandResultCode.Success,
            output: output,
            newCommandLine: commandLine + ' '
        };
        // CiscoFormatters
    }
}
