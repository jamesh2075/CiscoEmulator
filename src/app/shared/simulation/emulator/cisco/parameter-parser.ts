import {Parameter, ParameterList, ICommandParameter} from '../interfaces/terminal-parameter';
import {ParseCommandResult} from '../interfaces/parsed-command';
import {ParsedParameters, ParsedParameter} from '../interfaces/parsed-parameters';

class ParametersParseException extends Error {
}
// Parameter Parser
interface PropertyBag {
    noImplementation: any;
}

export class CiscoParameterParser {

    private result: ParsedParameters = new ParsedParameters;
    private propertyBag: any = {};

    //My output has to be
    //  ambiguous command with an array of options
    //  invalid input detected
    //  a structured object representing the data on the command line
    static Parse(tokens: string[], params: ICommandParameter): ParsedParameters {
        if (params !== undefined) {
            const parser = new CiscoParameterParser(tokens);
            params = CiscoParameterParser.ConvertToClass(params);
            return parser.doParse(params);
        } else {
            const result = new ParsedParameters;
            result.parseResult = ParseCommandResult.Unknown;
            return result;
        }
    }

    private static ConvertToClass(params: any): ICommandParameter {
        if (params.parameters) { // it's a list
            const result: ParameterList = new ParameterList;
            result.required = params.required ? params.required : false;
            result.sequential = params.sequential ? params.sequential : false;
            result.parameters = [];
            for (let i = 0; i < params.parameters.length; ++i) {
                result.parameters.push(CiscoParameterParser.ConvertToClass(params.parameters[i]));
            }
            return result;
        } else {
            const result: Parameter = new Parameter;
            result.name = params.name;
            result.propertyName = params.propertyName;
            result.type = params.type;
            result.description = params.description;
            return result;
        }
    }

    // What I learned in school, is you first create a grammar where each production has max of 2 non-terminal symbols
    // Then all you have to do is write a function for each production
    // might be overkill, but it'll get me to where I'm going

    // Grammar: Note that I'm using one line per production since the | symbol is a terminal

    // List     => RList
    // List     => OList
    // RList    => IParam+
    // OList    => IParam+
    // IParam   => Param
    // IParam   => List
    // Param    => Name
    // Param    => Name Value
    // Param    => Value
    // Name     => literal
    // Value    => literal

    constructor(private tokens: string[]) {
    }

    doParse(params: ICommandParameter): ParsedParameters {
        try {
            this.IParam(params);
            this.Finish();
            this.result.parseResult = ParseCommandResult.Success;
            this.result.properties = this.propertyBag;
            return this.result;
        } catch (ParametersParseException) {
            return this.result;
        }
    }

    List(params: ParameterList) {
        // decide which production to call:
        if (params.required) {
            this.RList(params);
        } else {
            this.OList(params);
        }
    }

    RList(params: ParameterList) {
        if (params.sequential) {
            for (let index = 0; index < params.parameters.length; ++index) {
                this.IParam(params.parameters[index]);  // parse each parameter in the list
            }
        } else {
            if (this.tokens.length === 0) {
                this.result.parseResult = ParseCommandResult.Invalid;
                throw new ParametersParseException('Missing required token');
            }
            const plist: ICommandParameter[] = (params.parameters) ?
                params.parameters.filter((value) => this.ValidToken(this.tokens[0], value)) : [];
            if (plist && 1 < plist.length) {
                this.result.parseResult = ParseCommandResult.Ambiguous;
                this.result.ambiguous = plist;
                throw new ParametersParseException('Ambiguous input');
            } else if (plist && plist.length === 1) {
                this.IParam(plist[0]);
            } else if (plist && plist.length === 0) {
                // this was a required parameter, and the token did not match
                this.result.parseResult = ParseCommandResult.Invalid;
                throw new ParametersParseException(`Invalid token '${this.tokens[0]}' did not match required parameter`);
            }
        }
    }

    OList(params: ParameterList) {
        if (this.tokens.length === 0) {
            // since this is optional, it's okay if there are no more tokens
            return;
         }
        if (params.sequential) {
            // check to see if the first parameter is valid
            if (this.ValidToken(this.tokens[0], params.parameters[0])) {
                for (let index = 0; index < params.parameters.length; ++index) {
                    this.IParam(params.parameters[index]);  // parse each parameter in the list
                }
            }
            // else: this list is optional AND sequential, and the first token didn't match, so we ignore and return
        } else {
            const plist: ICommandParameter[] = (params.parameters) ?
                params.parameters.filter((value) => this.ValidToken(this.tokens[0], value)) : [];
            if (plist && 1 < plist.length) {
                this.result.parseResult = ParseCommandResult.Ambiguous;
                this.result.ambiguous = plist;
                throw new ParametersParseException('Ambiguous input');
            } else if (plist && plist.length === 1) {
                this.IParam(plist[0]);
            }
            // else if the plist.length === 0, that's okay since this list is optional, so we ignore and return
        }
    }

    IParam(iparam: ICommandParameter) {
        if (iparam instanceof Parameter) {
            this.Param(<Parameter>iparam);   // should throw an invalid input error if it's not valid
        } else if (iparam instanceof ParameterList) {
            this.List(<ParameterList>iparam);    // should throw an invalid input error if it's not valid
        }
    }

    Param(param: Parameter): ParsedParameter {
        // decide which production to call
        if (this.tokens.length === 0) {
            this.result.parseResult = ParseCommandResult.Invalid;
            throw new ParametersParseException('Param expected a token');
        }
        const parsed: ParsedParameter = new ParsedParameter;
        let prop: string;
        parsed.token = '';  // empty string
        if (param.name) { // first token is a name
            prop = param.name;
            if (!prop.toLowerCase().startsWith(this.tokens[0].toLowerCase())) {
                this.result.parseResult = ParseCommandResult.Invalid;
                throw new ParametersParseException(`Name does not match, expected '${prop}' to start with '${this.tokens[0]}'`);
            }
            // we have succesfully parsed tokens[0]
            parsed.token += this.tokens[0];
            this.tokens.shift();
        } else if (param.propertyName) {
            prop = param.propertyName;
        }
        else {
            throw new ParametersParseException(`Invalid Parameter, requires name or propertyName: ${JSON.stringify(param)}`);
        }
        let value: any = true;   // default
        if (param.type) {
            if (this.tokens.length === 0) {
                this.result.parseResult = ParseCommandResult.Invalid;
                throw new ParametersParseException('Param expected a token');
            }
            if (param.type(this.tokens[0])) {
                value = this.tokens.shift();
                if (0 < parsed.token.length) {
                    parsed.token += ' ';
                }
                parsed.token += value;
            }
        }
        this.propertyBag[prop] = value;

        parsed.parameter = param;
        this.result.parameters.push(parsed);
        return parsed;
    }

    Finish() {
        const result: ParsedParameters = new ParsedParameters;
        if (this.tokens.length !== 0) {
            this.result = new ParsedParameters;
            this.result.parseResult = ParseCommandResult.Invalid;
            throw new ParametersParseException('Too many tokens');
        }
        // else success, fall through
    }


    private ValidToken(token: string, iparam: ICommandParameter): boolean {
        if (iparam instanceof Parameter) {
            const param: Parameter = <Parameter>iparam;
            if (param.name) {
                return param.name.toLowerCase().startsWith(token.toLowerCase());
            }
            if (param.type) {
                return param.type(token);
            }
        } else if (iparam instanceof ParameterList) {
            const plist: ParameterList = <ParameterList>iparam;
            if (plist.sequential) {
                return this.ValidToken(token, plist.parameters[0]);
            } else {
                for (let index = 0; index < plist.parameters.length; ++index) {
                    if (this.ValidToken(token, plist.parameters[index])) {
                        return true;
                    }
                }
            }
        }
        return false;   // default
    }

}
