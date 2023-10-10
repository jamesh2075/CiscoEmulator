import {ISwitch} from '../interfaces/iswitch';
import {CiscoDevice} from './cisco-device';
import {SimDevice, SimDeviceType, SimCommandData} from '../../sim-definition';


export class CiscoSwitch extends CiscoDevice implements ISwitch {
}

// export class CiscoSwitch implements ISwitch {
//   name: string;
//   ip: string;

//   userCommands = {
//   };

//   privilegedCommands = {
//   };

//   globalCommands = {
//   };

//   interfaceCommands = {
//   };

//   notSupportedCommands = {
//   };

//   constructor(settings: SimDevice = null) {
//     if(settings) {
//       this.name = settings.name;
//       this.ip = settings.ip;
//     }
//   }

// }
