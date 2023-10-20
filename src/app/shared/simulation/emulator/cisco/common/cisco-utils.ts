export class CiscoUtils {

    static clone(data: any): any {
        return JSON.parse(JSON.stringify(data));
    }

    static isEmpty(data: any): boolean {
        for (let e in data) {
            if (data.hasOwnProperty(e)) {
                return false;
            }
        }
        return true;
    }

    static camelize(value: string) {
        let alphaRegEx = /-([a-z])/g;
        if (value.indexOf('-') !== -1) {
            return value[0].toLowerCase() + value.replace(alphaRegEx, (a, b) => {
                return b.toUpperCase();
            }).slice(1);
        }
        return value;
    }

    static getRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    static getVrfPort() {
        //TODO: Add code to dynamically determine which port is the VRF port
        return {
            fullName: 'GigabitEthernet0/0',
            shortName: 'Gi0/0'
        };
    }

    static parsePorts(s: string): string {
        let str: string[] = s.split(',');
        let result = '';
        let count = 1;

        for (let n = 0; n <= str.length - 1; n++) {
            if (count > 4) {
                result += '\n                                                ';
                result += str[n] + ', ';
                count = 2;
            }
            else {
                result += str[n] + ', ';
                count++;
            }
        }

        result = result.substring(0, result.length - 2);
        return result;
    }

    static parsePortChannel(pc: any): any {
        
        let info: any = {
            id: undefined,
            name: undefined,
            protocol: undefined,
            status: undefined,
            switchports: undefined,
            type: undefined
        };
        

        return info;
    }

}
