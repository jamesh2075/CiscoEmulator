import {EventSubscriber, On} from "event-dispatch";
import {CommandConstants} from "../common/cisco-constants";
import {CiscoCommandContext} from "../cisco-terminal-command";
import {Vlan} from "../model/vlan.model";

@EventSubscriber()
export class VlanControler {

    private static instance: VlanControler;

    public static init() {
        if (!VlanControler.instance) {
            VlanControler.instance = new VlanControler();
        }
    }

    @On(CommandConstants.EVENTS.CONNECT_TO_VLAN)
    private onConnectToVlan(data: any) {
        let interfaces = data.cmdContext.device.getInterfaces(data.cmdContext.interfaceSelector);
        let vlans = data.cmdContext.device.model.vlans;

        // add interfaces to ports/interfaces list   //TODO: Use lodash to simplify this in 2 lines
        for (let vlan of vlans) {
            if (vlan.id === data.cmdState.properties['vlanNumber']) {
                for (let port of interfaces) {
                    if (!(vlan.ports.indexOf(port.model.interface) > -1)) {
                        port.model.switchport.accessVlan = vlan.id;
                        vlan.ports.push(port.model.interface);
                    }

                }
            }
        }
    }

    @On(CommandConstants.EVENTS.ADD_VLANS)
    private onAddVlans(data: any) {
        let cmdContext: CiscoCommandContext = data.cmdContext;
        Vlan.addVlans(cmdContext.device.model.vlans, data.vlanIds);
    }
}
