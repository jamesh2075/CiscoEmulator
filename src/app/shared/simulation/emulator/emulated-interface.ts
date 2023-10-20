import { IEmulatedDevice, IEmulatedInterface, IInterfaceConnection } from './interfaces/iemulated-device';
import { IEmulatedTerminal } from './interfaces/iemulated-terminal';
import { Device, IDevice } from './cisco/model/device.model';
import { DeviceModel, InterfaceModel } from '../simulation-model';
import { EmulatorDeviceState } from './emulator-state';


export abstract class EmulatedInterfaceBase implements IEmulatedInterface {
  state: EmulatorDeviceState;
  connection?: IInterfaceConnection;


  get model(): Readonly<InterfaceModel> {
    return { ...this._model };
  }

  // TODO: Rename to getProperty for consistency
  property(selector: string | string[]): any {
    return this.state.property(selector);
  }

  setProperty(selector: string | string[], value: any) {
    this.state.setProperty(selector, value);
  }

  abstract onPeerStatusChanged(peerStatus: string): void;
  abstract onStatusChanged(): void ;
  abstract noShutdown(): void;
  abstract shutdown(): void;

  constructor(protected _model: InterfaceModel) {
    this.state = new EmulatorDeviceState(_model);
  }
}

export class EmulatedInterface extends EmulatedInterfaceBase {
  onPeerStatusChanged(peerStatus: string): void {
      throw new Error('Method not implemented.');
  }
  onStatusChanged(): void {
      throw new Error('Method not implemented.');
  }
  noShutdown(): void {
      throw new Error('Method not implemented.');
  };
  shutdown(): void {
      throw new Error('Method not implemented.');
  };
}
