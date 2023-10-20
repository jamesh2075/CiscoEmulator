import { IVlan } from "./emulator/cisco/model/vlan.model";
import { IConnection, Connection } from './emulator/cisco/model/connection.model';

export interface InterfaceModel {
    id?: number;
    name: string;
    ipv4?: string;
    ipv4Mask?: string;
    status?: string;
    type?: string;
    ip?: { [key: string]: string };
    channelGroup?: any;
    etherflag?: any;
}

export interface DeviceModel {
    name: string;
    subtype: string;
    interfaces: InterfaceModel[];
    address?: string;
    ipv4?: string;
    vlan?: any;
    vtp?: any;
    vlans?: IVlan[];
    noTerminal?: boolean; // true if this device does not support a terminal
}

export class SimulationModel {
    devices: { [key: string]: DeviceModel } = {};
    connections: Connection[] = [];
}
