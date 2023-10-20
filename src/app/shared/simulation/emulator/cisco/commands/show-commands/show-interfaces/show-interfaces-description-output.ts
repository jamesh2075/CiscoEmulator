import { CiscoFormatters } from '../../../common/cisco-formatters';
export class DescriptionOutput {


    static getInterfacesDescriptionOutput(portInterfaces: any[]) {

        let result = '', LoopbackResult = '';

        result += `Interface  Status         Protocol        Description \n`;

        portInterfaces.forEach(function (portInterface: any) {
            let name = '';
            let protocol = (portInterface.status === 'up') ? 'up' : portInterface.protocol;
            if (portInterface.type === 'Port') {
                name = 'Po' + portInterface.id;
            }
            else if (portInterface.$class === 'Loopback') {
               // name = portInterface.name;
                name = 'Lo0';
            }
            else {
                name = portInterface.interface;
            }
            const description = portInterface.description || '';
            // result += `${name}      ${portInterface.status}                   ${protocol}           ${description} \n`;
            if (portInterface.$class !== 'Loopback') {
                result += CiscoFormatters.paddingRight(String(name), ' ', 11);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(portInterface.status), ' ', 16);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(protocol), ' ', 12);
                result += '  ';
                result += CiscoFormatters.paddingRight(String(description), ' ', 7);
                result += '\n';
            } else {
                LoopbackResult += CiscoFormatters.paddingRight(String(name), ' ', 11);
                LoopbackResult += ' ';
                LoopbackResult += CiscoFormatters.paddingRight(String(portInterface.status), ' ', 16);
                LoopbackResult += ' ';
                LoopbackResult += CiscoFormatters.paddingRight(String(protocol), ' ', 12);
                LoopbackResult += '  ';
                LoopbackResult += CiscoFormatters.paddingRight(String(description), ' ', 7);
                LoopbackResult += '\n';
            }
        });

        return result + LoopbackResult;
    }
}
