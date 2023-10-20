import {ParseCommandResult} from './parsed-command';
import {Parameter, ICommandParameter} from './terminal-parameter';

export class ParsedParameters {
    parseResult: ParseCommandResult = ParseCommandResult.Unknown;
    properties: any = {};
    ambiguous?: ICommandParameter[] = []; // if a command token did not unambiguously match a command
    parameters: ParsedParameter[] = []; // used to tell the consumer which parameter was successfully parsed
}

export class ParsedParameter {
    parameter?: Parameter;
    // parameters?: Parameter[];
    token?: string;
}
