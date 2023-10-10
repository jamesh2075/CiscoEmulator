import { property } from './../model/utils/property';
import { ICiscoInterface } from './../icisco-device';
import { Switchport } from '../model/switchport.model';
import { CommandConstants } from "../common/cisco-constants";
import { EventDispatcher, EventSubscriber, On } from "event-dispatch";
import { IInterface } from "../../../sim-definition";
import { SimulationModel } from "../../../simulation-model";
import { CiscoCommandContext } from "../cisco-terminal-command";
import { CommandState } from "../../interfaces/command-state";
import { Port } from "../model/port.model";

@EventSubscriber()
export class PortController {

    private static instance: PortController;

    private static EVENT_DISPATCHER: EventDispatcher = new EventDispatcher();

    private eventDispatcher: EventDispatcher = PortController.EVENT_DISPATCHER;

    static init() {
        if (!PortController.instance) {
            PortController.instance = new PortController();
        }
    }

    /**
     * Creates the port-channel interface if it does not already exist
     * @param cmdContext
     * @param channelGroupId
     */
    static CreatePortChannel(cmdContext: CiscoCommandContext, cmdState: CommandState, channelGroupId: number) {
        if (cmdContext.device == undefined)
            throw new Error("CiscoCommandContext.device is undefined!");

        let ciscoInterfaces = cmdContext.device.model.interfaces;
        let portInterface: IInterface = PortController.findPortInterface(ciscoInterfaces, channelGroupId);
        // if port interface doesn't already exist, create it
        if (!portInterface) {
            portInterface = new Port();
            portInterface.id = channelGroupId;
            portInterface.status = "up";
            portInterface.name = `Port-channel${channelGroupId}`;
            portInterface.protocol = "up";
            portInterface.hardware = "";
            portInterface.switchportMode = "Enabled";
            // create a default switchport
            portInterface.switchport = new Switchport();
            //TODO: How to handle in show run ---- for port channels has different properties by default
            portInterface.switchport.opMode = '??? (10)';
            portInterface.switchport.opTrunkEncapsulation = '??? (0)';
            portInterface.switchport.accessVlan = null as any;

            ciscoInterfaces.push(portInterface);
            PortController.etherChannelBundler(cmdContext.device.getInterfaces());
            PortController.EVENT_DISPATCHER.dispatch(CommandConstants.EVENTS.INTERFACE_ADDED, portInterface);
            cmdState.output = `Creating a port-channel interface Port-channel ${channelGroupId}`;
        }
    }

    private static findPortInterface(ciscoInterfaces: IInterface[], channelGroupId: number): IInterface {
        let portInterface: IInterface = null as any;
        for (let ciscoInterface of ciscoInterfaces) {
            if (ciscoInterface.type === 'Port' && ciscoInterface.id === channelGroupId) {
                portInterface = ciscoInterface;
                break;
            }
        }
        return portInterface;
    }

    private static hasChannelGroup(ciscoInterfaces: IInterface[], channelGroupId: number): boolean {
        for (let ciscoInterface of ciscoInterfaces) {
            if (ciscoInterface.type !== 'Port' &&
                ciscoInterface.channelGroup &&
                ciscoInterface.channelGroup.id === channelGroupId
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get all member interfaces under a port-channel
     * @param ciscoInterfaces
     * @param channelGroupId 
     */
    static getMemberInterfaces(ciscoInterfaces: ICiscoInterface[], channelGroupId: number): ICiscoInterface[] {
        let memberInterfaces: ICiscoInterface[] = [];
        for (let ciscoInterface of ciscoInterfaces) {
            if (ciscoInterface.property('$class') !== 'Port' && ciscoInterface.property('channelGroup') &&
                ciscoInterface.property(['channelGroup', 'id']) === channelGroupId) {
                memberInterfaces.push(ciscoInterface);
            }
        }
        return memberInterfaces;
    }


    static getPortInterfaces(ciscoInterfaces: ICiscoInterface[]): ICiscoInterface[] {
        let ports: ICiscoInterface[] = [];
        for (let ciscoInterface of ciscoInterfaces) {
            if (ciscoInterface.property('$class') === 'Port') {
                ports.push(ciscoInterface);
            }
        }
        return ports;
    }

    private getChannelGroupIds(ciscoInterfaces: IInterface[]): number[] {
        let portIds: number[] = [];
        for (let ciscoInterface of ciscoInterfaces) {
            if (ciscoInterface.channelGroup) {
                if (ciscoInterface.channelGroup.id > 0 && portIds.indexOf(ciscoInterface.channelGroup.id) === -1) {
                    portIds.push(ciscoInterface.channelGroup.id);
                }
            }
        }
        return portIds;
    }

    /*private removeOrphanedPorts(ciscoInterfaces: IInterface[]) {
        let portInterfaces = this.getPortInterfaces(ciscoInterfaces);
        for (let portInterface of portInterfaces) {
            // no interfaces are using this port
            if (!PortController.hasChannelGroup(ciscoInterfaces, portInterface.id)) {
                // get index in interfaces list and remove
                let index = ciscoInterfaces.indexOf(portInterface);
                ciscoInterfaces.splice(index, 1);
                // dispatch even indicating the removal
                this.eventDispatcher.dispatch(CommandConstants.EVENTS.INTERFACE_REMOVED, portInterface);
            }
        }
    }*/

    @On(CommandConstants.EVENTS.CHANNEL_GROUP_CHANGED)
    private onChannelGroupChanged(data: any) {
        let cmdContext = data.cmdContext;
        let cmdState = data.cmdState;
        let ciscoInterfaces = cmdContext.device.model.interfaces;
        let channelGroup = data.channelGroup;

        // if we are setting channel group to active
        //if (channelGroup.mode === 'active') {
        PortController.CreatePortChannel(cmdContext, cmdState, channelGroup.id);
        //}
        //Note, we don't know when this is supposed to happen.
        // no interface port-channel x will remove the port-channel
        //this.removeOrphanedPorts(ciscoInterfaces);
    }

    /**
     * remove the port-channel if exists
     * @param cmdContext
     * @param portchannelNo
     */
    @On(CommandConstants.EVENTS.NO_PORT_CHANNEL)
    private onRemovePortChannel(data: any) {
        let cmdContext = data.cmdContext;
        let cmdState = data.cmdState;
        let ciscoInterfaces = cmdContext.device.model.interfaces;
        let portChannelValue = data.portChannelValue;
        // Three steps to do when this command is invoked

        // 1.Removes all channel-group from interface members
        // 2. Shuts down all member interfaces
        for (let port of ciscoInterfaces) {
            if (port.channelGroup && port.channelGroup.id === portChannelValue) {
                port.status = 'admin down';
                port.channelGroup.id = 0;
            }
        }

        // 3. Remove port-channel from interfaces list

        for (let port of ciscoInterfaces) {
            if (port.type === 'Port' && port.id === portChannelValue) {
                let index = cmdContext.device.model.interfaces.indexOf(port);
                cmdContext.device.model.interfaces.splice(index, 1)
            }
        }
    }

    @On(CommandConstants.EVENTS.SIMULATION_INIT)
    private onSimulationInit(model: SimulationModel) {
        // Handle any simulation changes here
    }


    /*Items that need to match between member config and port-channel config LOCALLY:
        Switchport mode
        Access VLAN
        Trunk native VLAN
        Allowed VLAN list
    */
    /**
     * @param {ICiscoInterface} srcInterface 
     * @param {ICiscoInterface} destInterface 
     * @returns {boolean} 
     * @memberof PortController
     */
    public static verifyLocalMembers(srcInterface: ICiscoInterface, destInterface: ICiscoInterface): boolean {
        let localSelectors = [
            { selector: ["switchport", "mode"] },
            { selector: ["switchport", "accessVlan"] },
            { selector: ["switchport", "trunkVlan"] },
            { selector: ["switchport", "trunkingVlans"] }
        ];
        let isMatch = false;

        for (let localSelector of localSelectors) {
            isMatch = isMatch && (srcInterface.property(localSelector.selector) === destInterface.property(localSelector.selector))
        }

        return isMatch;
    }

    /*
        if i'm PAGP, he has to be PAGP, at least one of us must be desirable
        if I'm LACP, he has to be LACP, at least one must be active
        if I'm switchport modeaccess, he must be switchport mode access
            my Access vlan has to match his
        if switchport mode trunk, he must be switchport mode trunk
            my native VLAN has to match his
    */

    /**
     * @param {ICiscoInterface} srcInterface 
     * @returns {boolean} 
     * @memberof PortController
    * */
    public static verifyRemoteMembers(srcInterface: ICiscoInterface): boolean {
        let isMatch = false,
            connection = srcInterface.connection;
        let remoteSelectors = [
            { selector: ["channelGroup", "protocol"], value: '' },
            { selector: ["switchport", "mode"], value: '' }
        ];
        // verify protocol as same and check for PAGP - desirable or if it is LACP - active
        switch (srcInterface.property(["channelGroup", "protocol"])) {
            case 'PAGP':
                if (connection && connection.peer.channelGroupMode !== 'desirable') isMatch = false;
                break;
            case 'LACP':
                if (connection && connection.peer.channelGroupMode !== 'active') isMatch = false;
                break;
        }

        //verify mode and if access - accessVlan  or if it is trunk - nativeVlan
        switch (srcInterface.property(["switchport", "mode"])) {
            case 'static access': 
                if(connection && connection.peer.switchportAccessVlan !== '') isMatch = false;
                break;
            case 'trunk':
                if(connection && connection.peer.switchportTrunkVlan !== '') isMatch = false;
                break;
        }

        let protocol = srcInterface.property(["channelGroup", "protocol"]);
        let peerProtocol = connection ? connection.peer.channelGroupProtocol : null;
        isMatch = isMatch && (protocol === peerProtocol);

        let mode = srcInterface.property(["switchport", "mode"]);
        let peerMode = connection ? connection.peer.switchportMode : null;
        isMatch = isMatch && (mode === peerMode);

        return isMatch;
    }



    /**
     * @param {ICiscoInterface[]} ciscoInterfaces 
     * @returns {*} 
     * @memberof PortController
     */
    public static etherChannelBundler(ciscoInterfaces: ICiscoInterface[]): any {
        let portInterfaces = PortController.getPortInterfaces(ciscoInterfaces);
        if (portInterfaces && portInterfaces.length > 0)
            for (let portChannel of portInterfaces) {
                let portCount = 0;
                let memberInterfaces = PortController.getMemberInterfaces(ciscoInterfaces, portChannel.property('id'));
                if (memberInterfaces && memberInterfaces.length > 0)
                    for (let memberInterface of memberInterfaces) {
                        let isMatch = PortController.verifyLocalMembers(portChannel, memberInterface) && PortController.verifyRemoteMembers(memberInterface);
                        if (isMatch) {
                            memberInterface.setProperty('etherflag', 'P');
                            portCount++;
                        }
                        else if (memberInterface.property('status') === 'up') {
                            memberInterface.setProperty('etherflag', 's');
                        }
                        else
                            memberInterface.setProperty('etherflag', 'D');
                    }

                portChannel.setProperty('etherflag', (portCount > 0) ? 'SU' : 'SD');
            }
    }
}