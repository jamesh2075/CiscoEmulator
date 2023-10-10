import { ExamItemScoreKey, ITaskScoreKey, IVerification } from './scorekey';
import { AsArray, AsSingle } from "../../emulator/util";
import {
  ExtractFunction,
  ExtractSwitchport,
  ExtractChannelProtocol,
  ExtractChannelGroup,
  ExtractShutdown,
  ExtractStatus,
  ExtractSpanningTree,
  ExtractNoShutdown,
  ExtractVTP
} from './extract';

export class VerifyResult {
  name: string;
  device: string;
  iface: string;
  expected: any;
  model: any;
  pass: boolean;
}

export class Verifier {

  extractors: { [key: string]: ExtractFunction } = {
    // 'switchport access vlan 10': ExtractSwitchport.AccessVlan10,
    'switchport access vlan': ExtractSwitchport.AccessVlan,
    'switchport mode access': ExtractSwitchport.ModeAccess,
    'switchport trunk allowed vlan 1-39,41-4094':
    (dataModel, device, iface) =>
      ExtractSwitchport.Trunk(dataModel, device, iface, { vlan: '1-39,41-4094' }),
    'switchport trunk encapsulation dot1q':
    (dataModel, device, iface) =>
      ExtractSwitchport.Trunk(dataModel, device, iface, { encapsulation: 'dot1q' }),
    'switchport mode trunk': ExtractSwitchport.ModeTrunk,
    'switchport nonegotiate': ExtractSwitchport.NoNegotiate,
    'channel-group 1 mode active':
    (dataModel, device, iface) =>
      ExtractChannelGroup(dataModel, device, iface, { group: 1, mode: 'active' }),
    'channel-group 2 mode desirable':
    (dataModel, device, iface) =>
      ExtractChannelGroup(dataModel, device, iface, { group: 2, mode: 'desirable' }),
    'channel-group 2 mode auto':
    (dataModel, device, iface) =>
      ExtractChannelGroup(dataModel, device, iface, { group: 2, mode: 'auto' }),
    'vtp mode transparent':
    (dataModel, device, iface) => ExtractVTP(dataModel, device, iface, { mode: 'transparent' }),
    'shutdown': ExtractShutdown,
    'no shutdown': ExtractNoShutdown,
    // 'channel-protocol pagp': ExtractChannelProtocolPagp,
    // 'channel-protocol lacp': ExtractChannelProtocolLacp,
    'channel-protocol': ExtractChannelProtocol,
    'no spanning-tree vlan 40': 
    (dataModel, device, iface) =>
      ExtractSpanningTree(dataModel, device, iface, { vlan: 40, no: true }), // 'no spanning-tree vlan 40'=> device.vlans.filter((x)=>x.id == 40)[0].spanningEnabled == false
    'spanning-tree mode rapid-pvst':
    (dataModel, device, iface) =>
      ExtractSpanningTree(dataModel, device, iface, { mode: 'rapid-pvst' }),
    'spanning-tree vlan 10 priority 0':
    (dataModel, device, iface) =>
      ExtractSpanningTree(dataModel, device, iface, { vlan: 10, priority: 0 }),
    'interface status': ExtractStatus
  };

  Verify(dataModel: any, verifications: IVerification): VerifyResult[] {
    let devices = AsArray(verifications.devices);
    let interfaces = AsArray(verifications.interfaces);
    if (interfaces.length === 0) interfaces.push(null); // must have at least one value to iterate

    let results: VerifyResult[] = [];

    for (let device of devices) {
      for (let iface of interfaces) {
        iface = this.getInterfaceName(iface);
        for (let key in verifications.verify) {
          let result = new VerifyResult;
          result.name = key;
          result.device = device;
          result.iface = iface;
          result.expected = verifications.verify[key];
          result.model = this.getVerifyValue(dataModel, device, iface, key);
          // may need to normalize before comparison if the data graph is complex
          result.pass = (JSON.stringify(result.model) === JSON.stringify(result.expected));
          results.push(result);
        }
      }
    }
    return results;
  }

  private getVerifyValue(dataModel: any, device: string, netInterface: string, name: string): any {
    let extractor = this.extractors[name];
    if (extractor) {
      return extractor(dataModel, device, netInterface);
    } else {
      return 'Unknown verifier: ' + name;
    }
  }

  private getInterfaceName(name: string): string {
    if (!name) return null;

    let result: string = null;

    if (name.toLowerCase().startsWith('g')) {
      result = 'GigabitEthernet';
    } else if (name.toLowerCase().startsWith('po')) {
      result = 'Port-channel';
    } else if (name.toLowerCase().startsWith('lo')) {
      result = 'Loopback';
    } else {
      throw new Error('Invalid interface id ' + name);
    }

    let numStart = name.search(/\d/);
    if (numStart > 0) {
      result += name.slice(numStart).trim();
    }

    //result = result.split('/').join('_'); // converts "GigabitEthernet0/1" to "GigabitEthernet0_1"
    return result;
  }

}
