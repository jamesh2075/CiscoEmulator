import { CiscoFormatters } from "../../../common/cisco-formatters";
export class BuildOutput {


    static getInterfaceStatusOutput(portInterfaces: any[]) {

        let result = '';

        result += `Port       Name              Status        Vlan          Duplex     Speed Type \n`;
        portInterfaces.forEach(function (portInterface: any) {
            if (portInterface.$class !== 'Loopback') {
                let name = '';

                if (portInterface.type === 'Port')
                    name = "Po" + portInterface.id;
                else
                    name = portInterface.interface;

                let vlan = '';

                if (portInterface.slot === 0 && portInterface.port === 0)
                    vlan = 'routed';
                else if (portInterface.trunkEnabled)
                    vlan = 'trunk';
                else
                    vlan = portInterface.vlan || 1;

                let description = portInterface.description || ' ';
                let status = (portInterface.status === 'up') ? 'connected' : 'disabled';
                let portType = (portInterface.type === 'Port') ? ' ' : 'unknown';
                result += CiscoFormatters.paddingRight(String(name), ' ', 9);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(description), ' ', 18);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(status), ' ', 12);
                result += '  ';
                result += CiscoFormatters.paddingRight(String(vlan), ' ', 7);
                result += '  ';
                result += CiscoFormatters.padLeftLength('auto', ' ', 9);
                result += '  ';
                result += CiscoFormatters.padLeftLength('auto', ' ', 9);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(portType), ' ', 12);
                result += '\n';
            }
        });

        return result;
    }
}
