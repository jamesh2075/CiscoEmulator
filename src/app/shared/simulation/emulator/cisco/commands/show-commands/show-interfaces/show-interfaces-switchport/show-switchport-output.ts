export class BuildInterfacesSwitchportOutput {

    // Do operations on basic configuration to get data matching with Virl

    static getOperationalMode(interfaceData: any) { // TODO: Need to refactor this method based on different combinations of OP mode and Admin mode 
        let opMode: string;
        switch (interfaceData.switchport.adminMode) {
            case 'trunk':
            case 'static access': opMode = interfaceData.switchport.adminMode;
                break;
            default: opMode = (interfaceData.type === 'Port') ? interfaceData.switchport.opMode : 'static access';
                break;
        }

        return opMode;
    }

    // build output for show interfaces status as per Virl
    static buildSwitchportOutput(interfaces: any[], vlans?: any[]) {
        let result = '';

        interfaces.forEach(function (interfaceData: any) {
            if (interfaceData.switchport && interfaceData.switchportMode === 'Enabled') {
                // TODO: Changed allowed Vlans from all to dynamic on Trunking Vlans Enabled
                const name = (interfaceData.type === 'Port') ? `Po${interfaceData.id}` : `${interfaceData.shortName}`;
                let capturedResult = '';
                let vlanId: any = (interfaceData.switchportMode === 'Enabled') ? interfaceData.switchport.accessVlan : 0;
                let vlan: any, vlanName: any = '';
                if (interfaceData.switchport.accessVlan) {
                    vlan = (vlanId === 0) ? 'default' : vlans.find(x => x.id === vlanId);
                    vlanName = (vlan === 'default') ? `(default)` : `(${vlan.name})`;
                }

                // default or inactive based on vlan
                let trunkVlanName = '';
                if (interfaceData.switchport.accessVlan !== null) {
                    trunkVlanName = (interfaceData.switchport.trunkVlan === 1) ? '(default)' : `VLAN00${interfaceData.switchport.trunkVlan}`;
                }
                const nativetrunkMode = (interfaceData.switchport.trunkVlan) ? `${interfaceData.switchport.trunkVlan}  ${trunkVlanName}` : `${interfaceData.switchport.trunkVlan} (Inactive)`;
                if ((interfaceData.type !== 'Port')) {
                    capturedResult = `Capture Mode Disabled
Capture VLANs Allowed: ALL`;
                }

                result += `
Name: ${name}
Switchport: ${interfaceData.switchportMode}\n`;
                if (interfaceData.switchportMode === 'Enabled') {
                    result += `Administrative Mode: ${interfaceData.switchport.adminMode}
Operational Mode: ${BuildInterfacesSwitchportOutput.getOperationalMode(interfaceData)}
Administrative Trunking Encapsulation: ${interfaceData.switchport.adminPrivateVlan.trunkEncapsulation}
Operational Trunking Encapsulation: ${interfaceData.switchport.opTrunkEncapsulation}
Negotiation of Trunking: ${interfaceData.switchport.trunkNegotiation}
Access Mode VLAN: ${(interfaceData.switchport.accessVlan) ? interfaceData.switchport.accessVlan : 'unassigned'}  ${trunkVlanName}
Trunking Native Mode VLAN: ${nativetrunkMode}
Administrative Native VLAN tagging: ${interfaceData.switchport.adminVlanTag}
Voice VLAN: ${interfaceData.switchport.voiceVlan}
Administrative private-vlan host-association: ${interfaceData.switchport.adminPrivateVlan.host} 
Administrative private-vlan mapping: ${interfaceData.switchport.adminPrivateVlan.mapping}  
Administrative private-vlan trunk native VLAN: ${interfaceData.switchport.adminPrivateVlan.privatetrunkVlan} 
Administrative private-vlan trunk Native VLAN tagging: ${interfaceData.switchport.adminPrivateVlan.trunkVlanTag} 
Administrative private-vlan trunk encapsulation: ${interfaceData.switchport.adminPrivateVlan.trunkEncapsulation} 
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk associations: none
Administrative private-vlan trunk mappings: none
Operational private-vlan: ${interfaceData.switchport.opPrivateVlan} 
Trunking VLANs Enabled: ${interfaceData.switchport.trunkingVlans || 'ALL'} 
Pruning VLANs Enabled: 2-1001
${capturedResult} \n
Protected: false
Appliance trust: none  \n`;
                }
            } else if (interfaces && interfaces.length === 1) {
                result += `
Name: ${interfaceData.name}
Switchport: ${interfaceData.switchportMode}\n`;
            }
        });
        return result;
    }

    // Call this method and pass interface info to get switchport output
    static buildSwitchportInterfacesOutput(interfaces: any[], vlan?: any[]) {
        return BuildInterfacesSwitchportOutput.buildSwitchportOutput(interfaces, vlan);
    }


}
