import { CiscoFormatters } from "./cisco-formatters";
import { CommandConstants } from "./cisco-constants";
import { CiscoUtils } from "./cisco-utils";

export class CiscoValidators {

    // check if a value is with the defined range (all values are inclusive)
    static validateRange(value: string, min: number, max: number): boolean {
        let values = CiscoFormatters.formatRange(value);
        return (values[0] >= min && values[values.length - 1] <= max);
    }

    // check if a numeric value is in the array of allowed values
    static validateNumberInArray(value: number, rangeValues: Array<any>): boolean {
        return rangeValues['includes'](value);
        // return rangeValues.includes(value);  // TODO: ROB - Find out how to include typescript node_module d.ts ref
    }

    // check if a string value is in the array of allowed values
    static validateStringInArray(value: string, rangeValues: Array<string>): boolean {
        let found = false;

        for (let i = 0; i < rangeValues.length; ++i) {
            if (value.toLowerCase() === rangeValues[i].toLowerCase()) {
                found = true;
                break;
            }
        }
        return found;
    }

    static validateVlan(value: number) {

        let valid = true;
        let error = '';
        let vlanNumber: number = undefined;

        // These are all the messages returned depending on the mode, etc.
        let messages = {
            deleted: '% Default VLAN (' + value + ') may not be deleted.\n',
            outofrange: 'Command rejected: Bad VLAN list\number (' + value + ') out of range}',
            warning: '% Warning: port will be inactive in non-ethernet VLAN',
            invalid: CommandConstants.ERROR_MESSAGES.INVALID_INPUT
        };

        if (value) {
            vlanNumber = Number(value);
            if (!isNaN(vlanNumber)) {
                if (vlanNumber === 1002 || vlanNumber === 1003 || vlanNumber === 1004 || vlanNumber === 1005) {
                    valid = false;
                    error = messages.warning;
                } else if (vlanNumber < 0 || vlanNumber > 4094) {
                    valid = false;
                    error = messages.invalid;
                }
            } else {
                valid = false;
                error = messages.invalid;
            }
        } else {
            valid = false;
            error = messages.invalid;
        }

        return {
            valid: valid,
            error: error,
            messages
        };
    }

    // check if source string equals a target string up to a certain number of characters
    static validateIn(source: string, target: string, minimum?: number) {
        let isValid = true;
        let ambiguous = false;
        let length = 0;
        for (let index = 0; index < source.length; index++) {
            if (source.substr(index, 1).toLowerCase() !== target.substr(index, 1).toLowerCase()) {
                isValid = false;
                break;
            }
            else {
                length++;
            }
        }
        if (minimum !== undefined && length < minimum) {
            isValid = false;
            ambiguous = true;
        }

        return {
            isValid: isValid,
            ambiguous: ambiguous
        };
    }
    static isNumber(token: string): boolean {
        return !isNaN(Number(token));
    }

}
