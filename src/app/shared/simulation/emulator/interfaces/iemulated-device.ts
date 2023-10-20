import { selector } from 'rxjs/operator/multicast';
import { IEmulatedTerminal } from './iemulated-terminal';
import { IState } from '../emulator-state';
import { DeviceModel, InterfaceModel } from '../../simulation-model';
import { LinkStatus } from "../cisco/icisco-device";

export interface IEmulatedDevice {
  readonly model: Readonly<DeviceModel>;
  name: string;
  isTerminalEnabled(): boolean;
  getDefaultTerminal(): IEmulatedTerminal; // get or create the default terminal
  createPrivateTerminal(): IEmulatedTerminal; // creates a terminal (without saved state) that can be used to issue commands

  // getState(): IState;
  // TODO: Rename to getProperty for consistency
  property(selector: string | string[]): any;
  // setProperty(name: string, value: any): void;
  // setProperties(props: {[name:string]:any}): void;

  getInterface(selector: string): IEmulatedInterface;
}

export interface IEmulatedInterface {
  readonly model: Readonly<InterfaceModel>;
  connection?: IInterfaceConnection;

  // TODO: Rename to getProperty for consistency
  property(selector: string | string[]): any;
  setProperty(selector: string | string[], value: any): void;

  /** Called to notify that the remote end of a connection changed its status */
  onPeerStatusChanged(peerStatus: string): void;
  /** Called to notify that this interface's connection status has changed */
  onStatusChanged(): void;

  noShutdown(): void;
  shutdown(): void;
}

export interface IPeerConnection {
    readonly status: string;
    readonly protocol: string;
    readonly channelGroupProtocol: string;
    readonly channelGroupMode: string;
    readonly switchportMode: string;
    readonly switchportAccessVlan: string;
    readonly switchportTrunkVlan: string;
    onPeerStatusChanged(peerStatus: string): void;
}

export interface IInterfaceConnection {
  readonly peer: IPeerConnection;
}
