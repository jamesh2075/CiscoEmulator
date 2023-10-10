import { ITopology } from "../../emulator/cisco/model/topology.model";
import { IInterface } from "../../emulator/cisco/model/interface.model";
import { IDevice } from "../../emulator/cisco/model/device.model";
import { IGigabitEthernet } from "../../emulator/cisco/model/gigabitethernet.model";

export type ExtractFunction = (
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: any) => any;

export interface SwitchportTrunkModel {
  allowed?: boolean;
  encapsulation?: string; // dot1q
  vlan?: string; // '1-39,41-4094'
}

function getInterface(topology: ITopology, device: string, iface: string): IInterface {
  let name = iface; //.replace('_', `/`);
  let oDevice = getDevice(topology, device);
  return oDevice.interfaces.find((value) => value.name === name);
}

function getDevice(topology: any, device: string): IDevice {
  return topology.devices.find((value: any) => value.name === device);
}
// //accessor methods until the API is fixed
// function GetDevice(dataModel: any, device: string) {
//   let result = dataModel.devices ? dataModel.devices.find((v: any) => v.name === device) : undefined;
//   return result;
// }
// function GetInterface(device: any, iface: string) {
//   let realIface = iface.replace('_', `/`);
//   let result = undefined;
//   if (device.interfaces) {
//     result = device.interfaces.find((v: any) => {
//       return (v.name === realIface);
//     });
//   }
//   //let result = device.interfaces ? device.interfaces.find((v: any) => v.name === realIface) : null;
//   return result;
// }

export class ExtractSwitchport {
  static AccessVlan(
    dataModel: any,
    device: string,
    iface: string,
    verifyModel?: any): any {

    let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
    let switchport = oInterface.switchport;
    return switchport.accessVlan;
    // switchport access vlan 10 => interface.switchport.accessVlan == 10
  }
  static ModeAccess(
    dataModel: any,
    device: string,
    iface: string,
    verifyModel?: any): any {

    let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
    let switchport = oInterface.switchport;
    return (switchport.adminMode === 'static access') ? true : false;
    // 'switchport mode access' => interface.switchport.adminMode == 'static access'
    // 'switchport mode trunk' => interfaces.switchport.adminMode == 'trunk'
  }
  static ModeTrunk(
    dataModel: any,
    device: string,
    iface: string,
    verifyModel?: any): any {

    let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
    let switchport = oInterface.switchport;
    return (switchport.adminMode === 'trunk') ? true : false;
    // 'switchport mode access' => interface.switchport.adminMode == 'static access'
    // 'switchport mode trunk' => interfaces.switchport.adminMode == 'trunk'
  }
  static Trunk(
    dataModel: any,
    device: string,
    iface: string,
    verifyModel: SwitchportTrunkModel): any {
    let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
    let switchport = oInterface.switchport;
    if (verifyModel.encapsulation) {
      if (verifyModel.encapsulation !== switchport.adminPrivateVlan.trunkEncapsulation) {
        return false;
      }
    }
    if (verifyModel.vlan) {
      if (verifyModel.vlan !== switchport.trunkingVlans) {
        return false;
      }
    }
    return true;
  }
  static NoNegotiate(
    dataModel: any,
    device: string,
    iface: string,
    verifyModel?: any): any {
    let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
    let switchport = oInterface.switchport;
    // 'switchport nonegotiate' => interface.switchport.trunkNegotiation == 'Off'
    return switchport.trunkNegotiation === 'Off';
  }
}

export function ExtractChannelProtocol(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: any): any {
  let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
  let channelGroup = oInterface.channelGroup;
  // 'channel-protocol lacp' => interface.channelGroup.protocol === 'lacp'
  // 'channel-protocol pagp' => interface.channelGroup.protocol === 'pagp'
  return channelGroup.protocol;
  // return 'ExtractChannelProtocolPagp not implemented';
}
export interface ExctractVTPModel {
  domain?: string;
  mode?: string;
}
export function ExtractVTP(dataModel: any, device: string,
  iface: string, verifyModel: ExctractVTPModel): any {
  let oDevice = getDevice(dataModel as ITopology, device);
  let vtp = oDevice.vtp;
  if (verifyModel.domain) {
    if (vtp.domain !== verifyModel.domain)
      return false;
  }
  if (verifyModel.mode) {
    if (vtp.mode !== verifyModel.mode)
      return false;
  }
  return true;
}

export interface ExtractChannelGroupModel {
  group?: number;
  mode?: string;
}
export function ExtractChannelGroup(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: ExtractChannelGroupModel): any {
  let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
  let channelGroup = oInterface.channelGroup;
  if (verifyModel.group) {
    if (channelGroup.id !== verifyModel.group) {
      return false;
    }
  }
  if (verifyModel.mode) {
    if (channelGroup.mode !== verifyModel.mode) {
      return false;
    }
  }
  return true;
  // 'channel-group 1 mode active' => interface.channelGroup.id == 1 && interface.channelGroup.mode == 'active'
  // 'channel-group 2 mode auto' => interface.channelGroup.id == 2 && interface.channelGroup.mode === 'auto'
  // 'channel-group 2 mode desirable' =>interface.channelGroup.id == 2 && interface.channelGroup.mode === 'desirable'
}

export function ExtractShutdown(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: any): any {
  let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
  return oInterface.status === 'admin down';
  // 'shutdown' => interface.status !== 'up'
  // return 'ExtractShutdown not implemented';
}
export function ExtractNoShutdown(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: any): any {
  let oInterface = getInterface(dataModel as ITopology, device, iface) as IGigabitEthernet;
  return oInterface.status !== 'admin down';
}

export function ExtractStatus(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel?: any): any {
  let oInterface = getInterface(dataModel as ITopology, device, iface);
  return oInterface.status;
}

export interface ExtractSpanningTreeModel {
  mode?: string;
  vlan?: number;
  priority?: number;
  no?: boolean;
}
export function ExtractSpanningTree(
  dataModel: any,
  device: string,
  iface: string,
  verifyModel: ExtractSpanningTreeModel): any {
  // 'spanning-tree mode rapid-pvst' => device['spanning-tree'].mode == 'rapid-pvst'
  // 'spanning-tree vlan 10 priority 0'=> device['spanning-tree'].vlan == '10 priority 0'
  // 'no spanning-tree vlan 40'=> device.vlans.filter((x)=>x.id == 40)[0].spanningEnabled == false
  let oDevice = getDevice(dataModel, device);
  let spanning = oDevice.spanningtree;
  if (verifyModel.mode) {
    if (verifyModel.mode !== spanning.mode)
      return false;
  }
  if (verifyModel.vlan && verifyModel.priority !== undefined) {
    if (`${verifyModel.vlan} priority ${verifyModel.priority}` !== spanning.vlan)
      return false;
  }
  if(verifyModel.vlan && verifyModel.no) {
    let vlan = oDevice.vlans.filter((x:any) => x.id === verifyModel.vlan)[0];
    if(vlan.spanningEnabled !== false)
      return false;
  }

  return true;
}
