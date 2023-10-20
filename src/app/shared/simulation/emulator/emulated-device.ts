import { IEmulatedDevice, IEmulatedInterface } from './interfaces/iemulated-device';
import { IEmulatedTerminal } from './interfaces/iemulated-terminal';
import { Device, IDevice } from './cisco/model/device.model';
import { DeviceModel, InterfaceModel } from '../simulation-model';
import { EmulatorDeviceState } from './emulator-state';
import { EmulatedInterface } from './emulated-interface';

export abstract class EmulatedDeviceBase implements IEmulatedDevice {
  protected state: EmulatorDeviceState;

  abstract isTerminalEnabled(): boolean;
  abstract getDefaultTerminal(): IEmulatedTerminal;
  abstract createPrivateTerminal(): IEmulatedTerminal;
  abstract getInterface(selector: string): IEmulatedInterface;

  get model(): Readonly<Device> {
      return this._model as Device;
      // return { ...this._model };
  }

  get name(): string {
      return this.property('name');
  }

  set name(value: string) {
      this.state.setProperty('name', value);
  }

  property(selector: string | string[]): any {
      return this.state.property(selector);
  }

  setProperty(selector: string | string[], value: any) {
      this.state.setProperty(selector, value);
  }

  constructor(protected _model: DeviceModel) {
      this.state = new EmulatorDeviceState(_model);
  }

}

export class EmulatedDevice extends EmulatedDeviceBase {
  private _interfaces: {[key: number]: IEmulatedInterface } = {};

  isTerminalEnabled(): boolean {
    return false;
  }
  getDefaultTerminal(): IEmulatedTerminal {
    const unknown: any = null;
    return unknown;
  }
  createPrivateTerminal(): IEmulatedTerminal {
    const unknown: any = null;
    return unknown;
  }

  getInterface(selector: string): IEmulatedInterface {
    let model = this.model.interfaces.find((iface) => iface.name === selector);
    if (!model) {
      return null;
    }
    return this.getOrCreateInterface(model);
  }

  private getOrCreateInterface(model: InterfaceModel): IEmulatedInterface {
    if (!model.id) {
      console.log('Interface missing id: ' + JSON.stringify(model));
      // TODO: assign an Id?

      // return a non-singleton instance
      return new EmulatedInterface(model);
    }
    const id = model.id;
    let result = this._interfaces[id];
    if (!result) {
      result = new EmulatedInterface(model);
      this._interfaces[id] = result;
    }
    return result;
  }

}