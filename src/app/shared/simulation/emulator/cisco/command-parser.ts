import { TerminalCommand } from '../interfaces/terminal-command';
import { ParsedCommand, ParsedCommands, ParseCommandResult } from '../interfaces/parsed-command';
import { CiscoTerminalContext, CiscoCommandContext } from './cisco-terminal-command';
import { CiscoParameterParser } from './parameter-parser';
import { ParsedParameters } from '../interfaces/parsed-parameters';

export class CiscoCommandParser {

    static Parse(cmdLine: string, allCommands: TerminalCommand[]): ParsedCommands {
        let result = new ParsedCommands();
        if (cmdLine === undefined || cmdLine.trim() === '') {
            result.parseResult = ParseCommandResult.Success
            return result;
        }
        cmdLine = cmdLine.trim().replace(/\s\s+/g, ' ');
        let tokens = cmdLine.split(' ');

        let thisCommand = tokens[0].toLowerCase();
        let matching = allCommands.filter((value) => value.name.startsWith(thisCommand));

        if (matching.length === 1) {
            CiscoCommandParser.ParseInternal(tokens.slice(1), matching[0], result);
            result.commands[0].token = tokens[0]; //I'm cheating here to get the token on the command, but we're cheating anyway by parsing child commands and top level commands differently anyway
        } else if (matching.length > 1) {
            // potentially ambiguous command
            result.ambiguous = matching;
            let exactMatch: TerminalCommand[] = matching.filter((value) => {
                let result = value.name === tokens[0];
                if (!result && value.aliases) {
                    result = value.aliases.find((alias) => alias.toLowerCase() ===  tokens[0].toLowerCase()) !== undefined;
                }
                return result;
            });
            if (exactMatch.length === 1) {
                CiscoCommandParser.ParseInternal(tokens.slice(1), exactMatch[0], result);
                result.commands[0].token = tokens[0];
            }
            else
                result.parseResult = ParseCommandResult.Ambiguous;
        } else {
            // invalid command
            result.parseResult = ParseCommandResult.NoCommand;
        }

        return result;
    }

    static ParseInternal(tokens: string[], command: TerminalCommand, output: ParsedCommands) {
        let parsed = new ParsedCommand;
        parsed.command = command;
        output.commands.push(parsed);

        let parameterIndex = 0;
        let rangeCommandIndex = 0;

        for (let index = 0; index < tokens.length; index++) {
            let token = tokens[index];

            // a child command takes precedence over a parameter
            //let defaultAcceptor = ((value:TerminalCommand) => value.name.toLowerCase().startsWith(token.toLowerCase()));

            let commands: TerminalCommand[] =
                (command.children) ? command.children.filter(function (value: TerminalCommand) {
                    if (value.validator) return value.validator(token);
                    return value.name.toLowerCase().startsWith(token.toLowerCase());
                }) : [];


            if (commands.length === 0 && rangeCommandIndex > 0) {
                rangeCommandIndex = 0;
                command = command.children[0];
                commands = (command.children) ? command.children.filter(function (value: TerminalCommand) {
                    if (value.validator) return value.validator(token);
                    return value.name.toLowerCase().startsWith(token.toLowerCase());
                }) : [];
            }

            // if multiple commands match the token
            if (commands && commands.length > 1) {
                //TODO: Remove this comment once it is understood or if the code is clear enough
                //  Consider for example: ip, ipv4, ipv6
                //  If there is one command in commands whose name matches exactly with the token then:
                //    We should allow the parser to choose that command.
                //    If the token is last on the list, we should include the potentially ambiguous
                //      commands in the ambiguous array in case we're parsing for Query instead of Invoke
                //    If the token is not last on the list, we should *not* include the potentially ambiguous
                //      commands and assume that the user meant to choose the matching command unambiguously
                //      and continue parsing.
                let exactMatch: TerminalCommand[] = commands.filter((value) => {
                    let result = value.name === token;
                    if (!result && value.aliases) {
                        result = value.aliases.find((alias) => alias.toLowerCase() === token.toLowerCase()) !== undefined;
                    }
                    return result;
                });
                if (exactMatch.length === 1) {
                    if (index === tokens.length - 1) { //this is the last token,
                        output.ambiguous = commands;  //make sure the potential ambiguous commands are listed in case the user is asking for help
                        //but continue handling the command
                        commands = [exactMatch[0]];
                    } else {
                        //this token is not last on the list, so we should assume that the user unambiguously meant to choose this command
                        //  and continue parsing
                        commands = [exactMatch[0]];
                    }
                } else {
                    output.ambiguous = commands;
                    output.parseResult = ParseCommandResult.Ambiguous;
                    return;
                }
            }

            // a single command matched; this command will handle all remaining tokens
            if (commands && commands.length === 1) {
                let isRangeCommand = (commands[0].name === 'integerRange');
                if (isRangeCommand) {
                    rangeCommandIndex++;
                } else {
                    command = commands[0];
                }
                parsed = new ParsedCommand;
                parsed.token = token;
                parsed.command = isRangeCommand ? commands[0] : command;
                output.commands.push(parsed);
                parameterIndex = 0;
                continue;
            }


            // since the token is not a command, assume it is a parameter
            let parameterTokens = tokens.slice(index, tokens.length - index); //this token and all the rest after it.
            let parsedParameters: ParsedParameters = CiscoParameterParser.Parse(tokens, command.parameters);
            //what do do with the results?
            parsed.properties = parsedParameters.properties;

            if (parsed.command.notTerminalFlag) {
                output.parseResult = ParseCommandResult.Invalid;
                return;
            }
            //old way of handling parameters
            parsed.parameters[parameterIndex] = token;
            parameterIndex++;
        }
        // all tokens have been processed: success
        output.parseResult = ParseCommandResult.Success;
    }
}
