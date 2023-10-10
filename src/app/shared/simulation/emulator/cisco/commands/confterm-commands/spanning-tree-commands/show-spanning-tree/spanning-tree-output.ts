import { CiscoFormatters } from "../../../../common/cisco-formatters";

let vlanMode = [
    { id: 'mst', mode: 'mstp' },
    { id: 'pvst', mode: 'ieee' },
    { id: 'rapid-pvst', mode: 'rstp' }
];

let PortStatus = {
    BLK: 'BLK',
    DIS: 'DIS',
    FWD: 'FWD',
    LIS: 'LIS',
    LRN: 'LRN'
}

let PortType = {
    'EDGE': 'Shr Edge',
    'Shr': 'Shr'
}

//TODO: Verify for port channel in output once it is implemented.
export class BuildSpanningTreeOutput {
    // get status mode protocol text
    static getMode(mode: string): any {
        return vlanMode.filter((modeObj: any) => {
            if (modeObj.id === mode) return modeObj;
        })[0];
    }
    //debugger;
    static getVlanInfo(vlanInfo: any, spanningTreeInfo: any) {
        let vlanName = (spanningTreeInfo.mode === 'mst') ? 'MST0' : `VLAN000${vlanInfo.id}`
        let result = '';

        result += `${vlanName}
   Spanning tree enabled protocol ${BuildSpanningTreeOutput.getMode(spanningTreeInfo.mode).mode}
   Root ID    Priority   ${parseInt(vlanInfo.priority) + parseInt(vlanInfo.id)}
              Address     ${spanningTreeInfo.address}
              This bridge is the root
              Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

   Bridge ID  Priority    ${parseInt(vlanInfo.priority) + parseInt(vlanInfo.id)}  (priority ${vlanInfo.priority} sys-id-ext ${vlanInfo.id})
              Address     ${spanningTreeInfo.address}
              Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
              Aging Time  300 sec \n \n`;

        let interfaces = UtilityModel.getInterfaces(vlanInfo.ports, spanningTreeInfo.ports);
        if (interfaces && interfaces.length > 0)
            result += `${BuildSpanningTreeOutput.getInterfaceInfo(interfaces, spanningTreeInfo.mode)} \n \n`;

        return result;

    }



    static getInterfaceInfo(interfaces: any, mode: any) { //TODO: Find out how virl is dividing the blocks for interfaces
        let result = `Interface           Role  Sts  Cost     Prio.Nbr Type \n------------------- ---- ---- ------- ---------- ---------------------------- \n`;
        interfaces.forEach(function (vlaninterface: any) {
            if (vlaninterface.protocol !== 'down') {
                let typeInfo = BuildSpanningTreeOutput.getTypeInfo(vlaninterface, mode);
                result += CiscoFormatters.paddingRight(String(vlaninterface.interface), ' ', 18);
                result += ' Desg  FWD ';
                result += CiscoFormatters.paddingRight(String(vlaninterface.cost), ' ', 9);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(vlaninterface.priorNo), ' ', 8);
                result += ' ';
                result += CiscoFormatters.paddingRight(String(typeInfo), ' ', 32);
                result += `\n`;
            }
        });

        return result;

    }

    static getTypeInfo(port: any, mode: any) {
        let typeInfo = PortType.Shr;
        // TODO: change type if portfast default is enabled
        /*if (!port.trunkEnabled) {
            typeInfo = PortType.Shr;
        }*/
        return typeInfo;
    }

    static getMstInfo(spanningTreeInfo: any): any {

        let activePorts: any[] = [];
        // get all active/up ports
        spanningTreeInfo.ports.forEach((port: any) => {
            if (port.status === 'up') activePorts.push(port.interface);
        });


        let vlans = [], vlanInfo = {
            id: 0,
            name: 'MST0',
            priority: 32768,
            status: 'FWD',
            ipAddress: '',
            defaultMode: 'mstp',
            spanningEnabled: true,
            ports: activePorts
        };

        vlans.push(vlanInfo);

        return vlans;
    }

    static buildOutput(spanningTreeInfo: any): string {
        let result = '';
        // If mode is mst we need to show only default Vlan 
        let vlans: any[] = [];

        if (spanningTreeInfo.mode === 'mst')
            vlans = BuildSpanningTreeOutput.getMstInfo(spanningTreeInfo);
        else
            vlans = spanningTreeInfo.vlans.filter((vlan: any) => {
                if (vlan.spanningEnabled && vlan.status !== "act/unsup") return vlan
            });

        vlans.forEach(function (vlan: any) {
            result += BuildSpanningTreeOutput.getVlanInfo(vlan, spanningTreeInfo);
        })

        return result;

    }

    static getShowSpanningTreeOutput(spanningTreeInfo: any): string {
        return BuildSpanningTreeOutput.buildOutput(spanningTreeInfo);
    }

}


export class UtilityModel {
    static getInterfaces(interfaceports: any, ports: any) {

        let resultPorts: any[] = [];
        // get ports definition that are matched with  vlan ports
        ports.forEach(function (port: any) {
            if (interfaceports.includes(port.interface))
                resultPorts.push(port);
        })

        return resultPorts;
    }
}
