import {VlanCommands} from '../../confterm-commands/vlan-commands';

export class InterfacesTrunkOutput {


    static getInterfacesTrunkOutput(interfaces: any[], vlans: any[]) {
        let result = '';
        const trunkInterfaces: any[] = [];
        let found = false;
        console.log(interfaces);
        interfaces.forEach(function (obj: any) {
            if (obj.trunkEnabled) {
                trunkInterfaces.push(obj);
            }
        });

        // result of mode info
        result += `Port        Mode             Encapsulation  Status        Native vlan \n`;
        trunkInterfaces.forEach(function (trunkInterface: any) {
            result += `${trunkInterface.interface}       on               802.1q         trunking      1 \n`;
            found = true;
        });

        // result of trunk info
        result += `Port        Vlans allowed on trunk \n`;
        trunkInterfaces.forEach(function (trunkInterface: any) {
            result += `${trunkInterface.interface}       1-4094 \n`;
            found = true;
        });

        // result for vlan active info
        result += `Port        Vlans allowed and active in management domain \n`;
        const activeVlans = InterfacesTrunkOutput.getActiveVlans(vlans);
        trunkInterfaces.forEach(function (trunkInterface: any) {
            result += `${trunkInterface.interface}        ${activeVlans} \n`;
            found = true;
        });

        // result for vlan spanning tree info
        result += `Port        Vlans in spanning tree forwarding state and not pruned \n`;
        const spanningVlans = InterfacesTrunkOutput.getSpanningEnabledVlans(vlans);

        trunkInterfaces.forEach(function (trunkInterface: any) {
            const vlantrunk = (trunkInterface.portState === 'FWD') ? spanningVlans : 'none';
            result += `${trunkInterface.interface}        ${vlantrunk} \n`;
            found = true;
        });

        if (found === false) {
            result = '';
        }

        return result;

    }

    static getActiveVlans(vlans: any) {
        const activeVlans: any[] = [];
        vlans.forEach(function (obj: any) {
            if (obj.status === 'active') {
                activeVlans.push(obj.id);
            }
        });

        return activeVlans.join(',');
    }

    static getSpanningEnabledVlans(vlans: any) {
        const spanningVlans: any[] = [];
        vlans.forEach(function (obj: any) {
            if (obj.spanningEnabled) {
                spanningVlans.push(obj.id);
            }
        });

        return spanningVlans.join(',');
    }
}
