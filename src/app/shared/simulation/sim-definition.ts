import {IVlan} from "./emulator/cisco/model/vlan.model";
export interface SimCommandData {
    // settings, data, behavior for the command
    // output: string;
}

export interface SimDeviceType {
    commands: { [command: string]: SimCommandData };
}

export interface SimNetworkInterface {
    id?: number;
    name: string;
    ipv4: string;
    ipv4Mask?: string;
    netPrefixLenV4: number;
}

// switchport properties
export interface IAdminVlan {
    privatehost ?: string;
    mapping ?: string;
    privatetrunkVlan ?: string;
    privatetrunkVlantag ?: string;
    privatetrunkEncapsulation ?: string;
}
export interface ISwitchPort {
    adminMode ?: string;
    opMode ?: string;
    adminTrunkEncapsulation ?: string;
    opTrunkEncapsulation ?: string;
    trunkNegotiation ?: string;
    accessVlan ?: number;
    trunkVlan ?: number;
    adminVlanTag ?: string;
    voiceVlan ?: string;
    adminPrivateVlan ?: IAdminVlan;
    opPrivateVlan ?: string;
    trunkingVlans ?: string;
}


export interface IInterface {
    id?: number;
    name: string;
    interface?: string;
    role?: string;
    status?: string;
    cost?: number;
    priorNo?: string;
    hardware?: string;
    protocol ?: string;
    type?: string;
    vlan ?: number;
    switchportMode ?: string;
    switchport ?: ISwitchPort;
    channelGroup?: {
        id: number,
        mode: string,
        protocol: string
    };
    // 'media-type': 'rj45';
    // 'negotiation': 'auto';
}


export interface SimDevice {
    name: string;
    type: string; // corresponds to "type" in VIRL
    subtype?: string;
    address?: string;
    ipv4?: string;
    interfaces?: any[]; // IInterface[]
    noTerminal?: boolean; // true if this device does not support a terminal
    vlan?: any;
    vlans?: Partial<IVlan>[];
    vtp?: any;
    vtpConfig?: string; // determines the interface where is set the ip address for 'Local updater ID' in 'show vtp status'
}

export interface SimConnectionEndpoint {
    name: string; // the name of the device
    id?: number; // ID of the interface on the named device
    interfaceName?: string; // name of the interface on the named device
}

export interface SimConnection {
    dest: SimConnectionEndpoint;
    src: SimConnectionEndpoint;
}

export interface SimTask {
    description?: string;
    //stateChanges: {[key: string]: any};
}

export interface SimDefinition {
    name: string;
    deviceTypes?: { [key: string]: SimDeviceType };
    devices: any[];
    connections?: any[];
    tasks?: { [key: string]: SimTask };
}
