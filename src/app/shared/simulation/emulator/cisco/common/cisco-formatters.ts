import { CommandConstants } from "./cisco-constants";
import { MultiRange } from "multi-integer-range";

export interface IFormatRangeError {
    error: string;
    pos?: number;
    startId?: string;
    endId?: string;
}

export class CiscoFormatters {
    /**
     * Range can be the following combinations
     * "xxxx"
     * "[xxxx,xxxx], xxxx"
     * "xxxx-xxxx"
     * "xxxx,[xxxx-xxxx]" or any combination
     * @param range
     * @returns {Array}
     */
    static formatRange(value: string): number[] {
        value = value.split('[').join('').split(']').join('');
        try {
            let multiRange = new MultiRange(value);
            let values: number[] = multiRange.toArray();
            values.sort(function (a, b) {
                return a - b;
            });
            return values;
        } catch (e) {
            return [];
        }
    }


    /**
     * Add a value in a range of values
     * @usage addValuestoRange('[1-39,41-59,61-4094]', '40') => "[1-59,61-4094]"
     * @param str
     * @param padding
     * @returns {string}
     */
    static addValuestoRange(value: string, addvalue: any): string {

        addvalue = addvalue.split('[').join('').split(']').join('');
        try {
            if (value && addvalue) {
                var values = new MultiRange(value);
                return values.append(addvalue).toString();
            }
            else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    /**
    * Add a value in a range of values
    * @usage removeValuestoRange('[1-59,61-4094]', '40') => "[1-39,41-59,61-4094]"
    * @param str
    * @param padding
    * @returns {string}
    */
    static removeValuestoRange(value: string, removevalue: any): string {

        removevalue = removevalue.split('[').join('').split(']').join('');
        try {
            if (value && removevalue) {
                var values = new MultiRange(value);
                return values.subtract(removevalue).toString();
            }
            else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }


    /**
     * Pad a string with a padding
     * @usage padLeft('123', "00000") => "00123"
     * @param str
     * @param padding
     * @returns {string}
     */
    static padLeft(str: string, padding: string): string {
        return padding.substring(0, padding.length - str.length) + str;
    }

    /**
     * Pad a string with a padding
     * @usage padRight('123', "00000") => "12300"
     * @param str
     * @param padding
     * @returns {string}
     */
    static padRight(str: string, padding: string): string {
        return str + padding.substring(0, padding.length - str.length);
    }

    /**
     * Pad a string with a padding
     * @usage padRightLength('123', "0", 5) => "12300"
     * @param str
     * @param padding
     * @returns {string}
     */
    static padRightLength(str: string, padding: string, length: number): string {
        let result = str;
        while (result.length < length) {
            result += padding;
        }
        return result;
    }

    /**
     * Pad a string with a padding
     * @usage padLeftLength('123', "0", 5) => "00123"
     * @param str
     * @param padding
     * @returns {string}
     */
    static padLeftLength(str: string, padding: string, length: number): string {
        let result = str;
        while (result.length < length) {
            result = padding + result;
        }
        return result;
    }

    /**
     * format two strings into one column, with a max width
     * @usage twoColumns('beep', 30, 'Configure BEEP (Blocks Extensible Exchange Protocol)', 80) =>
     *   beep                        Configure BEEP (Blocks Extensible Exchange
     *                               Protocol)
     * @param left
     * @param leftWidth
     * @param right
     * @param maxLength
     */
    static twoColumns(left: string, leftWidth: number, right: string, maxWidth: number) {
        // assume that left.length < leftWidth
        let line = `${CiscoFormatters.padRightLength(left, ' ', leftWidth)}${right}`;
        let result = '';
        while (maxWidth < line.length) {
            //start at the end and split them at the last space
            let spaceIndex = 80;
            while (line[spaceIndex] !== ' ') {
                --spaceIndex;
            }
            let head = line.substr(0, spaceIndex);
            let tail = line.substr(spaceIndex + 1, line.length - spaceIndex);
            line = CiscoFormatters.padLeftLength('', ' ', leftWidth) + tail;
            result += `${head}\n`;
        }
        result += line;
        return result;
    }

    static padLeadingString(n: number, length: number, padding: string): string {
        let result = n.toString();
        while (result.length < length) {
            result = `${padding}${result}`;
        }
        return result;
    }

    static formatDate(date: Date): string {
        let monthNames: string[] = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        let day = date.getDate();
        let monthIndex = date.getMonth();

        //Jun  3 20:17:37.271
        return `${monthNames[monthIndex].substr(0, 3)}  ${day} ${this.padLeadingString(date.getHours(), 2, '0')}:${this.padLeadingString(date.getMinutes(), 2, '0')}:${this.padLeadingString(date.getSeconds(), 2, '0')}.${this.padLeadingString(date.getMilliseconds(), 3, '0')}`;
    }

    static paddingRight(s: string, c: string, n: number): any {
        if (!s || !c || s.length >= n) {
            return s;
        }
        let max = (n - s.length) / c.length;
        for (let i = 0; i < max; i++) {
            s += c;
        }
        return s;
    };

    // This function normalizes a set of numbers to a consistent representation used by VIRL.
    // For example:
    //    Set of Numbers = 1,2,3,10,11,15
    //    After normalization: 1-3,10-11,15
    static normalizeNumberSet(numbers: number[]): string {
        let normalized = '';
        let sortedNumbers = numbers.sort((a, b) => a - b);
        let previousNumber = 0;
        sortedNumbers.forEach((number) => {
            if (normalized === '') {
                normalized = number.toString();
            }
            else if (number - previousNumber > 1) {
                normalized += `${normalized.charAt(normalized.length - 1) === '-' ? previousNumber : ""},${number}`;
            }
            else if (number - previousNumber === 1 && normalized.charAt(normalized.length - 1) !== '-') {
                normalized += '-';
            }
            previousNumber = number;
        });
        if (normalized.charAt(normalized.length - 1) === '-') {
            normalized += sortedNumbers[sortedNumbers.length - 1].toString();
        }
        return normalized;
    }

    static denormalizeNumberSet(value: string): number[] {
        let numbers: number[] = [];
        let nonsequentialNumbers = value.split(',');
        nonsequentialNumbers.forEach((numberSet) => {
            let range = numberSet.split('-');
            let min = parseInt(range[0]);
            numbers.push(min);
            if (range.length === 2) {
                let max = parseInt(range[1]);
                for (let n = min + 1; n <= max; n++) {
                    numbers.push(n);
                }
            }
        });
        return numbers;
    }
}
