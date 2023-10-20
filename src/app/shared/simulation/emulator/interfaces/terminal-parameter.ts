import {ParseCommandResult} from './parsed-command';


export interface ICommandParameter {
}


// export interface IParameterValueType { (token: string): boolean
// }
export type IParameterValueType = (token: string) => boolean;
export class ParameterValueType {
    static string(token: string): boolean {
        return true;
    };

    static number(token: string): boolean {
        return !isNaN(Number(token));
    }

    static ipAddress(token: string): boolean {
        throw new Error('Not yet implemented!');
    }

    static vlanRange(token: string): boolean {
        throw new Error('Not yet implemented!');
    }

    static boundedNumber(min: number, max: number): IParameterValueType {
        return (function (token: string): boolean {
            if (ParameterValueType.number(token)) {
                const value = parseInt(token, 10);
                return min <= value && value <= max;
            }
            return false;   // default
        });
    }
}

export class ParameterList implements ICommandParameter {
    sequential? = false;
    required? = false;
    parameters: ICommandParameter[] = [];

    constructor() {
    }
}

export class Parameter implements ICommandParameter {
    // MUST have a propertyName or name
    propertyName?: string;       // what the parser will put in the property bag as the property name
    name?: string;              // name is what the parser uses, is also the default propertyName if propertyName is undefined
    type?: IParameterValueType; // assumes none if not explicitly declared
    description? = '';

    constructor() {
    }
}

// from Cisco documentation
// spanning-tree vlan vlan-id [ forward-time seconds | hello-time seconds | max-age seconds | priority
//  priority | protocol protocol | [ root { primary | secondary } [ diameter net-diameter [ hello-time seconds ] ] ] ]

