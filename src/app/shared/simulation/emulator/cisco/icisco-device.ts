import { IEmulatedDevice, IEmulatedInterface } from '../interfaces/iemulated-device';
import { CiscoTerminalContext, InterfaceSelector } from './cisco-terminal-command';

export interface ICiscoDevice extends IEmulatedDevice {
  getInterfaces(selector?: InterfaceSelector): ICiscoInterface[];
}
export type LinkStatus =
  "up" | "down" | "admin down";

export interface ICiscoInterface extends IEmulatedInterface {  
}
